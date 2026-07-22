import LegalPage from "@/component/LegalPage";


export const metadata = {
  title: "Contact — LegalEase",
  description: "Get in touch with the LegalEase team for support or partnership enquiries.",
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact us" updated="July 2026">
      <p>We&apos;d love to hear from you. Our team responds to every enquiry within one business day.</p>
      <h2>General enquiries</h2>
      <ul>
        <li>Email: support@legalease.com.bd</li>
        <li>Phone: +880 1XXX-XXXXXX</li>
      </ul>
      <h2>For lawyers</h2>
      <ul><li>Email: lawyers@legalease.com.bd</li></ul>
      <h2>Office</h2>
      <p>Gulshan Avenue, Dhaka 1212, Bangladesh</p>
      <h2>Hours</h2>
      <p>Sunday–Thursday, 9:00 AM – 6:00 PM (BST)</p>
    </LegalPage>
  );
}
