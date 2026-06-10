import React from "react";
import AdminPagePlaceholder from "../../component/admin/admin-page-placeholder";

function AdminSettings() {
  return (
    <AdminPagePlaceholder
      title="Settings"
      description="Configure platform settings, preferences, and system options."
    />
  );
}

export default React.memo(AdminSettings);
