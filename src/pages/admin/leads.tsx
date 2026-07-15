import React from "react";
import PageSeo from "../../component/seo/page-seo";
import LeadsTable from "../../component/admin/leads/leads-table";
import { Paragraph, Title } from "../../component/ui/typography";

function AdminLeads() {
  return (
    <div className="mx-auto max-w-8xl">
      <PageSeo title="Contact Leads" description="Review and manage inbound contact form leads." noIndex />
      <div className="mb-6">
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          Contact Leads
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Review submissions from the public contact form and update their status.
        </Paragraph>
      </div>

      <LeadsTable />
    </div>
  );
}

export default React.memo(AdminLeads);
