import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddLeadLayout({ children, pageTitle, currentStep }) {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F5F7FB] overflow-hidden">
      
      {/* SHIELD LAYOUT NAVIGATION ENGINE NAVBAR */}
      <header className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20 select-none">
        
        {/* Left Side: Dynamic Anchored Section Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button 
            type="button"
            onClick={() => navigate('/lead-management')}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold text-[#0B1F5B] tracking-tight leading-none whitespace-nowrap">
            {pageTitle || "Add New Lead"}
          </h1>
          <span className="text-[10px] font-black bg-blue-50 text-[#0F478D] border border-blue-100 px-2 py-0.5 rounded uppercase tracking-wider ml-2 shrink-0">
            Step {currentStep} of 6
          </span>
        </div>

        {/* Right Side: Standard Dashboard Profile Elements */}
        <div className="flex items-center gap-4 shrink-0">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg relative shrink-0">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span>
          </button>

          <div className="flex items-center gap-2.5 max-w-[180px] min-w-0">
            <div className="text-right hidden md:block min-w-0">
              <h4 className="text-xs font-bold text-slate-900 leading-none truncate">Agent John</h4>
              <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase block mt-0.5 truncate">PREMIUM BROKER</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#0F478D] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
              AJ
            </div>
          </div>
        </div>
      </header>

      {/* CORE CANVAS */}
      <main className="flex-1 w-full p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}