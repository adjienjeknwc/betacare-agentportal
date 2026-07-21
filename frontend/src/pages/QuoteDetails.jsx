// src/pages/QuoteDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Save, Share2, Check, X, Shield, Activity, Landmark, FileText, CheckCircle2 } from 'lucide-react';
import { fetchFromPortal } from './api';

export default function QuoteDetails() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Extract policy parameters passed from quote generator page state or fallback
  const quoteParams = location.state?.quoteData || {
    planName: 'Betacare Life Term Protect',
    policyType: 'Term Life',
    sumAssured: 28500000,
    policyTerm: 35,
    premiumPaymentTerm: 35,
    premiumFrequency: 'Annual',
    basePremium: 20203,
    taxAmount: 3637,
    totalPayable: 23840
  };

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchFromPortal(`/leads/single/${leadId}`);
        if (data) {
          setLead(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadDetails();
  }, [leadId]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAcceptQuote = async () => {
    try {
      // Save accepted status on lead
      const token = localStorage.getItem('agent_token');
      await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Quote Accepted' })
      });
      showToast('Quote accepted! Redirecting to proposal creation...');
      setTimeout(() => {
        navigate(`/lead-management/create-proposal/${leadId}`, { state: { lead, quoteParams } });
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectQuote = async () => {
    try {
      const token = localStorage.getItem('agent_token');
      await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Quote Rejected' })
      });
      showToast('Quote marked as rejected.');
      setTimeout(() => navigate('/lead-management'), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-slate-500 gap-2">
        <Activity className="w-8 h-8 animate-spin text-[#0B1F5B]" />
        <span className="text-xs font-bold uppercase tracking-wider">Loading Quote Details...</span>
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
          <button type="button" onClick={() => navigate(`/lead-management/details/${leadId}`)} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[20px] leading-none">Quote Details Review</h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[9px]">ID Reference: {leadId.toUpperCase()}</span>
          </div>
        </div>
        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
          Quote Status: Generated
        </span>
      </header>

      <main className="max-w-[1200px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Plan details & Premium Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer brief info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#0B1F5B] tracking-wider border-b pb-2">Customer Profile Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-700">
              <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Customer Name</span><span className="text-slate-900 block mt-0.5">{lead?.customerName}</span></div>
              <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Age / Gender</span><span className="text-slate-900 block mt-0.5">{lead?.dob ? `${new Date().getFullYear() - new Date(lead.dob).getFullYear()} yrs` : '—'} • {lead?.gender}</span></div>
              <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Annual Income</span><span className="text-slate-900 block mt-0.5">₹{lead?.annualIncome?.toLocaleString('en-IN')}</span></div>
              <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Tobacco Status</span><span className="text-slate-900 block mt-0.5">{lead?.smokingStatus}</span></div>
            </div>
          </div>

          {/* Plan benefits cover details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#0B1F5B] tracking-wider border-b pb-2">Plan Coverage Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
              <div className="p-3 border border-blue-50 bg-blue-50/10 rounded-xl flex items-start gap-2.5">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-900 font-bold block">Guaranteed Face Cover</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">₹{(quoteParams.sumAssured / 10000000).toFixed(2)} Cr Sum Assured is paid immediately to nominees on death.</span>
                </div>
              </div>
              <div className="p-3 border border-purple-50 bg-purple-50/10 rounded-xl flex items-start gap-2.5">
                <Activity className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-900 font-bold block">Critical Illness Rider Included</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">Covers 34 major critical illnesses with an accelerated payout setup.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions grid */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center gap-3">
            <button onClick={() => navigate(`/lead-management/generate-quote/${leadId}`)} className="w-full sm:w-auto h-10 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
              <Edit className="w-3.5 h-3.5" /><span>Edit Parameters</span>
            </button>
            <button onClick={() => showToast('Draft cached in sales pipeline.')} className="w-full sm:w-auto h-10 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
              <Save className="w-3.5 h-3.5" /><span>Save Draft</span>
            </button>
            <button onClick={() => showToast('Quote shared with client via Email & WhatsApp!')} className="w-full sm:w-auto h-10 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
              <Share2 className="w-3.5 h-3.5" /><span>Share Quote</span>
            </button>
          </div>
        </div>

        {/* Right Column: Actuarial Cost Card & Decision panel */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b pb-2">Actuarial Cost Card</h3>
            <div className="space-y-3.5 text-xs font-semibold text-slate-600">
              <div className="flex justify-between"><span>Base premium ({quoteParams.policyType})</span><span className="font-bold text-slate-900">₹{quoteParams.basePremium?.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Riders cost</span><span className="font-bold text-slate-900">₹0</span></div>
              <div className="flex justify-between"><span>GST / Taxes (18%)</span><span className="font-bold text-slate-900">₹{quoteParams.taxAmount?.toLocaleString('en-IN')}</span></div>
              <div className="pt-2.5 border-t border-dashed border-slate-200 flex justify-between text-slate-900 font-black text-sm">
                <span>Total Payable</span>
                <span className="text-[#0B1F5B] text-base font-black">₹{quoteParams.totalPayable?.toLocaleString('en-IN')}/{quoteParams.premiumFrequency.toLowerCase() === 'annual' ? 'yr':'mo'}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0B1F5B] text-white rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-blue-200 tracking-wider">Customer Acceptance Choice</h3>
            <p className="text-[11px] text-blue-100 font-medium leading-relaxed">
              Before proceeding to the proposal intake form, clarify the customer's choice regarding the recommended premium breakdown.
            </p>
            <div className="space-y-2.5 pt-2">
              <button onClick={handleAcceptQuote} className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <Check className="w-4 h-4 text-emerald-100" />
                <span>Customer Accepts Quote</span>
              </button>
              <button onClick={handleRejectQuote} className="w-full h-11 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-500/20">
                <X className="w-4 h-4 text-rose-300" />
                <span>Customer Rejects Quote</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
