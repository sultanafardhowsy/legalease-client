"use client"

import React, { useEffect, useState } from 'react';
import { Pagination } from "@heroui/react";
import { apiFetch, apiMutation, apiPatch } from "@/lib/core/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 8; // Adjust limit per page as needed

  // Fetch paginated users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await apiFetch(`/api/users?page=${page}&limit=${limit}`);
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
        setTotalUsers(data.totalUsers || 0);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  // Handle Role Change
  const handleRoleChange = async (userId, newRole) => {
    try {
      const data = await apiPatch(`/api/users/${userId}/role`, { role: newRole });
      if (data.success) {
        setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
        alert("Role updated successfully!");
      } else {
        alert("Failed to update role: " + data.message);
      }
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you absolutely sure you want to delete this user?")) return;
    try {
      const data = await apiMutation(`/api/users/${userId}`, {}, "DELETE");
      if (data.success) {
        setUsers(users.filter(user => user._id !== userId));
        setTotalUsers(prev => Math.max(0, prev - 1));
        alert("User deleted successfully!");
      } else {
        alert("Failed to delete user: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return <div className="text-center p-10 font-semibold text-default-700 bg-background min-h-screen">Loading dashboard users...</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-background text-foreground min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-default-800 dark:text-default-100">
        Manage Users Dashboard
      </h2>

      {/* Mobile Cards */}
      <div className="grid gap-4 lg:hidden">
        {users.map((user, index) => (
          <div
            key={user._id}
            className="rounded-xl border border-default-200 bg-content1 shadow-sm p-4"
          >
            <span className="text-xs font-medium text-default-400 block mb-2">
              #{(page - 1) * limit + index + 1}
            </span>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user.image || "https://via.placeholder.com/150"}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border border-default-300"
              />

              <div className="min-w-0">
                <h3 className="font-semibold truncate text-default-800">
                  {user.name}
                </h3>

                <p className="text-sm text-default-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                    : user.role === "lawyer"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                }`}
              >
                {user.role}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <select
                value={user.role || "client"}
                onChange={(e) =>
                  handleRoleChange(user._id, e.target.value)
                }
                className="w-full rounded-lg border border-default-300 bg-default-50 dark:bg-default-100 px-3 py-2 text-sm text-default-800"
              >
                <option value="client">Client</option>
                <option value="lawyer">Lawyer</option>
                <option value="admin">Admin</option>
              </select>

              <button
                onClick={() => handleDeleteUser(user._id)}
                className="w-full rounded-lg bg-danger-500 hover:bg-danger-600 text-white py-2 text-sm font-medium transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-default-200 bg-content1 shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-default-200 bg-default-100 dark:bg-default-50 text-left text-default-600">
              <th className="px-6 py-4">Avatar</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-default-200">
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="border-b border-default-100 hover:bg-default-50 dark:hover:bg-default-100/40 transition-colors"
              >
                <td className="px-6 py-4">
                  <img
                    src={
                      user.image ||
                      "https://via.placeholder.com/150"
                    }
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-default-300"
                  />
                </td>

                <td className="px-6 py-4 font-medium text-default-800">
                  {user.name}
                </td>

                <td className="px-6 py-4 text-default-500">
                  {user.email}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                        : user.role === "lawyer"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-3">
                    <select
                      value={user.role || "client"}
                      onChange={(e) =>
                        handleRoleChange(
                          user._id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-default-300 bg-default-50 dark:bg-default-100 px-3 py-2 text-sm text-default-800"
                    >
                      <option value="client">Client</option>
                      <option value="lawyer">Lawyer</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      onClick={() =>
                        handleDeleteUser(user._id)
                      }
                      className="rounded-lg bg-danger-500 hover:bg-danger-600 text-white px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HeroUI Compound Pagination Layout */}
      {!loading && totalPages > 0 && (
        <div className="flex justify-center mt-10">
          <Pagination className="w-full" total={totalPages} page={page} onChange={setPage}>
            <Pagination.Summary className="text-default-500">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalUsers)} of {totalUsers} users
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

export default ManageUsers;