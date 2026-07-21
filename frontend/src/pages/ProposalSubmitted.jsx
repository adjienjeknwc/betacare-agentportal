// src/pages/ProposalSubmitted.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, LayoutDashboard, Search, Calendar, ShieldCheck } from 'lucide-react';

export default function ProposalSubmitted() {
  const navigate = useNavigate();
  const location = useLocation();

  const proposalId = location.state?.proposalId || 'PROP-982451-2026';
  const quoteParams = location.state?.quoteParams || {
    planName: 'Betacare Life Term Protect',
    sumAssured: 28500000,
    totalPayable: 23840
  };

  const submissionDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex-1 min-h-screen bg-[#F5F7FB] flex items-center justify-center font-sans pb-16 w-full relative">
      <main className="max-w-[550px] w-full mx-auto px-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-3xs animate-fade-in">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-2 select-none">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Proposal Filed Successfully</h2>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto leading-relaxed">
              The proposal has been locked and queued into the central database. Risk underwriting assessments are initialized.
            </p>
          </div>

          {/* Submitted parameters breakdown card */}
          <div className="border border-slate-100 bg-slate-50/50 p-5 rounded-2xl text-left text-xs font-semibold text-slate-650 space-y-3.5">
            <div className="flex justify-between border-b pb-2.5">
              <span className="text-slate-400 flex items-center gap-1"><Search className="w-3.5 h-3.5" /> Proposal DB ID</span>
              <span className="text-slate-900 font-mono font-bold select-all">{proposalId}</span>
            </div>
            <div className="flex justify-between border-b pb-2.5">
              <span className="text-slate-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Submission Date</span>
              <span className="text-slate-900 font-bold">{submissionDate}</span>
            </div>
            <div className="flex justify-between border-b pb-2.5">
              <span className="text-slate-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Pipeline Status</span>
              <span className="text-indigo-700 font-extrabold uppercase text-[10px] tracking-wide">Submitted (Pending Review)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Premium Ingested</span>
              <span className="text-[#0B1F5B] font-extrabold">₹{quoteParams.totalPayable?.toLocaleString('en-IN')} / yr</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs font-bold select-none">
            <button
              onClick={() => navigate('/lead-management/proposal-tracking')}
              className="flex-1 h-11 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Track Proposal Status</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 h-11 bg-[#0B1F5B] hover:bg-black text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-200" />
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
