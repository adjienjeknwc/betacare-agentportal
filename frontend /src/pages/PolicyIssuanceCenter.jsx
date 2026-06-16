// src/pages/PolicyIssuanceCenter.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// ADDED 'Plus' INTO THE ICON LISTS TO RESOLVE THE VARIABLE LOG LOOKUP FAULT
import { 
  ArrowLeft, Download, Send, MessageSquare, ShieldCheck, CheckCircle2, 
  FileText, Clock, FileCheck, Smartphone, User, HelpCircle, Activity, LayoutDashboard, Plus
} from 'lucide-react';

export default function PolicyIssuanceCenter() {
  const navigate = useNavigate();
  const { policyId } = useParams();
  const [toastMessage, setToastMessage] = useState('');

  // 1. ANCHOR DATES TO CURRENT SYSTEM RUNTIME LIFECYCLE
  const currentDateString = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }, []);

  const nextPremiumDueDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6); // Set exactly 6 months out for Half-Yearly frequency parameters
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }, []);

  // 2. DYNAMIC BUSINESS OBJECT DATA LOOKUPS
  const clientSnapshot = {
    fullName: 'Alexander Thompson',
    age: 38,
    gender: 'Male',
    occupation: 'Software Engineer',
    annualIncome: '₹18,00,000',
    riskCategory: 'Standard Low-Risk Class'
  };

  const policyCoreData = {
    proposalNo: 'PR-987654',
    applicationNo: 'APP-2026-001234',
    policyNo: policyId || 'POL-2026-887654',
    insurer: 'ICICI Prudential',
    plan: 'iProtect Smart',
    sumAssured: '₹2.85 Crore',
    term: '35 Years',
    ppt: '20 Years',
    frequency: 'Half-Yearly',
    annualPremium: '₹23,840',
    basePremium: '₹16,500',
    riderPremium: '₹3,700',
    gst: '₹3,640',
    manager: 'Rohan Joshi (Senior Relationship Manager)',
    supportNumber: '1800-22-4232'
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-16 w-full max-w-full relative">
      
      {/* GLOBAL TOAST POPUP NOTIFIER */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#0B1F5B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 border border-blue-900 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* COMPACT DASHBOARD HEAD ROW */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-3xs w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/policies')} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[22px] leading-none">Policy Approved & Issued</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-1.5">
              All underwriting checks, medical reviews, KYC validations and compliance reviews have been completed successfully.
            </p>
          </div>
        </div>
      </header>

      {/* TWO COLUMN GRID MAIN DESK AREA */}
      <main className="flex-1 max-w-[1450px] w-full mx-auto px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT CANVAS REGISTRY PANEL */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* APPROVAL STATUS CARD IN PROFESSIONAL INSURANCE TABLES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-emerald-600 font-black text-xs uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Approval Status & Contract Identifiers</span>
            </div>
            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-xs text-slate-600 border-collapse">
                <tbody className="divide-y divide-slate-100 font-semibold">
                  <tr className="hover:bg-slate-50/30">
                    <td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black w-[35%]">Proposal Number</td>
                    <td className="p-2.5 text-slate-900 font-mono text-left w-[30%]">{policyCoreData.proposalNo}</td>
                    <td className="p-2.5 text-slate-400 text-[10px] uppercase font-black w-[20%]">Application No</td>
                    <td className="p-2.5 text-slate-900 font-mono text-right w-[15%]">{policyCoreData.applicationNo}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/30">
                    <td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Issued Policy Contract No</td>
                    <td className="p-2.5 text-[#0B1F5B] font-mono font-black text-left">{policyCoreData.policyNo}</td>
                    <td className="p-2.5 text-slate-400 text-[10px] uppercase font-black">Approval Date</td>
                    <td className="p-2.5 text-slate-900 font-bold text-right">{currentDateString}</td>
                  </tr>
                  <tr className="bg-emerald-50/20">
                    <td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Current Policy Status</td>
                    <td className="p-2.5 text-left">
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 font-black px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">Active</span>
                    </td>
                    <td className="p-2.5 text-slate-400 text-[10px] uppercase font-black">Decision Case</td>
                    <td className="p-2.5 text-emerald-600 font-black text-right uppercase text-[10px]">Approved</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* POLICY DETAILS DATA CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-[#0B1F5B] font-black text-xs uppercase tracking-wide">
              <FileCheck className="w-4 h-4 shrink-0" />
              <span>Policy Terms & Parameters Structure</span>
            </div>
            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-xs text-slate-600 border-collapse">
                <tbody className="divide-y divide-slate-100 font-semibold">
                  <tr className="hover:bg-slate-50/30">
                    <td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black w-[35%]">Sum Assured Risk Cap</td>
                    <td className="p-2.5 text-[#0B1F5B] font-black text-left w-[30%]">{policyCoreData.sumAssured}</td>
                    <td className="p-2.5 text-slate-400 text-[10px] uppercase font-black w-[20%]">Policy Coverage Term</td>
                    <td className="p-2.5 text-slate-900 font-bold text-right w-[15%]">{policyCoreData.term}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/30">
                    <td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Premium Payment Term PPT</td>
                    <td className="p-2.5 text-slate-900 text-left">{policyCoreData.ppt}</td>
                    <td className="p-2.5 text-slate-400 text-[10px] uppercase font-black">Collection Interval</td>
                    <td className="p-2.5 text-slate-900 font-extrabold text-right">{policyCoreData.frequency}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/30">
                    <td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Commencement Date</td>
                    <td className="p-2.5 text-slate-900 text-left">{currentDateString}</td>
                    <td className="p-2.5 text-slate-400 text-[10px] uppercase font-black">Next Due Date</td>
                    <td className="p-2.5 text-[#0B1F5B] font-black text-right">{nextPremiumDueDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* TWO COLUMN SUBGRID FOR RIDERS & BENEFITS SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* ACTIVE APPROVED RIDERS CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2.5">
              <span className="text-[10px] font-black uppercase text-[#0B1F5B] block border-b border-slate-100 pb-1.5">Approved Riders Ledger</span>
              <table className="w-full text-xs text-left text-slate-600 border-collapse">
                <thead>
                  <tr className="font-black text-[9px] text-slate-400 uppercase border-b tracking-wide">
                    <th className="pb-1">Rider Scheme</th>
                    <th className="pb-1 text-right">Apportioned Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  <tr><td className="py-2 text-slate-900">✓ Critical Illness Rider</td><td className="py-2 text-right text-[#0B1F5B]">₹2,100</td></tr>
                  <tr><td className="py-2 text-slate-900">✓ Accidental Death Benefit</td><td className="py-2 text-right text-[#0B1F5B]">₹1,600</td></tr>
                  <tr><td className="py-2 text-slate-900">✓ Waiver of Premium Rider</td><td className="py-2 text-right text-emerald-600 uppercase text-[9px] tracking-wide">Bundled</td></tr>
                </tbody>
              </table>
            </div>

            {/* BENEFITS SUMMARY CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2.5">
              <span className="text-[10px] font-black uppercase text-[#0B1F5B] block border-b border-slate-100 pb-1.5">Benefits Matrix Summary</span>
              <table className="w-full text-xs text-left text-slate-600 border-collapse">
                <thead>
                  <tr className="font-black text-[9px] text-slate-400 uppercase border-b tracking-wide">
                    <th className="pb-1">Benefit Clause</th>
                    <th className="pb-1 text-right">Fulfillment Metric</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  <tr><td className="py-2 text-slate-400 text-[10px] uppercase font-black">Death Benefit</td><td className="py-2 text-right text-slate-900 font-bold">{policyCoreData.sumAssured}</td></tr>
                  <tr><td className="py-2 text-slate-400 text-[10px] uppercase font-black">Tax Benefit Eligibility</td><td className="py-2 text-right text-slate-900">Section 80C & 10(10D)</td></tr>
                  <tr><td className="py-2 text-slate-400 text-[10px] uppercase font-black">Survival Benefit / ROP</td><td className="py-2 text-right text-slate-400">Not Applicable / No</td></tr>
                </tbody>
              </table>
            </div>

          </div>

          {/* POLICY DOCUMENT CENTER DOWNLOAD CHIPS ROW */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5">
            <span className="text-[10px] font-black uppercase text-slate-400 block border-b border-slate-100 pb-1.5 select-none">Policy Document Vault Center</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-bold select-none">
              {[
                { title: 'Official Policy Bond', doc: 'Policy_Bond_Signed.pdf' },
                { title: 'Proposal Attestation Form', doc: 'Proposal_Form_Ref.pdf' },
                { title: 'Premium Collection Receipt', doc: 'Remittance_Receipt.pdf' },
                { title: 'Medical Underwriting Summary', doc: 'Medical_SLA_Summary.pdf' },
                { title: 'Benefit Illustration Ledger', doc: 'Signed_Illustration.pdf' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 border rounded-xl bg-slate-50/50 flex flex-col justify-between h-20 items-start">
                  <div className="w-full truncate"><span className="text-slate-900 block truncate">{item.title}</span><span className="text-[10px] text-slate-400 font-mono font-medium block truncate mt-0.5">{item.doc}</span></div>
                  <button type="button" onClick={() => triggerToast(`Pushed file download stream buffer: ${item.doc}`)} className="text-[#0B1F5B] text-[11px] font-black flex items-center gap-0.5 hover:underline mt-1 focus:outline-none"><Download className="w-3 h-3" /><span>Download Document</span></button>
                </div>
              ))}
            </div>
            
            {/* VAULT DIGITAL TRANSMISSION INTERACTION HUB */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold select-none border-t border-slate-100 pt-3.5">
              <button type="button" onClick={() => triggerToast('Policy Welcome Kit payload compiled and downloaded.')} className="h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center gap-1.5"><Download className="w-3.5 h-3.5 text-slate-400" /><span>Download Welcome Kit</span></button>
              <button type="button" onClick={() => triggerToast('Dispatched complete document bundle via secure mail bridge nodes.')} className="h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center gap-1.5"><Send className="w-3.5 h-3.5 text-slate-400" /><span>Email Contract Bond</span></button>
              <button type="button" onClick={() => triggerToast('Hyperlink lookup trace string pushed to WhatsApp client.')} className="h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-slate-400" /><span>WhatsApp Copy</span></button>
            </div>
          </div>

          {/* POST ISSUANCE POLICY ADVISOR SERVICING CONTROLS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-black uppercase text-slate-400 block border-b border-slate-100 pb-1.5 select-none">Post-Issuance Core Policy Servicing Options</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold text-slate-700 select-none">
              {['Nominee Update', 'Address Change', 'Premium Certificate', 'Policy Servicing', 'Claim Intimation', 'Generate Reminder', 'Create Request'].map((action, i) => (
                <button key={i} type="button" onClick={() => triggerToast(`Initializing Servicing Workflow Subgrid: ${action}`)} className="h-9 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-center truncate px-2 focus:outline-none">
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* BOTTOM INTERACTION TERMINAL ROUTING ACTIONS FOOTER BAR */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5 select-none border-t border-slate-100">
            <button type="button" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto h-11 px-5 border border-slate-200 text-slate-600 bg-white font-bold text-xs rounded-xl hover:bg-slate-50 focus:outline-none">
              Return to Dashboard
            </button>
            <button type="button" onClick={() => navigate('/policies')} className="w-full sm:w-auto h-11 px-6 bg-[#0B1F5B] text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 focus:outline-none">
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>View Policy Dashboard</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN SIDEBAR CANVAS: MONITOR CHIPS & SNAPSHOT TRACES */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-[88px] text-left select-none">
          
          {/* POLICY SNAPSHOT PANEL MONITOR CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5 animate-fade-in">
            <div className="border-b border-slate-100 pb-1.5 flex items-center gap-1.5 text-[#0B1F5B]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <h4 className="text-[10px] font-black uppercase tracking-wider">Policy Snapshot</h4>
            </div>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs font-semibold text-slate-600">
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Policy Number</span><span className="text-[#0B1F5B] font-mono font-black block mt-0.5 truncate select-all">{policyCoreData.policyNo}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Underwriter Carrier</span><span className="text-black font-extrabold block mt-0.5 truncate">{policyCoreData.insurer}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Plan Product</span><span className="text-slate-900 font-bold block mt-0.5 truncate">{policyCoreData.plan}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Total Face Cover</span><span className="text-slate-900 font-bold block mt-0.5">{policyCoreData.sumAssured}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Premium Installment</span><span className="text-slate-900 font-black block mt-0.5">{policyCoreData.annualPremium}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Next Installment Due</span><span className="text-[#0B1F5B] font-black block mt-0.5">{nextPremiumDueDate}</span></div>
              <div className="col-span-2 border-t pt-2 mt-0.5"><span className="text-slate-400 text-[9px] uppercase block font-black">Contract Status</span><span className="text-emerald-600 font-black tracking-wide text-[10px] bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 mt-0.5 inline-block rounded uppercase">Active - Issued</span></div>
            </div>
          </div>

          {/* CUSTOMER PORTFOLIO DATA SNAPSHOT CARD CHIP */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2.5 animate-fade-in">
            <div className="border-b border-slate-100 pb-1.5 flex items-center gap-1.5 text-slate-400">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <h4 className="text-[10px] font-black uppercase tracking-wider">Customer Snapshot</h4>
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-1.5 text-xs font-semibold text-slate-600">
              <div><span className="text-slate-400 text-[9px] uppercase font-black block">Customer Name</span><span className="text-black font-bold block truncate">{clientSnapshot.fullName}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase font-black block">Age / Gender</span><span className="text-black font-bold block">{clientSnapshot.age} Yrs ({clientSnapshot.gender})</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase font-black block">Occupation Class</span><span className="text-slate-900 font-medium block truncate">{clientSnapshot.occupation}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase font-black block">Annual Revenue</span><span className="text-slate-900 font-bold block">{clientSnapshot.annualIncome}</span></div>
              <div className="col-span-2 border-t pt-1.5 mt-0.5"><span className="text-slate-400 text-[9px] uppercase font-black block">Assigned Risk Pool Category</span><span className="text-indigo-700 font-extrabold uppercase text-[10px] tracking-wide mt-0.5 block">{clientSnapshot.riskCategory}</span></div>
            </div>
          </div>

          {/* COMPREHENSIVE COMPLETED CHRONOLOGICAL POLICY TIMELINE LOG PANEL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 animate-fade-in text-xs font-semibold text-slate-600">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1">Policy Processing Milestone Timeline</span>
            <div className="space-y-2.5 relative pl-4 border-l border-slate-100 mt-1">
              {[
                { label: 'Proposal Submitted Successfully', sub: 'Transmitted from dynamic wizard step configurations.' },
                { label: 'KYC Evidence Verified & Checked', sub: 'PAN and central Aadhaar credentials parsed OK.' },
                { label: 'Medical Verification Completed', sub: 'Physical checkup metrics passed standard guidelines.' },
                { label: 'Underwriting Approved & Finalized', sub: 'Risk score parameters written to active pools.' },
                { label: 'Policy Issued & Welcome Kit Generated', sub: 'Permanent insurance bond created in system vault.' }
              ].map((step, idx) => (
                <div key={idx} className="relative space-y-0.5">
                  <span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100 flex items-center justify-center text-white text-[6px]"></span>
                  <span className="text-slate-900 font-bold block leading-tight text-[11px]">{step.label}</span>
                  <p className="text-slate-400 text-[10px] font-medium leading-normal">{step.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK LINKS INTERACTION CORES PANEL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2 text-xs font-bold text-slate-700 animate-fade-in select-none">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1.5 mb-1">Service Quick Links</span>
            <button type="button" onClick={() => triggerToast('Directing to Service Ticket Creation interface desk...')} className="w-full h-8 border border-slate-100 hover:bg-slate-50 rounded-lg bg-white px-2.5 text-left flex items-center gap-1.5 focus:outline-none"><Plus className="w-3.5 h-3.5 text-slate-400" /><span>Raise Service Request</span></button>
            <button type="button" onClick={() => triggerToast('Initiating direct secure outbound phone call patch... (1800-22-4232)')} className="w-full h-8 border border-slate-100 hover:bg-slate-50 rounded-lg bg-white px-2.5 text-left flex items-center gap-1.5 focus:outline-none"><Smartphone className="w-3.5 h-3.5 text-slate-400" /><span>Contact Customer Support</span></button>
          </div>

        </div>

      </main>

    </div>
  );
}