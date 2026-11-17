import { ContactSection } from "~/components/contact/contact-section";
import { HomeBackground } from "~/components/home/home-background";

export default function ContactPage() {
  // pb-12 keeps the page clear of the fixed footer, as on the home page
  return (
    <div className="pb-12">
      <HomeBackground />
      <ContactSection className="pt-20 pb-16 md:pt-28" />
    </div>
  );
}
