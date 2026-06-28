"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Trash2, Edit2, Check, X, ShieldCheck } from "lucide-react";
import { apiFetch, apiMutation } from "@/lib/core/api";

export default function LawyerCommentsSection({ lawyerId }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [canComment, setCanComment] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchComments();
    if (user?.id) checkEligibility();
  }, [lawyerId, user?.id]);

  const fetchComments = async () => {
    try {
      const data = await apiFetch(`/api/comments/lawyer/${lawyerId}`);
      setComments(data);
    } catch (err) {
      console.error("Failed fetching comments:", err);
    }
  };

  const checkEligibility = async () => {
    try {
      const data = await apiFetch(
        `/api/comments/check-eligibility?lawyerId=${lawyerId}`
      );
      setCanComment(data.canComment);
    } catch (err) {
      setCanComment(false);
    }
  };

  const handlePostComment = async () => {
    if (!newCommentText.trim()) return;
    try {
      await apiMutation(`/api/comments`, {
        lawyerId,
        userId: user.id,
        userName: user.name,
        userImage: user.image,
        text: newCommentText,
      });
      setNewCommentText("");
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Only clients who hired this lawyer can comment.");
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await apiMutation(`/api/comments/${commentId}`, { userId: user.id, text: editText }, "PUT");
      setEditingId(null);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete your review?")) return;
    try {
      await apiMutation(`/api/comments/${commentId}`, { userId: user.id }, "DELETE");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-12 space-y-6 border-t border-slate-200 pt-8 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-slate-900">Client Reviews & Comments</h3>

      {/* Input Box for Eligible Hired Clients */}
      {canComment ? (
        <div className="rounded-2xl border bg-slate-50 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-green-700 uppercase tracking-wider">
            <ShieldCheck size={16} /> Verified Hired Client Access
          </div>
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Share your experience working with this professional..."
            className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
            rows={3}
          />
          <button
            onClick={handlePostComment}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Submit Review
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500 bg-slate-100 p-4 rounded-xl border border-dashed">
          🔒 Only clients who have retained this lawyer via complete dashboard payments can post a review.
        </p>
      )}

      {/* Render Comment Streams */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-slate-400 text-sm italic">No reviews posted yet.</p>
        ) : (
          comments.map((comment) => {
            const isOwner = user?.id === comment.userId;

            return (
              <div key={comment._id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {comment.userImage ? (
                      <img src={comment.userImage} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold uppercase">
                        {comment.userName[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{comment.userName}</h4>
                      <p className="text-xs text-slate-400">Verified Client</p>
                    </div>
                  </div>

                  {/* Edit/Delete Controls (Only visible to the comment author) */}
                  {isOwner && (
                    <div className="flex items-center gap-2">
                      {editingId === comment._id ? (
                        <>
                          <button onClick={() => handleEditComment(comment._id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(comment._id);
                              setEditText(comment.text);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Comment Text / Edit Box Toggle */}
                {editingId === comment._id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
                  />
                ) : (
                  <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}