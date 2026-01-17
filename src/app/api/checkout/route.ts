import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { supabaseServer } from "@/app/lib/supabase/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const productId = String(form.get("productId") ?? "");

  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.redirect(new URL("/login?next=/tienda", req.url), { status: 303 });
  }

  const { data: product, error: prodErr } = await supabase
    .from("products")
    .select("id, mp_title, price_cents, currency, duration_days, active")
    .eq("id", productId)
    .single();

  if (prodErr || !product || !product.active) {
    return NextResponse.json({ error: "PRODUCT_NOT_FOUND" }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const accessToken = process.env.MP_ACCESS_TOKEN!;
  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  const externalReference = `${userData.user.id}:${product.id}`;

  const pref = await preference.create({
    body: {
      items: [
        {
          id: String(product.id), // <-- FIX TYPESCRIPT (y sirve como id del item)
          title: product.mp_title ?? "Membresía mensual",
          quantity: 1,
          unit_price: (product.price_cents ?? 0) / 100,
          currency_id: product.currency ?? "ARS",
        },
      ],
      external_reference: externalReference,
      back_urls: {
        success: `${siteUrl}/tienda/success`,
        pending: `${siteUrl}/tienda/pending`,
        failure: `${siteUrl}/tienda/failure`,
      },
      auto_return: "approved",
      notification_url: `${siteUrl}/api/mp/webhook`,
    },
  });

  return NextResponse.redirect(pref.init_point!, { status: 303 });
}
