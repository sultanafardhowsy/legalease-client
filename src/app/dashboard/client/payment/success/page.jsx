export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { stripe } from "@/lib/stripe";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LawyerPaymentSuccess({
  searchParams,
}) {
  const params = await searchParams;

  const session_id = params?.session_id;

  if (!session_id) {
    redirect("/dashboard/client/hiring-history");
  }

  let session;

  try {
    session = await stripe.checkout.sessions.retrieve(
      session_id
    );
  } catch (error) {
    console.error(error);

    redirect("/dashboard/client/hiring-history");
  }

  if (session.payment_status !== "paid") {
    redirect("/dashboard/client/hiring-history");
  }

  const customerEmail =
    session.customer_details?.email || "N/A";

  const amountPaid = (
    (session.amount_total || 0) / 100
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

        <h1 className="mt-8 text-4xl font-bold">
          Payment Successful 🎉
        </h1>

        <p className="mt-4 text-default-500">
          Your payment has been completed successfully.
        </p>

        <div className="mt-8 rounded-2xl border border-divider bg-default-50 p-5 space-y-3 text-left">

          <div className="flex justify-between">
            <p className="text-sm text-default-400">
              Amount Paid
            </p>

            <p className="text-sm font-bold">
              ${amountPaid} USD
            </p>
          </div>

          <div className="flex justify-between border-t border-divider pt-3">

            <p className="text-sm text-default-400">
              Confirmation sent to
            </p>

            <p className="text-sm font-medium break-all">
              {customerEmail}
            </p>

          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">

          <Link
            href="/dashboard/client/hiring-history"
            className="flex-1 rounded-xl bg-primary px-5 py-3 font-semibold text-white text-center"
          >
            View Hiring History
          </Link>

          <Link
            href="/"
            className="flex-1 rounded-xl border border-divider px-5 py-3 font-semibold text-center"
          >
            Back Home
          </Link>

        </div>

      </div>
    </main>
  );
}