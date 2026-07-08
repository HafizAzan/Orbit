import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  buildWorkspaceProfileFromUser,
  getWorkspaceProfileDisplayName,
  type WorkspaceProfile,
} from "../data/workspace-profile";
import {
  changeWorkspacePassword,
  completeWorkspaceEmailChange,
  initiateWorkspaceEmailChange,
  sendWorkspacePasswordResetLink,
  updateWorkspaceProfile,
  type ChangeWorkspacePasswordInput,
} from "../lib/workspace-profile";
import { countObjectChanges } from "../lib/helper";
import { toast } from "../lib/toast";
import type { AuthUser } from "../types/auth.types";
import { useAppContext } from "./app-context";

type WorkspaceProfileContextValue = {
  profile: WorkspaceProfile;
  profileChangeCount: number;
  savingProfile: boolean;
  changingPassword: boolean;
  changingEmail: boolean;
  resettingPassword: boolean;
  handleProfileFieldChange: <K extends keyof WorkspaceProfile>(key: K, value: WorkspaceProfile[K]) => void;
  handleDiscardProfile: () => void;
  handleSaveProfile: () => Promise<void>;
  handleChangePassword: (input: ChangeWorkspacePasswordInput) => Promise<boolean>;
  handleInitiateEmailChange: (newEmail: string, currentPassword: string) => Promise<boolean>;
  handleCompleteEmailChange: (newEmail: string, otp: string) => Promise<boolean>;
  handleSendPasswordResetLink: () => Promise<boolean>;
};

const WorkspaceProfileContext = createContext<WorkspaceProfileContextValue | undefined>(undefined);

function syncUserFromProfile(user: AuthUser, profile: WorkspaceProfile): AuthUser {
  return {
    ...user,
    name: getWorkspaceProfileDisplayName(profile),
    email: profile.email,
    emailVerificationStatus: profile.emailVerified ? "verified" : "pending",
    accountStatus: profile.accountStatus,
    organization:
      user.organization && profile.organizationId
        ? { ...user.organization, id: profile.organizationId, name: profile.organizationName }
        : user.organization,
  };
}

type WorkspaceProfileProviderProps = {
  children: ReactNode;
};

function WorkspaceProfileProvider({ children }: WorkspaceProfileProviderProps) {
  const app = useAppContext();
  const user = app?.user ?? null;

  const [savedProfile, setSavedProfile] = useState<WorkspaceProfile>(() =>
    user ? buildWorkspaceProfileFromUser(user) : buildWorkspaceProfileFromUser({
      id: "",
      name: "",
      email: "",
      role: "member",
      isPlatformAdmin: false,
      emailVerificationStatus: "pending",
      accountStatus: "pending",
      organization: null,
      requiresPlanSelection: false,
      organizationAwaitingSubscription: false,
    }),
  );
  const [profile, setProfile] = useState<WorkspaceProfile>(savedProfile);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    const nextProfile = buildWorkspaceProfileFromUser(user);
    setSavedProfile(nextProfile);
    setProfile(nextProfile);
  }, [user]);

  const profileChangeCount = useMemo(() => countObjectChanges(profile, savedProfile), [profile, savedProfile]);

  const handleProfileFieldChange = useCallback(<K extends keyof WorkspaceProfile>(key: K, value: WorkspaceProfile[K]) => {
    setProfile((current) => {
      if (current[key] === value) return current;
      return { ...current, [key]: value };
    });
  }, []);

  const handleDiscardProfile = useCallback(() => {
    setProfile(savedProfile);
    toast.info("Profile changes discarded");
  }, [savedProfile]);

  const handleSaveProfile = useCallback(async () => {
    setSavingProfile(true);

    try {
      const updated = await updateWorkspaceProfile(profile);
      setProfile(updated);
      setSavedProfile(updated);

      if (user && app?.setUser) {
        app.setUser(syncUserFromProfile(user, updated));
      }

      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  }, [app, profile, user]);

  const handleChangePassword = useCallback(async (input: ChangeWorkspacePasswordInput) => {
    setChangingPassword(true);

    try {
      await changeWorkspacePassword(input);
      toast.success("Password updated successfully");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update password");
      return false;
    } finally {
      setChangingPassword(false);
    }
  }, []);

  const handleInitiateEmailChange = useCallback(
    async (newEmail: string, currentPassword: string) => {
      setChangingEmail(true);

      try {
        await initiateWorkspaceEmailChange({ newEmail, currentPassword });
        toast.success("OTP sent to your new email address");
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to start email change");
        return false;
      } finally {
        setChangingEmail(false);
      }
    },
    [],
  );

  const handleCompleteEmailChange = useCallback(
    async (newEmail: string, otp: string) => {
      setChangingEmail(true);

      try {
        const result = await completeWorkspaceEmailChange({ newEmail, otp });
        const nextProfile = buildWorkspaceProfileFromUser(result.user);
        setProfile(nextProfile);
        setSavedProfile(nextProfile);

        if (app?.setUser) {
          app.setUser(result.user);
        }

        toast.success("Email address updated successfully");
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to verify email change");
        return false;
      } finally {
        setChangingEmail(false);
      }
    },
    [app],
  );

  const handleSendPasswordResetLink = useCallback(async () => {
    setResettingPassword(true);

    try {
      await sendWorkspacePasswordResetLink(profile.email);
      toast.success(`Password reset link sent to ${profile.email}`);
      return true;
    } catch {
      toast.error("Failed to send reset link. Please try again.");
      return false;
    } finally {
      setResettingPassword(false);
    }
  }, [profile.email]);

  const value = useMemo(
    () => ({
      profile,
      profileChangeCount,
      savingProfile,
      changingPassword,
      changingEmail,
      resettingPassword,
      handleProfileFieldChange,
      handleDiscardProfile,
      handleSaveProfile,
      handleChangePassword,
      handleInitiateEmailChange,
      handleCompleteEmailChange,
      handleSendPasswordResetLink,
    }),
    [
      profile,
      profileChangeCount,
      savingProfile,
      changingPassword,
      changingEmail,
      resettingPassword,
      handleProfileFieldChange,
      handleDiscardProfile,
      handleSaveProfile,
      handleChangePassword,
      handleInitiateEmailChange,
      handleCompleteEmailChange,
      handleSendPasswordResetLink,
    ],
  );

  return <WorkspaceProfileContext.Provider value={value}>{children}</WorkspaceProfileContext.Provider>;
}

function useWorkspaceProfile() {
  const context = useContext(WorkspaceProfileContext);

  if (context === undefined) {
    throw new Error("useWorkspaceProfile must be used within WorkspaceProfileProvider");
  }

  return context;
}

export { WorkspaceProfileProvider, useWorkspaceProfile };
