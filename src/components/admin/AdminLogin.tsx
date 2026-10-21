import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  HardHat,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { COMPANY_DETAILS } from '../../data/company.ts';

interface AdminLoginProps {
  onBackToWebsite: () => void;
  onLoginSuccess: () => void;
  onOpenSetupGuide: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onBackToWebsite,
  onLoginSuccess,
  onOpenSetupGuide,
}) => {
  const { login, resetPassword, isConfigured, authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!isConfigured) {
      setLocalError(
        'Firebase credentials are not yet configured. Please click "Firebase Setup Guide" below to configure your project keys.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setLocalError('Please enter both admin email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      onLoginSuccess();
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setResetSent(false);

    if (!isConfigured) {
      setLocalError('Firebase is not yet configured.');
      return;
    }

    if (!email.trim()) {
      setLocalError('Please enter your admin email to receive a password reset link.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(email.trim());
      setResetSent(true);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to send reset email');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative text-left">
      {/* Background geometric accents */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Back to Website Button */}
        <button
          onClick={onBackToWebsite}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>

        {/* Corporate Brand Header */}
        <div className="flex items-center gap-3 justify-center mb-5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
            <HardHat className="w-6 h-6 text-amber-300" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold text-white tracking-tight">
              {COMPANY_DETAILS.name}
            </h1>
            <p className="text-xs text-blue-300 font-medium -mt-0.5">
              Admin Portal • Secure Access
            </p>
          </div>
        </div>

        <h2 className="text-center text-xl font-bold text-white mb-2">
          {isResetMode ? 'Reset Admin Password' : 'Administrator Sign In'}
        </h2>
        <p className="text-center text-xs text-slate-400 max-w-sm mx-auto mb-6">
          {isResetMode
            ? 'Enter your authorized email to receive a secure Firebase password reset email.'
            : 'Sign in to manage projects, upload high-resolution photographs, and publish updates.'}
        </p>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-200">
          {/* Security Notice Pill */}
          <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Restricted Access</span>
              Only pre-created, authorized accounts can sign in. Public registration is disabled by policy.
            </div>
          </div>

          {/* Configuration Notice if Firebase is not yet configured */}
          {!isConfigured && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm">Existing Firebase Project Connection</span>
                  <p className="mt-0.5 text-xs text-amber-900">
                    Paste your Firebase configuration keys and authorized admin UID to connect your existing Firebase Authentication &amp; Firestore database.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenSetupGuide}
                    className="mt-2.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Connect Existing Firebase Project →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {(localError || authError) && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{localError || authError}</span>
            </div>
          )}

          {/* Success Message for Reset */}
          {resetSent && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Password reset link sent to {email}. Check your inbox or spam folder.
              </span>
            </div>
          )}

          {/* LOGIN FORM */}
          {!isResetMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shribuilders.home@gmail.com"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setLocalError(null);
                    }}
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{submitting ? 'Verifying Credentials...' : 'Sign In as Administrator'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* PASSWORD RESET FORM */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Authorized Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shribuilders.home@gmail.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(false);
                    setResetSent(false);
                    setLocalError(null);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Back to Sign In
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}

          {/* Footer Guide Button */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>SHRI BUILDERS • Coimbatore</span>
            <button
              onClick={onOpenSetupGuide}
              className="text-blue-700 hover:underline flex items-center gap-1 font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Firebase Guide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
