import React from "react";
import type { LegalDocument } from "../../data/legal";
import LegalContent from "./legal-content";
import LegalHero from "./legal-hero";
import LegalSidebar from "./legal-sidebar";

type LegalPageProps = {
  document: LegalDocument;
};

function LegalPage({ document }: LegalPageProps) {
  return (
    <>
      <LegalHero title={document.hero.title} description={document.hero.description} />

      <section className="bg-background px-4 pb-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:sticky lg:top-28 lg:z-10 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
                <LegalSidebar document={document} />
              </div>
            </aside>

            <main className="lg:col-span-8">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <LegalContent document={document} />
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}

export default React.memo(LegalPage);
