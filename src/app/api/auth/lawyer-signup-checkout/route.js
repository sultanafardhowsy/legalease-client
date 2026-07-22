import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const body = await request.json();
    const { userId, email } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            unit_amount: 2999,
            product_data: {
              name: "Lawyer Account Activation",
              description: "One-time fee to activate your lawyer account",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: String(userId),
        type: "lawyer_activation",
      },
      success_url: `${origin}/dashboard/lawyer/activate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/lawyer/activate`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("Lawyer activation payment error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}