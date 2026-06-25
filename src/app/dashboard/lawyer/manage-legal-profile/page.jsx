"use client"

import React, { useState, useEffect } from 'react';
import { authClient } from "@/lib/auth-client";
import { useRouter } from 'next/navigation';

export default function ManageLegalProfile() {
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '', bio: '', fee: '', specialization: '', status: 'Available'
  });
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🛡️ ACCESS GUARD
  useEffect(() => {
    if (isAuthPending) return;
    if (!userId) { router.replace('/login'); return; }

    const checkAccess = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyer/check-access/${userId}`);
        if (!res.ok) throw new Error("Failed network response from access route.");
        const data = await res.json();
        if (data.allowed) { setIsAllowed(true); }
        else { router.replace('/dashboard/lawyer/activate'); }
      } catch (err) {
        console.error("Access check failed:", err);
        router.replace('/dashboard/lawyer/activate');
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [isAuthPending, userId, router]);

  // Fetch profile data
  useEffect(() => {
    if (!userId || !isAllowed) return;

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyer/profile/${userId}`)
      .then(res => {
        if (res.status === 200) { setIsEditMode(true); return res.json(); }
        return null;
      })
      .then(data => {
        if (data) {
          setFormData({
            name: data.name || '',
            bio: data.bio || '',
            fee: data.fee || '',
            specialization: data.specialization || '',
            status: data.status || 'Available'
          });
          setExistingImageUrl(data.imageUrl || '');
        }
        setIsLoadingProfile(false);
      })
      .catch(err => {
        console.error("Error fetching initial profile:", err);
        setIsLoadingProfile(false);
      });
  }, [userId, isAllowed]);

  const handleImageUpload = async () => {
    if (!imageFile) return existingImageUrl;

    const data = new FormData();
    data.append('image', imageFile);

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) throw new Error("ImgBB API key is missing from environment variables.");

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: data });
    if (!res.ok) throw new Error(`ImgBB upload failed with status code ${res.status}`);

    const json = await res.json();
    if (!json.success || !json.data?.url) throw new Error(json.error?.message || "Invalid image upload response from ImgBB.");

    return json.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Session expired. Please sign back in.");

    setIsSubmitting(true);
    try {
      const finalImageUrl = await handleImageUpload();
      if (!finalImageUrl) throw new Error("Please upload a profile photo.");

      const finalPayload = {
        id: userId,
        name: formData.name,
        specialization: formData.specialization,
        bio: formData.bio,
        fee: Number(formData.fee),
        status: formData.status,
        imageUrl: finalImageUrl
      };

      const endpoint = isEditMode
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyer/profile/update`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyer/profile`;

      const response = await fetch(endpoint, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      setExistingImageUrl(finalImageUrl);
      alert(isEditMode ? 'Profile updated successfully!' : 'Profile created successfully!');
      setIsEditMode(true);
    } catch (err) {
      console.error("Submission failed:", err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthPending || isCheckingAccess || (isAllowed && isLoadingProfile)) {
    return (
      <div className="p-6 text-center font-medium text-gray-600 dark:text-gray-400">
        Verifying access & loading profile...
      </div>
    );
  }

  if (!isAllowed) return null;

  const inputClass =
    "w-full border rounded px-3 py-2 bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent " +
    "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-500 dark:focus:ring-blue-400";

  const labelClass = "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="p-6 max-w-xl mx-auto pt-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/50 rounded-xl p-8 border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {isEditMode ? '✏️ Edit Legal Profile' : '🚀 Create Legal Profile'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditMode ? 'Update your public lawyer profile.' : 'Set up your profile to start accepting clients.'}
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              className={inputClass}
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Jane Doe"
              required
            />
          </div>

          {/* Specialization */}
          <div>
            <label className={labelClass}>Specialization</label>
            <input
              type="text"
              className={inputClass}
              value={formData.specialization}
              onChange={e => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Corporate Law, Family Law"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className={labelClass}>Bio / Summary</label>
            <textarea
              className={inputClass}
              rows="4"
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Briefly describe your experience and expertise..."
              required
            />
          </div>

          {/* Fee */}
          <div>
            <label className={labelClass}>Consultation Fee ($)</label>
            <input
              type="number"
              className={inputClass}
              value={formData.fee}
              onChange={e => setFormData({ ...formData, fee: e.target.value })}
              placeholder="e.g. 150"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
            </select>
          </div>

          {/* Profile Photo */}
          <div>
            <label className={labelClass}>Profile Photo</label>
            {isEditMode && existingImageUrl && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current photo:</p>
                <img
                  src={existingImageUrl}
                  alt="Current profile"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0])}
              required={!isEditMode}
              className={
                "w-full text-sm text-gray-600 dark:text-gray-400 " +
                "file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border-0 " +
                "file:text-sm file:font-medium " +
                "file:bg-blue-50 file:text-blue-700 " +
                "dark:file:bg-blue-900/30 dark:file:text-blue-400 " +
                "hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 " +
                "cursor-pointer"
              }
            />
            {isEditMode && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Leave empty to keep your current photo.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={
              "w-full py-2.5 px-4 rounded-lg font-semibold text-white transition-colors duration-150 " +
              (isSubmitting
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 active:bg-blue-800")
            }
          >
            {isSubmitting ? 'Saving changes...' : isEditMode ? 'Update Profile' : 'Save & Publish Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}