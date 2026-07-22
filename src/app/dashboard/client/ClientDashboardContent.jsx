"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@heroui/react";
import { ClipboardList, ShieldCheck, Scale } from "lucide-react";
import { apiFetch } from "@/lib/core/api";

export default function ClientDashboardContent() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/hire-requests/user/${user.id}`);
      if (Array.isArray(data)) {
        const pendingCount = data.filter((req) => req.status === "pending").length;
        const paidCount = data.filter((req) => req.status === "paid").length;
        setStats({
          pendingRequests: pendingCount,
          activeCases: paidCount,
          accountStatus: "Active",
        });
      } else {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [fetchStats, user?.id]);

  const statusColor = stats?.accountStatus === "Active" ? "text-green-600" : "text-amber-500";

  return (
    <>
      {/* Welcome Section */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-lg">
        <p className="text-sm uppercase tracking-widest text-slate-300">
          Client Dashboard
        </p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Welcome back, {user?.name || "Client"} 👋
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Track your legal consultations, review your outgoing hire requests, and 
          manage your active legal retainers seamlessly from your control panel.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ClipboardList size={16} />
            Sent Requests
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-16 rounded-xl" />
          ) : (
            <h2 className="mt-3 text-4xl font-bold">
              {stats?.pendingRequests ?? 0}
            </h2>
          )}
          <p className="mt-2 text-sm text-gray-500">Requests awaiting lawyer review.</p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Scale size={16} />
            Active Retainers
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-16 rounded-xl" />
          ) : (
            <h2 className="mt-3 text-4xl font-bold">
              {stats?.activeCases ?? 0}
            </h2>
          )}
          <p className="mt-2 text-sm text-gray-500">Hired lawyers with completed payments.</p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ShieldCheck size={16} />
            Account Status
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-28 rounded-xl" />
          ) : (
            <h2 className={`mt-3 text-2xl font-bold ${statusColor}`}>
              {stats?.accountStatus ?? "Active"}
            </h2>
          )}
          <p className="mt-2 text-sm text-gray-500">Your current account standing.</p>
        </div>
      </div>

      {/* Professional Banner */}
      <div className="rounded-3xl border bg-amber-50 p-8">
        <h3 className="text-2xl font-bold">Prepare for Your Consultations</h3>
        <p className="mt-3 max-w-3xl text-gray-600">
          Make the most out of your hired legal support. Keep case descriptions clear, 
          prepare your documentation ahead of time, and verify consultation pricing 
          details before proceeding with checkout transactions.
        </p>
      </div>
    </>
  );
}
