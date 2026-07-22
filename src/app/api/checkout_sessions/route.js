import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    // ✅ Fix: assign to `body` first, then destructure
    const body = await request.json();
    console.log("--- CHECKOUT API RECEIVED THIS BODY ---", body);
    const { hireRequestId, lawyerName, amount, userEmail, lawyerId, userId } = body;

    // Validation
    if (!hireRequestId || !amount || !userEmail || !lawyerId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `Legal Consultation — ${lawyerName}`,
              description: `One-time consultation fee for hiring ${lawyerName}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        hireRequestId,
        lawyerId,
        userId,
        type: "lawyer_consultation",
      },
      success_url: `${origin}/dashboard/client/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/client/hiring-history`,
    });

    console.log("Stripe Session Status is:", session.status);

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("Lawyer payment error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}