import React from "react";
import type { LegalDocument } from "../../data/legal";

type LegalContentProps = {
  document: LegalDocument;
};

function LegalContent({ document }: LegalContentProps) {
  const { content, sections } = document;

  return (
    <div className="flex h-full flex-col">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{content.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{content.description}</p>
      </div>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-sm leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default React.memo(LegalContent);
