// src/components/lead/LeadFinancialDetails.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Briefcase, TrendingUp, ArrowRight, ArrowLeft, Bell } from 'lucide-react';

export default function LeadFinancialDetails() {
  const navigate = useNavigate();

  // 1. FINANCIAL CORE DATA TRACKING STATE
  const [financialForm, setFinancialForm] = useState({
    occupation: 'Salaried Professional',
    annualIncome: '',
    sourceOfFunds: 'Employment Income'
  });

  const steps = [
    { label: '1. Personal', active: false },
    { label: '2. Contact', active: false },
    { label: '3. Financial', active: true }, // Highlighted Step 3
    { label: '4. Insurance', active: false },
    { label: '5. Documents', active: false },
    { label: '6. Review', active: false }
  ];

  const handleSaveAndContinue = (e) => {
    e.preventDefault();
    // Progress sequentially directly forward to Step 4
    navigate('/register/insurance');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] text-left font-sans antialiased pb-12">
      
      {/* ADD NEW LEAD TOP BAR */}
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 select-none">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/register/contact-info')}
            className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 transition-colors focus:outline-none shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-black tracking-tight leading-none">Add New Lead</h1>
            <span className="text-[10px] font-extrabold bg-blue-50 text-[#0F478D] border border-blue-100 px-2 py-0.5 rounded-md tracking-wider uppercase">
              Step 3 of 6
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg relative focus:outline-none">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span>
          </button>
          <div className="flex items-center gap-2 select-none">
            <div className="text-right">
              <h4 className="text-xs font-bold text-black leading-none">Agent John</h4>
              <span className="text-[9px] text-slate-400 font-black tracking-wider block mt-0.5">PREMIUM BROKER</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#0F478D] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">AJ</div>
          </div>
        </div>
      </header>

      {/* CANVAS VIEWPORT */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-6 space-y-6">
        
        {/* PROGRESSION STEPS CONTROLLER HUD */}
        <div className="w-full bg-white border border-slate-200 p-3 rounded-xl shadow-3xs select-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`py-1.5 px-2 rounded-lg text-xs font-bold tracking-tight border transition-colors ${
                  step.active 
                    ? 'bg-white text-[#0F478D] border-[#0F478D] font-black shadow-3xs' 
                    : 'bg-slate-50/60 text-slate-400 border-transparent'
                }`}
              >
                {step.label}
              </div>
            ))}
          </div>
        </div>

        {/* INPUT LAYOUT METRIC FORM CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
          
          <div className="text-left space-y-1 border-b border-slate-100 pb-4 select-none">
            <h2 className="text-xl font-bold text-black tracking-tight leading-none">Financial Details</h2>
            <p className="text-xs font-medium text-slate-500 max-w-xl">
              Configure active income structures and underwriting eligibility thresholds cleanly.
            </p>
          </div>

          <form onSubmit={handleSaveAndContinue} className="space-y-5 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
              
              {/* OCCUPATION PROFILE FIELD */}
              <div className="space-y-1.5 text-left">
                <label className="block text-slate-400 font-bold tracking-wider uppercase text-[10px] select-none">
                  Employment / Occupation Type
                </label>
                <div className="relative flex items-center w-full">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none z-10" />
                  <select 
                    value={financialForm.occupation}
                    onChange={(e) => setFinancialForm({ ...financialForm, occupation: e.target.value })}
                    className="w-full h-10 bg-[#F5F7FB] border border-slate-200 rounded-xl pl-9 pr-8 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-bold cursor-pointer transition-all appearance-none"
                  >
                    <option>Salaried Professional</option>
                    <option>Self-Employed Business Owner</option>
                    <option>Independent Contractor / Freelancer</option>
                    <option>Homemaker / Student</option>
                  </select>
                  <div className="absolute right-3 pointer-events-none text-slate-500 font-bold text-xs">▼</div>
                </div>
              </div>

              {/* ANNUAL GROSS INCOME FIELD */}
              <div className="space-y-1.5 text-left">
                <label className="block text-slate-400 font-bold tracking-wider uppercase text-[10px] select-none">
                  Estimated Gross Annual Income
                </label>
                <div className="relative flex items-center">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <input 
                    required 
                    type="number"
                    value={financialForm.annualIncome}
                    onChange={(e) => setFinancialForm({ ...financialForm, annualIncome: e.target.value })}
                    placeholder="e.g. 75000" 
                    className="w-full h-10 bg-[#F5F7FB] border border-slate-200 rounded-xl pl-9 pr-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>

              {/* SOURCE OF FUNDS DESCRIPTOR */}
              <div className="md:col-span-2 space-y-1.5 text-left">
                <label className="block text-slate-400 font-bold tracking-wider uppercase text-[10px] select-none">
                  Primary Source of Insurance Funds
                </label>
                <div className="relative flex items-center w-full">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none z-10" />
                  <select 
                    value={financialForm.sourceOfFunds}
                    onChange={(e) => setFinancialForm({ ...financialForm, sourceOfFunds: e.target.value })}
                    className="w-full h-10 bg-[#F5F7FB] border border-slate-200 rounded-xl pl-9 pr-8 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-bold cursor-pointer transition-all appearance-none"
                  >
                    <option>Employment Income</option>
                    <option>Business Operations Capital</option>
                    <option>Investment Dividends / Savings</option>
                    <option>Inheritance / Family Trust</option>
                  </select>
                  <div className="absolute right-3 pointer-events-none text-slate-500 font-bold text-xs">▼</div>
                </div>
              </div>

            </div>

            {/* FORM FOOTER ACTION LAYER TRIPS */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end select-none">
              <button 
                type="submit"
                className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-10 px-5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm focus:outline-none"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}