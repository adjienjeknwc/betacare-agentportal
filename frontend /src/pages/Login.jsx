import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, registrationSuccessMessage, setRegistrationSuccessMessage } = useAuth();
  const navigate = useNavigate();

  const handleAuthenticationTrigger = () => {
    setRegistrationSuccessMessage(''); // Clean alert message state
    login();
    navigate('/dashboard');
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-[#F5F7FB] flex flex-col md:flex-row font-sans text-gray-900 antialiased select-none">
      
      {/* LEFT COLUMN: AUTH CONTRL PANEL */}
      <div className="w-full md:w-[50%] h-full bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 border-r border-gray-200">
        <div className="shrink-0 flex justify-between items-center">
          <h1 className="text-[#0B1F5B] text-xs font-extrabold tracking-wider uppercase m-0 p-0">
            ABCD Life Insurance
          </h1>
        </div>

        <div className="w-full max-w-md mx-auto my-auto flex flex-col justify-center min-h-0 py-2">
          
          {/* Persistent Onboarding Status Alert Indicator Notification Banner */}
          {registrationSuccessMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{registrationSuccessMessage}</span>
            </div>
          )}

          <div className="flex flex-col text-left mb-5" style={{ textAlign: 'left' }}>
            <h2 className="text-[#0B1F5B] text-2xl sm:text-3xl font-bold tracking-tight m-0 p-0 leading-tight">
              Welcome back
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1.5 m-0 p-0 leading-normal">
              Enter your credentials to access the Premier Agent Portal.
            </p>
          </div>

          <LoginForm onAuthSuccess={handleAuthenticationTrigger} />

          <div className="mt-5 text-center text-xs text-gray-600 border-b border-gray-100 pb-4 shrink-0">
            <span>Don't have an account? </span>
            <Link to="/register/personal-details" className="text-[#0F478D] font-bold hover:underline">
              Register as an Agent
            </Link>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
            <div className="flex items-center justify-center gap-1.5 w-full sm:w-auto bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-[#0F478D]">
              <CheckCircle className="w-3.5 h-3.5 fill-current" />
              <span>MEMBER OF IRDAI</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 w-full sm:w-auto bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-full text-[10px] font-semibold text-gray-600">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>Secure SSL Encryption</span>
            </div>
          </div>
        </div>

        <div className="text-center md:text-left block shrink-0 pt-2">
          <p className="text-[10px] text-gray-400 font-medium m-0 p-0 leading-normal">
            © 2024 ABCD Life Insurance. All rights reserved. 
            <span className="mx-1">·</span>
            <a href="#" className="hover:text-gray-600 underline sm:no-underline">Privacy Policy</a>
            <span className="mx-1">|</span>
            <a href="#" className="hover:text-gray-600 underline sm:no-underline">Terms</a>
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: SEAL EMBLEM CONTAINER */}
      <div className="w-full md:w-[50%] h-full bg-[#F5F7FB] flex items-center justify-center p-6 overflow-hidden">
        <div className="w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[280px] max-h-[48vh] aspect-[4/5] relative drop-shadow-[0_10px_24px_rgba(15,71,141,0.05)]">
          <svg viewBox="0 0 400 500" className="w-full h-full fill-[#0F478D]" xmlns="http://www.w3.org/2000/svg">
            <path d="M200 0C320 40 400 100 400 100V280C400 400 200 500 200 500C200 500 0 400 0 280V100C0 100 80 40 200 0Z" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pb-5 select-none">
            <span className="text-white text-[7rem] sm:text-[9rem] lg:text-[11rem] font-black tracking-tighter antialiased">A</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onAuthSuccess }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onAuthSuccess(); }} className="space-y-3 shrink-0">
      <div className="w-full flex flex-col text-left">
        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Agent ID / Email</label>
        <div className="relative flex items-center w-full">
          <span className="absolute left-3 z-10"><User className="w-3.5 h-3.5 text-gray-400" /></span>
          <input type="text" placeholder="e.g. AGT-9982 or name@abcdlife.com" className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-xs outline-none text-gray-900 focus:border-[#0F478D]" required />
        </div>
      </div>

      <div className="w-full flex flex-col text-left">
        <div className="flex justify-between items-center mb-1">
          <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Password</label>
          <a href="#" className="text-[10px] font-bold text-[#0F478D] hover:underline">Forgot Password?</a>
        </div>
        <div className="relative flex items-center w-full">
          <span className="absolute left-3 z-10"><Lock className="w-3.5 h-3.5 text-gray-400" /></span>
          <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full pl-9 pr-9 py-2 bg-white border border-gray-300 rounded-xl text-xs outline-none text-gray-900 focus:border-[#0F478D]" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400">
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center text-left py-0.5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-[#0F478D] focus:ring-0" />
          <span className="text-[11px] text-gray-600 font-medium">Remember me on this device</span>
        </label>
      </div>

      <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0B1E46] text-white rounded-xl text-xs font-bold transition-all active:scale-[0.99]">
        <span>Login</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}