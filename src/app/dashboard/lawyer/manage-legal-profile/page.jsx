"use client"

import React, { useState, useEffect } from 'react';
import { authClient } from "@/lib/auth-client"; 

export default function ManageLegalProfile() {
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const userId = session?.user?.id;

  const [formData, setFormData] = useState({
    name: '', bio: '', fee: '', specialization: '', status: 'Available'
  });
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // Flags if profile already exists
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch profile on mount to check if it exists
  useEffect(() => {
    if (!userId) return;

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyer/profile/${userId}`)
      .then(res => {
        if (res.status === 200) {
          setIsEditMode(true);
          return res.json();
        }
        return null; // 404 or other status means no profile yet
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
  }, [userId]);

  const handleImageUpload = async () => {
    if (!imageFile) return existingImageUrl; // If editing and no new file selected, retain old URL
    
    const data = new FormData();
    data.append('image', imageFile);

    const imgbbUrl = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`;
    const res = await fetch(imgbbUrl, { method: 'POST', body: data });
    const json = await res.json();
    return json?.data?.url; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Session expired. Please sign back in.");
    
    setIsSubmitting(true);

    try {
      const finalImageUrl = await handleImageUpload();
      if (!finalImageUrl) {
        throw new Error("Please upload a profile photo.");
      }

      const finalPayload = { 
        id: userId, 
        name: formData.name,
        specialization: formData.specialization,
        bio: formData.bio,
        fee: Number(formData.fee), 
        status: formData.status,
        imageUrl: finalImageUrl
      };

      // Switch URL & Method depending on whether we are creating or editing
      const endpoint = isEditMode 
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyer/profile/update`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyer/profile`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      alert(isEditMode ? 'Profile updated successfully!' : 'Profile created successfully!');
      if (!isEditMode) setIsEditMode(true); // Switch to edit mode now that it exists
      setExistingImageUrl(finalImageUrl);
    } catch (err) {
      console.error("Submission failed:", err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthPending || (userId && isLoadingProfile)) {
    return <div className="p-6 text-center font-medium">Loading profile data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl space-y-4 bg-white shadow rounded-md mx-auto mt-6">
      <h2 className="text-2xl font-bold border-b pb-2">
        {isEditMode ? '✏️ Edit Legal Profile' : '🚀 Create Legal Profile'}
      </h2>
      
      <div>
        <label className="block font-medium">Full Name</label>
        <input type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
      </div>

      <div>
        <label className="block font-medium">Specialization</label>
        <input type="text" className="w-full border p-2 rounded" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} required />
      </div>

      <div>
        <label className="block font-medium">Bio / Summary</label>
        <textarea className="w-full border p-2 rounded" rows="4" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} required />
      </div>

      <div>
        <label className="block font-medium">Consultation Fee ($)</label>
        <input type="number" className="w-full border p-2 rounded" value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} required />
      </div>

      <div>
        <label className="block font-medium">Status</label>
        <select className="w-full border p-2 rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Profile Photo</label>
        {isEditMode && existingImageUrl && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1">Current Image:</p>
            <img src={existingImageUrl} alt="Current profile" className="w-20 h-20 object-cover rounded-md border" />
          </div>
        )}
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} required={!isEditMode} />
        {isEditMode && <p className="text-xs text-gray-400 mt-1">Leave empty to keep your current photo.</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded font-semibold disabled:bg-gray-400">
        {isSubmitting ? 'Saving changes...' : isEditMode ? 'Update Profile' : 'Save & Publish Profile'}
      </button>
    </form>
  );
}