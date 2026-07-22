"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Avatar, Chip } from "@heroui/react";
import { BriefcaseBusiness, CalendarDays, Banknote, FileText, User, Layers, X } from "lucide-react";
import HireModal from "@/component/HireModal";
import { useSession } from "@/lib/auth-client";
import LawyerCommentsSection from "./CommentsPage";
import { apiFetch } from "@/lib/core/api";

export function LawyerDetailModal({ selectedLawyer, onClose, currentUser }) {
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

        const fetchServices = async () => {
            setSelectedService(null);
            setLawyerServices([]);
            setLoadingServices(true);

            try {
                const data = await apiFetch(`/api/lawyer/services/${selectedLawyer._id}`);
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative flex w-full max-w-5xl max-h-[92vh] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.25)] dark:border-slate-700 dark:bg-slate-950">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 bg-linear-to-r from-amber-50 via-white to-slate-50 px-5 py-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 sm:px-6">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-400">Lawyer Profile</p>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Professional Profile</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                aria-label="Close profile"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">

                                {/* Left Column */}
                                <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/70 md:col-span-5">

                                    {/* Avatar */}
                                    <div className="flex justify-center md:justify-start">
                                        <div className="relative">
                                            <img
                                                src={selectedLawyer.imageUrl || "/placeholder.png"}
                                                alt={selectedLawyer.name || "Lawyer"}
                                                className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-md dark:ring-slate-800"
                                            />
                                            <span className="absolute bottom-1 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
                                        </div>
                                    </div>

                                    {/* Name & Status */}
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{selectedLawyer.name}</h3>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedLawyer.specialization}</p>
                                        <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            selectedLawyer.status === "Busy"
                                                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                        }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${selectedLawyer.status === "Busy" ? "bg-red-500" : "bg-emerald-500"}`} />
                                            {selectedLawyer.status || "Available"}
                                        </span>
                                    </div>

                                    {/* Meta block */}
                                    <div className="space-y-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">

                                        <div className="flex items-start gap-3">
                                            <User size={16} className="mt-0.5 shrink-0 text-slate-400" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Lawyer ID</p>
                                                <p className="break-all text-xs font-mono text-slate-500 dark:text-slate-400">{selectedLawyer._id}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <BriefcaseBusiness size={16} className="mt-0.5 shrink-0 text-blue-500" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Specialization</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{selectedLawyer.specialization}</p>
                                            </div>
                                        </div>

                                        {selectedLawyer.bio && (
                                            <div className="flex items-start gap-3">
                                                <FileText size={16} className="mt-0.5 shrink-0 text-purple-500" />
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Bio</p>
                                                    <p className="max-h-25 overflow-y-auto pr-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{selectedLawyer.bio}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            <Banknote size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Consultation Fee</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-white">৳{selectedLawyer.fee}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <CalendarDays size={16} className="mt-0.5 shrink-0 text-slate-400" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Member Since</p>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{formatDate(selectedLawyer.dateJoined)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services Section */}
                                    {loadingServices && (
                                        <p className="text-xs text-gray-400 text-center">Loading services...</p>
                                    )}

                                    {!loadingServices && lawyerServices.length > 0 && (
                                        <div className="w-full">
                                            <div className="mb-1 flex items-center gap-2">
                                                <Layers size={14} className="text-slate-400" />
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Services Offered</p>
                                            </div>
                                            <p className="mb-2 text-[11px] text-slate-500 dark:text-slate-400">
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
                                                            className={`w-full rounded-2xl border px-3 py-2.5 text-left transition-all duration-150 ${
                                                                isSelected
                                                                    ? "border-amber-400 bg-amber-50 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10"
                                                                    : "border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/60 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-amber-500/40 dark:hover:bg-amber-500/10"
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <div className="min-w-0">
                                                                    <p className={`truncate text-sm font-semibold ${isSelected ? "text-amber-700 dark:text-amber-300" : "text-slate-800 dark:text-slate-200"}`}>
                                                                        {entry.service?.name}
                                                                    </p>
                                                                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                                                                        {entry.service?.description}
                                                                    </p>
                                                                </div>
                                                                <span className={`shrink-0 text-sm font-bold ${isSelected ? "text-amber-700 dark:text-amber-300" : "text-emerald-600 dark:text-emerald-400"}`}>
                                                                    ৳{entry.service?.fee}
                                                                </span>
                                                            </div>
                                                            {isSelected && (
                                                                <p className="mt-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">✓ Selected</p>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Comments */}
                                <div className="flex flex-col gap-3 md:col-span-7">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Reviews & Comments</h4>
                                    </div>
                                    <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                                        <LawyerCommentsSection lawyerId={selectedLawyer._id} />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/70 sm:px-6">

                            {/* Selected service badge */}
                            {selectedService && (
                                <div className="flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
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

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <button
                                    disabled={isSelf}
                                    onClick={handleHireClick}
                                    className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition-colors ${
                                        isSelf
                                            ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                                            : "bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600"
                                    }`}
                                >
                                    {isSelf ? "This is your profile" : selectedService ? `Hire for ${selectedService.service?.name}` : "Consult Now"}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
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