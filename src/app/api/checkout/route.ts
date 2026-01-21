import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { supabaseServer } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function GET() {
  return NextResponse.json({ error: "METHOD_NOT_ALLOWED. Use POST." }, { status: 405 });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const productId = String(form.get("productId") ?? "");

    const supabase = await supabaseServer();
    const { data: userData, error: userErr } = await supabase.auth.getUser();

    if (userErr || !userData.user) {
      return NextResponse.redirect(new URL("/login?next=/tienda", req.url), { status: 303 });
    }

    const admin = supabaseAdmin();
    const { data: product, error: prodErr } = await admin
      .from("products")
      .select("id, mp_title, price_cents, currency, duration_days, active, product_type")
      .eq("id", productId)
      .single();

    if (prodErr || !product || !product.active) {
      console.error("Product fetch failed", prodErr);
      return NextResponse.json({ error: "PRODUCT_NOT_FOUND" }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!siteUrl) return NextResponse.json({ error: "MISSING_NEXT_PUBLIC_SITE_URL" }, { status: 500 });
    if (!accessToken) return NextResponse.json({ error: "MISSING_MP_ACCESS_TOKEN" }, { status: 500 });

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productType = (product as any).product_type ?? "service";
    const externalReference = `${userData.user.id}:${product.id}:${productType}`;


    const pref = await preference.create({
      body: {
        items: [
          {
            id: String(product.id),
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

    if (!pref.init_point) {
      console.error("Preference created without init_point", pref);
      return NextResponse.json({ error: "MP_INIT_POINT_MISSING" }, { status: 500 });
    }

    return NextResponse.redirect(pref.init_point, { status: 303 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error("Checkout error", e);
    return NextResponse.json({ error: "CHECKOUT_FAILED" }, { status: 500 });
  }
}
