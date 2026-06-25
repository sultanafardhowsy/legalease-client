"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Avatar, Chip } from "@heroui/react";
import { BriefcaseBusiness, CalendarDays, BadgeDollarSign, FileText, User, Layers } from "lucide-react";
import HireModal from "@/component/HireModal";
import { useSession } from "@/lib/auth-client";
import LawyerCommentsSection from "./CommentsPage";

export default function LawyerDetailModal({ selectedLawyer, onClose, currentUser }) {
    const { data: session } = useSession();
    const [hireTarget, setHireTarget] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [lawyerServices, setLawyerServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);

    const formatDate = (dateField) => {
        if (!dateField) return "N/A";
        const dateStr = dateField?.$date || dateField;
        const d = new Date(dateStr);
        return isNaN(d) ? "N/A" : d.toLocaleDateString(undefined, {
            year: "numeric", month: "long", day: "numeric",
        });
    };

    const isSelf = session?.user?.id === selectedLawyer?._id;

    useEffect(() => {
        if (!selectedLawyer?._id) return;
        setSelectedService(null);
        setLawyerServices([]);
        setLoadingServices(true);

        const fetchServices = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyer/services/${selectedLawyer._id}`);
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                const data = await res.json();
                setLawyerServices(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch lawyer services:", err);
            } finally {
                setLoadingServices(false);
            }
        };

        fetchServices();
    }, [selectedLawyer?._id]);

    const handleHireClick = () => {
        if (isSelf) return;
        if (!currentUser) {
            alert("Please log in to consult a lawyer.");
            return;
        }
        setHireTarget({
            ...selectedLawyer,
            selectedService: selectedService || null,
            effectiveFee: selectedService ? selectedService.service?.fee : selectedLawyer.fee,
        });
    };

    return (
        <>
            {/* Overlay backdrop */}
            {!!selectedLawyer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 shrink-0">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Professional Profile</h2>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                                {/* Left Column */}
                                <div className="md:col-span-5 flex flex-col gap-4 bg-gray-50 dark:bg-gray-800/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">

                                    {/* Avatar */}
                                    <div className="flex justify-center md:justify-start">
                                        <img
                                            src={selectedLawyer.imageUrl || "/placeholder.png"}
                                            alt={selectedLawyer.name || "Lawyer"}
                                            className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-600"
                                        />
                                    </div>

                                    {/* Name & Status */}
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-gray-50 tracking-tight">{selectedLawyer.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{selectedLawyer.specialization}</p>
                                        <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            selectedLawyer.status === "Busy"
                                                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                                : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${selectedLawyer.status === "Busy" ? "bg-red-500" : "bg-green-500"}`} />
                                            {selectedLawyer.status || "Available"}
                                        </span>
                                    </div>

                                    {/* Meta block */}
                                    <div className="space-y-3.5 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">

                                        <div className="flex items-start gap-3">
                                            <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lawyer ID</p>
                                                <p className="text-xs font-mono text-gray-400 dark:text-gray-400 break-all">{selectedLawyer._id}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <BriefcaseBusiness size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Specialization</p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{selectedLawyer.specialization}</p>
                                            </div>
                                        </div>

                                        {selectedLawyer.bio && (
                                            <div className="flex items-start gap-3">
                                                <FileText size={16} className="text-purple-500 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bio</p>
                                                    <p className="text-sm text-gray-400 dark:text-gray-400 leading-relaxed max-h-[100px] overflow-y-auto pr-1">{selectedLawyer.bio}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            <BadgeDollarSign size={16} className="text-green-500 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Consultation Fee</p>
                                                <p className="text-sm font-bold text-gray-400 dark:text-white"> {selectedLawyer.fee} </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <CalendarDays size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Member Since</p>
                                                <p className="text-sm font-medium text-gray-400 dark:text-gray-200">{formatDate(selectedLawyer.dateJoined)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services Section */}
                                    {loadingServices && (
                                        <p className="text-xs text-gray-400 text-center">Loading services...</p>
                                    )}

                                    {!loadingServices && lawyerServices.length > 0 && (
                                        <div className="w-full">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Layers size={14} className="text-gray-400" />
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Services Offered</p>
                                            </div>
                                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
                                                Select a service or proceed for general consultation.
                                            </p>
                                            <div className="space-y-2">
                                                {lawyerServices.map(entry => {
                                                    const isSelected = selectedService?._id === entry._id;
                                                    return (
                                                        <button
                                                            key={entry._id}
                                                            type="button"
                                                            onClick={() => setSelectedService(isSelected ? null : entry)}
                                                            className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-150 ${
                                                                isSelected
                                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <div className="min-w-0">
                                                                    <p className={`text-sm font-semibold truncate ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-800 dark:text-gray-200"}`}>
                                                                        {entry.service?.name}
                                                                    </p>
                                                                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug line-clamp-2">
                                                                        {entry.service?.description}
                                                                    </p>
                                                                </div>
                                                                <span className={`text-sm font-bold shrink-0 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-green-600 dark:text-green-400"}`}>
                                                                    ৳{entry.service?.fee}
                                                                </span>
                                                            </div>
                                                            {isSelected && (
                                                                <p className="text-[10px] text-blue-500 font-semibold mt-1">✓ Selected</p>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Comments */}
                                <div className="md:col-span-7 flex flex-col gap-3">
                                    <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-50">Reviews & Comments</h4>
                                    </div>
                                    <div className="bg-gray-50/50 dark:bg-gray-800/30 p-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                                        <LawyerCommentsSection lawyerId={selectedLawyer._id} />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 shrink-0 flex flex-col gap-3">

                            {/* Selected service badge */}
                            {selectedService && (
                                <div className="flex items-center justify-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2">
                                    <span>Service selected:</span>
                                    <span className="font-bold">{selectedService.service?.name}</span>
                                    <span>— ৳{selectedService.service?.fee}</span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedService(null)}
                                        className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    disabled={isSelf}
                                    onClick={handleHireClick}
                                    className={`py-2.5 px-4 rounded-xl font-bold text-sm transition-colors ${
                                        isSelf
                                            ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    }`}
                                >
                                    {isSelf ? "This is your profile" : selectedService ? `Hire for ${selectedService.service?.name}` : "Consult Now"}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="py-2.5 px-4 rounded-xl font-semibold text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            <HireModal
                lawyer={hireTarget}
                user={currentUser}
                isOpen={!!hireTarget}
                onClose={() => setHireTarget(null)}
            />
        </>
    );
}