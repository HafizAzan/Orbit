import { Helmet } from "react-helmet-async";

const APP_NAME = "Orbit";
const DEFAULT_DESCRIPTION =
  "Orbit — Project management for modern teams. Plan, track, and ship work faster with boards, tasks, timelines, and real-time collaboration.";
const APP_URL = import.meta.env.VITE_APP_URL as string | undefined;

type PageSeoProps = {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

function PageSeo({ title, description = DEFAULT_DESCRIPTION, path, noIndex = false }: PageSeoProps) {
  const fullTitle = title.includes(APP_NAME) ? title : `${title} | ${APP_NAME}`;
  const canonicalUrl = path ? `${APP_URL ?? (typeof window !== "undefined" ? window.location.origin : "")}${path}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
    </Helmet>
  );
}

export default PageSeo;
