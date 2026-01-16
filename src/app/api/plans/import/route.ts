import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { supabaseRoute } from "@/app/lib/supabase/route";

export const runtime = "nodejs";

function norm(s: unknown) {
  return String(s ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

function readCell(sheet: XLSX.WorkSheet, r: number, c: number) {
  const addr = XLSX.utils.encode_cell({ r, c });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = (sheet as any)[addr]?.v;
  return v === undefined ? null : v;
}

function findCell(sheet: XLSX.WorkSheet, text: string) {
  const target = norm(text);
  const range = XLSX.utils.decode_range(sheet["!ref"] ?? "A1:A1");

  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const v = readCell(sheet, r, c);
      if (norm(v) === target) return { r, c };
    }
  }
  return null;
}

function parseCronologia(sheet: XLSX.WorkSheet) {
  const start = findCell(sheet, "CRONOLOGIA SEMANAL");
  if (!start) return [];

  const weekRowStart = start.r + 1;

  const blocks: Array<{ week: number; day: number; block_type: string | null }> =
    [];

  for (let i = 0; i < 4; i++) {
    const row = weekRowStart + i;
    const weekLabel = readCell(sheet, row, 2); // C
    if (!norm(weekLabel).startsWith("SEMANA")) continue;

    const weekNum = i + 1;

    for (let d = 0; d < 5; d++) {
      const val = readCell(sheet, row, 3 + d); // D..H
      const block_type =
        val == null || String(val).trim() === "" ? null : String(val).trim();
      blocks.push({ week: weekNum, day: d + 1, block_type });
    }
  }

  return blocks;
}

function parseExerciseTables(sheet: XLSX.WorkSheet) {
  const range = XLSX.utils.decode_range(sheet["!ref"] ?? "A1:A1");

  let currentSection: "CALISTENIA" | "SKILLS" | null = null;
  let currentCategory: string | null = null;

  const items: Array<{
    section: "CALISTENIA" | "SKILLS";
    category: string | null;
    week_number: number;
    order_index: number | null;
    name: string;
    sets: string | null;
  }> = [];

  const pushWeek = (
    section: "CALISTENIA" | "SKILLS",
    category: string | null,
    week: number,
    order_index: number | null,
    nameVal: unknown,
    setsVal: unknown
  ) => {
    const name = String(nameVal ?? "").trim();
    const sets = setsVal == null ? null : String(setsVal).trim();
    if (!name) return;

    items.push({
      section,
      category,
      week_number: week,
      order_index,
      name,
      sets,
    });
  };

  for (let r = range.s.r; r <= range.e.r; r++) {
    const A = readCell(sheet, r, 0);
    const B = readCell(sheet, r, 1);
    const C = readCell(sheet, r, 2);
    const D = readCell(sheet, r, 3);
    const E = readCell(sheet, r, 4);
    const F = readCell(sheet, r, 5);
    const G = readCell(sheet, r, 6);

    const aNorm = norm(A);

    // Secciones
    if (aNorm === "CALISTENIA") {
      currentSection = "CALISTENIA";
      currentCategory = null;
      continue;
    }
    if (aNorm === "SKILLS") {
      currentSection = "SKILLS";
      currentCategory = null;
      continue;
    }
    if (!currentSection) continue;

    // Categorías (líneas tipo "EEC GENERAL", "EJERCICIOS", etc.)
    const isCategoryLine =
      typeof A === "string" &&
      A.trim() !== "" &&
      (aNorm.includes("EEC") || aNorm === "EJERCICIOS" || aNorm.includes("TRABAJO"));

    if (isCategoryLine) {
      currentCategory = String(A).trim();
      continue;
    }

    const order_index = typeof A === "number" ? Math.trunc(A) : null;

    // Filas vacías
    if (!B && !E) continue;

    const section = currentSection;

    // Semana 1 y 2: name=B, sets=C y D
    pushWeek(section, currentCategory, 1, order_index, B, C);
    pushWeek(section, currentCategory, 2, order_index, B, D);

    // Semana 3 y 4: en tu sheet suele ser name=E (o B), sets=F/G
    const name34 = E ?? B;
    if (name34) {
      pushWeek(section, currentCategory, 3, order_index, name34, F);
      pushWeek(section, currentCategory, 4, order_index, name34, G);
    }
  }

  return items;
}

export async function POST(req: Request) {
  const supabase = await supabaseRoute();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;

  if (!user) {
    return NextResponse.json({ ok: false, error: "no_user" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "no_file" }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return NextResponse.json({ ok: false, error: "only_xlsx" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];

  const cronologia = parseCronologia(sheet);
  const exercises = parseExerciseTables(sheet);

  const rawTitle = file.name.replace(/\.xlsx$/i, "").trim();
  const slug = slugify(rawTitle);

  // 1) Crear plan
  const { data: plan, error: planErr } = await supabase
    .from("plans")
    .insert({
      owner_user_id: user.id,
      slug,
      title: rawTitle,
      goal: null,
      active: true,
    })
    .select("id")
    .single();

  if (planErr || !plan) {
    return NextResponse.json(
      { ok: false, error: "plan_insert_failed", details: planErr?.message },
      { status: 500 }
    );
  }

  const planId = plan.id as number;

  // 2) Crear weeks 1..4
  const { data: weeks, error: weeksErr } = await supabase
    .from("plan_weeks")
    .insert([1, 2, 3, 4].map((n) => ({
      plan_id: planId,
      week_number: n,
      name: `Semana ${n}`,
    })))
    .select("id, week_number");

  if (weeksErr || !weeks) {
    return NextResponse.json(
      { ok: false, error: "weeks_insert_failed", details: weeksErr?.message },
      { status: 500 }
    );
  }

  const weekIdByNumber = new Map<number, number>();
  for (const w of weeks) weekIdByNumber.set(w.week_number, w.id);

  // 3) Insertar blocks
  const blocksPayload = cronologia.map((b) => ({
    plan_week_id: weekIdByNumber.get(b.week)!,
    day: b.day,
    block_type: b.block_type,
  }));

  if (blocksPayload.length) {
    const { error: blocksErr } = await supabase.from("plan_blocks").insert(blocksPayload);
    if (blocksErr) {
      return NextResponse.json(
        { ok: false, error: "blocks_insert_failed", details: blocksErr.message },
        { status: 500 }
      );
    }
  }

  // 4) Insertar exercises
  const exPayload = exercises.map((e) => ({
    plan_id: planId,
    week_number: e.week_number,
    section: e.section,
    category: e.category,
    order_index: e.order_index,
    name: e.name,
    sets: e.sets,
    notes: null,
  }));

  if (exPayload.length) {
    const { error: exErr } = await supabase.from("plan_exercises").insert(exPayload);
    if (exErr) {
      return NextResponse.json(
        { ok: false, error: "ex_insert_failed", details: exErr.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true, planId });
}
