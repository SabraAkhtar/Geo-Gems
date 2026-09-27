import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Logo } from '../Logo';

export const AdminLogin: React.FC = () => {
  const { adminLogin, setCurrentView } = useEcommerce();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter both your administrator email/username and password.');
      return;
    }

    setIsLoading(true);
    const result = await adminLogin(identifier.trim(), password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Invalid credentials. Please verify and try again.');
    }
  };


  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#B08D57] selection:text-[#151515]">
      {/* Return to website link */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs font-sans font-semibold tracking-wider text-[#5A544A] hover:text-[#151515] transition-colors uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* GEO GEMS Official Logo */}
        <div className="text-center flex flex-col items-center">
          <div className="mb-3">
            <Logo size="lg" layout="stacked" showTagline={false} />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#151515] font-normal tracking-tight mt-2">
            Administrator Sign In
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#5A544A] font-sans">
            Manage your Geo Gems Crystals catalog, photos, videos, and customer inquiries.
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-white py-8 px-6 sm:px-10 shadow-lg rounded-2xl border border-[#E1D9CD]">
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-[#A14B38]/10 border border-[#A14B38]/30 rounded-xl flex items-start gap-2.5 text-xs text-[#A14B38]">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            {/* Email or Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#292820] mb-1.5">
                Email or Username
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#716B60]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57] text-[#151515]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#292820] mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#716B60]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full pl-9 pr-10 py-2.5 text-sm bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57] text-[#151515]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#716B60] hover:text-[#151515] cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="primary-button w-full disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Sign In to Admin Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
