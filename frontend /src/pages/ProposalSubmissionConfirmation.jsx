// src/pages/ProposalSubmissionConfirmation.jsx
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext'; // Context binding
import { CheckCircle, ShieldCheck, ArrowRight, User, FileText, ArrowLeft } from 'lucide-react';

export default function ProposalSubmissionConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { masterLeadsData } = useLeads();

  // Extract any data pushed through the navigation router location descriptor state
  const routerStateLead = location.state?.leadData;

  // ==========================================================================
  // METRICS RESOLVER ENGINE
  // Matches the passing state object or hooks into the most recent ledger element
  // ==========================================================================
  const activeProfile = useMemo(() => {
    if (routerStateLead) return routerStateLead;

    // Fallback: Bind directly to the newest created profile row at index 0
    if (masterLeadsData && masterLeadsData.length > 0) {
      const latest = masterLeadsData[0];
      return {
        id: latest.id,
        fullName: latest.name,
        interest: latest.interest || 'Term Life',
        annualIncome: latest.annualIncome || '1800000',
        mobileNumber: latest.mobileNumber || '9876543210',
        email: latest.email || 'customer@email.com',
        gender: latest.gender || 'Male',
        dob: latest.dob || '1994-05-14',
        coverageAmount: latest.coverageAmount || '28500000'
      };
    }

    // Secondary default fallback matrix to prevent UI rendering dropouts
    return {
      id: '#LD-8924',
      fullName: 'Rahul Sharma',
      interest: 'Term Life',
      annualIncome: '1800000',
      mobileNumber: '9876543210',
      email: 'customer@email.com',
      gender: 'Male',
      dob: '1994-05-14',
      coverageAmount: '28500000'
    };
  }, [routerStateLead, masterLeadsData]);

  // Compute baseline chronological age parameters
  const resolvedAge = useMemo(() => {
    if (!activeProfile.dob) return '32 Yrs';
    const ageDiff = 2026 - new Date(activeProfile.dob).getFullYear();
    return ageDiff > 0 ? `${ageDiff} Yrs` : '32 Yrs';
  }, [activeProfile.dob]);

  // Formats currency string elements cleanly
  const displayIncome = useMemo(() => {
    const rawIncome = parseFloat(activeProfile.annualIncome);
    return !isNaN(rawIncome) ? `₹${rawIncome.toLocaleString('en-IN')}` : '₹18,00,000';
  }, [activeProfile.annualIncome]);

  const displayCoverage = useMemo(() => {
    const rawCoverage = parseFloat(activeProfile.coverageAmount);
    if (!isNaN(rawCoverage)) {
      if (rawCoverage >= 10000000) return `₹${(rawCoverage / 10000000).toFixed(2)} Crore`;
      return `₹${(rawCoverage / 100000).toFixed(2)} Lakh`;
    }
    return '₹2.85 Crore';
  }, [activeProfile.coverageAmount]);

  // Random placeholder numbers for specific structural confirmation values
  const proposalNumber = useMemo(() => `PR-${Math.floor(100000 + Math.random() * 900000)}`, []);
  const quoteNumber = useMemo(() => `QT-2026-${Math.floor(100000 + Math.random() * 900000)}`, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-16 w-full">
      
      {/* HEADER TOOLBAR */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-3xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/lead-management')} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-slate-900 tracking-tight text-2xl leading-none">Confirmation</h1>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider mt-1.5">Betacare Life Insurance Premier Underwriting Core</p>
          </div>
        </div>
      </header>

      {/* CORE GRID ARCHITECTURE FRAME */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN MODULE: METRIC SUMMARY SHEETS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SUCCESS BANNER PANEL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm border-l-4 border-l-emerald-500 flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-sm font-black text-emerald-700 uppercase tracking-wider leading-none">✓ Proposal Successfully Submitted</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">The policy parameters have been safely compiled into active core index queues.</p>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden text-xs font-semibold text-slate-500">
                <div className="grid grid-cols-3 border-b border-slate-100 p-2.5 bg-slate-50/50 uppercase text-[9px] text-slate-400"><span className="col-span-1">Metric Param</span><span className="col-span-2">Registered Ledger System Log</span></div>
                <div className="grid grid-cols-3 border-b border-slate-100 p-2.5"><span className="text-slate-400 font-medium">Proposal Number</span><span className="text-slate-900 font-mono font-bold">{proposalNumber}</span></div>
                <div className="grid grid-cols-3 border-b border-slate-100 p-2.5"><span className="text-slate-400 font-medium">Quote Number</span><span className="text-slate-900 font-mono font-bold">{quoteNumber}</span></div>
                <div className="grid grid-cols-3 border-b border-slate-100 p-2.5"><span className="text-slate-400 font-medium">Submission Timestamp</span><span className="text-slate-900 font-medium">17 Jun 2026, 1:31 PM</span></div>
                <div className="grid grid-cols-3 p-2.5"><span className="text-slate-400 font-medium">Insurer Core</span><span className="text-slate-900 font-bold">Betacare Life Underwriting Core</span></div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CUSTOMER SUMMARY CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 font-black text-[10px] text-[#0B1F5B] uppercase tracking-wider border-b pb-2">
              <User className="w-4 h-4 text-blue-500" />
              <span>Section 2: Customer Summary</span>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-hidden text-xs font-semibold text-slate-600 divide-y divide-slate-100">
              <div className="grid grid-cols-3 p-3"><span className="text-slate-400 font-medium">Customer Name</span><span className="text-slate-900 font-bold col-span-2">{activeProfile.fullName}</span></div>
              <div className="grid grid-cols-3 p-3"><span className="text-slate-400 font-medium">Age / Gender</span><span className="text-slate-900 font-medium col-span-2">{resolvedAge} / {activeProfile.gender}</span></div>
              <div className="grid grid-cols-3 p-3"><span className="text-slate-400 font-medium">Occupation Class</span><span className="text-slate-900 font-medium col-span-2">{activeProfile.occupation || 'Salaried Track'}</span></div>
              <div className="grid grid-cols-3 p-3"><span className="text-slate-400 font-medium">Annual Income</span><span className="text-[#0B1F5B] font-black col-span-2">{displayIncome}</span></div>
              <div className="grid grid-cols-3 p-3"><span className="text-slate-400 font-medium">Contact Registry</span><span className="text-slate-900 font-medium col-span-2">{activeProfile.mobileNumber} | {activeProfile.email}</span></div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN MODULE: SNAPSHOT DECK FLOATS */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* PROPOSAL SNAPSHOT CHIP BOX */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5 font-black text-[10px] text-slate-900 uppercase border-b pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Proposal Snapshot</span>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2">
              <div><span className="text-[9px] uppercase text-slate-400 font-bold block">Proposal Number</span><span className="text-slate-900 font-mono font-bold">{proposalNumber}</span></div>
              <div><span className="text-[9px] uppercase text-slate-400 font-bold block">Customer Name</span><span className="text-slate-900 font-bold truncate block">{activeProfile.fullName}</span></div>
              <div><span className="text-[9px] uppercase text-slate-400 font-bold block">Cover Amount</span><span className="text-slate-900 font-black text-xs block">{displayCoverage}</span></div>
              <div><span className="text-[9px] uppercase text-slate-400 font-bold block">Premium Target</span><span className="text-emerald-600 font-black text-xs block">₹23,840</span></div>
            </div>
          </div>

          {/* ADVISORY ACTION TRACKER CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-xs font-semibold text-slate-500">
            <div className="font-black text-[9px] text-slate-400 uppercase tracking-wider border-b pb-2">Advisory Action Tracker</div>
            <div className="space-y-1">
              <h4 className="text-slate-900 font-bold">Next Step: KYC Verification Pending</h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Expand verification modules to process compliance documentation scans.</p>
            </div>
            
            <button 
  type="button" 
  onClick={() => navigate('/lead-management/kyc-documents', { 
    state: { 
      leadData: activeProfile,
      activeLead: activeProfile,
      lead: activeProfile
    } 
  })}
  className="w-full h-10 bg-[#0B1F5B] hover:bg-black text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm focus:outline-none"
>
  <span>Proceed to KYC</span>
  <ArrowRight className="w-4 h-4" />
</button>
          </div>

        </div>

      </main>
    </div>
  );
}