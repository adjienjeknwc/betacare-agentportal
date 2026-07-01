// src/components/registration/LeadContactInfo.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext';
import { Phone, Mail, MapPin, ArrowRight, ArrowLeft, Bell } from 'lucide-react';

export default function LeadContactInfo() {
  const navigate = useNavigate();
  const { wizardLeadForm, updateWizardForm } = useLeads();

  const [formData, setFormData] = useState({
    mobileNumber: wizardLeadForm?.mobileNumber || '',
    email: wizardLeadForm?.email || '',
    city: wizardLeadForm?.city || ''
  });

  const steps = [
    { label: '1. Personal', active: false },
    { label: '2. Contact', active: true },
    { label: '3. Financial', active: false },
    { label: '4. Insurance', active: false },
    { label: '5. Documents', active: false },
    { label: '6. Review', active: false }
  ];

  const handleSaveAndContinue = (e) => {
    e.preventDefault();
    updateWizardForm(formData);
    navigate('/register/financial-info');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] text-left font-sans antialiased pb-12">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 select-none">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/register/personal-details')} className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 transition-colors focus:outline-none shrink-0"><ArrowLeft className="w-4 h-4" /></button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-black tracking-tight leading-none">Add New Lead</h1>
            <span className="text-[10px] font-extrabold bg-blue-50 text-[#0F478D] border border-blue-100 px-2 py-0.5 rounded-md tracking-wider uppercase">Step 2 of 6</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-[#0F478D] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">AJ</div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-6 space-y-6">
        <div className="w-full bg-white border border-slate-200 p-3 rounded-xl shadow-3xs select-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
            {steps.map((step, idx) => (
              <div key={idx} className={`py-1.5 px-2 rounded-lg text-xs font-bold tracking-tight border ${step.active ? 'bg-white text-[#0F478D] border-[#0F478D] font-black shadow-3xs' : 'bg-slate-50/60 text-slate-400 border-transparent'}`}>{step.label}</div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-1 border-b border-slate-100 pb-4 select-none">
            <h2 className="text-lg font-black text-black tracking-tight leading-none">Contact Details</h2>
            <p className="text-xs font-medium text-slate-500 max-w-xl mx-auto">Establish vital communication endpoints for verification loops.</p>
          </div>

          <form onSubmit={handleSaveAndContinue} className="space-y-5 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold text-left">Mobile Number</label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input required type="tel" value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} placeholder="Enter 10-digit primary contact number" className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold text-left">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="e.g. client@domain.com" className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all" />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-slate-700 font-bold text-left">City / Region</label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="e.g. Mumbai, Maharashtra" className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end select-none">
              <button type="submit" className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-10 px-5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm focus:outline-none">
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