import LegalPage from "@/component/LegalPage";


export const metadata = {
  title: "Privacy Policy — LegalEase",
  description: "How LegalEase collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 2026">
      <p>This Privacy Policy explains how LegalEase collects, uses, and safeguards your personal information.</p>
      <h2>1. Information we collect</h2>
      <ul>
        <li>Account information: name, email, phone number.</li>
        <li>Lawyer profile details: qualifications, Bar Council registration, fees.</li>
        <li>Case-related information you share when contacting a lawyer.</li>
        <li>Usage data: pages visited, device and browser details.</li>
      </ul>
      <h2>2. How we use your information</h2>
      <ul>
        <li>To operate and improve the platform.</li>
        <li>To connect clients with lawyers and facilitate bookings.</li>
        <li>To communicate service updates and support responses.</li>
      </ul>
      <h2>3. Sharing</h2>
      <p>We share information with the lawyer you choose to engage. We do not sell your personal data.</p>
      <h2>4. Data security</h2>
      <p>We use industry-standard measures to protect your data.</p>
      <h2>5. Your rights</h2>
      <ul>
        <li>Access, correct, or delete your account data.</li>
        <li>Opt out of marketing communications at any time.</li>
      </ul>
      <h2>6. Contact</h2>
      <p>Privacy questions: privacy@legalease.com.bd</p>
    </LegalPage>
  );
}
