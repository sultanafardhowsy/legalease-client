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
  const [updating, setUpdating] = useState(null); // track which row is updating

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
        // Update UI instantly without refetch
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
    <div className="mx-auto max-w-5xl px-5 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Hiring History</h1>
        <p className="mt-2 text-default-500">
          Manage consultation requests from clients.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && requests.length === 0 && (
        <div className="rounded-3xl border border-divider p-14 text-center">
          <p className="text-2xl font-bold text-foreground">No requests yet</p>
          <p className="mt-2 text-default-500">
            When clients send hiring requests, they will appear here.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && requests.length > 0 && (
        <div className="rounded-3xl border border-divider overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-default-50 border-b border-divider">
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Client</p>
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Request Date</p>
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Status</p>
            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Action</p>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-divider">
            {requests.map((req) => (
              <div
                key={req._id}
                className="grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-default-50 transition-colors"
              >
                {/* Client */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    {req.clientImage ? (
                      <Avatar.Image src={req.clientImage} alt={req.clientName} />
                    ) : null}
                    <Avatar.Fallback>
                      {req.clientName?.charAt(0).toUpperCase() || "U"}
                    </Avatar.Fallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground line-clamp-1">
                      {req.clientName}
                    </p>
                    <p className="text-xs text-default-400 line-clamp-1">
                      {req.clientEmail}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-default-500">
                  <CalendarDays size={14} className="shrink-0" />
                  {formatDate(req.requestDate)}
                </div>

                {/* Status */}
                {/* Status */}
<div>
  <Chip
    size="sm"
    color={statusColor(req.status)}
    variant="flat"
  >
    <span className="flex items-center gap-1">
      {statusIcon(req.status)}
      {req.status}
    </span>
  </Chip>
</div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {req.status === "pending" ? (
                    <>
                      <Button
                        size="sm"
                        color="success"
                        variant="flat"
                        className="font-semibold rounded-xl"
                        isLoading={updating === req._id.toString()}
                        onPress={() => updateStatus(req._id.toString(), "accepted")}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        className="font-semibold rounded-xl"
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