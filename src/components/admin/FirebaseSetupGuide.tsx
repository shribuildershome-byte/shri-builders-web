import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  ShieldCheck,
  Database,
  Cloud,
  Key,
  ExternalLink,
  Save,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Info,
  FileCode,
} from 'lucide-react';
import {
  isFirebaseConfigured,
  activeFirebaseConfig,
  testFirebaseConnection,
  ConnectionTestResult,
  getAuthorizedAdminUid,
} from '../../firebase/config.ts';

interface FirebaseSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: () => void;
}

const FIRESTORE_RULES_SNIPPET = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 1. Default-deny catch-all for Zero-Trust security
    match /{document=**} {
      allow read, write: if false;
    }

    // 2. Global Security Helper Primitives
    function isSignedIn() {
      return request.auth != null;
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\\\-]+$');
    }

    // Check if the signed-in user is an explicitly authorized administrator
    function isAdmin() {
      return isSignedIn() && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    function incoming() {
      return request.resource.data;
    }

    // 3. Project schema validation helper
    function isValidProject(data) {
      return data.title is string && data.title.size() > 0 && data.title.size() <= 150
        && data.location is string && data.location.size() <= 120
        && data.category is string && (data.category in ['Residential', 'Commercial', 'Industrial', 'Residential Buildings', 'Commercial Buildings', 'Industrial Buildings'])
        && data.status is string && (data.status in ['Ongoing', 'Completed', 'Ongoing Projects', 'Completed Projects'])
        && data.isPublished is bool;
    }

    // 4. Projects Collection
    match /projects/{projectId} {
      // Public visitors can read ONLY published projects.
      // Authorized admins can read all projects (both drafts and published).
      allow get: if (resource.data.isPublished == true) || isAdmin();
      allow list: if (resource.data.isPublished == true) || isAdmin();

      // Only authorized admins can write, publish, update or delete projects
      allow create: if isAdmin() && isValidId(projectId) && isValidProject(incoming());
      allow update: if isAdmin() && isValidId(projectId) && isValidProject(incoming());
      allow delete: if isAdmin() && isValidId(projectId);
    }

    // 5. Admins Collection
    match /admins/{adminUid} {
      // Authenticated users can check only their own admin status document
      allow get: if isSignedIn() && request.auth.uid == adminUid;
      allow list: if isAdmin();
      // Block arbitrary client writes to prevent privilege escalation
      allow write: if false;
    }
  }
}`;

const STORAGE_RULES_SNIPPET = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper function to check authentication and admin status
    function isSignedIn() {
      return request.auth != null;
    }

    // Check if the user is explicitly authorized as an administrator via Firestore
    function isAdmin() {
      return isSignedIn() && firestore.exists(/databases/(default)/documents/admins/$(request.auth.uid));
    }

    // Validate image format and file size limits (5 MB maximum)
    function isValidImage() {
      return request.resource.contentType.matches('image/(jpeg|jpg|png|webp)')
        && request.resource.size <= 5 * 1024 * 1024;
    }

    // Match all project image assets
    match /projects/{projectId}/{allPaths=**} {
      // Anyone can read project photographs publicly
      allow read: if true;

      // Only authorized admins can upload new project photos
      allow create: if isAdmin() && isValidImage();

      // Only authorized admins can update or replace photos
      allow update: if isAdmin() && isValidImage();

      // Only authorized admins can delete project photos
      allow delete: if isAdmin();
    }

    // Deny all other unmapped paths by default
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}`;

