import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const signature = request.headers.get("x-signature") ?? "";

  if (secret && signature !== secret) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const body = await request.json();
  const { meta, data } = body;
  const eventName = meta?.event_name;

  if (eventName === "order_created") {
    const email = data?.attributes?.user_email;
    const variantId = data?.attributes?.first_order_item?.variant_id;

    if (email && variantId) {
      const plan = String(variantId).includes(process.env.LS_PRO_VARIANT_ID ?? "") ? "pro" : "free";
      await prisma.user.upsert({
        where: { email },
        update: { plan },
        create: { email, plan },
      });
    }
  }

  if (eventName === "subscription_updated" || eventName === "subscription_cancelled") {
    const email = data?.attributes?.user_email;
    const status = data?.attributes?.status;
    if (email) {
      const plan = status === "active" || status === "on_trial" ? "pro" : "free";
      await prisma.user.upsert({
        where: { email },
        update: { plan },
        create: { email, plan },
      });
    }
  }

  return NextResponse.json({ received: true });
}
