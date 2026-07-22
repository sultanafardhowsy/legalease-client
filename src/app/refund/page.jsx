import LegalPage from "@/component/LegalPage";


export const metadata = {
  title: "Refund Policy — LegalEase",
  description: "LegalEase refund policy for consultations and platform fees.",
};

export default function RefundPage() {
  return (
    <LegalPage title="Refund Policy" updated="July 2026">
      <p>This policy explains when refunds are available for payments made through LegalEase.</p>
      <h2>1. Consultation fees</h2>
      <ul>
        <li>Full refund if you cancel at least 24 hours before the consultation.</li>
        <li>50% refund if you cancel within 24 hours.</li>
        <li>No refund for no-shows or after the consultation starts.</li>
      </ul>
      <h2>2. Lawyer-initiated cancellations</h2>
      <p>If a lawyer cancels, you receive a full refund automatically within 5–7 business days.</p>
      <h2>3. Platform service fees</h2>
      <p>Service fees are non-refundable once a lawyer has been contacted, except where required by law.</p>
      <h2>4. Disputes</h2>
      <p>If you are unsatisfied, contact support within 7 days at support@legalease.com.bd.</p>
      <h2>5. Processing time</h2>
      <p>Approved refunds return to your original payment method within 5–10 business days.</p>
    </LegalPage>
  );
}
