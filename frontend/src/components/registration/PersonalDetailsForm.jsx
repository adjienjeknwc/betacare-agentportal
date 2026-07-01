// src/pages/PersonalDetailsForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

export default function PersonalDetailsForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', mobile: '', identityDoc: '' });

  const handleNext = (e) => {
    e.preventDefault();
    // Progress safely to step 2 of your intake path setup
    navigate('/register/professional-info', { state: { prefillPersonal: form } });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] text-left px-6 py-8">
      <div className="max-w-2xl w-full mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-6">
        
        {/* PROGRESS STEPPER HEADER */}
        <div className="border-b border-slate-100 pb-4 select-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Step 1 of 5</span>
          <h2 className="text-xl font-bold text-black mt-1">Lead Personal Details Configuration</h2>
        </div>

        {/* INTAKE FIELDS FORM */}
        <form onSubmit={handleNext} className="space-y-4 text-xs font-semibold text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-slate-700">First Legal Name</label>
              <input required type="text" placeholder="e.g. Rohan" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none focus:bg-white focus:border-[#0F478D] font-medium text-slate-900 shadow-inner" />
            </div>
            <div className="space-y-1">
              <label className="block text-slate-700">Last Legal Name</label>
              <input required type="text" placeholder="e.g. Mehta" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none focus:bg-white focus:border-[#0F478D] font-medium text-slate-900 shadow-inner" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-700">Primary Email Link Contact</label>
            <div className="relative flex items-center">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input required type="email" placeholder="client.name@example.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 outline-none focus:bg-white focus:border-[#0F478D] font-medium text-slate-900" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-700">Mobile Connection Number</label>
            <div className="relative flex items-center">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input required type="text" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={(e) => setForm({...form, mobile: e.target.value})} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 outline-none focus:bg-white focus:border-[#0F478D] font-medium text-slate-900" />
            </div>
          </div>

          {/* Underwriting Verification Document Holder Field */}
          <div className="space-y-1">
            <label className="block text-slate-700">Statutory Tax Account Reference Number (PAN Number)</label>
            <input required type="text" placeholder="ABCDE1234F" value={form.identityDoc} onChange={(e) => setForm({...form, identityDoc: e.target.value.toUpperCase()})} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none focus:bg-white focus:border-[#0F478D] font-mono text-slate-900 placeholder:normal-case tracking-wider" />
          </div>

          {/* NAVIGATION ACTION BAR BUTTON ROW */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between select-none">
            <button type="button" onClick={() => navigate('/dashboard')} className="h-9 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 font-bold transition-colors">
              Cancel
            </button>
            <button type="submit" className="h-9 px-4 bg-[#0B1E46] hover:bg-black text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm">
              <span>Save & Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}