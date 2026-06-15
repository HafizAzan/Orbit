type WebmailProvider = {
  label: string;
  url: string;
};

function getEmailParts(email?: string | null) {
  const normalized = email?.trim().toLowerCase();

  if (!normalized?.includes("@")) {
    return null;
  }

  const [localPart, domain] = normalized.split("@");

  if (!localPart || !domain) {
    return null;
  }

  return { localPart, domain };
}

export function getWebmailProvider(email?: string | null): WebmailProvider {
  const parts = getEmailParts(email);

  if (!parts) {
    return {
      label: "Open Gmail",
      url: "https://mail.google.com/mail/u/0/#inbox",
    };
  }

  const { localPart, domain } = parts;

  switch (domain) {
    case "gmail.com":
    case "googlemail.com":
      return {
        label: "Open Gmail",
        url: `https://mail.google.com/mail/u/0/#inbox`,
      };
    case "yopmail.com":
      return {
        label: "Open YOPmail",
        url: `https://yopmail.com/en/?login=${encodeURIComponent(localPart)}`,
      };
    case "outlook.com":
    case "hotmail.com":
    case "live.com":
      return {
        label: "Open Outlook",
        url: "https://outlook.live.com/mail/0/inbox",
      };
    case "yahoo.com":
      return {
        label: "Open Yahoo Mail",
        url: "https://mail.yahoo.com/",
      };
    default:
      return {
        label: "Open Gmail",
        url: "https://mail.google.com/mail/u/0/#inbox",
      };
  }
}

export function openWebmailInbox(email?: string | null) {
  const { url } = getWebmailProvider(email);
  window.open(url, "_blank", "noopener,noreferrer");
}
