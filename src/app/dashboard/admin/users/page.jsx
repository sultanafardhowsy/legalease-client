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
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Users Dashboard</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-6 py-4">Avatar</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Current Role</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                {/* Image Avatar */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={user.image || "https://via.placeholder.com/150"} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                </td>
                
                {/* Name */}
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                
                {/* Email */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                
                {/* Role Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                
                {/* Change Role & Delete Buttons */}
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-3">
  <select 
    value={user.role || 'client'} // Default fallback to client if role is empty
    onChange={(e) => handleRoleChange(user, e.target.value)}
    className="border border-gray-300 rounded bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="client">Client</option>
    <option value="lawyer">Lawyer</option>
    <option value="admin">Admin</option>
  </select>

  <button 
    onClick={() => handleDeleteUser(user)}
    className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded shadow transition text-xs"
  >
    Delete
  </button>
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