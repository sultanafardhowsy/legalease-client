"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {
    Card,
    Avatar,
    Button,
    TextArea,
    Skeleton,
    Separator,
    Tooltip
} from "@heroui/react";
import { MessageSquare, Trash2, Edit3, Calendar, ShieldCheck, ExternalLink } from "lucide-react";
import { apiFetch, apiMutation, apiMutationPatch,  } from "@/lib/core/api";

export default function MyCommentsPage() {
    const { data: session } = useSession();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    // Fetch comments written by this logged in client
    useEffect(() => {
        const fetchUserComments = async () => {
            if (!session?.user?.id) return;
            try {
                setLoading(true);
                const data = await apiFetch(`/api/comments/client/${session.user.id}`);
                console.log(data, "from get api");
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserComments();
    }, [session]);

    const formatDate = (dateObj) => {
        const dateStr = dateObj?.$date || dateObj;
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
        });
    };

    // PATCH Update request handling
    const handleUpdate = async (id) => {
        if (!editText.trim()) return;
        try {
            await apiMutationPatch(`/api/comments/${id}`, {
                text: editText,
                userId: session?.user?.id,
            });
            setComments(prev => prev.map(c =>
                c._id.$oid === id || c._id === id
                    ? { ...c, text: editText, updatedAt: { $date: new Date().toISOString() } }
                    : c
            ));
            setEditingId(null);
        } catch (error) {
            console.error("Error updating comment:", error);
            alert("Failed to update review.");
        }
    };

    // DELETE request handling
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to permanently delete this comment?")) return;
        try {
            await apiMutation(`/api/comments/${id}`, { userId: session?.user?.id }, "DELETE");
            setComments(prev => prev.filter(c => (c._id.$oid !== id && c._id !== id)));
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Network connection error encountered while removing entry.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 text-foreground min-h-screen">
            {/* Header section */}
            <div className="flex flex-col gap-1 mb-8">
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <MessageSquare className="text-primary h-8 w-8" />
                    My Consultation Reviews
                </h1>
                <p className="text-default-400 text-sm">
                    Manage and view all feedback you have submitted for your legal consultations.
                </p>
            </div>

            <Separator className="mb-8" />

            {/* Main Content Layout */}
            {loading ? (
                // Loading Skeleton Layout
                <div className="space-y-4">
                    {[1, 2].map((n) => (
                        <Card key={n} className="w-full border border-divider/60">
                            <Card.Content className="p-5 flex gap-4">
                                <Skeleton className="rounded-full w-12 h-12 shrink-0" />
                                <div className="w-full space-y-2">
                                    <Skeleton className="h-4 w-1/4 rounded-lg" />
                                    <Skeleton className="h-3 w-1/3 rounded-lg" />
                                    <Skeleton className="h-12 w-full rounded-xl mt-2" />
                                </div>
                            </Card.Content>
                        </Card>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                // Empty State Layout
                <Card className="border-2 border-dashed border-divider bg-default-50/50 py-12 text-center">
                    <Card.Content className="flex flex-col items-center gap-3 justify-center">
                        <MessageSquare className="h-12 w-12 text-default-300" />
                        <h3 className="text-lg font-bold text-default-600">No comments found</h3>
                        <p className="text-sm text-default-400 max-w-sm">
                            You haven&apos;t left any professional reviews for lawyers yet. Your reviews will appear here once submitted.
                        </p>
                    </Card.Content>
                </Card>
            ) : (
                // Real data render mapping matching server schema fields
                <div className="space-y-4">
                    {comments.map((comment) => {
                        const targetId = comment._id.$oid || comment._id;
                        const isEditing = editingId === targetId;

                        return (
                            <Card
                                key={targetId}
                                className="w-full border border-divider/70 shadow-sm hover:shadow-md transition-all duration-200 bg-background dark:bg-default-50/40"
                            >
                                <Card.Content className="p-5 md:p-6 flex flex-col sm:flex-row items-start gap-4">
                                    {/* Author Profile Picture */}
                                    <Avatar
                                        src={comment.userImage}
                                        name={comment.userName}
                                        className="w-12 h-12 ring-2 ring-divider shrink-0"
                                    />

                                    {/* Content Area */}
                                    <div className="flex-1 w-full space-y-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 w-full">
                                            <div>
                                                <h3 className="font-bold text-foreground flex items-center gap-1.5 text-base">
                                                    {comment.userName}
                                                    <Tooltip content="Verified Client">
                                                        <ShieldCheck className="h-4 w-4 text-success" />
                                                    </Tooltip>
                                                </h3>
                                                <p className="text-xs text-default-400 font-medium flex items-center gap-1 mt-0.5">
                                                    <Calendar size={12} />
                                                    Posted on {formatDate(comment.createdAt)}
                                                    {(comment.updatedAt?.$date !== comment.createdAt?.$date && comment.updatedAt !== comment.createdAt) && (
                                                        <span className="italic text-primary/80 ml-1">(edited)</span>
                                                    )}
                                                </p>
                                            </div>

                                            {/* Link indicator showing which Lawyer this belongs to */}
                                            <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold mt-1 sm:mt-0">
                                                Review for: {comment.lawyerName || "Legal Expert"}
                                                <ExternalLink size={12} className="ml-0.5" />
                                            </div>
                                        </div>

                                        {/* Comment Body Area */}
                                        {isEditing ? (
                                            <div className="space-y-2 mt-3">
                                                <TextArea
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    variant="bordered"
                                                    className="w-full text-sm text-foreground"
                                                    rows={2}
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <Button size="sm" variant="flat" color="danger" onPress={() => setEditingId(null)}>
                                                        Cancel
                                                    </Button>
                                                    <Button size="sm" color="primary" className="font-bold" onPress={() => handleUpdate(targetId)}>
                                                        Save Changes
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-default-700 dark:text-default-300 bg-default-50 dark:bg-default-100/60 p-3.5 rounded-xl border border-divider/40 leading-relaxed mt-2 italic">
                                                &quot;{comment.text}&quot;
                                            </p>
                                        )}

                                        {/* Action buttons bar */}
                                        {!isEditing && (
                                            <div className="flex justify-end gap-3 pt-2">
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    color="default"
                                                    className="text-default-500 font-medium hover:text-foreground"
                                                    startContent={<Edit3 size={15} />}
                                                    onPress={() => {
                                                        setEditingId(targetId);
                                                        setEditText(comment.text);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    color="danger"
                                                    className="font-medium"
                                                    startContent={<Trash2 size={15} />}
                                                    onPress={() => handleDelete(targetId)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card.Content>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}