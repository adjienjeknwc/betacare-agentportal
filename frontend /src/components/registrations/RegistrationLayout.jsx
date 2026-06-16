import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function RegistrationLayout({ currentStep, children }) {
  const navigate = useNavigate();

  const stepsList = [
    { num: 1, name: 'Personal' },
    { num: 2, name: 'Professional' },
    { num: 3, name: 'KYC' },
    { num: 4, name: 'Credentials' },
    { num: 5, name: 'Review' }
  ];

  return (
    <div className="w-full h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 antialiased overflow-hidden selection:bg-[#0F478D]/10 select-none">
      
      {/* PERSISTENT ONBOARDING HEADER BAR COMPONENT */}
      <header className="w-full h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 relative z-10 shadow-xs">
        <div className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => navigate('/login')} 
            className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
          <div className="h-4 w-px bg-slate-200 mx-2"></div>
          <span className="text-xs font-black text-[#0B1E46] tracking-wider uppercase">Agent Registration</span>
        </div>

        {/* Stepper Node Line Tracking Layer */}
        <div className="hidden md:flex items-center gap-6">
          {stepsList.map((step) => (
            <div key={step.num} className="flex items-center gap-2">
              <div 
                className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition-all shadow-xs ${
                  currentStep === step.num 
                    ? 'bg-[#0F478D] text-white ring-4 ring-blue-50' 
                    : currentStep > step.num 
                    ? 'bg-[#0B1E46] text-white' 
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step.num}
              </div>
              <span className={`text-xs font-bold ${currentStep >= step.num ? 'text-[#0B1E46]' : 'text-slate-400'}`}>
                {step.name}
              </span>
              {step.num < 5 && <div className="w-4 h-px bg-slate-200"></div>}
            </div>
          ))}
        </div>

        <div>
          <button type="button" className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help & Support</span>
          </button>
        </div>
      </header>

      {/* CORE FORM RENDER BLOCK PIPELINE INTERFACE */}
      <div className="flex-1 w-full overflow-hidden flex flex-col md:flex-row">
        {children}
      </div>

    </div>
  );
}