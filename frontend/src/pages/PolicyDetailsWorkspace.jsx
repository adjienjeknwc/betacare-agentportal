// src/pages/PolicyDetailsWorkspace.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shield, User, Calendar, CreditCard, 
  FileText, CheckCircle2, AlertCircle, Clock, Activity, Check, RefreshCw
} from 'lucide-react';

export default function PolicyDetailsWorkspace() {
  const { policyId } = useParams();
  const navigate = useNavigate();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicyDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('agent_token');
        const res = await fetch(`/api/policies/${policyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-agent-role': localStorage.getItem('agent_role') || 'Sales Agent'
          }
        });
        const data = await res.json();
        if (data.success) {
          setPolicy(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (policyId) fetchPolicyDetails();
  }, [policyId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-slate-500 gap-2">
        <RefreshCw className="w-8 h-8 animate-spin text-[#0B1F5B]" />
        <span className="text-xs font-bold uppercase tracking-wider">Loading Policy Details...</span>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-slate-500 gap-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Policy Not Found</span>
        <button onClick={() => navigate('/policies')} className="px-4 py-2 bg-[#0B1F5B] text-white rounded-xl text-xs font-bold">Return to Policies Dashboard</button>
      </div>
    );
  }

  const issueDate = new Date(policy.policyCommencementDate);
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(issueDate.getFullYear() + 25); // Default 25 years term

  const timeline = [
    { step: 'Application Submitted', date: new Date(policy.createdAt).toLocaleDateString(), done: true },
    { step: 'KYC & Document Verification', date: new Date(policy.createdAt).toLocaleDateString(), done: true },
    { step: 'Underwriting Review Approved', date: new Date(policy.createdAt).toLocaleDateString(), done: true },
    { step: 'Premium Paid & Policy Issued', date: issueDate.toLocaleDateString(), done: true },
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-12 w-full">
      {/* Header Panel */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 w-full">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/policies')} 
            className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col items-start">
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[20px] leading-tight">
              Policy Workspace
            </h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[10px]">
              Managing ID: {policy.policyNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1.5 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {policy.policyStatus}
          </span>
        </div>
      </header>

      {/* Workspace Grid */}
      <main className="max-w-[1400px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column - Core Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Plan Overview Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#0F478D]" />
              <div>
                <h2 className="text-sm font-black text-[#0B1F5B] uppercase tracking-wider">Plan Architecture Overview</h2>
                <p className="text-[11px] text-slate-400 font-medium">Core policy parameters and underlying coverage metrics.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5 text-xs font-semibold">
              <div className="p-4 bg-slate-50/60 border border-slate-100 rounded-xl">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Selected Product Matrix</span>
                <span className="text-base font-black text-slate-900 block mt-1">{policy.planName}</span>
                <span className="text-slate-500 font-medium block mt-0.5">{policy.planType} Plan</span>
              </div>

              <div className="p-4 bg-slate-50/60 border border-slate-100 rounded-xl">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Total Face Valued Sum Assured</span>
                <span className="text-xl font-black text-[#0B1F5B] block mt-1">₹{policy.sumAssured.toLocaleString('en-IN')}</span>
                <span className="text-slate-400 font-medium block mt-0.5">Guaranteed Death & Health Benefit</span>
              </div>
            </div>

            {/* Metas Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs font-semibold">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Issue Anniversary</span>
                <span className="text-slate-900 block mt-1 font-bold">{issueDate.toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Maturity Horizon</span>
                <span className="text-slate-900 block mt-1 font-bold">{expiryDate.toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Premium Rate Card</span>
                <span className="text-slate-900 block mt-1 font-bold">₹{policy.totalAnnualPremium.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Frequency Mode</span>
                <span className="text-slate-900 block mt-1 font-bold">{policy.paymentFrequency}</span>
              </div>
            </div>
          </div>

          {/* Insured Entity Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <User className="w-5 h-5 text-[#0F478D]" />
              <div>
                <h2 className="text-sm font-black text-[#0B1F5B] uppercase tracking-wider">Policyholder Metadata</h2>
                <p className="text-[11px] text-slate-400 font-medium">Verified primary risk applicant entity details.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Full Name</span>
                <span className="text-slate-900 font-bold block mt-0.5">{policy.customerName}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Registration Code</span>
                <span className="text-slate-900 font-mono font-bold block mt-0.5">{policy.proposalNumber}</span>
              </div>
            </div>
          </div>

          {/* Riders Block */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-[#0F478D]" />
              <div>
                <h2 className="text-sm font-black text-[#0B1F5B] uppercase tracking-wider">Integrated Policy Riders</h2>
                <p className="text-[11px] text-slate-400 font-medium">Supplementary structural clause matrices added to core baseline asset.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {['Critical Illness Cover', 'Accidental Death Benefit', 'Premium Waiver'].map((rider, idx) => (
                <div key={idx} className="p-3 border border-blue-100 bg-blue-50/10 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0F478D] shrink-0" />
                  <span>{rider}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Audit Timeline */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[112px]">
          
          {/* Premium Financial Ledger Minimalist Callout */}
          <div className="bg-[#0B1F5B] text-white border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-blue-900/40 pb-2">
              <h4 className="text-[10px] font-black uppercase text-blue-200 tracking-wider">ANNUAL PREMIUM REMITTANCE</h4>
              <span className="text-2xl font-black text-white block mt-1">₹{policy.totalAnnualPremium.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-blue-200">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <span>Next billing due on: {new Date(policy.nextPremiumDueDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Lifecycle Execution Log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider border-b pb-2">Lifecycle Underwriting Log</h4>
            
            <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {timeline.map((log, index) => (
                <div key={index} className="flex gap-4 items-start relative text-xs text-left font-semibold">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 z-10 ${
                    log.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-400'
                  }`}>
                    {log.done ? <Check className="w-3 h-3 stroke-[3]" /> : <Clock className="w-3 h-3" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-bold">{log.step}</span>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">{log.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}