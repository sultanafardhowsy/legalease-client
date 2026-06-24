"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@heroui/react";
import { Users, Scale, DollarSign, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardHome() {
  const { data: session } = authClient.useSession();
  const adminUser = session?.user;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/stats`
      );
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch admin stats dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-10">

      {/* Welcome Hero Banner */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-purple-950 to-indigo-900 p-8 text-white shadow-lg">
        <p className="text-sm uppercase tracking-widest text-indigo-200">
          Control Center Administration
        </p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          System Overview, {adminUser?.name || "Administrator"} ⚙️
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-indigo-100">
          Manage system operations, track subscription configurations, monitor 
          platform database states, and adjust role access parameters across all user bases.
        </p>
      </div>

      {/* Admin Metric Overview Grid Cards */}
      <div className="grid gap-6 md:grid-cols-4">

        {/* Total Users */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users size={16} className="text-purple-600" />
            Total Base Users
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-16 rounded-xl" />
          ) : (
            <h2 className="mt-3 text-4xl font-bold text-gray-900">
              {stats?.totalUsers ?? 0}
            </h2>
          )}
          <p className="mt-2 text-sm text-gray-500">Registered platform accounts.</p>
        </div>

        {/* Total Verified Lawyers */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Scale size={16} className="text-blue-600" />
            Active Lawyers
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-16 rounded-xl" />
          ) : (
            <h2 className="mt-3 text-4xl font-bold text-gray-900">
              {stats?.totalLawyers ?? 0}
            </h2>
          )}
          <p className="mt-2 text-sm text-gray-500">Lawyers on a sub plan status.</p>
        </div>

        {/* Platform Premium Gross Revenue */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <DollarSign size={16} className="text-emerald-600" />
            Gross Revenue
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-24 rounded-xl" />
          ) : (
            <h2 className="mt-3 text-4xl font-bold text-emerald-600">
              ${stats?.totalRevenue ?? "0.00"}
            </h2>
          )}
          <p className="mt-2 text-sm text-gray-500">Aggregated premium upgrades.</p>
        </div>

        {/* Server & System Status Badge */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity size={16} className="text-amber-500" />
            System Pulse
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-28 rounded-xl" />
          ) : (
            <h2 className="mt-3 text-2xl font-bold text-green-600">
              {stats?.platformStanding ?? "Online"}
            </h2>
          )}
          <p className="mt-2 text-sm text-gray-500">All services operational.</p>
        </div>

      </div>

      {/* Action Router Shortcuts Block */}
      <div className="rounded-3xl border border-purple-100 bg-purple-50/50 p-8">
        <h3 className="text-xl font-bold text-slate-900">Administrative Shortcuts</h3>
        <p className="mt-2 text-gray-600 max-w-2xl text-sm">
          Jump directly to database panels to perform immediate state manipulation, update authorization tiers, or manage client entries.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link 
            href="/dashboard/admin/users"
            className="rounded-xl bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-800 transition"
          >
            Open User Table Panel
          </Link>
          <button 
            onClick={fetchAdminStats}
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
          >
            Force System Refresh
          </button>
        </div>
      </div>

    </div>
  );
}