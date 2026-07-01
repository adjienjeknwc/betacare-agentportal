import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLead } from '../../context/LeadContext';
import AddLeadLayout from './AddLeadLayout';
import { Sparkles } from 'lucide-react';

export default function LeadInsuranceInterest() {
  const navigate = useNavigate();
  const { leadData, updateLeadData } = useLead();

  const handleNextStep = (e) => {
    e.preventDefault();
    navigate('/lead-management/add-lead/documents');
  };

  return (
    <AddLeadLayout currentStep={4}>
      <div className="flex-1 h-full bg-white p-6 sm:p-8 overflow-y-auto border-r border-slate-200 flex flex-col justify-between">
        <div className="w-full max-w-xl mx-auto space-y-5 text-left">
          <div>
            <h2 className="text-lg font-black text-[#0B1E46] tracking-tight">Insurance Interest</h2>
            <p className="text-xs text-slate-400 font-medium">Define the protection scope and financial aspirations for your lead application profile matrix.</p>
          </div>

          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-2">Engagement Priority</label>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                <button type="button" onClick={() => updateLeadData({ engagementPriority: 'Hot' })} className={`p-2 rounded-xl border ${leadData.engagementPriority === 'Hot' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Hot</button>
                <button type="button" onClick={() => updateLeadData({ engagementPriority: 'Warm' })} className={`p-2 rounded-xl border ${leadData.engagementPriority === 'Warm' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Warm</button>
                <button type="button" onClick={() => updateLeadData({ engagementPriority: 'Cold' })} className={`p-2 rounded-xl border ${leadData.engagementPriority === 'Cold' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Cold</button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-2">Product Interest</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
                {['Term', 'Whole Life', 'ULIP', 'Endowment'].map((p) => (
                  <button key={p} type="button" onClick={() => updateLeadData({ productInterest: p })} className={`p-2 rounded-xl border ${leadData.productInterest === p ? 'bg-blue-50/50 border-[#0F478D] text-[#0F478D]' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{p}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Key Life Objectives</label>
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <label className="flex items-center gap-2"><input type="checkbox" checked={leadData.keyObjectives.includes('Tax-deferred cash value accumulation')} readOnly className="rounded text-[#0F478D]" /> <span>Tax-deferred cash value accumulation</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded text-[#0F478D]" /> <span>Fixed premiums for entire duration</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded text-[#0F478D]" /> <span>Guaranteed death benefit payout</span></label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-5 select-none">
              <button type="button" onClick={() => navigate('/lead-management/add-lead/financial-details')} className="bg-white text-slate-700 border border-slate-200 font-bold text-xs py-2 px-5 rounded-xl">Back</button>
              <div className="flex gap-2">
                <button type="button" className="bg-white text-slate-500 border border-slate-200 font-bold text-xs py-2 px-4 rounded-xl">Save Draft</button>
                <button type="submit" className="bg-[#0F478D] hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md">Next: Documents →</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* SMART MATCH AI INSIGHT SIDEBAR ELEMENT */}
      <div className="hidden lg:flex flex-col w-[32%] h-full bg-[#F8FAFC] p-5 justify-between overflow-y-auto select-none">
        <div className="space-y-4 text-left">
          <div className="bg-gradient-to-br from-[#0B1E46] to-[#0F478D] text-white p-4 rounded-xl shadow-md space-y-3">
            <div className="flex items-center gap-1.5 text-blue-200">
              <Sparkles className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-wider">Smart Match</span>
            </div>
            <div>
              <h4 className="text-sm font-black leading-none mb-1">Whole Life Plan</h4>
              <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase">94% Fit</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-relaxed">Matches profile age (34) and "Wealth Creation" objective with lifetime coverage boundaries.</p>
            <button type="button" className="w-full bg-white text-[#0F478D] font-bold text-xs py-2 rounded-xl">View Illustration</button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-2">
            <span className="block text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Lead Snapshot</span>
            <div className="border-b border-slate-100 pb-2 mb-1">
              <h4 className="text-xs font-bold text-slate-800 leading-none mb-1">Robert Sullivan</h4>
              <span className="text-[10px] text-slate-400 font-bold">Profile: High Net Worth</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><span className="block text-[9px] text-slate-400 font-bold uppercase">Risk Appetite</span><span className="font-bold text-slate-700">Moderate-High</span></div>
              <div><span className="block text-[9px] text-slate-400 font-bold uppercase">Horizon</span><span className="font-bold text-slate-700">25+ Years</span></div>
            </div>
          </div>
        </div>
      </div>
    </AddLeadLayout>
  );
}