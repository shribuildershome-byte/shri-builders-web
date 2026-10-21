import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseAppletConfig from '../../firebase-applet-config.json';

export interface FirebaseConfigObject {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  firestoreDatabaseId?: string;
  authorizedAdminUid?: string;
}

// Read configuration from firebase-applet-config.json, Vite env vars, or localStorage override
export const getActiveFirebaseConfig = (): FirebaseConfigObject => {
  try {
    const saved = localStorage.getItem('shri_builders_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId && !parsed.apiKey.includes('your-') && !parsed.apiKey.includes('YOUR_')) {
        return {
          apiKey: parsed.apiKey || '',
          authDomain: parsed.authDomain || '',
          projectId: parsed.projectId || '',
          storageBucket: parsed.storageBucket || '',
          messagingSenderId: parsed.messagingSenderId || '',
          appId: parsed.appId || '',
          firestoreDatabaseId: parsed.firestoreDatabaseId || (firebaseAppletConfig as any).firestoreDatabaseId || '',
          authorizedAdminUid: parsed.authorizedAdminUid || localStorage.getItem('shri_builders_admin_uid') || '',
        };
      }
    }
  } catch {
    // Ignore localStorage errors
  }

  // 1. Check provisioned firebase-applet-config.json
  const appletCfg = firebaseAppletConfig as Record<string, any>;
  if (appletCfg && appletCfg.apiKey && appletCfg.projectId && !appletCfg.projectId.includes('remixed-')) {
    const envAdminUid = import.meta.env.VITE_AUTHORIZED_ADMIN_UID || localStorage.getItem('shri_builders_admin_uid') || '';
    return {
      apiKey: appletCfg.apiKey,
      authDomain: appletCfg.authDomain || `${appletCfg.projectId}.firebaseapp.com`,
      projectId: appletCfg.projectId,
      storageBucket: appletCfg.storageBucket || `${appletCfg.projectId}.firebasestorage.app`,
      messagingSenderId: appletCfg.messagingSenderId || '',
      appId: appletCfg.appId || '',
      firestoreDatabaseId: appletCfg.firestoreDatabaseId || '',
      authorizedAdminUid: envAdminUid,
    };
  }

  // 2. Fallback to Vite environment variables
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || '';
  const envAdminUid = import.meta.env.VITE_AUTHORIZED_ADMIN_UID || localStorage.getItem('shri_builders_admin_uid') || '';

  return {
    apiKey: envApiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: envProjectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    firestoreDatabaseId: '',
    authorizedAdminUid: envAdminUid,
  };
};

export const activeFirebaseConfig: FirebaseConfigObject = getActiveFirebaseConfig();

// Strict check: we do not claim Firebase is configured if keys are empty or placeholders
export const isFirebaseConfigured = (): boolean => {
  const cfg = getActiveFirebaseConfig();
  return Boolean(
    cfg.apiKey &&
    cfg.projectId &&
    !cfg.apiKey.includes('your-') &&
    !cfg.apiKey.includes('YOUR_') &&
    cfg.apiKey.length > 15 &&
    !cfg.projectId.includes('your-')
  );
};

export const getAuthorizedAdminUid = (): string => {
  return (
    import.meta.env.VITE_AUTHORIZED_ADMIN_UID ||
    localStorage.getItem('shri_builders_admin_uid') ||
    getActiveFirebaseConfig().authorizedAdminUid ||
    ''
  ).trim();
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured()) {
  try {
    const config = getActiveFirebaseConfig();
    app = getApps().length > 0 ? getApp() : initializeApp(config);
    auth = getAuth(app);
    // Connect Firestore using the configured databaseId if available
    db = config.firestoreDatabaseId ? getFirestore(app, config.firestoreDatabaseId) : getFirestore(app);
    storage = getStorage(app);
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }
}

export { app, auth, db, storage };

// Connection verification test function
export interface ConnectionTestResult {
  connected: boolean;
  status: 'CONNECTED' | 'NOT_CONFIGURED' | 'PERMISSION_ERROR' | 'NETWORK_ERROR';
  message: string;
  details?: string;
}

export const testFirebaseConnection = async (): Promise<ConnectionTestResult> => {
  if (!isFirebaseConfigured() || !db) {
    return {
      connected: false,
      status: 'NOT_CONFIGURED',
      message: 'Firebase configuration is missing or incomplete.',
      details: 'Please provide your apiKey, projectId, and storageBucket in the Firebase Setup panel.',
    };
  }

  try {
    // Attempt reading from Firestore to verify connection
    const testDoc = doc(db, 'projects', '_connection_check');
    await getDocFromServer(testDoc);
    return {
      connected: true,
      status: 'CONNECTED',
      message: `Successfully connected to Firestore database in project "${activeFirebaseConfig.projectId}".`,
    };
  } catch (error: any) {
    const msg = error?.message || String(error);
    if (msg.includes('permission-denied') || msg.includes('Missing or insufficient permissions')) {
      // Permission denied still confirms that Firebase project and Firestore exist and responded!
      return {
        connected: true,
        status: 'PERMISSION_ERROR',
        message: 'Connected to Firestore. Security rules active (Zero-Trust protection).',
        details: 'Admin authentication is required to make write operations.',
      };
    }

    if (msg.includes('offline') || msg.includes('unavailable')) {
      return {
        connected: false,
        status: 'NETWORK_ERROR',
        message: 'Could not reach Firebase servers. Check network connection or project ID.',
        details: msg,
      };
    }

    return {
      connected: false,
      status: 'NETWORK_ERROR',
      message: `Firebase connection test returned: ${msg}`,
      details: msg,
    };
  }
};

if (isFirebaseConfigured() && db) {
  testFirebaseConnection().catch((err) => {
    console.warn('Initial Firebase connection test:', err);
  });
}