export const FirebaseSetupGuide: React.FC<FirebaseSetupGuideProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // In-browser config override input for quick testing
  const [apiKey, setApiKey] = useState(activeFirebaseConfig.apiKey || '');
  const [authDomain, setAuthDomain] = useState(activeFirebaseConfig.authDomain || '');
  const [projectId, setProjectId] = useState(activeFirebaseConfig.projectId || '');
  const [storageBucket, setStorageBucket] = useState(activeFirebaseConfig.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(activeFirebaseConfig.messagingSenderId || '');
  const [appId, setAppId] = useState(activeFirebaseConfig.appId || '');
  const [authorizedAdminUid, setAuthorizedAdminUid] = useState(getAuthorizedAdminUid());

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live Connection test state
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const result = await testFirebaseConnection();
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        connected: false,
        status: 'NETWORK_ERROR',
        message: err.message || 'Connection test failed',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveBrowserConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
      authorizedAdminUid: authorizedAdminUid.trim(),
    };

    localStorage.setItem('shri_builders_firebase_config', JSON.stringify(config));
    if (authorizedAdminUid.trim()) {
      localStorage.setItem('shri_builders_admin_uid', authorizedAdminUid.trim());
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onConfigSaved) onConfigSaved();
      window.location.reload();
    }, 1200);
  };

  const envTemplate = `# Firebase Configuration for SHRI BUILDERS
# Replace with values from your existing Firebase project:
VITE_FIREBASE_API_KEY="${apiKey || 'AIzaSy...'}"
VITE_FIREBASE_AUTH_DOMAIN="${authDomain || 'your-project-id.firebaseapp.com'}"
VITE_FIREBASE_PROJECT_ID="${projectId || 'your-project-id'}"
VITE_FIREBASE_STORAGE_BUCKET="${storageBucket || 'your-project-id.firebasestorage.app'}"
VITE_FIREBASE_MESSAGING_SENDER_ID="${messagingSenderId || '123456789012'}"
VITE_FIREBASE_APP_ID="${appId || '1:123456789012:web:abcdef123456'}"

# Explicit Authorized Admin UID (from Firebase Console -> Authentication -> Users)
VITE_AUTHORIZED_ADMIN_UID="${authorizedAdminUid || 'paste-your-admin-user-uid-here'}"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn text-left">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Connect Your Existing Firebase Project
              </h3>
              <p className="text-xs text-slate-500">
                Firebase Authentication, Cloud Firestore, Cloud Storage & Explicit Admin UID
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Quick status & Live Test */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isFirebaseConfigured()
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-blue-700" />
              <div>
                <span className="font-bold block text-sm">
                  Status: {isFirebaseConfigured() ? 'Firebase Configured' : 'Configuration Required'}
                </span>
                <p className="text-xs mt-0.5">
                  {isFirebaseConfigured()
                    ? `Connected to project "${activeFirebaseConfig.projectId}".`
                    : 'Paste the web configuration keys from your existing Firebase project below.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold shrink-0 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin text-blue-600' : ''}`} />
              <span>{testingConnection ? 'Testing...' : 'Test Live Connection'}</span>
            </button>
          </div>

          {/* Test Result Display */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                testResult.connected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              {testResult.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block">{testResult.message}</span>
                {testResult.details && <p className="mt-0.5 text-slate-600">{testResult.details}</p>}
              </div>
            </div>
          )}

          {/* Where to find credentials in Firebase Console banner */}
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 text-xs">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm mb-1 text-blue-900">
                  Where to find your exact configuration in Firebase Console:
                </strong>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                  <li>
                    Go to <strong>Firebase Console</strong> (
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline inline-flex items-center gap-0.5 font-semibold"
                    >
                      console.firebase.google.com <ExternalLink className="w-3 h-3" />
                    </a>
                    ) and open your project.
                  </li>
                  <li>
                    Click the <strong>Settings Gear ⚙️</strong> (top-left next to Project Overview) → select <strong>Project settings</strong>.
                  </li>
                  <li>
                    Under the <strong>General</strong> tab, scroll down to <strong>Your apps</strong>. If you haven't added a Web App yet, click the Web icon (<strong>&lt;/&gt;</strong>) and name it "SHRI BUILDERS".
                  </li>
                  <li>
                    Under <strong>Firebase SDK snippet</strong>, click <strong>Config</strong>. Copy the exact values for <code className="font-mono bg-white px-1 py-0.5 rounded text-blue-900 border">apiKey</code>, <code className="font-mono bg-white px-1 py-0.5 rounded text-blue-900 border">projectId</code>, and <code className="font-mono bg-white px-1 py-0.5 rounded text-blue-900 border">storageBucket</code>.
                  </li>
                  <li>
                    <strong>Find your Admin UID:</strong> In Firebase Console sidebar, click <strong>Build</strong> → <strong>Authentication</strong> → <strong>Users</strong> tab. Look at your admin user row and copy the string in the <strong>User UID</strong> column.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Direct Browser Config Form */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Connect Existing Firebase Project (Instant Live Connection)
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Enter the credentials from your Firebase Console. These are saved in browser storage for immediate live connection and project management.
            </p>

            <form onSubmit={handleSaveBrowserConfig} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    apiKey <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    projectId <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="shri-builders-xxx"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    authDomain
                  </label>
                  <input
                    type="text"
                    value={authDomain}
                    onChange={(e) => setAuthDomain(e.target.value)}
                    placeholder="your-project.firebaseapp.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    storageBucket <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={storageBucket}
                    onChange={(e) => setStorageBucket(e.target.value)}
                    placeholder="your-project.firebasestorage.app"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    messagingSenderId
                  </label>
                  <input
                    type="text"
                    value={messagingSenderId}
                    onChange={(e) => setMessagingSenderId(e.target.value)}
                    placeholder="123456789012"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    appId
                  </label>
                  <input
                    type="text"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="1:123456789012:web:..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                  />
                </div>
              </div>

              {/* Explicit Admin UID field */}
              <div className="pt-1">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Authorized Admin User UID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={authorizedAdminUid}
                  onChange={(e) => setAuthorizedAdminUid(e.target.value)}
                  placeholder="e.g. 7qX1... (From Firebase Authentication -> Users -> User UID column)"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Only the user matching this specific UID is granted access to the Admin Dashboard.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {savedSuccess ? (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved! Reloading page to connect your Firebase project...</span>
                  </span>
                ) : (
                  <span></span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs shadow-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Connect Existing Project</span>
                </button>
              </div>
            </form>
          </div>

          {/* Security Rules Snippets with One-Click Copy */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-700" />
              <span>Complete Security Rules & Deployment</span>
            </h4>

            {/* Firestore Rules Block */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-4 py-2.5 text-xs font-mono">
                <span className="font-bold text-blue-400">1. Cloud Firestore Rules (firestore.rules)</span>
                <button
                  onClick={() => copyToClipboard(FIRESTORE_RULES_SNIPPET, 'firestore_rules')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs font-bold transition-colors"
                >
                  {copiedKey === 'firestore_rules' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'firestore_rules' ? 'Copied!' : 'Copy Firestore Rules'}</span>
                </button>
              </div>
              <div className="p-3 bg-slate-50 text-xs text-slate-600 border-b border-slate-200">
                <strong>Deployment Steps:</strong> Go to Firebase Console → <strong>Firestore Database</strong> → <strong>Rules</strong> tab → Paste and click <strong>Publish</strong>.
              </div>
              <pre className="bg-slate-950 text-slate-200 p-3 text-[11px] overflow-x-auto font-mono max-h-48 overflow-y-auto">
                {FIRESTORE_RULES_SNIPPET}
              </pre>
            </div>

            {/* Storage Rules Block */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-4 py-2.5 text-xs font-mono">
                <span className="font-bold text-amber-400">2. Cloud Storage Rules (storage.rules)</span>
                <button
                  onClick={() => copyToClipboard(STORAGE_RULES_SNIPPET, 'storage_rules')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs font-bold transition-colors"
                >
                  {copiedKey === 'storage_rules' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'storage_rules' ? 'Copied!' : 'Copy Storage Rules'}</span>
                </button>
              </div>
              <div className="p-3 bg-slate-50 text-xs text-slate-600 border-b border-slate-200">
                <strong>Deployment Steps:</strong> Go to Firebase Console → <strong>Storage</strong> → <strong>Rules</strong> tab → Paste and click <strong>Publish</strong>.
              </div>
              <pre className="bg-slate-950 text-slate-200 p-3 text-[11px] overflow-x-auto font-mono max-h-48 overflow-y-auto">
                {STORAGE_RULES_SNIPPET}
              </pre>
            </div>

            {/* Admin Document in Firestore instructions */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <h5 className="font-bold text-slate-900 mb-1">
                3. Authorize Admin UID in Firestore:
              </h5>
              <p className="text-slate-600 mb-2">
                In Firebase Console → <strong>Firestore Database</strong> → <strong>Data</strong> tab:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-700 font-medium">
                <li>Click <strong>Start collection</strong> and enter Collection ID: <code className="bg-white px-1.5 py-0.5 rounded text-blue-900 font-mono border">admins</code></li>
                <li>Enter Document ID: your admin's <strong>User UID</strong></li>
                <li>Add field: <code className="bg-white px-1.5 py-0.5 rounded text-blue-900 font-mono border">email</code> = <code className="bg-white px-1.5 py-0.5 rounded text-blue-900 font-mono border">shribuilders.home@gmail.com</code></li>
                <li>Add field: <code className="bg-white px-1.5 py-0.5 rounded text-blue-900 font-mono border">role</code> = <code className="bg-white px-1.5 py-0.5 rounded text-blue-900 font-mono border">admin</code></li>
              </ol>
            </div>
          </div>

          {/* Option 2: Environment Variables Template */}
          <div>
            <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-4 py-2 rounded-t-xl text-xs font-mono">
              <span>Alternative: Permanent .env File</span>
              <button
                onClick={() => copyToClipboard(envTemplate, 'env')}
                className="flex items-center gap-1 hover:text-white font-sans text-xs font-semibold"
              >
                {copiedKey === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'env' ? 'Copied' : 'Copy Template'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 text-slate-200 p-4 rounded-b-xl text-xs overflow-x-auto font-mono">
              {envTemplate}
            </pre>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
