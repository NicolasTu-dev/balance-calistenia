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
  return crypto.timingSafeEqual(Buffer.from(calc), Buffer.from(v1));
}

export async function POST(req: Request) {
  const url = new URL(req.url);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any = null;
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

  const accessToken = process.env.MP_ACCESS_TOKEN!;
  const client = new MercadoPagoConfig({ accessToken });
  const paymentApi = new Payment(client);

  const payment = await paymentApi.get({ id: paymentId });

  if (payment.status !== "approved") {
    return NextResponse.json({ ok: true });
  }

  const ext = payment.external_reference ?? "";
  const [userId, productId] = ext.split(":");
  if (!userId || !productId) {
    return NextResponse.json({ error: "MISSING_EXTERNAL_REFERENCE" }, { status: 400 });
  }

  const admin = supabaseAdmin();

  const { data: product, error: prodErr } = await admin
    .from("products")
    .select("id, duration_days, active")
    .eq("id", productId)
    .single();

  if (prodErr || !product || !product.active) {
    return NextResponse.json({ error: "PRODUCT_NOT_FOUND" }, { status: 404 });
  }

  const durationDays = product.duration_days ?? 30;
  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  const { error: upErr } = await admin
    .from("memberships")
    .upsert(
      {
        user_id: userId,
        status: "active",
        started_at: new Date().toISOString(),
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (upErr) {
    return NextResponse.json({ error: "DB_UPDATE_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
