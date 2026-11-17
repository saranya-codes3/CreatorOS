import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

interface AuthScreensProps {
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
  onBackToLanding: () => void;
  onLoginSuccess: (email: string) => void;
  onRegisterSuccess: (fullName: string, email: string) => void;
  onUseDemo: () => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  mode,
  onSwitchMode,
  onBackToLanding,
  onLoginSuccess,
  onRegisterSuccess,
  onUseDemo,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('aanya@aanyasharma.in');
  const [password, setPassword] = useState('CreatorOS#2026');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (forgotMode) {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      setForgotSent(true);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!acceptTerms) {
        setError('Please accept the Terms of Service to continue.');
        return;
      }
      onRegisterSuccess(fullName.trim(), email.trim());
    } else {
      onLoginSuccess(email.trim());
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FAFAFC]">
      {/* Left Split: CREATOR OS Branding */}
      <div className="lg:col-span-5 bg-[#172554] text-white p-8 md:p-12 flex flex-col justify-between">
        <div>
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#CBD5E1] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
          <div className="mt-8">
            <BrandLogo inverted />
          </div>
          <h1 className="mt-10 font-display text-3xl font-bold tracking-tight leading-tight">
            Your Creator Business. One Operating System.
          </h1>
          <p className="mt-4 text-sm text-[#CBD5E1] leading-relaxed max-w-md">
            Unify brand collaborations, content schedules, invoices, expense tracking, and
            real-time business intelligence in one calm financial workspace.
          </p>
        </div>

        <div className="mt-12 space-y-4 border-t border-white/15 pt-8">
          <div className="grid grid-cols-2 gap-4 font-mono tabular-nums">
            <div>
              <p className="font-sans text-xs text-[#94A3B8]">Sample Operating Margin</p>
              <p className="mt-1 text-2xl font-semibold text-[#D9FBEA]">78.2%</p>
            </div>
            <div>
              <p className="font-sans text-xs text-[#94A3B8]">Currency Precision</p>
              <p className="mt-1 text-2xl font-semibold text-white">INR · Multi</p>
            </div>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Separate demo data from live workspace records at any time.
          </p>
        </div>
      </div>

      {/* Right Split: Auth Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {forgotMode ? (
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-8">
              <h2 className="font-display text-2xl font-bold text-[#171923]">Reset password</h2>
              <p className="mt-1.5 text-sm text-[#697386]">
                Enter your workspace email and we will prepare a reset link.
              </p>

              {forgotSent ? (
                <div className="mt-6 rounded-lg border border-[#159B69]/25 bg-[#D9FBEA]/50 p-4 text-sm text-[#0E744E] flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Reset link sent</p>
                    <p className="mt-0.5 text-xs">
                      Check {email} for password recovery instructions.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {error && (
                    <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-2.5 text-xs text-[#B91C1C]">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-[#171923] mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-sm focus:border-[#635BFF] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#635BFF] py-2.5 text-sm font-semibold text-white hover:bg-[#5248F5] transition-colors"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setForgotSent(false);
                  setError('');
                }}
                className="mt-5 text-xs font-medium text-[#635BFF] hover:underline"
              >
                Back to Sign in
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-8">
              <h2 className="font-display text-2xl font-bold text-[#171923]">
                {mode === 'login' ? 'Sign in to CREATOR OS' : 'Create your creator account'}
              </h2>
              <p className="mt-1.5 text-sm text-[#697386]">
                {mode === 'login'
                  ? 'Access your revenue dashboard, campaigns, and assistant.'
                  : 'Set up your personal creator business workspace in minutes.'}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && (
                  <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-2.5 text-xs text-[#B91C1C]">
                    {error}
                  </div>
                )}

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-[#171923] mb-1.5">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Aanya Sharma"
                      className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-sm focus:border-[#635BFF] focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#171923] mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aanya@aanyasharma.in"
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-sm focus:border-[#635BFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#171923] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 pr-10 text-sm focus:border-[#635BFF] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#697386] hover:text-[#171923]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-[#171923] mb-1.5">
                      Confirm password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-sm focus:border-[#635BFF] focus:outline-none"
                    />
                  </div>
                )}

                {mode === 'login' ? (
                  <div className="flex items-center justify-between text-xs">
                    <label className="inline-flex items-center gap-2 text-[#697386] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-[#D1D5DB] text-[#635BFF] focus:ring-[#635BFF]"
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotMode(true);
                        setError('');
                      }}
                      className="font-medium text-[#635BFF] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                ) : (
                  <label className="flex items-start gap-2.5 text-xs text-[#697386] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 rounded border-[#D1D5DB] text-[#635BFF] focus:ring-[#635BFF]"
                    />
                    <span>
                      I agree to the CREATOR OS Terms of Service and Privacy Policy.
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#635BFF] py-2.5 text-sm font-semibold text-white hover:bg-[#5248F5] transition-colors"
                >
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <div className="mt-5 border-t border-[#E5E7EB] pt-5 space-y-3">
                <button
                  type="button"
                  onClick={onUseDemo}
                  className="w-full rounded-lg border border-[#D1D5DB] bg-[#FAFAFC] py-2.5 text-xs font-semibold text-[#172554] hover:bg-[#F3F4F8] transition-colors"
                >
                  Explore Demo Workspace (Aanya Sharma)
                </button>
                <p className="text-center text-xs text-[#697386]">
                  {mode === 'login' ? (
                    <>
                      New to CREATOR OS?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          onSwitchMode('register');
                          setError('');
                        }}
                        className="font-semibold text-[#635BFF] hover:underline"
                      >
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          onSwitchMode('login');
                          setError('');
                        }}
                        className="font-semibold text-[#635BFF] hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
