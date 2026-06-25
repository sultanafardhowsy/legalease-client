"use client"

import React, { useEffect, useState } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from API
  useEffect(() => {
    fetch('http://localhost:5000/api/users') // Adjust endpoint to your GET users route
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  // Handle Role Change
  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await response.json();

      if (data.success) {
        // Optimistically update frontend UI state
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
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        // Filter out deleted user from local state
        setUsers(users.filter(user => user._id !== userId));
        alert("User deleted successfully!");
      } else {
        alert("Failed to delete user: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) return <div className="text-center p-10 font-semibold">Loading dashboard users...</div>;

 return (
  <div className="p-4 md:p-6 max-w-7xl mx-auto">
    <h2 className="text-2xl font-bold mb-6 text-foreground">
      Manage Users Dashboard
    </h2>

    {/* Mobile Cards */}
    <div className="grid gap-4 lg:hidden">
      {users.map((user) => (
        <div
          key={user._id}
          className="rounded-xl border border-default-200 bg-background shadow-sm p-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user.image || "https://via.placeholder.com/150"}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border"
            />

            <div className="min-w-0">
              <h3 className="font-semibold truncate">
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
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  : user.role === "lawyer"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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
              className="w-full rounded-lg border border-default-300 bg-background px-3 py-2 text-sm"
            >
              <option value="client">Client</option>
              <option value="lawyer">Lawyer</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={() => handleDeleteUser(user._id)}
              className="w-full rounded-lg bg-red-500 hover:bg-red-600 text-white py-2 text-sm font-medium"
            >
              Delete User
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Desktop Table */}
    <div className="hidden lg:block overflow-x-auto rounded-xl border border-default-200 bg-background shadow-sm">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-default-200 bg-default-100 text-left">
            <th className="px-6 py-4">Avatar</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-b border-default-200 hover:bg-default-100 transition"
            >
              <td className="px-6 py-4">
                <img
                  src={
                    user.image ||
                    "https://via.placeholder.com/150"
                  }
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              </td>

              <td className="px-6 py-4 font-medium">
                {user.name}
              </td>

              <td className="px-6 py-4 text-default-500">
                {user.email}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      : user.role === "lawyer"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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
                    className="rounded-lg border border-default-300 bg-background px-3 py-2 text-sm"
                  >
                    <option value="client">Client</option>
                    <option value="lawyer">Lawyer</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    onClick={() =>
                      handleDeleteUser(user._id)
                    }
                    className="rounded-lg bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-medium"
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
  </div>
);
};

export default ManageUsers;