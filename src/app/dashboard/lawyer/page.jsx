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

  // Color adjusts dynamically based on the current system/app theme classes
  const statusColor = stats?.status === "Available" ? "text-success" : "text-danger";

  return (
    <div className="space-y-8 p-6 md:p-10">

      {/* Welcome Section */}
      <div className="rounded-3xl border border-divider bg-gradient-to-r from-slate-900 to-slate-700 dark:from-default-100 dark:to-default-50 p-8 text-white dark:text-foreground shadow-lg">
        <p className="text-sm uppercase tracking-widest text-slate-300 dark:text-default-500">
          Lawyer Dashboard
        </p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Welcome back, {user?.name || "Lawyer"} 👋
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300 dark:text-default-600">
          Manage your legal profile, review client requests, and maintain your
          professional presence from one central place.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Pending Requests */}
        <div className="rounded-3xl border border-divider bg-content1 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-default-500">
            <ClipboardList size={16} />
            Hiring Requests
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-16 rounded-xl" />
          ) : (
            <h2 className="mt-3 text-4xl font-bold text-foreground">
              {stats?.pendingRequests ?? 0}
            </h2>
          )}
          <p className="mt-2 text-sm text-default-400">Pending client requests.</p>
        </div>

        {/* Specialization */}
        <div className="rounded-3xl border border-divider bg-content1 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-default-500">
            <Briefcase size={16} />
            Specialization
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-40 rounded-xl" />
          ) : (
            <h2 className="mt-3 text-xl font-bold line-clamp-2 text-foreground">
              {stats?.specialization ?? "N/A"}
            </h2>
          )}
          <p className="mt-2 text-sm text-default-400">Your legal expertise.</p>
        </div>

        {/* Availability */}
        <div className="rounded-3xl border border-divider bg-content1 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-default-500">
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
          <p className="mt-2 text-sm text-default-400">Your current status.</p>
        </div>

      </div>

      {/* Professional Banner */}
     <div className="rounded-3xl border border-divider bg-content1 p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-foreground">Build Trust With Your Clients</h3>
        <p className="mt-3 max-w-3xl text-default-600 dark:text-default-400">
          Keep your profile updated with an accurate bio, professional photo,
          consultation fee, and legal services. A complete profile helps clients
          confidently choose and hire you.
        </p>
      </div>

    </div>
  );
}