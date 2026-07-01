// src/components/registration/LeadInsuranceInfo.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext';
import { Shield, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LeadInsuranceInfo() {
  const navigate = useNavigate();
  const { wizardLeadForm, updateWizardForm } = useLeads();

  const [formData, setFormData] = useState({
    smokingStatus: wizardLeadForm?.smokingStatus || 'Non-Smoker',
    planInterest: wizardLeadForm?.planInterest || 'Term Life',
    medicalHistory: wizardLeadForm?.medicalHistory || 'None Declared'
  });

  const steps = [
    { label: '1. Personal', active: false },
    { label: '2. Contact', active: false },
    { label: '3. Financial', active: false },
    { label: '4. Insurance', active: true },
    { label: '5. Documents', active: false },
    { label: '6. Review', active: false }
  ];

  const handleSaveAndContinue = (e) => {
    e.preventDefault();
    updateWizardForm(formData);
    navigate('/register/documents');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] text-left font-sans antialiased pb-12">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/register/financial-info')} className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none"><ArrowLeft className="w-4 h-4" /></button>
          <h1 className="text-2xl font-bold text-black tracking-tight leading-none">Add New Lead</h1>
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
            <h2 className="text-lg font-black text-black tracking-tight leading-none">Insurance Configurations</h2>
            <p className="text-xs font-medium text-slate-500 max-w-xl mx-auto">Configure intended plan blueprints and baseline medical configurations.</p>
          </div>

          <form onSubmit={handleSaveAndContinue} className="space-y-5 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 text-left">
                <label className="block text-slate-700 font-bold">Smoking Status</label>
                <select value={formData.smokingStatus} onChange={(e) => setFormData({...formData, smokingStatus: e.target.value})} className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl px-3 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-bold transition-all">
                  <option value="Non-Smoker">Non-Smoker</option>
                  <option value="Smoker">Active Tobacco Consumer</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-slate-700 font-bold">Plan Framework Focus</label>
                <select value={formData.planInterest} onChange={(e) => setFormData({...formData, planInterest: e.target.value})} className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl px-3 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-bold transition-all">
                  <option value="Term Life">Term Life Insurance Plan</option>
                  <option value="ULIP">Unit Linked Insurance Product (ULIP)</option>
                  <option value="Endowment">Endowment Savings Guarantee</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2 text-left">
                <label className="block text-slate-700 font-bold">Medical History Declarations</label>
                <input type="text" value={formData.medicalHistory} onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})} placeholder="e.g. Hypertension declared / None" className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl px-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all" />
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