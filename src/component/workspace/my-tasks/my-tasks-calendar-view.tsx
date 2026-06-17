import { CalendarOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import { Paragraph, Title } from "../../ui/typography";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";

function MyTasksCalendarView() {
  return (
    <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-feature-sync text-primary">
        <CalendarOutlined className="text-2xl" />
      </span>
      <Title level={4} className="mt-5 text-foreground">
        Calendar view
      </Title>
      <Paragraph size="sm" className="mx-auto mt-2 max-w-md text-muted">
        See your personal deadlines and meetings in the workspace calendar.
      </Paragraph>
      <Link
        to={WORKSPACE_ROUTES.CALENDAR}
        className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Open Calendar
      </Link>
    </div>
  );
}

export default React.memo(MyTasksCalendarView);
