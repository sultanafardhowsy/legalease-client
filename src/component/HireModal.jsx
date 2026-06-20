"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, Chip } from "@heroui/react";
import { CalendarDays, User, BriefcaseBusiness, BadgeDollarSign } from "lucide-react";

export default function HireModal({ lawyer, user, isOpen, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const confirmHire = async () => {
    if (!user) {
      onClose();
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/hire-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId:   user.id,
          lawyerId: lawyer._id,
        }),
      });

      if (res.status === 201)      setResult("success");
      else if (res.status === 409) setResult("duplicate");
      else                         setResult("error");
    } catch (err) {
      setResult("error");
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
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => { if (!open) handleClose(); }}
      >
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
                            <p className="text-xs font-mono text-foreground break-all">
                              {user?.id || "Not logged in"}
                            </p>
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

                        <div className="flex items-start gap-3">
                          <BadgeDollarSign size={16} className="text-success mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-default-400">Consultation Fee</p>
                            <p className="text-sm font-bold text-foreground">$ {lawyer?.fee} </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CalendarDays size={16} className="text-default-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-default-400">Request Date</p>
                            <p className="text-sm text-foreground">
                              {new Date().toLocaleDateString(undefined, {
                                year: "numeric", month: "long", day: "numeric",
                              })}
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
                  <Button
                    color="danger"
                    variant="flat"
                    className="font-semibold rounded-xl"
                    onPress={handleClose}
                  >
                    {result ? "Close" : "Cancel"}
                  </Button>
                  {!result && (
                    <Button
                      color="primary"
                      className="font-bold rounded-xl"
                      isLoading={loading}
                      onPress={confirmHire}
                    >
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