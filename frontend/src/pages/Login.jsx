// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { useAuth } from '../context/AuthContext'; // IMPORT FOR CONTEXT SYNCHRONIZATION
import { Eye, EyeOff, Lock, User, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { setMasterLeadsData, setWizardLeadForm } = useLeads();
  
  // Extract the handler from your AuthContext to update routing guards dynamically
  const authContext = useAuth();
  
  const [agentId, setAgentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  // Forgot Password State parameters
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email, 2 = Verify OTP, 3 = Reset Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrorBanner('Please enter your registered email address.');
      return;
    }
    setErrorBanner('');
    setSuccessBanner('');
    try {
      setForgotLoading(true);
      const res = await fetch('/api/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAddress: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Verification request failed.');
      }
      
      setSimulatedOtp(data.otp);
      setSuccessBanner('Verification code sent successfully!');
      setForgotStep(2); // Go to verification code step
    } catch (err) {
      setErrorBanner(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!forgotOtp) {
      setErrorBanner('Please enter the 6-digit OTP code.');
      return;
    }
    if (forgotOtp !== simulatedOtp) {
      setErrorBanner('Invalid validation code. Please verify the code and try again.');
      return;
    }
    setErrorBanner('');
    setSuccessBanner('Code verified! Please enter your new password.');
    setForgotStep(3); // Go to new password step
  };

  const handleResetPasswordFinal = async (e) => {
    e.preventDefault();
    if (!forgotNewPassword || !forgotConfirmPassword) {
      setErrorBanner('Please fill in all password fields.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorBanner('Passwords do not match.');
      return;
    }
    setErrorBanner('');
    setSuccessBanner('');
    try {
      setForgotLoading(true);
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailAddress: forgotEmail,
          otp: forgotOtp,
          newPassword: forgotNewPassword
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Password update failed.');
      }

      setSuccessBanner(data.message || 'Password updated successfully!');
      setForgotEmail('');
      setForgotOtp('');
      setSimulatedOtp('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setTimeout(() => {
        setIsForgotPassword(false);
        setForgotStep(1);
        setSuccessBanner('');
      }, 3000);
    } catch (err) {
      setErrorBanner(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  // Hydrate credentials from browser client layer memory strings if active tokens exist
  useEffect(() => {
    const savedAgentId = localStorage.getItem('remembered_agent_id');
    if (savedAgentId) {
      setAgentId(savedAgentId);
      setRememberMe(true);
    }
  }, []);

  // ==========================================================================
  // API INTENT HANDLER: AUTHORIZE AGENT
  // ==========================================================================
  const handleExistingAgentLogin = async (e) => {
    e.preventDefault();
    if (!agentId || !password) return;
    setErrorBanner('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, password })
      });

      let data = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textError = await response.text();
        console.error("❌ Non-JSON response received from server:", textError);
        throw new Error(`Server Error (${response.status}): Invalid server response. Please verify database connection.`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Authentication credentials rejected by Atlas Database.");
      }

      // 1. Commit backup strings across all common storage key variants
      localStorage.setItem('token', data.token);
      localStorage.setItem('agent_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.agent));
      localStorage.setItem('agent_profile', JSON.stringify(data.agent));

      // Handle Device Persistent Remember Me Flag Values
      if (rememberMe) {
        localStorage.setItem('remembered_agent_id', agentId);
      } else {
        localStorage.removeItem('remembered_agent_id');
        localStorage.removeItem('remembered_password');
      }

      // ==========================================================================
      // CRITICAL GUARD UPDATE: Hydrate your AuthContext State Provider
      // Depending on how your context state functions are named, execute the sync:
      // ==========================================================================
      if (authContext && typeof authContext.login === 'function') {
        await authContext.login(data.token, data.agent);
      } else if (authContext && typeof authContext.setIsAuthenticated === 'function') {
        authContext.setIsAuthenticated(true);
      } else {
        console.warn("⚠️ useAuth context found but login/setIsAuthenticated method was missing.");
      }

      console.log("🚀 Authorization synced across context hooks. Moving to workspace...");

      // 2. Clear out local state logs and redirect to dashboard route securely
      navigate('/dashboard');

    } catch (error) {
      console.error("❌ Authentication transaction failed:", error);
      setErrorBanner(error.message);
    }
  };

  const handleLaunchNewAgentRegistration = () => {
    if (typeof setMasterLeadsData === 'function') setMasterLeadsData([]);
    if (typeof setWizardLeadForm === 'function') setWizardLeadForm({});
    navigate('/register');
  };

  return (
    <div className="h-screen w-full flex bg-[#F5F7FB] font-sans antialiased text-left text-slate-700 select-none overflow-hidden">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white relative z-10 py-6 h-full overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#0B1F5B] font-black tracking-tight text-xl">
              <img src="/logo.png" alt="Betacare Life Logo" className="w-9 h-9 rounded-lg object-contain bg-slate-50 border p-0.5 no-invert" />
              <span className="text-lg">BETACARE LIFE</span>
            </div>
            <div className="pt-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                {isForgotPassword ? 'Reset Password' : 'Welcome back'}
              </h1>
              <p className="text-xs font-medium text-slate-400 mt-3">
                {isForgotPassword 
                  ? 'Verify your credentials to register a new account password.' 
                  : 'Enter your configuration parameters to mount the core tracking desktop terminal.'}
              </p>
            </div>
          </div>

          {errorBanner && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorBanner}</span>
            </div>
          )}

          {successBanner && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successBanner}</span>
            </div>
          )}

          {isForgotPassword ? (
            <div className="space-y-4">
              {forgotStep === 1 && (
                <form onSubmit={handleRequestOtp} className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Registered Email Address</label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input 
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. broker@betacarelife.com"
                        className="w-full h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B1F5B] rounded-xl pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full h-11 bg-[#0B1F5B] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                  >
                    <span>{forgotLoading ? 'Sending verification...' : 'Send Verification OTP →'}</span>
                  </button>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                  {/* SIMULATED INBOX POPUP IF OTP GENERATED */}
                  {simulatedOtp && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-fade-in bg-white">
                      <div className="bg-[#0B1F5B] text-white px-3.5 py-2 flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">✉️ BETACARE LIFE SECURITY SENTINEL</span>
                        <span className="bg-blue-500 text-[8px] px-2 py-0.5 rounded-full text-white font-extrabold uppercase">Sandbox Simulator</span>
                      </div>
                      <div className="p-4 space-y-3 text-left">
                        <div className="text-[11px] text-slate-500 space-y-0.5 border-b border-slate-100 pb-2">
                          <div><span className="font-black text-slate-700">To:</span> {forgotEmail}</div>
                          <div><span className="font-black text-slate-700">Subject:</span> [SECURE ALERT] Single-Use Password Reset Verification OTP Code</div>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                          A request was registered to modify the password credential binding for this email. Use the single-use authorization code below:
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 my-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ONE-TIME AUTHORIZATION CODE</span>
                          <span className="font-mono text-lg font-black tracking-widest text-[#0B1F5B] bg-white border px-4 py-1.5 rounded-lg shadow-3xs select-all">
                            {simulatedOtp}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium mt-1">This authorization code is active for 10 minutes.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Verification OTP Code</label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input 
                        type="text"
                        required
                        maxLength="6"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit code"
                        className="w-full h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B1F5B] rounded-xl pl-10 pr-4 text-xs font-mono text-slate-900 outline-none transition-all text-center tracking-widest"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full h-11 bg-[#0B1F5B] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                  >
                    <span>Verify Code →</span>
                  </button>
                </form>
              )}

              {forgotStep === 3 && (
                <form onSubmit={handleResetPasswordFinal} className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">New Password</label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input 
                        type="password"
                        required
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B1F5B] rounded-xl pl-10 pr-4 text-xs font-mono text-slate-900 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Confirm New Password</label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input 
                        type="password"
                        required
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B1F5B] rounded-xl pl-10 pr-4 text-xs font-mono text-slate-900 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full h-11 bg-[#0B1F5B] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                  >
                    <span>{forgotLoading ? 'Saving...' : 'Update Password & Save'}</span>
                  </button>
                </form>
              )}

              <button 
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setForgotStep(1);
                  setForgotEmail('');
                  setForgotOtp('');
                  setSimulatedOtp('');
                  setErrorBanner('');
                  setSuccessBanner('');
                }}
                className="w-full h-10 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 font-bold text-xs rounded-xl transition-all flex items-center justify-center cursor-pointer mt-2"
              >
                Cancel and Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleExistingAgentLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Agent ID / Email Address</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input 
                    type="text"
                    required
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    placeholder="e.g. AGT-123456 or broker@betacarelife.com"
                    className="w-full h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B1F5B] rounded-xl pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Password</label>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsForgotPassword(true);
                      setErrorBanner('');
                      setSuccessBanner('');
                    }}
                    className="text-[10px] font-black text-blue-600 hover:underline outline-none cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B1F5B] rounded-xl pl-10 pr-10 text-xs font-mono text-slate-900 outline-none transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-900 outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-500">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#0B1F5B] focus:ring-[#0B1F5B] border-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full h-11 bg-[#0B1F5B] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
              >
                <span>Login Terminal →</span>
              </button>
            </form>
          )}

          <div className="pt-4 text-center text-xs font-semibold text-slate-500 border-t border-slate-100">
            <span>Don't have an account? </span>
            <button 
              type="button"
              onClick={handleLaunchNewAgentRegistration}
              className="text-[#0B1F5B] font-black hover:underline focus:outline-none bg-transparent border-none p-0 inline cursor-pointer"
            >
              Register as an Agent
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-4 flex-wrap gap-3">
            <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              <span>MEMBER OF IRDAI</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Secure SSL Encryption</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-[#0F478D] items-center justify-center relative p-12 overflow-hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B1F5B]/30 pointer-events-none z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-56 h-56 md:w-64 md:h-64 rounded-[40px] bg-white flex items-center justify-center shadow-2xl relative p-8">
            <img src="/logo.png" alt="Betacare Life Logo" className="w-full h-full object-contain no-invert" />
          </div>
          <div className="max-w-sm space-y-2">
            <h3 className="text-white font-black text-xl tracking-tight">Betacare Life Insurance Portal</h3>
            <p className="text-blue-100/70 text-xs leading-relaxed font-medium">Access unified underwriting channels, customer quotation metrics graphs, and real-time active compliance logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}