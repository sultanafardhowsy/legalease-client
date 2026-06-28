"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/core/api";

export default function LawyerActivatePage() {
  const { data: session, isPending } = authClient.useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handlePayment = async () => {
    setIsRedirecting(true);
    try {
      const res = await apiFetch("/api/auth/lawyer-signup-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          email: session?.user?.email,
        }),
      });

      const { url, error } = await res.json();
      if (error) throw new Error(error);

      window.location.href = url;
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.message);
      setIsRedirecting(false);
    }
  };

  if (isPending) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">⚖️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Activate Your Lawyer Account</h1>
        <p className="text-gray-500 text-sm mb-6">
          A one-time payment is required to activate your account and appear in client searches.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-600 font-medium mb-1">What you get:</p>
          <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
            <li>Full lawyer profile visibility</li>
            <li>Receive and manage client hire requests</li>
            <li>Access to your lawyer dashboard</li>
          </ul>
        </div>

        <button
          onClick={handlePayment}
          disabled={isRedirecting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:bg-gray-400 transition-colors"
        >
          {isRedirecting ? "Redirecting to payment..." : "Pay to Activate →"}
        </button>

        <p className="text-xs text-gray-400 mt-4">Secured by Stripe. One-time fee.</p>
      </div>
    </div>
  );
}
