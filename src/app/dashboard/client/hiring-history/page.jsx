"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Avatar, Chip, Button, Skeleton } from "@heroui/react";
import { CalendarDays, Banknote, BriefcaseBusiness, CreditCard } from "lucide-react";
import { apiFetch } from "@/lib/core/api";

export default function UserHiringHistoryPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null); // track which row is paying

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/hire-requests/user/${userId}`);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch hiring history:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [fetchRequests, userId]);

  // ✅ handlePayNow defined here
  const handlePayNow = async (req) => {
    try {
      setPayingId(req._id);

      console.log("handlePayNow called with:", {
        hireRequestId: req._id,
        lawyerName:    req.lawyerName,
        amount:        req.lawyerFee,
        userEmail:     session?.user?.email,
        lawyerId:      req.lawyerId,
        userId:        userId,
      });

      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hireRequestId: req._id,
          lawyerName:    req.lawyerName,
          amount:        req.lawyerFee,
          userEmail:     session?.user?.email,
          lawyerId:      req.lawyerId,
          userId:        userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Payment error:", err.message);
    } finally {
      setPayingId(null);
    }
  };

  const formatDate = (dateField) => {
    if (!dateField) return "N/A";
    const d = new Date(dateField?.$date || dateField);
    return isNaN(d) ? "N/A" : d.toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const statusColor = (status) => {
    if (status === "accepted") return "success";
    if (status === "rejected") return "danger";
    return "warning";
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Hiring History</h1>
        <p className="mt-2 text-default-500">
          Track your consultation requests and payments.
        </p>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="rounded-3xl border border-divider p-14 text-center">
          <p className="text-2xl font-bold text-foreground">No requests yet</p>
          <p className="mt-2 text-default-500">
            Your consultation requests will appear here.
          </p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="rounded-3xl border border-divider overflow-hidden">

          <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-default-50 border-b border-divider">
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Lawyer</p>
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Specialization</p>
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Fee</p>
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Date</p>
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Status / Action</p>
          </div>

          <div className="divide-y divide-divider">
            {requests.map((req) => (
              <div
                key={req._id}
                className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-default-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    className="h-9 w-9 shrink-0"
                    src={req.lawyerImage || undefined}
                    name={req.lawyerName?.charAt(0).toUpperCase() || "L"}
                  />
                  <p className="text-sm font-semibold text-foreground line-clamp-1">
                    {req.lawyerName}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-default-500">
                  <BriefcaseBusiness size={14} className="shrink-0" />
                  <span className="line-clamp-2">{req.lawyerSpecialization}</span>
                </div>

                <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                  <Banknote size={14} className="text-success shrink-0" />
                  ৳{req.lawyerFee}
                </div>

                <div className="flex items-center gap-2 text-sm text-default-500">
                  <CalendarDays size={14} className="shrink-0" />
                  {formatDate(req.requestDate)}
                </div>

                <div className="flex items-center gap-2">
  <Chip size="sm" color={statusColor(req.status)} variant="flat">
    {req.status}
  </Chip>

  {/* ✅ Only show Pay Now if accepted, not if paid */}
  {req.status === "accepted" && (
    <Button
      size="sm"
      color="primary"
      className="font-bold rounded-xl"
      isLoading={payingId === req._id}
      onPress={() => handlePayNow(req)}
    >
      <CreditCard size={14} />
      Pay Now
    </Button>
  )}
</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}