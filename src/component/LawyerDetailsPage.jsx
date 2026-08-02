import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Image from 'next/image';

export default function LawyerDetails({ userRole, isLoggedIn }) {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/lawyers/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Could not find information for this lawyer.');
        }
        return res.json();
      })
      .then(data => {
        setLawyer(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse space-y-4">
        <div className="w-48 h-48 bg-gray-300 rounded-full"></div>
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-20 bg-gray-300 rounded w-full"></div>
      </div>
    );
  }

  if (error || !lawyer) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center mt-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p className="font-semibold">Error Loading Profile</p>
          <p className="text-sm">{error || "Lawyer profile data is unavailable."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
      <div className="flex flex-col md:flex-row gap-6">
        {lawyer?.imageUrl ? (
          <Image 
            src={lawyer.imageUrl} 
            alt="Lawyer" 
            width={96}
            height={96}
            className="w-24 h-24 rounded-full border-4 border-gray-100 object-cover shadow-md"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-gray-100 bg-gray-200 shadow-md">
            <span className="text-3xl font-bold text-gray-500">
              {lawyer?.name ? lawyer.name.charAt(0).toUpperCase() : "L"}
            </span>
          </div>
        )}
        
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold">{lawyer?.name}</h1>
          <p className="text-blue-600 font-semibold">{lawyer?.specialization}</p>
          <p className="text-gray-600">{lawyer?.bio}</p>
          <p className="text-lg font-bold">Fee: ৳{lawyer?.fee}</p>
          
          <span className={`inline-block px-3 py-1 rounded text-sm text-white ${lawyer?.status === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}>
            {lawyer?.status || 'Unavailable'}
          </span>
          
          <p className="text-xs text-gray-400">
            Joined: {lawyer?.dateJoined ? new Date(lawyer.dateJoined).toLocaleDateString() : 'N/A'}
          </p>

          {isLoggedIn && userRole === 'client' ? (
            <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded shadow block">
              Hire Lawyer
            </button>
          ) : (
            <p className="text-sm text-amber-600 italic mt-4">Please log in as a client to submit a hiring request.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-2">Confirm Hiring Request</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to send a consultation request to {lawyer?.name}?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={() => { setIsModalOpen(false); alert('Request Sent!'); }} className="px-4 py-2 bg-blue-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}