"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, Chip } from "@heroui/react";
import { CalendarDays, User, BriefcaseBusiness, Banknote, Layers } from "lucide-react";
import { apiMutation } from "@/lib/core/api";

export default function HireModal({ lawyer, user, isOpen, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mounted, setMounted] = useState(false); // ✅ add this

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedService = lawyer?.selectedService || null;
  const effectiveFee = lawyer?.effectiveFee ?? lawyer?.fee;

  const confirmHire = async () => {
    if (!user) {
      onClose();
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      await apiMutation(`/api/hire-requests`, {
        userId: user.id,
        lawyerId: lawyer._id,
        serviceId: selectedService?.serviceId || null,
        serviceName: selectedService?.service?.name || null,
        fee: effectiveFee,
      });
      setResult("success");
    } catch (err) {
      if (err.message?.includes("409")) setResult("duplicate");
      else setResult("error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <Modal.Container className="max-w-[90%] sm:max-w-[440px]">
          <Modal.Dialog className="rounded-3xl border border-divider">
            {({ close }) => (
              <>
                <Modal.Header>
                  <Modal.Heading>Confirm Hiring</Modal.Heading>
                </Modal.Header>

                <Modal.Body className="py-4">

                  {result === "success" && (
                    <div className="text-center py-6 space-y-2">
                      <p className="text-5xl">✅</p>
                      <p className="font-bold text-foreground text-lg">Request Sent!</p>
                      <p className="text-sm text-default-500">
                        Waiting for <span className="font-semibold">{lawyer?.name}</span> to accept.
                      </p>
                    </div>
                  )}

                  {result === "duplicate" && (
                    <div className="text-center py-6 space-y-2">
                      <p className="text-5xl">⚠️</p>
                      <p className="font-bold text-foreground text-lg">Already Requested</p>
                      <p className="text-sm text-default-500">
                        You already have a pending request for this lawyer.
                      </p>
                    </div>
                  )}

                  {result === "error" && (
                    <div className="text-center py-6 space-y-2">
                      <p className="text-5xl">❌</p>
                      <p className="font-bold text-foreground text-lg">Something went wrong</p>
                      <p className="text-sm text-default-500">Please try again.</p>
                    </div>
                  )}

                  {!result && (
                    <div className="space-y-4">
                      <div className="bg-default-50 border border-divider rounded-2xl p-4 space-y-3">
                        <p className="text-xs font-semibold text-default-400 uppercase tracking-wider">
                          Request Summary
                        </p>

                        <div className="flex items-start gap-3">
                          <User size={16} className="text-default-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-default-400">Your ID</p>
                            <p className="text-xs font-mono text-foreground break-all">{user?.id || "Not logged in"}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <BriefcaseBusiness size={16} className="text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-default-400">Lawyer</p>
                            <p className="text-sm font-semibold text-foreground">{lawyer?.name}</p>
                            <p className="text-xs text-default-500">{lawyer?.specialization}</p>
                          </div>
                        </div>

                        {selectedService && (
                          <div className="flex items-start gap-3">
                            <Layers size={16} className="text-secondary mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-default-400">Service</p>
                              <p className="text-sm font-semibold text-foreground">{selectedService.service?.name}</p>
                              <p className="text-xs text-default-500">{selectedService.service?.description}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          <Banknote size={16} className="text-success mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-default-400">
                              {selectedService ? "Service Fee" : "Consultation Fee"}
                            </p>
                            <p className="text-sm font-bold text-foreground">৳ {effectiveFee} BDT</p>
                            {selectedService && (
                              <p className="text-[11px] text-default-400 mt-0.5">
                                Default consultation: ৳{lawyer?.fee} BDT
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CalendarDays size={16} className="text-default-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-default-400">Request Date</p>
                            {/* ✅ render date only after mount so server & client match */}
                            <p className="text-sm text-foreground">
                              {mounted
                                ? new Date().toLocaleDateString("en-GB", {
                                    year: "numeric", month: "long", day: "numeric",
                                  })
                                : "—"}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-divider">
                          <p className="text-xs text-default-400 mb-1">Status</p>
                          <Chip size="sm" color="warning" variant="flat">Pending</Chip>
                        </div>
                      </div>

                      <p className="text-xs text-default-400 text-center">
                        The lawyer will review your request. Payment is only required after approval.
                      </p>
                    </div>
                  )}
                </Modal.Body>

                <Modal.Footer className="pb-6 grid grid-cols-2 gap-3">
                  <Button color="danger" variant="flat" className="font-semibold rounded-xl" onPress={handleClose}>
                    {result ? "Close" : "Cancel"}
                  </Button>
                  {!result && (
                    <Button color="primary" className="font-bold rounded-xl" isLoading={loading} onPress={confirmHire}>
                      Confirm Hire
                    </Button>
                  )}
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}