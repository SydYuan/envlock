import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.customer_email || session.customer_details?.email;
      if (email) {
        await prisma.user.upsert({
          where: { email },
          update: {
            stripeCustomerId: session.customer as string,
            plan: "pro",
          },
          create: {
            email,
            stripeCustomerId: session.customer as string,
            plan: "pro",
          },
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      const status = subscription.status;
      const plan = status === "active" || status === "trialing" ? "pro" : "free";

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { plan },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
