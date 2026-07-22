"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@heroui/react";
import { Users, Scale, Banknote, Activity, RefreshCw } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/core/api";

export default function AdminDashboardContent() {
  const { data: session } = authClient.useSession();
  const adminUser = session?.user;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/admin/stats`);
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch admin stats dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  return (
    <>
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 dark:from-purple-950 dark:via-indigo-950 dark:to-black p-6 sm:p-8 md:p-10 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-indigo-300 dark:text-indigo-200">
          Control Center Administration
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
          System Overview, {adminUser?.name || "Admin"} ⚙️
        </h1>
        <p className="mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-indigo-100/80 leading-relaxed">
          Manage system operations, track subscription configurations, monitor 
          platform database states, and adjust role access parameters across all user bases.
        </p>
      </div>

      {/* Admin Metric Overview Grid Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm dark:shadow-md hover:shadow-md dark:hover:border-slate-700 transition duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Users size={18} className="text-purple-600 dark:text-purple-400" />
              Total Base Users
            </div>
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
          ) : (
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {stats?.totalUsers ?? 0}
            </h2>
          )}
          <p className="mt-2 text-xs sm:text-sm text-slate-400 dark:text-slate-500">Registered platform accounts.</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm dark:shadow-md hover:shadow-md dark:hover:border-slate-700 transition duration-200">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Scale size={18} className="text-blue-600 dark:text-blue-400" />
            Active Lawyers
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
          ) : (
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {stats?.totalLawyers ?? 0}
            </h2>
          )}
          <p className="mt-2 text-xs sm:text-sm text-slate-400 dark:text-slate-500">Lawyers on a sub plan status.</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm dark:shadow-md hover:shadow-md dark:hover:border-slate-700 transition duration-200">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Banknote size={18} className="text-emerald-600 dark:text-emerald-400" />
            Gross Revenue
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
          ) : (
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              ৳{stats?.totalRevenue ?? "0.00"}
            </h2>
          )}
          <p className="mt-2 text-xs sm:text-sm text-slate-400 dark:text-slate-500">Aggregated premium upgrades.</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm dark:shadow-md hover:shadow-md dark:hover:border-slate-700 transition duration-200">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Activity size={18} className="text-amber-500 dark:text-amber-400" />
            System Pulse
          </div>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
          ) : (
            <div className="mt-3 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {stats?.platformStanding ?? "Online"}
              </h2>
            </div>
          )}
          <p className="mt-2 text-xs sm:text-sm text-slate-400 dark:text-slate-500">All services operational.</p>
        </div>
      </div>

      {/* Action Router Shortcuts Block */}
      <div className="rounded-3xl border border-purple-100/80 dark:border-purple-950/40 bg-purple-50/40 dark:bg-purple-950/10 p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">Administrative Shortcuts</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl text-xs sm:text-sm leading-relaxed">
          Jump directly to database panels to perform immediate state manipulation, update authorization tiers, or manage client entries.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link 
            href="/dashboard/admin/users"
            className="inline-flex justify-center items-center rounded-xl bg-purple-700 dark:bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-800 dark:hover:bg-purple-700 transition active:scale-[0.98]"
          >
            Open User Table Panel
          </Link>
          <button 
            onClick={fetchAdminStats}
            disabled={loading}
            className="inline-flex justify-center items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Force System Refresh
          </button>
        </div>
      </div>
    </>
  );
}
