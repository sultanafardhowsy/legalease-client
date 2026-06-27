"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/core/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalHires: 0,
    totalRevenue: 0,
    // Assuming your backend can also send chart data (e.g., monthly breakdown)
    // If your backend only sends totals, you can dynamically build charts from the totals below.
    monthlyRevenue: [
      { name: "Jan", revenue: 400 },
      { name: "Feb", revenue: 600 },
      { name: "Mar", revenue: 800 },
      { name: "Apr", revenue: 1000 },
      { name: "May", revenue: 1500 },
      { name: "Jun", revenue: 2100 },
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiFetch(`/api/admin/analytics`);
        // If the backend returns data, merge it. 
        // We use spread to keep our default mockup values if the backend doesn't send them yet.
        setAnalytics((prev) => ({ ...prev, ...data }));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Preparing dynamic summary chart data based on the loaded metrics
  const summaryData = [
    { name: "Users", count: analytics?.totalUsers || 0 },
    { name: "Lawyers", count: analytics?.totalLawyers || 0 },
    { name: "Hires", count: analytics?.totalHires || 0 },
  ];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Analytics Overview</h1>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm dark:shadow-md hover:shadow-md dark:hover:border-slate-700 transition duration-200">
          <p className="text-gray-500 dark:text-gray-200">Total Users</p>
          <h2 className="text-4xl font-bold mt-3">{analytics.totalUsers}</h2>
        </div>

        {/* Total Lawyers */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm dark:shadow-md hover:shadow-md dark:hover:border-slate-700 transition duration-200">
          <p className="text-gray-500 dark:text-gray-200">Total Lawyers</p>
          <h2 className="text-4xl font-bold mt-3">{analytics.totalLawyers}</h2>
        </div>

        {/* Total Hires */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm dark:shadow-md hover:shadow-md dark:hover:border-slate-700 transition duration-200">
          <p className="text-gray-500 dark:text-gray-200">Total Hires</p>
          <h2 className="text-4xl font-bold mt-3">{analytics.totalHires}</h2>
        </div>

        {/* Total Revenue */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm dark:shadow-md hover:shadow-md dark:hover:border-slate-700 transition duration-200">
          <p className="text-gray-500 dark:text-gray-200">Total Revenue</p>
          <h2 className="text-4xl font-bold mt-3">${analytics.totalRevenue}</h2>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Platform Overview */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
            Platform Distribution
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart: Revenue Trend */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
            Revenue Progression
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}