// src/components/registration/LeadFinancialDetails.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext';
import { Briefcase, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LeadFinancialDetails() {
  const navigate = useNavigate();
  const { wizardLeadForm, updateWizardForm } = useLeads();

  const [formData, setFormData] = useState({
    occupation: wizardLeadForm?.occupation || '',
    annualIncome: wizardLeadForm?.annualIncome || ''
  });

  const steps = [
    { label: '1. Personal', active: false },
    { label: '2. Contact', active: false },
    { label: '3. Financial', active: true },
    { label: '4. Insurance', active: false },
    { label: '5. Documents', active: false },
    { label: '6. Review', active: false }
  ];

  const handleSaveAndContinue = (e) => {
    e.preventDefault();
    updateWizardForm(formData);
    navigate('/register/insurance-info');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] text-left font-sans antialiased pb-12">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 select-none">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/register/contact-info')} className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none"><ArrowLeft className="w-4 h-4" /></button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-black tracking-tight leading-none">Add New Lead</h1>
            <span className="text-[10px] font-extrabold bg-blue-50 text-[#0F478D] border border-blue-100 px-2 py-0.5 rounded-md tracking-wider uppercase">Step 3 of 6</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-6 space-y-6">
        <div className="w-full bg-white border border-slate-200 p-3 rounded-xl shadow-3xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
            {steps.map((step, idx) => (
              <div key={idx} className={`py-1.5 px-2 rounded-lg text-xs font-bold tracking-tight border ${step.active ? 'bg-white text-[#0F478D] border-[#0F478D] font-black shadow-3xs' : 'bg-slate-50/60 text-slate-400 border-transparent'}`}>{step.label}</div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-1 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-black tracking-tight leading-none">Financial Profiling</h2>
            <p className="text-xs font-medium text-slate-500 max-w-xl mx-auto">Analyze income streams to establish clear underwriting caps.</p>
          </div>

          <form onSubmit={handleSaveAndContinue} className="space-y-5 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold text-left">Primary Occupation Track</label>
                <div className="relative flex items-center">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input required type="text" value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})} placeholder="e.g. Salaried IT Professional" className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold text-left">Gross Annual Income (₹)</label>
                <div className="relative flex items-center">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input required type="number" value={formData.annualIncome} onChange={(e) => setFormData({...formData, annualIncome: e.target.value})} placeholder="e.g. 1800000" className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
              <button type="submit" className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-10 px-5 rounded-xl flex items-center gap-1.5 shadow-sm">
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