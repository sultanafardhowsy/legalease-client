"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@heroui/react";
import { ClipboardList, Briefcase, CircleCheck } from "lucide-react";

export default function LawyerDashboardHome() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchStats();
  }, [user?.id]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/dashboard/lawyer/${user.id}`
      );
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = stats?.status === "Available" ? "text-green-600" : "text-red-500";

  return (
    <div className="space-y-8 p-6 md:p-10">

      {/* Welcome Section */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-lg">
        <p className="text-sm uppercase tracking-widest text-slate-300">
          Lawyer Dashboard
        </p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Welcome back, {user?.name || "Lawyer"} 👋
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Manage your legal profile, review client requests, and maintain your
          professional presence from one central place.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Pending Requests */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ClipboardList size={16} />
            Hiring Requests
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-16 rounded-xl" />
          ) : (
            <h2 className="mt-3 text-4xl font-bold">
              {stats?.pendingRequests ?? 0}
            </h2>
          )}
          <p className="mt-2 text-sm text-gray-500">Pending client requests.</p>
        </div>

        {/* Specialization */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Briefcase size={16} />
            Specialization
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-40 rounded-xl" />
          ) : (
            <h2 className="mt-3 text-xl font-bold line-clamp-2">
              {stats?.specialization ?? "N/A"}
            </h2>
          )}
          <p className="mt-2 text-sm text-gray-500">Your legal expertise.</p>
        </div>

        {/* Availability */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CircleCheck size={16} />
            Availability
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-28 rounded-xl" />
          ) : (
            <h2 className={`mt-3 text-2xl font-bold ${statusColor}`}>
              {stats?.status ?? "Available"}
            </h2>
          )}
          <p className="mt-2 text-sm text-gray-500">Your current status.</p>
        </div>

      </div>

      {/* Professional Banner */}
      <div className="rounded-3xl border bg-amber-50 p-8">
        <h3 className="text-2xl font-bold">Build Trust With Your Clients</h3>
        <p className="mt-3 max-w-3xl text-gray-600">
          Keep your profile updated with an accurate bio, professional photo,
          consultation fee, and legal services. A complete profile helps clients
          confidently choose and hire you.
        </p>
      </div>

    </div>
  );
}