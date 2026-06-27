"use client"

import React, { useState, useEffect, useRef } from 'react';
import { authClient } from "@/lib/auth-client";
import { useRouter } from 'next/navigation';
import { apiFetch, apiMutation } from "@/lib/core/api";

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

  // Services state
  const [allServices, setAllServices] = useState([]);
  const [lawyerServices, setLawyerServices] = useState([]);
  const [serviceSearch, setServiceSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const dropdownRef = useRef(null);

  // 🛡️ ACCESS GUARD
  useEffect(() => {
    if (isAuthPending) return;
    if (!userId) { router.replace('/login'); return; }

    const checkAccess = async () => {
      try {
        const data = await apiFetch(`/api/lawyer/check-access/${userId}`);
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

  // Fetch profile
  useEffect(() => {
    if (!userId || !isAllowed) return;
    const loadProfile = async () => {
      try {
        const data = await apiFetch(`/api/lawyer/profile/${userId}`);
        setIsEditMode(true);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          fee: data.fee || '',
          specialization: data.specialization || '',
          status: data.status || 'Available'
        });
        setExistingImageUrl(data.imageUrl || '');
      } catch {
        // Profile not found yet — create mode
      } finally {
        setIsLoadingProfile(false);
      }
    };
    loadProfile();
  }, [userId, isAllowed]);

  // Fetch all services
  useEffect(() => {
    if (!isAllowed) return;
    apiFetch(`/api/services`)
      .then(data => setAllServices(data))
      .catch(err => console.error("Failed to fetch services:", err));
  }, [isAllowed]);

  // Fetch lawyer's added services
  useEffect(() => {
    if (!userId || !isAllowed) return;
    apiFetch(`/api/lawyer/services/${userId}`)
      .then(data => setLawyerServices(data))
      .catch(err => console.error("Failed to fetch lawyer services:", err));
  }, [userId, isAllowed]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = async () => {
    if (!imageFile) return existingImageUrl;
    const data = new FormData();
    data.append('image', imageFile);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) throw new Error("ImgBB API key is missing.");
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: data });
    if (!res.ok) throw new Error(`ImgBB upload failed with status ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data?.url) throw new Error(json.error?.message || "Invalid ImgBB response.");
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
        id: userId, name: formData.name, specialization: formData.specialization,
        bio: formData.bio, fee: Number(formData.fee), status: formData.status, imageUrl: finalImageUrl
      };
      if (isEditMode) {
        await apiMutation(`/api/lawyer/profile/update`, finalPayload, 'PUT');
      } else {
        await apiMutation(`/api/lawyer/profile`, finalPayload, 'POST');
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

  // Add a service
  const handleAddService = async (service) => {
    setIsAddingService(true);
    setShowDropdown(false);
    setServiceSearch('');
    try {
      const added = await apiMutation(`/api/lawyer/services`, { lawyerId: userId, serviceId: service._id });
      setLawyerServices(prev => [added, ...prev]);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsAddingService(false);
    }
  };

  // Remove a service
  const handleRemoveService = async (entryId) => {
    try {
      await apiMutation(`/api/lawyer/services/${entryId}`, {}, 'DELETE');
      setLawyerServices(prev => prev.filter(s => s._id !== entryId));
    } catch (err) {
      alert(err.message);
    }
  };

  // Services already added (to exclude from dropdown)
  const addedServiceIds = new Set(lawyerServices.map(s => s.serviceId));

  // Filtered dropdown list
  const filteredServices = allServices.filter(s =>
    !addedServiceIds.has(s._id) &&
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const inputClass =
    "w-full border rounded px-3 py-2 bg-white text-gray-900 border-gray-300 placeholder-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent " +
    "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-500 dark:focus:ring-blue-400";

  const labelClass = "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";

  if (isAuthPending || isCheckingAccess || (isAllowed && isLoadingProfile)) {
    return (
      <div className="p-6 text-center font-medium text-gray-600 dark:text-gray-400">
        Verifying access & loading profile...
      </div>
    );
  }

  if (!isAllowed) return null;

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
            <input type="text" className={inputClass} value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Jane Doe" required />
          </div>

          {/* Specialization */}
          <div>
            <label className={labelClass}>Specialization</label>
            <input type="text" className={inputClass} value={formData.specialization}
              onChange={e => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Corporate Law, Family Law" required />
          </div>

          {/* Bio */}
          <div>
            <label className={labelClass}>Bio / Summary</label>
            <textarea className={inputClass} rows="4" value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Briefly describe your experience and expertise..." required />
          </div>

          {/* Fee */}
          <div>
            <label className={labelClass}>Consultation Fee ($)</label>
            <input type="number" className={inputClass} value={formData.fee}
              onChange={e => setFormData({ ...formData, fee: e.target.value })}
              placeholder="e.g. 150" required />
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}>
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
                <img src={existingImageUrl} alt="Current profile"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
              required={!isEditMode}
              className={
                "w-full text-sm text-gray-600 dark:text-gray-400 " +
                "file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border-0 " +
                "file:text-sm file:font-medium " +
                "file:bg-blue-50 file:text-blue-700 " +
                "dark:file:bg-blue-900/30 dark:file:text-blue-400 " +
                "hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 cursor-pointer"
              } />
            {isEditMode && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Leave empty to keep your current photo.
              </p>
            )}
          </div>

          {/* ── SERVICES SECTION ── */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Your Services
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Search and add the legal services you offer. Changes save instantly.
            </p>

            {/* Search dropdown */}
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                className={inputClass}
                placeholder="Search services to add..."
                value={serviceSearch}
                onChange={e => { setServiceSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
              />

              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                  {filteredServices.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                      {allServices.length === 0 ? 'Loading services...' : 'No services found.'}
                    </p>
                  ) : (
                    filteredServices.map(service => (
                      <button
                        key={service._id}
                        type="button"
                        disabled={isAddingService}
                        onClick={() => handleAddService(service)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {service.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {service.description}
                            </p>
                          </div>
                          <span className="ml-3 text-sm font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                            ${service.fee}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Added services list */}
            {lawyerServices.length > 0 && (
              <ul className="mt-3 space-y-2">
                {lawyerServices.map(entry => (
                  <li
                    key={entry._id}
                    className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {entry.service?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {entry.service?.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-3 shrink-0">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        ${entry.service?.fee}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(entry._id)}
                        className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {lawyerServices.length === 0 && (
              <p className="mt-3 text-sm text-gray-400 dark:text-gray-500 text-center py-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                No services added yet. Search above to add your first service.
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