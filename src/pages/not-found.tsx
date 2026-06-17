import { FileSearchOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import { Paragraph, Title } from "../component/ui/typography";
import { UN_AUTH_ROUTES } from "../router/public-routes";

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <FileSearchOutlined className="text-2xl" />
      </span>
      <Title level={3} className="mt-5 text-foreground">
        Page not found
      </Title>
      <Paragraph size="sm" className="mt-2 text-muted">
        The page you are looking for does not exist or may have been moved.
      </Paragraph>
      <Link
        to={UN_AUTH_ROUTES.HOME}
        className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}

export default React.memo(NotFound);
