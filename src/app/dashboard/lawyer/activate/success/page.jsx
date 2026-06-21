import { stripe } from "@/lib/stripe";
import Link from "next/link";
import { redirect } from "next/navigation";

async function waitForSession(session_id) {
  for (let i = 0; i < 5; i++) {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

    console.log(
      `Attempt ${i + 1} - status: ${session.status}, payment_status: ${session.payment_status}`
    );

    if (session.payment_status === "paid") {
      return session;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 2000)
    );
  }

  return null;
}

async function activateLawyerAccount(userId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/${userId}/plan`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        cache: "no-store",
      }
    );

    const data = await res.json();

    console.log(
      "Lawyer activation response:",
      data
    );

    return data;
  } catch (err) {
    console.error(
      "Failed to activate lawyer account:",
      err
    );
  }
}

export default async function LawyerActivationSuccess({
  searchParams,
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/dashboard/lawyer/activate");
  }

  const session = await waitForSession(
    session_id
  );

  if (!session) {
    redirect("/dashboard/lawyer/activate");
  }

  // Verify payment type
  if (
    session.metadata?.type !==
    "lawyer_activation"
  ) {
    redirect("/dashboard/lawyer/activate");
  }

  // Get userId from Stripe metadata
  const { userId } = session.metadata;

  // Update MongoDB
  await activateLawyerAccount(userId);

  const customerEmail =
    session.customer_details?.email;

  const amountPaid = (
    session.amount_total / 100
  ).toFixed(2);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">

      <div className="w-full max-w-xl rounded-3xl border border-divider bg-white p-10 shadow-lg text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 border border-green-200">

          <svg
            className="h-10 w-10 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>

        </div>

        <h1 className="mt-8 text-4xl font-bold text-foreground">
          Account Activated 🎉
        </h1>

        <p className="mt-4 text-default-500 leading-relaxed">
          Your lawyer account is now active.
          You can complete your profile and
          start receiving client requests.
        </p>

        <div className="mt-8 rounded-2xl border border-divider bg-default-50 p-5 space-y-3 text-left">

          <div className="flex justify-between">

            <p className="text-sm text-default-400">
              Amount Paid
            </p>

            <p className="text-sm font-bold text-foreground">
              ${amountPaid} USD
            </p>

          </div>

          <div className="flex justify-between border-t border-divider pt-3">

            <p className="text-sm text-default-400">
              Confirmation sent to
            </p>

            <p className="text-sm font-medium text-foreground break-all">
              {customerEmail}
            </p>

          </div>

        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">

          <Link
            href="/dashboard/lawyer/profile"
            className="flex-1 rounded-xl bg-primary px-5 py-3 font-semibold text-white text-center transition hover:opacity-90"
          >
            Complete Your Profile
          </Link>

          <Link
            href="/"
            className="flex-1 rounded-xl border border-divider px-5 py-3 font-semibold text-foreground text-center transition hover:bg-default-50"
          >
            Back Home
          </Link>

        </div>

      </div>

    </main>
  );
}