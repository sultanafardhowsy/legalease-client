"use client";

import React, { useState } from "react";
import { Modal, Button, Avatar, Chip } from "@heroui/react";
import { BriefcaseBusiness, CalendarDays, BadgeDollarSign, FileText, User } from "lucide-react";
import HireModal from "@/component/HireModal";
import { useSession } from "@/lib/auth-client";
import LawyerCommentsSection from "./CommentsPage";

export default function LawyerDetailModal({ selectedLawyer, onClose, currentUser }) {
    const { data: session } = useSession();
    const [hireTarget, setHireTarget] = useState(null);

    const formatDate = (dateField) => {
        if (!dateField) return "N/A";
        const dateStr = dateField?.$date || dateField;
        const d = new Date(dateStr);
        return isNaN(d) ? "N/A" : d.toLocaleDateString(undefined, {
            year: "numeric", month: "long", day: "numeric",
        });
    };

    const isSelf = session?.user?.id === selectedLawyer?._id;

    return (
        <>
            <Modal>
                <Modal.Backdrop isOpen={!!selectedLawyer} onOpenChange={(isOpen) => !isOpen && onClose()}>
                    {/* Increased width capacities for tablet (md) and desktop (lg) sizes */}
                    <Modal.Container className="max-w-[95%] sm:max-w-[600px] md:max-w-[850px] lg:max-w-[1100px] w-full transition-all duration-300">
                        <Modal.Dialog className="rounded-3xl border border-divider bg-background shadow-2xl">
                            {({ close }) => (
                                <>
                                    <Modal.Header className="flex flex-col gap-1 text-xl font-bold pb-4 border-b border-divider text-foreground px-6 pt-6">
                                        <Modal.Heading>Professional Profile</Modal.Heading>
                                    </Modal.Header>

                                    {selectedLawyer && (
                                        /* Increased max height to 80vh for maximizing vertical real-estate */
                                        <Modal.Body className="py-6 px-6 overflow-y-auto max-h-[80vh] scrollbar-thin">
                                            {/* Two Column Grid layout for Desktop, single column stack for Mobile */}
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                                
                                                {/* Left Column: Lawyer Info Card (Takes 5/12 width on desktop) */}
                                                <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left gap-4 bg-default-50 dark:bg-default-100/40 p-5 rounded-2xl border border-divider sticky top-0">
                                                    
                                                    {/* Profile Avatar Container */}
                                                    <div className="w-full flex justify-center md:justify-start">
                                                        <Avatar className="h-28 w-28 ring-4 ring-default-200 dark:ring-default-100">
                                                            {selectedLawyer.imageUrl ? (
                                                                <Avatar.Image
                                                                    src={selectedLawyer.imageUrl}
                                                                    alt={selectedLawyer.name || "Lawyer"}
                                                                />
                                                            ) : null}
                                                            <Avatar.Fallback className="text-2xl font-bold bg-primary/10 text-primary">
                                                                {selectedLawyer.name?.charAt(0).toUpperCase() || "L"}
                                                            </Avatar.Fallback>
                                                        </Avatar>
                                                    </div>

                                                    {/* Name, Specialization, Status */}
                                                    <div className="w-full">
                                                        <h3 className="text-2xl font-black text-foreground tracking-tight">{selectedLawyer.name}</h3>
                                                        <p className="text-sm font-medium text-default-500 mt-0.5">{selectedLawyer.specialization}</p>
                                                        <Chip
                                                            className="mt-2"
                                                            color={selectedLawyer.status === "Busy" ? "danger" : "success"}
                                                            variant="dot"
                                                            size="sm"
                                                        >
                                                            {selectedLawyer.status || "Available"}
                                                        </Chip>
                                                    </div>

                                                    {/* Details Meta Block */}
                                                    <div className="w-full space-y-3.5 mt-2 text-left bg-background dark:bg-default-50 p-4 rounded-xl border border-divider/60">
                                                        <div className="flex items-start gap-3">
                                                            <User size={18} className="text-default-400 mt-0.5 shrink-0" />
                                                            <div>
                                                                <p className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Lawyer ID</p>
                                                                <p className="text-xs font-mono text-default-500 break-all">{selectedLawyer._id}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-3">
                                                            <BriefcaseBusiness size={18} className="text-primary mt-0.5 shrink-0" />
                                                            <div>
                                                                <p className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Specialization</p>
                                                                <p className="text-sm font-medium text-foreground">{selectedLawyer.specialization}</p>
                                                            </div>
                                                        </div>

                                                        {selectedLawyer.bio && (
                                                            <div className="flex items-start gap-3">
                                                                <FileText size={18} className="text-secondary mt-0.5 shrink-0" />
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Bio</p>
                                                                    <p className="text-sm text-default-600 dark:text-default-400 leading-relaxed max-h-[120px] overflow-y-auto pr-1">{selectedLawyer.bio}</p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex items-start gap-3">
                                                            <BadgeDollarSign size={18} className="text-success mt-0.5 shrink-0" />
                                                            <div>
                                                                <p className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Consultation Fee</p>
                                                                <p className="text-sm font-bold text-foreground">৳ {selectedLawyer.fee} BDT</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-3">
                                                            <CalendarDays size={18} className="text-default-500 mt-0.5 shrink-0" />
                                                            <div>
                                                                <p className="text-[10px] font-bold text-default-400 uppercase tracking-wider">Member Since</p>
                                                                <p className="text-sm font-medium text-foreground">{formatDate(selectedLawyer.dateJoined)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Column: Comments & Feedback Section (Takes 7/12 width on desktop) */}
                                                <div className="md:col-span-7 flex flex-col gap-3 h-full">
                                                    <div className="border-b border-divider pb-2 px-1">
                                                        <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                                                            Reviews & Comments
                                                        </h4>
                                                    </div>
                                                    <div className="w-full text-left bg-default-50/50 dark:bg-default-50/20 p-2 rounded-2xl border border-divider/50">
                                                        <LawyerCommentsSection lawyerId={selectedLawyer._id} />
                                                    </div>
                                                </div>

                                            </div>
                                        </Modal.Body>
                                    )}

                                    <Modal.Footer className="pt-4 pb-6 px-6 border-t border-divider grid grid-cols-2 gap-3 bg-default-50/30 dark:bg-default-50/10">
                                        <Button
                                            color="primary"
                                            className="font-bold rounded-xl shadow-lg shadow-primary/20 dark:shadow-none"
                                            isDisabled={isSelf}
                                            onPress={() => !isSelf && setHireTarget(selectedLawyer)}
                                        >
                                            {isSelf ? "This is your profile" : "Consult Now"}
                                        </Button>
                                        <Button
                                            color="danger"
                                            variant="flat"
                                            className="font-semibold rounded-xl"
                                            onPress={() => { close(); onClose(); }}
                                        >
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </>
                            )}
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>

            <HireModal
                lawyer={hireTarget}
                user={currentUser}
                isOpen={!!hireTarget}
                onClose={() => setHireTarget(null)}
            />
        </>
    );
}