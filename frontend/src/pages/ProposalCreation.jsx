// src/pages/ProposalCreation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Landmark, FileText, CheckCircle2 } from 'lucide-react';
import { fetchFromPortal } from './api';

export default function ProposalCreation() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [lead, setLead] = useState(location.state?.lead || null);
  const [loading, setLoading] = useState(!lead);
  const [toastMsg, setToastMsg] = useState('');

  const quoteParams = location.state?.quoteParams || {
    planName: 'Betacare Life Term Protect',
    policyType: 'Term Life',
    sumAssured: 28500000,
    totalPayable: 23840,
    premiumFrequency: 'Annual'
  };

  useEffect(() => {
    if (!lead) {
      const fetchLead = async () => {
        try {
          const data = await fetchFromPortal(`/leads/single/${leadId}`);
          setLead(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchLead();
    }
  }, [leadId, lead]);

  const handleCreateProposal = async () => {
    try {
      const token = localStorage.getItem('agent_token');
      // Create a draft proposal status on lead
      await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Draft Proposal' })
      });
      setToastMsg('Proposal record initialized! Redirecting to setup form...');
      setTimeout(() => {
        navigate(`/lead-management/proposal-form/${leadId}`, { state: { lead, quoteParams } });
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-slate-500">
        <Landmark className="w-8 h-8 animate-spin text-[#0B1F5B] mb-2" />
        <span className="text-xs font-bold uppercase tracking-wider">Initializing Workspace...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#F5F7FB] text-left font-sans pb-16 w-full relative">
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-[#0B1F5B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 border border-blue-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-3xs w-full">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate(`/lead-management/quote-details/${leadId}`)} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[20px] leading-none">Proposal Onboarding Desk</h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[9px]">ID Reference: {leadId.toUpperCase()}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[700px] w-full mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-md text-center space-y-6">
          <div className="w-16 h-16 bg-[#0B1F5B]/5 border border-[#0B1F5B]/10 rounded-2xl flex items-center justify-center mx-auto text-[#0B1F5B]">
            <FileText className="w-8 h-8" />
          </div>

          <div className="space-y-2 select-none">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Convert Accepted Quote to Proposal</h2>
            <p className="text-xs text-slate-400 font-semibold max-w-md mx-auto leading-relaxed">
              Customer has accepted the calculated premium illustration rate sheet. You can now initialize the formal policy proposal record.
            </p>
          </div>

          {/* Quote & Customer Brief Overview card */}
          <div className="border border-slate-100 bg-slate-50/50 p-5 rounded-2xl text-left text-xs font-semibold text-slate-650 space-y-4">
            <div className="flex justify-between border-b pb-2.5">
              <span className="text-slate-400">Customer Name</span>
              <span className="text-slate-900 font-black">{lead?.customerName}</span>
            </div>
            <div className="flex justify-between border-b pb-2.5">
              <span className="text-slate-400">Selected Product</span>
              <span className="text-slate-900 font-bold">{quoteParams.planName}</span>
            </div>
            <div className="flex justify-between border-b pb-2.5">
              <span className="text-slate-400">Sum Assured Coverage</span>
              <span className="text-[#0B1F5B] font-extrabold">₹{quoteParams.sumAssured?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Premium Cost</span>
              <span className="text-slate-900 font-extrabold">₹{quoteParams.totalPayable?.toLocaleString('en-IN')} / {quoteParams.premiumFrequency}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateProposal}
            className="w-full h-12 bg-[#0B1F5B] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Initialize Proposal Intake Form →</span>
          </button>
        </div>
      </main>
    </div>
  );
}
