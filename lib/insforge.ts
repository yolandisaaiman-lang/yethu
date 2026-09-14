import { createClient } from '@insforge/sdk';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

export const insforge = createClient({
  baseUrl,
  anonKey,
});

export interface ResumeProfileData {
  fileName: string;
  uploadedAt: string;
  jobTitle: string;
  summary: string;
  skills: string[];
  yearsExperience: number;
  education: string;
  preferredRoles: string[];
  preferredLocations: string[];
  rawText?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  country?: string;
  countryCode?: string;
  bio?: string;
  nativeLanguage: string;
  targetLanguage: string;
  isCreator?: boolean;
  createdAt?: string;
  resume?: ResumeProfileData;
}

const LOCAL_STORAGE_SESSION_KEY = 'yethu_session_user';
const LOCAL_STORAGE_ACCOUNTS_KEY = 'yethu_registered_accounts_v1';

export interface StoredAccount {
  user: UserProfile;
  password?: string;
  savedAt: string;
}

function getStoredAccounts(): Record<string, StoredAccount> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredAccount(email: string, user: UserProfile, password?: string) {
  if (typeof window === 'undefined') return;
  try {
    const accounts = getStoredAccounts();
    const key = email.trim().toLowerCase();
    accounts[key] = {
      user,
      password: password || accounts[key]?.password,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.warn('Could not cache account locally:', err);
  }
}

export const authService = {
  async signUp(params: {
    email: string;
    password: string;
    name: string;
    handle: string;
    nativeLanguage: string;
    targetLanguage: string;
    country?: string;
    countryCode?: string;
  }): Promise<{ user: UserProfile | null; error: string | null }> {
    const normalizedEmail = params.email.trim().toLowerCase();
    const formattedHandle = params.handle.startsWith('@') ? params.handle : `@${params.handle}`;

    try {
      // Pass autoConfirm: true to ensure InsForge marks the email verified immediately,
      // avoiding 403 "Email verification required" lockouts when logging out and back in.
      const { data, error } = await (insforge.auth as any).signUp({
        email: normalizedEmail,
        password: params.password,
        name: params.name,
        autoConfirm: true,
      });

      if (error || !data?.user?.id) {
        console.warn('InsForge auth signUp notice:', error.message);
        return { user: null, error: error.message };
      }

      // A profile is not an authenticated session. Establish a session now so
      // the new account can use protected chat routes and Realtime immediately.
      const { data: session, error: sessionError } = await insforge.auth.signInWithPassword({
        email: normalizedEmail,
        password: params.password,
      });
      if (sessionError || !session?.user?.id) {
        return { user: null, error: sessionError?.message || 'Account created, but sign-in did not complete.' };
      }

      const userProfile: UserProfile = {
        id: session.user.id,
        email: normalizedEmail,
        name: params.name,
        handle: formattedHandle,
        nativeLanguage: params.nativeLanguage,
        targetLanguage: params.targetLanguage,
        country: params.country || 'South Africa',
        countryCode: params.countryCode || 'ZA',
        bio: 'Afropolitan creator on Yethu Live.',
        isCreator: true,
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userProfile));
        saveStoredAccount(normalizedEmail, userProfile, params.password);
      }

      return { user: userProfile, error: null };
    } catch (err: any) {
      return { user: null, error: err?.message || 'Could not create your account' };
    }
  },

  async signIn(params: {
    email: string;
    password: string;
  }): Promise<{ user: UserProfile | null; error: string | null }> {
    const normalizedEmail = params.email.trim().toLowerCase();
    const accounts = getStoredAccounts();
    const stored = accounts[normalizedEmail];

    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email: normalizedEmail,
        password: params.password,
      });

      // 1. Success from InsForge (account verified & credentials valid)
      if (!error && data?.user) {
        const userName =
          stored?.user?.name ||
          (data.user as any)?.profile?.name ||
          (data.user as any)?.name ||
          normalizedEmail.split('@')[0];

        const userProfile: UserProfile = {
          id: data.user.id || stored?.user?.id || 'usr_1',
          email: data.user.email || normalizedEmail,
          name: userName,
          handle:
            stored?.user?.handle ||
            `@${userName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`,
          nativeLanguage: stored?.user?.nativeLanguage || 'isiXhosa',
          targetLanguage: stored?.user?.targetLanguage || 'English',
          country: stored?.user?.country || 'South Africa',
          countryCode: stored?.user?.countryCode || 'ZA',
          bio: stored?.user?.bio || 'Connecting across Africa via Yethu Live.',
          isCreator: true,
          createdAt: (data.user as any)?.createdAt || stored?.user?.createdAt || new Date().toISOString(),
          resume: stored?.user?.resume,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userProfile));
          saveStoredAccount(normalizedEmail, userProfile, params.password);
        }

        return { user: userProfile, error: null };
      }

      // 2. InsForge returned "Email verification required" (HTTP 403)
      // Note: InsForge only returns 403 for an unverified account if the password is CORRECT (wrong password yields 401).
      const isVerificationIssue =
        error?.message?.toLowerCase().includes('email verification') ||
        error?.message?.toLowerCase().includes('verify your email') ||
        (error as any)?.statusCode === 403;

      if (isVerificationIssue) {
        return { user: null, error: 'Please verify your email before signing in.' };
      }

      // 3. If credentials were invalid (HTTP 401)
      if (error?.message?.toLowerCase().includes('invalid') || (error as any)?.statusCode === 401) {
        return { user: null, error: 'Invalid email or password. Please check your credentials.' };
      }

      return { user: null, error: error?.message || 'Failed to sign in. Please check your credentials.' };
    } catch (err: any) {
      console.warn('InsForge signIn exception:', err);

      return { user: null, error: err?.message || 'Authentication error. Please try again.' };
    }
  },

  async signOut(): Promise<void> {
    try {
      await insforge.auth.signOut();
    } catch (e) {
      console.warn('Sign out cleanup:', e);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      }
    }
  },

  async getAuthenticatedUser(): Promise<UserProfile | null> {
    const { data, error } = await insforge.auth.getCurrentUser();
    if (error || !data.user?.id) {
      if (typeof window !== 'undefined') localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      return null;
    }

    const stored = authService.getCurrentLocalUser();
    const account = getStoredAccounts()[data.user.email?.toLowerCase() || '']?.user;
    const profile = stored?.id === data.user.id ? stored : account?.id === data.user.id ? account : undefined;
    const name = profile?.name || (data.user as any).profile?.name || data.user.email?.split('@')[0] || 'Yethu User';
    const user: UserProfile = {
      id: data.user.id,
      email: data.user.email || profile?.email || '',
      name,
      handle: profile?.handle || `@${name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`,
      nativeLanguage: profile?.nativeLanguage || 'English',
      targetLanguage: profile?.targetLanguage || 'English',
      country: profile?.country || 'South Africa',
      countryCode: profile?.countryCode || 'ZA',
      bio: profile?.bio || 'Afropolitan creator on Yethu Live.',
      avatarUrl: profile?.avatarUrl,
      isCreator: true,
      createdAt: profile?.createdAt,
    };
    if (typeof window !== 'undefined') localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(user));
    return user;
  },

  async saveProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
    try {
      // Attempt upsert to InsForge profiles table
      try {
        await (insforge.database as any).from('profiles').upsert([
          {
            id: userId,
            ...updates,
            updated_at: new Date().toISOString(),
          }
        ]);
      } catch (dbErr) {
        console.info('InsForge database profile sync note (fallback to local cache):', dbErr);
      }

      // Update local storage
      if (typeof window !== 'undefined') {
        const current = authService.getCurrentLocalUser();
        if (current) {
          const merged = { ...current, ...updates };
          localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(merged));
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Could not save profile' };
    }
  },

  getCurrentLocalUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  },

  setLocalUser(user: UserProfile) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(user));
    }
  },
};
