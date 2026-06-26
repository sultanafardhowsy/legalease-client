"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Avatar, Chip, Button, Skeleton } from "@heroui/react";
import { CalendarDays, CheckCircle, XCircle, Clock } from "lucide-react";

export default function LawyerHiringHistoryPage() {
  const { data: session } = useSession();
  const lawyerId = session?.user?.id;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (lawyerId) fetchRequests();
  }, [lawyerId]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/hire-requests/lawyer/${lawyerId}`
      );
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch hiring history:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/hire-requests/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r._id.toString() === id ? { ...r, status } : r
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateField) => {
    if (!dateField) return "N/A";
    const d = new Date(dateField?.$date || dateField);
    return isNaN(d)
      ? "N/A"
      : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  };

  const statusColor = (status) => {
    if (status === "accepted") return "success";
    if (status === "rejected") return "danger";
    return "warning";
  };

  const statusIcon = (status) => {
    if (status === "accepted") return <CheckCircle size={14} />;
    if (status === "rejected") return <XCircle size={14} />;
    return <Clock size={14} />;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Hiring History</h1>
        <p className="mt-2 text-default-500">
          Manage consultation requests from clients.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl w-full" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && requests.length === 0 && (
        <div className="rounded-3xl border border-divider bg-content1 p-8 sm:p-14 text-center shadow-sm">
          <p className="text-2xl font-bold text-foreground">No requests yet</p>
          <p className="mt-2 text-default-500">
            When clients send hiring requests, they will appear here.
          </p>
        </div>
      )}

      {/* Data Container */}
      {!loading && requests.length > 0 && (
        <div className="rounded-3xl border border-divider bg-content1 overflow-hidden shadow-sm">
          {/* Table Header (Hidden on Mobile, visible on Medium screens and up) */}
          <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-3 bg-default-50/50 dark:bg-default-100/20 border-b border-divider">
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Client</p>
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Request Date</p>
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Status</p>
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Action</p>
          </div>

          {/* List/Table Rows */}
          <div className="divide-y divide-divider">
            {requests.map((req) => (
              <div
                key={req._id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 sm:px-6 py-5 items-start md:items-center hover:bg-default-50/30 dark:hover:bg-default-100/10 transition-colors gap-y-4"
              >
                {/* Column 1: Client */}
                <div className="flex items-center gap-3">
                  <Avatar
                    src={req.clientImage || undefined}
                    name={req.clientName || "U"}
                    className="h-9 w-9 shrink-0 text-tiny font-bold"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {req.clientName || "Unknown Client"}
                    </p>
                    <p className="text-xs text-default-400 truncate">
                      {req.clientEmail || "No email provided"}
                    </p>
                  </div>
                </div>

                {/* Column 2: Date */}
                <div className="flex items-center gap-2 text-sm text-default-500">
                  <CalendarDays size={14} className="shrink-0 text-default-400" />
                  <span className="md:hidden text-xs font-medium text-default-400 uppercase tracking-wider mr-1">Date:</span>
                  {formatDate(req.requestDate)}
                </div>

                {/* Column 3: Status */}
                {/* Column 3: Status */}
                <div className="flex items-center gap-2">
                  <span className="md:hidden text-xs font-medium text-default-400 uppercase tracking-wider mr-1">Status:</span>
                  <Chip
                    size="sm"
                    color={statusColor(req.status)}
                    variant="flat"
                    className="capitalize font-medium"
                  >
                    <span className="flex items-center gap-1">
                      {statusIcon(req.status)}
                      {req.status}
                    </span>
                  </Chip>
                </div>

                {/* Column 4: Actions */}
                <div className="flex items-center gap-3 justify-start md:justify-start pt-2 md:pt-0 border-t border-divider/50 md:border-0 mt-2 md:mt-0">
                  {req.status === "pending" ? (
                    <>
                      <Button
                        size="sm"
                        color="success"
                        variant="flat"
                        className="font-semibold rounded-xl flex-1 md:flex-none"
                        isLoading={updating === req._id.toString()}
                        onPress={() => updateStatus(req._id.toString(), "accepted")}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        className="font-semibold rounded-xl flex-1 md:flex-none"
                        isLoading={updating === req._id.toString()}
                        onPress={() => updateStatus(req._id.toString(), "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <p className="text-xs text-default-400 italic">No action needed</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}