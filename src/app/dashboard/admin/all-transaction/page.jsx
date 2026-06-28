"use client";

import React, { useEffect, useState } from "react";
import { Pagination } from "@heroui/react";
import { apiFetch } from "@/lib/core/api"; // ← add this import

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const limit = 8;

 useEffect(() => {
  console.log("useEffect running, page:", page); // ← add this
  setLoading(true);
  apiFetch(`/api/admin/all-transactions?page=${page}&limit=${limit}`)
    .then((data) => {
      console.log("Transactions data:", data);
      setTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 1);
      setTotalTransactions(data.totalTransactions || 0);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setLoading(false);
    });
}, [page]);

  // ... rest of your component unchanged
  if (loading) {
    return (
      <div className="text-center p-10 font-semibold text-default-700 bg-background min-h-screen">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-background text-default-900 min-h-screen">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-default-800">
        All Transactions
      </h2>

      {/* Mobile Cards */}
      <div className="grid gap-4 lg:hidden">
        {transactions.map((item, index) => (
          <div
            key={item._id}
            className="bg-content1 rounded-xl shadow p-4 border border-default-200"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-default-600">
                #{(page - 1) * limit + index + 1}
              </span>

              <span className="font-bold text-success-600">
                ${item.amount}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-default-500">
                  Transaction:
                </span>{" "}
                <span className="break-all text-default-700">
                  {item.transactionId}
                </span>
              </p>

              <p>
                <span className="font-medium text-default-500">
                  User:
                </span>{" "}
                <span className="text-default-700">{item.userEmail}</span>
              </p>

              <p>
                <span className="font-medium text-default-500">
                  Role:
                </span>{" "}
                <span className="capitalize text-default-700">
                  {item.userRole}
                </span>
              </p>

              <p>
                <span className="font-medium text-default-500">
                  Lawyer:
                </span>{" "}
                <span className="text-default-700">{item.lawyerEmail}</span>
              </p>

              <p>
                <span className="font-medium text-default-500">
                  Date:
                </span>{" "}
                <span className="text-default-700">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-content1 rounded-lg shadow border border-default-200">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-default-100 border-b border-default-200 text-left text-sm font-semibold text-default-600 uppercase">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">User Email</th>
              <th className="px-6 py-4">User Role</th>
              <th className="px-6 py-4">Lawyer Email</th>
              <th className="px-6 py-4">Lawyer Role</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-default-200 text-sm text-default-700">
            {transactions.map((item, index) => (
              <tr
                key={item._id}
                className="hover:bg-default-50 transition-colors"
              >
                <td className="px-6 py-4">
                  {(page - 1) * limit + index + 1}
                </td>

                <td className="px-6 py-4">
                  <div className="max-w-[250px] truncate">
                    {item.transactionId}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {item.userEmail}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.userRole === "lawyer"
                        ? "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-400"
                        : "bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-400"
                    }`}
                  >
                    {item.userRole}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {item.lawyerEmail}
                </td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-400">
                    {item.lawyerRole}
                  </span>
                </td>

                <td className="px-6 py-4 font-semibold text-success-600 dark:text-success-400">
                  ${item.amount}
                </td>

                <td className="px-6 py-4">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HeroUI Compound Pagination Setup */}
      {!loading && totalPages > 0 && (
        <div className="flex justify-center mt-10">
          <Pagination className="w-full" total={totalPages} page={page} onChange={setPage}>
            <Pagination.Summary className="text-default-500">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalTransactions)} of{" "}
              {totalTransactions} transactions
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous isDisabled={page === 1} onPress={() => setPage((p) => p - 1)}>
                  <Pagination.PreviousIcon />
                  <span>Prev</span>
                </Pagination.Previous>
              </Pagination.Item>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Pagination.Item key={pageNum}>
                  <Pagination.Link 
                    isActive={pageNum === page} 
                    onPress={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Pagination.Link>
                </Pagination.Item>
              ))}

              <Pagination.Item>
                <Pagination.Next isDisabled={page === totalPages} onPress={() => setPage((p) => p + 1)}>
                  <span>Next</span>
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default AllTransactions;