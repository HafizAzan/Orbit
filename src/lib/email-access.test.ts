import { describe, expect, it } from "vitest";
import {
  canChangeOwnEmail,
  canRequestOwnEmailChange,
  getEmailChangeRequestRecipientLabel,
} from "./email-access";

describe("manager email access", () => {
  it("cannot change email directly", () => {
    expect(canChangeOwnEmail("manager")).toBe(false);
  });

  it("can request an email change", () => {
    expect(canRequestOwnEmailChange("manager")).toBe(true);
  });

  it("routes requests to workspace admins", () => {
    expect(getEmailChangeRequestRecipientLabel("manager")).toBe("workspace admin");
  });
});
