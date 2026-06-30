import React from "react";
import type { LegalDocument } from "../../data/legal";
import { Paragraph, Title } from "../ui/typography";

type LegalContentProps = {
  document: LegalDocument;
};

function LegalContent({ document }: LegalContentProps) {
  const { content, sections } = document;

  return (
    <div className="flex h-full flex-col">
      <div>
        <Title level={4}>{content.title}</Title>
        <Paragraph size="sm" className="mt-2">{content.description}</Paragraph>
      </div>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <Title level={5} className="text-base">{section.title}</Title>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph, index) => (
                <Paragraph key={index} size="sm">
                  {paragraph}
                </Paragraph>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default React.memo(LegalContent);
