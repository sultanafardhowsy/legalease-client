import { stripe } from "@/lib/stripe";
import Link from "next/link";
import { redirect } from "next/navigation";

// ✅ Poll Stripe until session is complete (max 10 seconds)
async function waitForSession(session_id) {
  for (let i = 0; i < 5; i++) {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

    console.log(`Attempt ${i + 1} — status: ${session.status}, payment_status: ${session.payment_status}`);

    if (session.payment_status === "paid") return session;

    // Wait 2 seconds before retrying
    await new Promise((res) => setTimeout(res, 2000));
  }
  return null;
}

async function confirmPaymentInDB(sessionId) {
  try {
    const res = await fetch("http://localhost:5000/api/transactions/save-success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
      cache: "no-store",
    });

    const data = await res.json();
    console.log("DB save response:", data);
  } catch (err) {
    console.error("Failed to confirm payment in DB:", err);
  }
}

export default async function LawyerPaymentSuccess({ searchParams }) {
  const { session_id } = await searchParams;

  console.log("session_id from URL:", session_id);

  if (!session_id) redirect("/dashboard/client/hiring-history");

  // ✅ Wait for Stripe to confirm payment
  const session = await waitForSession(session_id);

  console.log("Final session:", session?.status, session?.payment_status);
  console.log("Metadata:", session?.metadata);

  if (!session) {
    // Payment didn't confirm in time
    redirect("/dashboard/client/hiring-history");
  }

  // ✅ Save to DB
  await confirmPaymentInDB(session_id);

  const customerEmail = session.customer_details?.email;
  const amountPaid = (session.amount_total / 100).toFixed(2);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-divider bg-white p-10 shadow-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 border border-green-200">
          <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mt-8 text-4xl font-bold text-foreground">Payment Successful 🎉</h1>
        <p className="mt-4 text-default-500 leading-relaxed">
          Your consultation has been confirmed. The lawyer will reach out to you shortly.
        </p>

        <div className="mt-8 rounded-2xl border border-divider bg-default-50 p-5 space-y-3 text-left">
          <div className="flex justify-between">
            <p className="text-sm text-default-400">Amount Paid</p>
            <p className="text-sm font-bold text-foreground">${amountPaid} USD</p>
          </div>
          <div className="flex justify-between border-t border-divider pt-3">
            <p className="text-sm text-default-400">Confirmation sent to</p>
            <p className="text-sm font-medium text-foreground break-all">{customerEmail}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard/client/hiring-history" className="flex-1 rounded-xl bg-primary px-5 py-3 font-semibold text-white text-center transition hover:opacity-90">
            View Hiring History
          </Link>
          <Link href="/" className="flex-1 rounded-xl border border-divider px-5 py-3 font-semibold text-foreground text-center transition hover:bg-default-50">
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}