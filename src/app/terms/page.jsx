import LegalPage from "@/component/LegalPage";


export const metadata = {
  title: "Terms of Service — LegalEase",
  description: "The terms and conditions governing use of the LegalEase platform.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 2026">
      <p>These Terms govern your use of the LegalEase platform. By using our services you agree to them.</p>
      <h2>1. Platform role</h2>
      <p>LegalEase is a marketplace connecting clients with independent lawyers. We are not a law firm and do not provide legal advice.</p>
      <h2>2. Eligibility</h2>
      <p>You must be at least 18 years old to use LegalEase.</p>
      <h2>3. Account responsibilities</h2>
      <ul>
        <li>Provide accurate information at registration.</li>
        <li>Keep your credentials confidential.</li>
        <li>Notify us of any unauthorized use.</li>
      </ul>
      <h2>4. Fees and payment</h2>
      <p>Consultation fees are set by each lawyer and displayed on their profile.</p>
      <h2>5. Prohibited conduct</h2>
      <ul>
        <li>Impersonation, harassment, or fraud.</li>
        <li>Circumventing platform payments.</li>
        <li>Uploading unlawful or infringing content.</li>
      </ul>
      <h2>6. Limitation of liability</h2>
      <p>To the fullest extent permitted by law, LegalEase is not liable for legal outcomes or damages arising from your engagement with any lawyer.</p>
      <h2>7. Governing law</h2>
      <p>These Terms are governed by the laws of the People&apos;s Republic of Bangladesh.</p>
    </LegalPage>
  );
}
