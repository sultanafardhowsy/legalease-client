"use client";

import React, { useEffect, useState } from "react";

const AllTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/all-transactions`
        )
            .then((res) => res.json())
            .then((data) => {
                setTransactions(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="text-center p-10 font-semibold">
                Loading transactions...
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">

            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                All Transactions
            </h2>

            <div className="overflow-x-auto bg-white rounded-lg shadow">

                <table className="min-w-full table-auto border-collapse">

                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">

                            <th className="px-6 py-4">#</th>

                            <th className="px-6 py-4">
                                Transaction ID
                            </th>

                            <th className="px-6 py-4">
                                User Email
                            </th>

                            <th className="px-6 py-4">
                                User Role
                            </th>

                            <th className="px-6 py-4">
                                Lawyer Email
                            </th>

                            <th className="px-6 py-4">
                                Lawyer Role
                            </th>

                            <th className="px-6 py-4">
                                Amount
                            </th>

                            <th className="px-6 py-4">
                                Date
                            </th>

                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 text-sm text-gray-700">

                        {transactions.map((item, index) => (

                            <tr
                                key={item._id}
                                className="hover:bg-gray-50 transition"
                            >

                                <td className="px-6 py-4">
                                    {index + 1}
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
                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.userRole === "lawyer"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-green-100 text-green-800"
                                            }`}
                                    >

                                        {item.userRole}

                                    </span>

                                </td>

                                <td className="px-6 py-4">
                                    {item.lawyerEmail}
                                </td>

                                <td className="px-6 py-4">

                                    <span
                                        className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"
                                    >

                                        {item.lawyerRole}

                                    </span>

                                </td>

                                <td className="px-6 py-4 font-semibold text-green-600">

                                    ${item.amount}

                                </td>

                                <td className="px-6 py-4">

                                    {new Date(
                                        item.createdAt
                                    ).toLocaleDateString()}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default AllTransactions;