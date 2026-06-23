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
                    <Modal.Container className="max-w-[90%] sm:max-w-[500px]">
                        <Modal.Dialog className="rounded-3xl border border-divider">
                            {({ close }) => (
                                <>
                                    <Modal.Header className="flex flex-col gap-1 text-xl font-bold pb-2 text-foreground">
                                        <Modal.Heading>Professional Profile</Modal.Heading>
                                    </Modal.Header>

                                    {/* ✅ Single Modal.Body with everything inside */}
                                    {selectedLawyer && (
                                        <Modal.Body className="py-6 flex flex-col items-center text-center gap-4 overflow-y-auto max-h-[70vh]">

                                            {/* Avatar */}
                                            <Avatar className="h-32 w-32">
                                                {selectedLawyer.imageUrl ? (
                                                    <Avatar.Image
                                                        src={selectedLawyer.imageUrl}
                                                        alt={selectedLawyer.name || "Lawyer"}
                                                    />
                                                ) : null}
                                                <Avatar.Fallback>
                                                    {selectedLawyer.name?.charAt(0).toUpperCase() || "L"}
                                                </Avatar.Fallback>
                                            </Avatar>

                                            {/* Name, Specialization, Status */}
                                            <div>
                                                <h3 className="text-2xl font-black text-foreground">{selectedLawyer.name}</h3>
                                                <p className="text-sm text-default-400 mt-1">{selectedLawyer.specialization}</p>
                                                <Chip
                                                    className="mt-2"
                                                    color={selectedLawyer.status === "Busy" ? "danger" : "success"}
                                                    variant="dot"
                                                    size="sm"
                                                >
                                                    {selectedLawyer.status || "Available"}
                                                </Chip>
                                            </div>

                                            {/* Details Block */}
                                            <div className="w-full space-y-3 mt-2 text-left bg-default-50 p-4 rounded-2xl border border-divider">

                                                <div className="flex items-start gap-3">
                                                    <User size={18} className="text-default-400 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Lawyer ID</p>
                                                        <p className="text-xs font-mono text-default-500 break-all">{selectedLawyer._id}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <BriefcaseBusiness size={18} className="text-primary mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Specialization</p>
                                                        <p className="text-sm font-medium text-foreground">{selectedLawyer.specialization}</p>
                                                    </div>
                                                </div>

                                                {selectedLawyer.bio && (
                                                    <div className="flex items-start gap-3">
                                                        <FileText size={18} className="text-secondary mt-0.5 shrink-0" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Bio</p>
                                                            <p className="text-sm text-default-600 leading-relaxed">{selectedLawyer.bio}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-start gap-3">
                                                    <BadgeDollarSign size={18} className="text-success mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Consultation Fee</p>
                                                        <p className="text-sm font-bold text-foreground">৳ {selectedLawyer.fee} BDT</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <CalendarDays size={18} className="text-default-500 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">Member Since</p>
                                                        <p className="text-sm font-medium text-foreground">{formatDate(selectedLawyer.dateJoined)}</p>
                                                    </div>
                                                </div>

                                            </div>

                                            {/* ✅ Comments Section — inside the same guard, no null risk */}
                                            <div className="w-full text-left">
                                                <LawyerCommentsSection lawyerId={selectedLawyer._id} />
                                            </div>

                                        </Modal.Body>
                                    )}

                                    <Modal.Footer className="pt-2 pb-6 grid grid-cols-2 gap-3">
                                        <Button
                                            color="primary"
                                            className="font-bold rounded-xl"
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
