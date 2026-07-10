import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type AdminProfile } from "../data/admin-profile";
import {
  buildAdminProfileFromUser,
  changeAdminPassword,
  completeAdminEmailChange,
  getAdminDisplayName,
  initiateAdminEmailChange,
  sendAdminPasswordResetLink,
  updateAdminProfile,
  type ChangeAdminPasswordInput,
} from "../lib/admin-profile";
import { getApiErrorMessage } from "../lib/api-error";
import { countObjectChanges } from "../lib/helper";
import { toast } from "../lib/toast";
import type { AuthUser } from "../types/auth.types";
import { useAppContext } from "./app-context";

type AdminProfileContextValue = {
  profile: AdminProfile;
  profileChangeCount: number;
  savingProfile: boolean;
  changingPassword: boolean;
  changingEmail: boolean;
  resettingPassword: boolean;
  handleProfileFieldChange: <K extends keyof AdminProfile>(key: K, value: AdminProfile[K]) => void;
  handleDiscardProfile: () => void;
  handleSaveProfile: () => Promise<void>;
  handleChangePassword: (input: ChangeAdminPasswordInput) => Promise<boolean>;
  handleInitiateEmailChange: (newEmail: string, currentPassword: string) => Promise<boolean>;
  handleCompleteEmailChange: (newEmail: string, otp: string) => Promise<boolean>;
  handleSendPasswordResetLink: () => Promise<boolean>;
};

const AdminProfileContext = createContext<AdminProfileContextValue | undefined>(undefined);

function emptyAdminProfile(): AdminProfile {
  return {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    avatarUrl: "",
    role: "platform_admin",
    emailVerified: false,
  };
}

function syncUserFromProfile(user: AuthUser, profile: AdminProfile): AuthUser {
  return {
    ...user,
    name: getAdminDisplayName(profile),
    email: profile.email,
    emailVerificationStatus: profile.emailVerified ? "verified" : "pending",
  };
}

type AdminProfileProviderProps = {
  children: ReactNode;
};

function AdminProfileProvider({ children }: AdminProfileProviderProps) {
  const app = useAppContext();
  const user = app?.user ?? null;

  const [savedProfile, setSavedProfile] = useState<AdminProfile>(() =>
    user ? buildAdminProfileFromUser(user) : emptyAdminProfile(),
  );
  const [profile, setProfile] = useState<AdminProfile>(savedProfile);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    const nextProfile = buildAdminProfileFromUser(user);
    setSavedProfile(nextProfile);
    setProfile(nextProfile);
  }, [user]);

  const profileChangeCount = useMemo(() => countObjectChanges(profile, savedProfile), [profile, savedProfile]);

  const handleProfileFieldChange = useCallback(<K extends keyof AdminProfile>(key: K, value: AdminProfile[K]) => {
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
      const updated = await updateAdminProfile(profile);
      setProfile(updated);
      setSavedProfile(updated);

      if (user && app?.setUser) {
        app.setUser(syncUserFromProfile(user, updated));
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error) ?? "Failed to update profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  }, [app, profile, user]);

  const handleChangePassword = useCallback(async (input: ChangeAdminPasswordInput) => {
    setChangingPassword(true);

    try {
      await changeAdminPassword(input);
      toast.success("Password updated successfully");
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error) ?? "Failed to update password");
      return false;
    } finally {
      setChangingPassword(false);
    }
  }, []);

  const handleInitiateEmailChange = useCallback(async (newEmail: string, currentPassword: string) => {
    setChangingEmail(true);

    try {
      await initiateAdminEmailChange({ newEmail, currentPassword });
      toast.success("OTP sent to your new email address");
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error) ?? "Failed to start email change");
      return false;
    } finally {
      setChangingEmail(false);
    }
  }, []);

  const handleCompleteEmailChange = useCallback(
    async (newEmail: string, otp: string) => {
      setChangingEmail(true);

      try {
        const result = await completeAdminEmailChange({ newEmail, otp });
        const nextProfile = buildAdminProfileFromUser(result.user);
        setProfile(nextProfile);
        setSavedProfile(nextProfile);

        if (app?.setUser) {
          app.setUser(result.user);
        }

        toast.success("Email address updated successfully");
        return true;
      } catch (error) {
        toast.error(getApiErrorMessage(error) ?? "Failed to verify email change");
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
      await sendAdminPasswordResetLink(profile.email);
      toast.success(`Password reset link sent to ${profile.email}`);
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error) ?? "Failed to send reset link. Please try again.");
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

  return <AdminProfileContext.Provider value={value}>{children}</AdminProfileContext.Provider>;
}

function useAdminProfile() {
  const context = useContext(AdminProfileContext);

  if (context === undefined) {
    throw new Error("useAdminProfile must be used within AdminProfileProvider");
  }

  return context;
}

export { AdminProfileProvider, useAdminProfile };
