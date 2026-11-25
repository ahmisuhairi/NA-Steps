import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const OWNER_EMAIL = 'ahmisuhairi@gmail.com';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.setCustomParameters({ prompt: 'select_account' });

// In-memory OAuth access token cache (never stored in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

export function isAllowedOwnerEmail(
  email: string | null | undefined,
  emailVerified?: boolean,
): boolean {
  if (!email || emailVerified === false) return false;
  return email.trim().toLowerCase() === OWNER_EMAIL;
}

export async function verifyOwnerSessionWithServer(
  user: User | null,
): Promise<{ isOwner: boolean; idToken: string | null }> {
  if (!user || !isAllowedOwnerEmail(user.email, user.emailVerified)) {
    return { isOwner: false, idToken: null };
  }

  try {
    const idToken = await user.getIdToken();
    const res = await fetch('/api/owner/verify', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (!res.ok) {
      return { isOwner: false, idToken: null };
    }
    const data = (await res.json()) as { isOwner?: boolean };
    return {
      isOwner: Boolean(data.isOwner),
      idToken: data.isOwner ? idToken : null,
    };
  } catch {
    return { isOwner: false, idToken: null };
  }
}

export function subscribeAuthChanges(
  onUserChange: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      cachedAccessToken = null;
    }
    onUserChange(user);
  });
}

export async function signInWithGoogleAccount(): Promise<User> {
  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (credential?.accessToken) {
    cachedAccessToken = credential.accessToken;
  }
  return result.user;
}

export async function signOutGoogleAccount(): Promise<void> {
  cachedAccessToken = null;
  await signOut(auth);
}

export function getCachedAccessToken(): string | null {
  return cachedAccessToken;
}

export async function getFreshIdToken(): Promise<string | null> {
  if (!auth.currentUser) return null;
  return auth.currentUser.getIdToken();
}
