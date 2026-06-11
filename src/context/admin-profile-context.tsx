import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_ADMIN_PROFILE, type AdminProfile } from "../data/admin-profile";
import {
  changeAdminPassword,
  completeAdminEmailChange,
  initiateAdminEmailChange,
  sendAdminPasswordResetLink,
  updateAdminProfile,
  type ChangeAdminPasswordInput,
} from "../lib/admin-profile";
import { countObjectChanges } from "../lib/helper";
import { toast } from "../lib/toast";

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

type AdminProfileProviderProps = {
  children: ReactNode;
  initialProfile?: AdminProfile;
};

function AdminProfileProvider({ children, initialProfile = DEFAULT_ADMIN_PROFILE }: AdminProfileProviderProps) {
  const [savedProfile, setSavedProfile] = useState<AdminProfile>(initialProfile);
  const [profile, setProfile] = useState<AdminProfile>(initialProfile);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

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
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  }, [profile]);

  const handleChangePassword = useCallback(async (input: ChangeAdminPasswordInput) => {
    setChangingPassword(true);

    try {
      await changeAdminPassword(input);
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
        await initiateAdminEmailChange({ newEmail, currentPassword }, profile.email);
        toast.success("OTP sent to your new email address");
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to start email change");
        return false;
      } finally {
        setChangingEmail(false);
      }
    },
    [profile.email],
  );

  const handleCompleteEmailChange = useCallback(async (newEmail: string, otp: string) => {
    setChangingEmail(true);

    try {
      const updatedEmail = await completeAdminEmailChange({ newEmail, otp });
      setProfile((current) => ({ ...current, email: updatedEmail, emailVerified: true }));
      setSavedProfile((current) => ({ ...current, email: updatedEmail, emailVerified: true }));
      toast.success("Email address updated successfully");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to verify email change");
      return false;
    } finally {
      setChangingEmail(false);
    }
  }, []);

  const handleSendPasswordResetLink = useCallback(async () => {
    setResettingPassword(true);

    try {
      await sendAdminPasswordResetLink(profile.email);
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
