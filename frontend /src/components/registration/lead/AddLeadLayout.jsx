import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';

export default function AddLeadLayout({ currentStep, children }) {
  const navigate = useNavigate();
  
  const stepNodes = [
    { key: 1, label: 'Basic Info' },
    { key: 2, label: 'Contact Info' },
    { key: 3, label: 'Financial Details' },
    { key: 4, label: 'Insurance Interest' },
    { key: 5, label: 'Documents' },
    { key: 6, label: 'Review & Submit' }
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#F5F7FB]">
      
      {/* LOCALIZED HEADER MODAL BAR */}
      <header className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-10 select-none">
        <div className="flex items-center gap-6">
          <div className="flex flex-col text-left">
            <h1 className="text-sm font-black text-[#0B1F5B] uppercase tracking-wide leading-none">Add New Lead</h1>
            <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Lumina Onboarding</span>
          </div>
          <div className="w-64 relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input type="text" placeholder="Search leads..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-1.5 text-xs outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 placeholder:text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/lead-management')} className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
          <div className="h-5 w-px bg-slate-200"></div>
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg relative"><Bell className="w-4 h-4" /></button>
        </div>
      </header>

      {/* CORE WORKSPACE STEPPER SUB-MODULE WRAPPER */}
      <div className="flex-1 w-full flex flex-col overflow-hidden">
        
        {/* DYNAMIC REGISTRATION STEP PROGRESS LINE BAR */}
        <div className="w-full bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 select-none">
          <div className="flex flex-wrap items-center gap-4">
            {stepNodes.map((s) => (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${currentStep === s.key ? 'bg-[#0F478D] text-white ring-4 ring-blue-50' : currentStep > s.key ? 'bg-[#0B1E46] text-white' : 'bg-slate-100 border border-slate-200 text-slate-400'}`}>
                  {s.key}
                </div>
                <span className={`text-xs font-bold ${currentStep >= s.key ? 'text-[#0B1E46]' : 'text-slate-400'}`}>{s.label}</span>
                {s.key < 6 && <div className="w-3 h-px bg-slate-200"></div>}
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
            Step {currentStep} of 6
          </span>
        </div>

        {/* CONTAINER VIEWPORTS FLOW */}
        <div className="flex-1 w-full overflow-hidden flex flex-col lg:flex-row">
          {children}
        </div>
      </div>

    </div>
  );
}