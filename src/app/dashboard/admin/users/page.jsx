"use client";

import React, { useEffect, useState } from 'react';
import { Pagination, Button, Avatar, toast, Select, Label, ListBox } from "@heroui/react";
import { apiFetch, apiMutation, apiMutationPatch } from "@/lib/core/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 8;

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
        toast.danger("Failed to load dashboard users.", { title: "Error" });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const data = await apiMutationPatch(`/api/users/${userId}/role`, { role: newRole });
      if (data.success) {
        setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
        toast.success("Role updated successfully!");
      } else {
        toast.warning("Failed to update role: " + data.message);
      }
    } catch (error) {
      console.error("Error changing role:", error);
      toast.danger("An error occurred while updating the role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you absolutely sure you want to delete this user?")) return;
    try {
      const data = await apiMutation(`/api/users/${userId}`, {}, "DELETE");
      if (data.success) {
        setUsers(users.filter(user => user._id !== userId));
        setTotalUsers(prev => Math.max(0, prev - 1));
        toast.success("User deleted successfully!");
      } else {
        toast.warning("Failed to delete user: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.danger("An error occurred while deleting the user.");
    }
  };

  const roleBadgeClass = (role) =>
    `px-3 py-1 rounded-full text-xs font-semibold ${
      role === "admin"
        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
        : role === "lawyer"
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
    }`;

  const RoleSelect = ({ userId, currentRole, className }) => (
    <Select
      size="sm"
      className={className}
      selectedKeys={[currentRole || "client"]}
      onSelectionChange={(key) => {
  if (key !== currentRole) {
    handleRoleChange(userId, String(key));
  }
}}
    >
      <Label>Change Role</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <ListBox.Item id="client" textValue="Client">Client<ListBox.ItemIndicator /></ListBox.Item>
          <ListBox.Item id="lawyer" textValue="Lawyer">Lawyer<ListBox.ItemIndicator /></ListBox.Item>
          <ListBox.Item id="admin" textValue="Admin">Admin<ListBox.ItemIndicator /></ListBox.Item>
        </ListBox>
      </Select.Popover>
    </Select>
  );

  if (loading) {
    return (
      <div className="text-center p-10 font-semibold text-default-700 bg-background min-h-screen">
        Loading dashboard users...
      </div>
    );
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
            key={user._id || index}
            className="rounded-xl border border-default-200 bg-content1 shadow-sm p-4"
          >
            <span className="text-xs font-medium text-default-400 block mb-2">
              #{(page - 1) * limit + index + 1}
            </span>
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                src={user.image || "https://via.placeholder.com/150"}
                alt={user.name}
                className="w-12 h-12 text-large"
              />
              <div className="min-w-0">
                <h3 className="font-semibold truncate text-default-800">{user.name}</h3>
                <p className="text-sm text-default-500 truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={roleBadgeClass(user.role)}>{user.role}</span>
            </div>

            <div className="flex flex-col gap-2">
              <RoleSelect userId={user._id} currentRole={user.role} className="w-full" />
              <Button
                color="danger"
                size="sm"
                onPress={() => handleDeleteUser(user._id)}
                className="w-full font-medium"
              >
                Delete User
              </Button>
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
                key={user._id || index}
                className="border-b border-default-100 hover:bg-default-50 dark:hover:bg-default-100/40 transition-colors"
              >
                <td className="px-6 py-4">
                  <Avatar
                    src={user.image || "https://via.placeholder.com/150"}
                    alt={user.name}
                    className="w-10 h-10 text-medium"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-default-800">{user.name}</td>
                <td className="px-6 py-4 text-default-500">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={roleBadgeClass(user.role)}>{user.role}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-3">
                    <RoleSelect userId={user._id} currentRole={user.role} className="w-36" />
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <div className="flex flex-col items-center gap-4 mt-10">
          <p className="text-default-500 text-sm">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, totalUsers)} of {totalUsers} users
          </p>
          <Pagination>
            <Pagination.Content>
              {/* Previous button */}
              <Pagination.Item>
                <Pagination.Previous
                  onPress={() => setPage(p => Math.max(1, p - 1))}
                  isDisabled={page === 1}
                >
                  <Pagination.PreviousIcon />
                  <span>Previous</span>
                </Pagination.Previous>
              </Pagination.Item>

              {/* Page number links */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Pagination.Item key={p}>
                  <Pagination.Link
                    isActive={p === page}
                    onPress={() => setPage(p)}
                  >
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ))}

              {/* Next button */}
              <Pagination.Item>
                <Pagination.Next
                  onPress={() => setPage(p => Math.min(totalPages, p + 1))}
                  isDisabled={page === totalPages}
                >
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
