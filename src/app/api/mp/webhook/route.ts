import { NextResponse } from "next/server";
import crypto from "crypto";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPaymentId(reqUrl: URL, body: any): string | null {
  const qId = reqUrl.searchParams.get("data.id") || reqUrl.searchParams.get("id");
  if (qId) return qId;

  const bId = body?.data?.id ?? body?.id;
  return bId ? String(bId) : null;
}

function verifySignature(req: Request, paymentId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;

  const xSignature = req.headers.get("x-signature") ?? "";
  const xRequestId = req.headers.get("x-request-id") ?? "";

  const parts = xSignature.split(",").map((s) => s.trim());
  const ts = parts.find((p) => p.startsWith("ts="))?.split("=")[1];
  const v1 = parts.find((p) => p.startsWith("v1="))?.split("=")[1];
  if (!ts || !v1 || !xRequestId) return false;

  const manifest = `id:${paymentId};request-id:${xRequestId};ts:${ts};`;
  const calc = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  // Evita excepción si longitudes difieren
  if (calc.length !== v1.length) return false;

  return crypto.timingSafeEqual(Buffer.from(calc), Buffer.from(v1));
}

export async function POST(req: Request) {
  const url = new URL(req.url);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const paymentId = getPaymentId(url, body);
  if (!paymentId) return NextResponse.json({ ok: true });

  if (!verifySignature(req, paymentId)) {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 401 });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("Webhook missing MP_ACCESS_TOKEN");
    return NextResponse.json({ error: "MISSING_MP_ACCESS_TOKEN" }, { status: 500 });
  }

  const client = new MercadoPagoConfig({ accessToken });
  const paymentApi = new Payment(client);

  const payment = await paymentApi.get({ id: paymentId });

  // Idempotencia simple: solo aprobados activan
  if (payment.status !== "approved") {
    return NextResponse.json({ ok: true });
  }

  const ext = payment.external_reference ?? "";
  const [userId, productId] = ext.split(":");
  if (!userId || !productId) {
    return NextResponse.json({ error: "MISSING_EXTERNAL_REFERENCE" }, { status: 400 });
  }

  const admin = supabaseAdmin();

  // Producto -> duración
  const { data: product, error: prodErr } = await admin
    .from("products")
    .select("id, duration_days, active")
    .eq("id", productId)
    .single();

  if (prodErr || !product || !product.active) {
    console.error("Webhook product fetch failed", prodErr);
    return NextResponse.json({ error: "PRODUCT_NOT_FOUND" }, { status: 404 });
  }

  const durationDays = product.duration_days ?? 30;

  // Leer membresía actual para extender correctamente
  const { data: current, error: curErr } = await admin
    .from("memberships")
    .select("user_id, status, started_at, expires_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (curErr) {
    console.error("Webhook membership fetch failed", curErr);
    return NextResponse.json({ error: "MEMBERSHIP_FETCH_FAILED" }, { status: 500 });
  }

  const now = new Date();

  const currentExpires =
    current?.expires_at ? new Date(current.expires_at) : null;

  const baseDate =
    currentExpires && currentExpires.getTime() > now.getTime()
      ? currentExpires
      : now;

  const newExpiresAt = new Date(
    baseDate.getTime() + durationDays * 24 * 60 * 60 * 1000
  ).toISOString();

  // started_at: mantener si existe, setear solo si no existe
  const startedAt = current?.started_at ?? now.toISOString();

  const { error: upErr } = await admin
    .from("memberships")
    .upsert(
      {
        user_id: userId,
        status: "active",
        started_at: startedAt,
        expires_at: newExpiresAt,
        updated_at: now.toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (upErr) {
    console.error("Webhook membership upsert failed", upErr);
    return NextResponse.json({ error: "DB_UPDATE_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
