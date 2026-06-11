import React from "react";
import ContactFaqSection from "../component/contact/contact-faq-section";
import ContactForm from "../component/contact/contact-form";
import ContactHero from "../component/contact/contact-hero";
import ContactInfoCard from "../component/contact/contact-info-card";

function Contact() {
  return (
    <>
      <ContactHero />

      <section className="bg-background px-4 pb-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch">
              <div className="border-b border-border bg-linear-to-br from-feature-sync/50 via-card to-card p-6 sm:p-8 lg:border-r lg:border-b-0">
                <ContactInfoCard />
              </div>

              <div className="p-6 sm:p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactFaqSection />
    </>
  );
}

export default React.memo(Contact);
