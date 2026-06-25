"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalHires: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/analytics`
        );

        const data = await res.json();

        setAnalytics(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchAnalytics();

  }, []);


  if (loading) {

    return (
      <div className="p-6">
        Loading...
      </div>
    );

  }


  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">

        Analytics Overview

      </h1>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


        {/* Total Users */}

        {/* <div className="bg-white rounded-xl shadow p-6"> */}
 <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm dark:shadow-md hover:shadow-md dark:hover:border-slate-700 transition duration-200">
          <p className="text-gray-500">

            Total Users

          </p>

          <h2 className="text-4xl font-bold mt-3">

            {analytics.totalUsers}

          </h2>

        </div>


        {/* Total Lawyers */}

        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">

            Total Lawyers

          </p>

          <h2 className="text-4xl font-bold mt-3">

            {analytics.totalLawyers}

          </h2>

        </div>


        {/* Total Hires */}

        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">

            Total Hires

          </p>

          <h2 className="text-4xl font-bold mt-3">

            {analytics.totalHires}

          </h2>

        </div>


        {/* Total Revenue */}

        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">

            Total Revenue

          </p>

          <h2 className="text-4xl font-bold mt-3">

            ${analytics.totalRevenue}

          </h2>

        </div>

      </div>

    </div>

  );

}