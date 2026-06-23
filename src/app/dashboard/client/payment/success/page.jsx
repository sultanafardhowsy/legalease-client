export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LawyerPaymentSuccess({ searchParams }) {
  const params = await searchParams;
  const session_id = params?.session_id;

  if (!session_id) {
    redirect("/dashboard/client/hiring-history");
  }

  let amountPaid = "0.00";
  let customerEmail = "N/A";

  try {
    // 🚀 Call your Express backend API to verify and save the transaction
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/save-success`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId: session_id }),
      cache: "no-store"
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("Backend payment processing failed:", data.message);
      // Redirecting to history if verification fails
      redirect("/dashboard/client/hiring-history");
    }

    // Optional: If you want to fetch display metrics, you could return them from your backend, 
    // or keep the current UI simple since the database update was successful!
  } catch (error) {
    console.error("Error confirming transaction with backend:", error);
    redirect("/dashboard/client/hiring-history");
  }

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
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mt-8 text-4xl font-bold">
          Payment Successful 🎉
        </h1>

        <p className="mt-4 text-default-500">
          Your payment has been completed successfully and your dashboard has been updated.
        </p>

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