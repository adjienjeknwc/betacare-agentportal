// src/pages/ProposalSubmissionConfirmation.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Send, MessageSquare, ShieldCheck, CheckCircle2, 
  FileText, Clock, Smartphone, User, HelpCircle, Activity, Check, Upload, Award, Calendar,
  ShieldAlert, ChevronDown, Users, FileCheck, Wrench, Settings, LayoutDashboard, BarChart3
} from 'lucide-react';

export default function ProposalSubmissionConfirmation() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [kycNotes, setKycNotes] = useState('');
  const [savedNotesList, setSavedNotesList] = useState([]);
  
  // UI Display Multi-Step Control State Machine
  const [isKycExpanded, setIsKycExpanded] = useState(false);
  const [isMedicalExpanded, setIsMedicalExpanded] = useState(false);
  const [isTrackingExpanded, setIsTrackingExpanded] = useState(false);
  const [showUnderwriterModal, setShowUnderwriterModal] = useState(false);
  
  // Controls dynamic injection of the post-issuance detailed views (Step 15)
  const [isPolicyDetailsActive, setIsPolicyDetailsActive] = useState(false);
  const [showServiceRequestModal, setShowServiceRequestModal] = useState(false);

  // Scheduling Inputs State
  const [teleMerSlot, setTeleMerSlot] = useState('');
  const [diagnosticPartner, setDiagnosticPartner] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-06-16');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');

  // Core High-Fidelity Enterprise Insurance Definitions
  const activeQuote = {
    name: 'ICICI Prudential', plan: 'Term Life Protect Plus', sumAssured: '₹2.85 Crore',
    term: '35 Years', ppt: '20 Years', base: 16500, riders: 3700, gst: 3640, premium: 23840, csr: '98.9%'
  };

  const inheritedLeadData = {
    fullName: 'Rahul Sharma', age: 32, gender: 'Male', occupation: 'Salaried IT Professional', annualIncome: '1800000'
  };

  // State Management for Interactive In-Place Mock Document Uploads
  const [documentsState, setDocumentsState] = useState({
    panCard: null, aadhaarCard: null, aadhaarAddress: null, utilityBill: null,
    salarySlips: null, form16: null, itrDoc: null, customerPhoto: null, cancelledCheque: null
  });

  const [bankDetails] = useState({
    holderName: 'Rahul Sharma', bankName: 'HDFC Bank Ltd', accountNumber: '50100421298451', ifscCode: 'HDFC0000060'
  });

  const simulateDocumentUpload = (key) => {
    setDocumentsState(prev => ({ ...prev, [key]: `DOC_SCAN_${key.toUpperCase()}_SIGNED.pdf` }));
    triggerToast(`Document loaded into application vault successfully.`);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Dynamic Metrics for In-Line KYC Checklist Tracker
  const kycMetrics = useMemo(() => {
    const mandatoryKeys = ['panCard', 'aadhaarCard', 'aadhaarAddress', 'salarySlips', 'form16', 'customerPhoto', 'cancelledCheque'];
    let verifiedCount = 0;
    mandatoryKeys.forEach(k => { if (documentsState[k]) verifiedCount++; });
    return {
      completionPercentage: Math.round((verifiedCount / mandatoryKeys.length) * 100),
      isProceedEligible: verifiedCount === mandatoryKeys.length
    };
  }, [documentsState]);

  // Action Controllers for Section Transitions
  const handleProceedToKycSection = () => {
    setIsKycExpanded(true);
    triggerToast('Expanding Step 10: KYC & Document Verification...');
    setTimeout(() => { document.getElementById('step10-kyc-section')?.scrollIntoView({ behavior: 'smooth' }); }, 150);
  };

  const handleProceedToMedicalSection = () => {
    setIsMedicalExpanded(true);
    triggerToast('Expanding Step 12: Medical Scheduling Console...');
    setTimeout(() => { document.getElementById('step12-medical-section')?.scrollIntoView({ behavior: 'smooth' }); }, 150);
  };

  const handleConfirmScheduling = () => {
    if (!teleMerSlot || !diagnosticPartner) {
      triggerToast('Validation Guard: Please select both a Tele-MER slot and a Diagnostic Partner.');
      return;
    }
    setIsTrackingExpanded(true);
    triggerToast('Appointments confirmed. Transitioning to Step 13: Medical Tracking...');
    setTimeout(() => { document.getElementById('step13-tracking-section')?.scrollIntoView({ behavior: 'smooth' }); }, 150);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-16 w-full max-w-full relative">
      
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#0B1F5B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 border border-blue-900 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* DEDICATED INTERACTIVE DRAWER MODAL: SERVICE REQUEST TYPES */}
      {showServiceRequestModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="border-b pb-2 flex justify-between items-center">
              <h3 className="text-sm font-black text-[#0B1F5B] uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-[#0B1F5B]" />
                <span>Service Request Types</span>
              </h3>
              <button type="button" onClick={() => setShowServiceRequestModal(false)} className="text-slate-400 hover:text-black font-black text-sm p-1">✕</button>
            </div>
            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              {[
                'Address Change',
                'Nominee Change',
                'Contact Update',
                'Premium Certificate',
                'Policy Reinstatement',
                'Duplicate Policy Bond'
              ].map((requestType, idx) => (
                <button 
                  key={idx} 
                  type="button" 
                  onClick={() => { setShowServiceRequestModal(false); triggerToast(`Service request workflow opened: ${requestType}`); }}
                  className="w-full text-left p-3 border rounded-xl hover:bg-slate-50 transition-colors text-slate-950 font-bold flex items-center justify-between group"
                >
                  <span>• {requestType}</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-[#0B1F5B] font-black uppercase tracking-wider transition-colors">Open Case →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS CRITICAL UNDERWRITER APPROVAL OVERLAY MODAL */}
      {showUnderwriterModal && !isPolicyDetailsActive && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-scale-up">
            <div className="w-16 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Underwriting Assessment Passed</h3>
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 font-mono font-black text-[10px] px-2 py-0.5 rounded tracking-wide uppercase inline-block mt-1">
                Status: Policy Formally Approved & Issued
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-md mx-auto">
              All dynamic checks, physical blood profile results, and tele-MER logs have cleared corporate compliance. The active contract <span className="font-mono font-bold text-slate-800">POL-2026-887654</span> has been safely created.
            </p>
            <div className="pt-3 flex gap-2 justify-center text-xs font-bold w-full">
              <button type="button" onClick={() => setShowUnderwriterModal(false)} className="px-4 py-2 border rounded-xl text-slate-700 w-1/2">Review Logs</button>
              <button 
                type="button" 
                onClick={() => { setIsPolicyDetailsActive(true); triggerToast('Opening Step 15: Policy Details...'); }} 
                className="px-5 py-2 bg-[#0B1F5B] text-white rounded-xl hover:bg-black transition-colors w-1/2"
              >
                Policies → Policy Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER LOGIC SWITCH: STEP 15 POLICY DETAILS ACTIVE VIEW */}
      {isPolicyDetailsActive ? (
        <div className="flex-1 flex flex-col">
          
          <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-3xs w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setIsPolicyDetailsActive(false)} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="font-black text-[22px] text-[#0B1F5B] tracking-tight leading-none">Policy Details</h1>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-1.5">Post-Issuance Core Operations Hub</p>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-[1450px] w-full mx-auto px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-fade-in">
            
            {/* LEFT COLUMN DETAILS SUMMARY CARDS */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
              
              {/* HERO POLICY HEADER STATUS BAR */}
              <div className="border border-indigo-100 bg-indigo-50/20 p-4 rounded-xl flex justify-between items-center select-none text-left">
                <div>
                  <span className="text-slate-400 text-[9px] uppercase font-black tracking-wider block">Policy Number</span>
                  <span className="text-[#0B1F5B] font-mono font-black text-lg block mt-0.5">POL-2026-887654</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase font-black tracking-wider block">Status</span>
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-[10px] font-black tracking-wide uppercase px-2 py-0.5 rounded block mt-1">Active</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[9px] uppercase font-black tracking-wider block">Issued Date</span>
                  <span className="text-slate-900 font-bold block mt-0.5">15 Jun 2026</span>
                </div>
              </div>

              {/* CUSTOMER INFORMATION CARD SECTION */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b pb-1">Customer Information</span>
                <div className="border rounded-xl overflow-hidden bg-white w-full">
                  <table className="w-full text-xs text-left text-slate-600 border-collapse font-semibold">
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black w-[35%]">Customer Name</td><td className="p-2.5 text-black font-bold">{inheritedLeadData.fullName}</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">DOB</td><td className="p-2.5 text-slate-900">14 May 1994</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Mobile Number</td><td className="p-2.5 text-slate-900 font-mono">+91 9876543210</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Email</td><td className="p-2.5 text-slate-900 font-mono">customer@email.com</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Address</td><td className="p-2.5 text-slate-700 leading-relaxed">7224 Oak Creek Terrace, Mumbai, MH 400001</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ESSENTIAL COMPREHENSIVE POLICY INFORMATION CARD */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b pb-1">Policy Information</span>
                <div className="border rounded-xl overflow-hidden bg-white w-full">
                  <table className="w-full text-xs text-left text-slate-600 border-collapse font-semibold">
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black w-[35%]">Product Name</td><td className="p-2.5 text-[#0B1F5B] font-extrabold">{activeQuote.plan}</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Policy Term</td><td className="p-2.5 text-slate-900">{activeQuote.term}</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Premium Paying Term</td><td className="p-2.5 text-slate-900">{activeQuote.ppt}</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Sum Assured</td><td className="p-2.5 text-[#0B1F5B] font-black text-xs">{activeQuote.sumAssured}</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Premium Amount</td><td className="p-2.5 text-slate-900 font-black">₹23,840</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Premium Frequency</td><td className="p-2.5 text-indigo-700 font-extrabold">Half-Yearly</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Policy Start Date</td><td className="p-2.5 text-slate-900 font-mono">15 Jun 2026</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Policy End Date</td><td className="p-2.5 text-slate-900 font-mono">15 Jun 2061</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* NOMINEE INFORMATION DATA CARD */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b pb-1">Nominee Information</span>
                <div className="border rounded-xl overflow-hidden bg-white w-full">
                  <table className="w-full text-xs text-left text-slate-600 border-collapse font-semibold">
                    <thead>
                      <tr className="bg-slate-50 font-black text-[9px] text-slate-400 uppercase border-b tracking-wider">
                        <th className="p-2.5 pl-4 w-[35%]">Nominee Name</th>
                        <th className="p-2.5 w-[25%]">Relationship</th>
                        <th className="p-2.5 w-[20%]">Date of Birth</th>
                        <th className="p-2.5 text-right pr-4 w-[20%]">Nominee Share %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      <tr>
                        <td className="p-2.5 pl-4 text-slate-900 font-bold">Sunita Sharma</td>
                        <td className="p-2.5 text-slate-700">Spouse</td>
                        <td className="p-2.5 text-slate-600 font-mono">22 Nov 1996</td>
                        <td className="p-2.5 text-right pr-4 text-[#0B1F5B] font-black">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* COMPREHENSIVE POLICY DOCUMENTS SECURE CARD */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider select-none">Policy Documents</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold select-none">
                  {[
                    { label: "Policy Bond PDF" }, { label: "Premium Receipt" },
                    { label: "Proposal Form" }, { label: "Benefit Illustration" },
                    { label: "Medical Reports" }, { label: "KYC Documents" }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-2.5 border rounded-xl bg-slate-50/50 flex items-center justify-between gap-3">
                      <span className="text-slate-900 block truncate font-bold text-[11px]">{doc.label}</span>
                      <div className="flex gap-2 shrink-0">
                        <button type="button" onClick={() => triggerToast(`Opening continuous viewer channel for ${doc.label}...`)} className="text-[#0B1F5B] font-black hover:underline text-[11px]">View</button>
                        <button type="button" onClick={() => triggerToast(`Initiating target download payload...`)} className="text-slate-500 font-medium hover:underline text-[11px]">Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT LIFECYCLE TIMELINE TIMELINE GRAPH PANEL */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-[74px] text-left select-none">
              
              {/* REALISTIC CHRONOLOGICAL TIMELINE CHIP */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 text-xs font-semibold text-slate-600">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1">Policy Timeline</span>
                <div className="space-y-2.5 relative pl-4 border-l border-slate-100 mt-1 font-bold text-[11px]">
                  <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"></span><span className="text-emerald-700 block">✓ Lead Created</span></div>
                  <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"></span><span className="text-emerald-700 block">✓ Quote Generated</span></div>
                  <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"></span><span className="text-emerald-700 block">✓ Proposal Submitted</span></div>
                  <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"></span><span className="text-emerald-700 block">✓ KYC Completed</span></div>
                  <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"></span><span className="text-emerald-700 block">✓ Medical Completed</span></div>
                  <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"></span><span className="text-emerald-700 block">✓ Underwriting Approved</span></div>
                  <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"></span><span className="text-emerald-700 block">✓ Payment Received</span></div>
                  <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"></span><span className="text-emerald-700 block">✓ Policy Issued</span></div>
                </div>
              </div>

              {/* QUICK POST-ISSUANCE ACTIONS BARS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2.5 text-xs font-semibold text-slate-600">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1">Quick Actions</span>
                <div className="space-y-1.5 font-bold text-[11px]">
                <button 
      type="button" 
      onClick={() => { 
        setIsPolicyDetailsActive(false); 
        triggerToast('Navigating back to Active Policy Dashboard panel...'); 
      }} 
      className="w-full h-10 px-3 border rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex flex-col items-center justify-center text-center transition-all focus:outline-none leading-tight py-1"
    >
      <div className="flex items-center gap-1.5 justify-center">
        <Send className="w-3.5 h-3.5 text-slate-400 rotate-45 shrink-0" />
        <span className="text-[10px] tracking-tight uppercase font-black text-slate-600 block">
          return to active policy dashboard
        </span>
      </div>
    </button>
                 
                </div>
              </div>

            </div>

          </main>
        </div>
      ) : (
        
        // STANDARD PROPOSAL SUBMISSION SYSTEM WITH FULL DETAIL SECTIONS 1-9 MANIFEST RESTORED
        <div className="flex-1 flex flex-col text-left">
          
          <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-3xs w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => navigate(-1)} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="font-black text-[22px] text-[#0B1F5B] tracking-tight leading-none">Proposal Submission Confirmation</h1>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-1.5">ABCD Life Insurance Premier Underwriting Core</p>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-[1450px] w-full mx-auto px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            <div className="lg:col-span-8 space-y-6">
              
              {/* SECTION 1: SUBMISSION SYSTEM METRIC STATUS HEADER CARD */}
              <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-5 shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-black text-emerald-900 uppercase tracking-wider">✓ Proposal Successfully Submitted</h3>
                  <div className="border border-emerald-100/60 rounded-xl overflow-hidden bg-white mt-2">
                    <table className="w-full text-xs font-semibold text-slate-600 border-collapse">
                      <tbody className="divide-y divide-slate-100">
                        <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black w-[35%]">Proposal Number</td><td className="p-2.5 text-black font-mono font-bold text-left">PR-987654</td></tr>
                        <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Quote Number</td><td className="p-2.5 text-black font-mono font-bold text-left">QT-2026-001245</td></tr>
                        <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Submission Timestamp</td><td className="p-2.5 text-slate-900 text-left">12 Jun 2026, 2:05 PM</td></tr>
                        <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Insurer</td><td className="p-2.5 text-[#0B1F5B] font-extrabold text-left">{activeQuote.name}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DETAILED CUSTOMER SUMMARY CARD */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1.5">Section 2: Customer Summary</span>
                <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-xs font-semibold text-slate-600 border-collapse">
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black w-[35%]">Customer Name</td><td className="p-2.5 text-black font-bold text-left">{inheritedLeadData.fullName}</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Age / Gender</td><td className="p-2.5 text-black text-left">32 Yrs / Male</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Occupation Class</td><td className="p-2.5 text-slate-900 font-medium text-left">{inheritedLeadData.occupation}</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Annual Income</td><td className="p-2.5 text-slate-900 font-bold text-left">₹18,00,000</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Contact Registry</td><td className="p-2.5 text-slate-500 text-left">98XXXXXXX | customer@email.com</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 3: DETAILED POLICY SUMMARY CARD */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1.5">Section 3: Policy Summary</span>
                <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-xs font-semibold text-slate-600 border-collapse">
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black w-[35%]">Product Blueprint</td><td className="p-2.5 text-black font-bold text-left w-[65%]">{activeQuote.plan}</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Sum Assured Cover</td><td className="p-2.5 text-[#0B1F5B] font-black text-left">{activeQuote.sumAssured}</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Policy Term / PPT</td><td className="p-2.5 text-slate-900 font-medium text-left">{activeQuote.term} / {activeQuote.ppt}</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">Frequency</td><td className="p-2.5 text-slate-900 font-medium text-left">Half-Yearly</td></tr>
                      <tr><td className="p-2.5 pl-4 text-slate-400 text-[10px] uppercase font-black">CSR Score</td><td className="p-2.5 text-emerald-600 font-black text-left">{activeQuote.csr}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SPLIT GRIDS: SECTION 4 & SECTION 5 RESTORED */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SECTION 4: PREMIUM SUMMARY */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
                  <span className="text-[10px] font-black uppercase text-[#0B1F5B] block border-b pb-1">Section 4: Premium Summary</span>
                  <table className="w-full text-xs font-semibold text-slate-600 border-collapse">
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="py-2 text-slate-400 text-[10px] uppercase">Base Premium</td><td className="py-2 font-bold text-slate-900 text-right">₹16,500</td></tr>
                      <tr><td className="py-2 text-slate-400 text-[10px] uppercase">Rider Premium</td><td className="py-2 font-bold text-slate-900 text-right">₹3,700</td></tr>
                      <tr><td className="py-2 text-slate-400 text-[10px] uppercase">GST (18%)</td><td className="py-2 font-bold text-slate-900 text-right">₹3,640</td></tr>
                      <tr className="bg-slate-50"><td className="p-2 font-black text-black">Total Premium</td><td className="p-2 font-black text-[#0B1F5B] text-right">₹23,840</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* SECTION 5: SELECTED RIDERS */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
                  <span className="text-[10px] font-black uppercase text-[#0B1F5B] block border-b pb-1">Section 5: Selected Riders</span>
                  <table className="w-full text-xs font-semibold text-slate-600 border-collapse">
                    <thead><tr className="text-[9px] font-black text-slate-400 uppercase border-b"><th className="pb-1 text-left">Rider Benefit</th><th className="pb-1 text-right">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="py-2 text-slate-800">Critical Illness Rider</td><td className="py-2 text-right text-emerald-600 font-bold">✓ Active</td></tr>
                      <tr><td className="py-2 text-slate-800">Accidental Death Benefit</td><td className="py-2 text-right text-emerald-600 font-bold">✓ Active</td></tr>
                      <tr><td className="py-2 text-slate-800">Waiver of Premium</td><td className="py-2 text-right text-emerald-600 font-bold">✓ Active</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 6: GENERATED DOCUMENTS VAULT RESTORED */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <span className="text-[10px] font-black uppercase text-slate-400 block border-b border-slate-100 pb-1.5 select-none">Section 6: Generated Documents Vault</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-bold select-none">
                  {[
                    { title: 'Proposal Form', status: 'Generated' },
                    { title: 'Quote PDF Document', status: 'Generated' },
                    { title: 'Benefit Illustration', status: 'Generated' },
                    { title: 'Consent Form Signature', status: 'Generated' },
                    { title: 'Application Summary', status: 'Generated' }
                  ].map((item, index) => (
                    <div key={index} className="p-2.5 border rounded-xl bg-slate-50/40 flex items-center justify-between gap-3">
                      <div className="truncate"><span className="text-slate-900 block truncate">{item.title}</span><span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">✓ {item.status}</span></div>
                      <button type="button" onClick={() => triggerToast(`Downloaded ${item.title}`)} className="text-[#0B1F5B] text-[11px] font-black hover:underline shrink-0 focus:outline-none">Download</button>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold select-none border-t border-slate-50 pt-3">
                  <button type="button" onClick={() => triggerToast('Proposal contract files generated.')} className="h-9 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1">Download Proposal</button>
                  <button type="button" onClick={() => triggerToast('Dispatched email buffers.')} className="h-9 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1 text-slate-700"><Send className="w-3.5 h-3.5 text-slate-400" /><span>Email Documents</span></button>
                  <button type="button" onClick={() => triggerToast('Linked to WhatsApp Client API.')} className="h-9 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1 text-slate-700"><MessageSquare className="w-3.5 h-3.5 text-slate-400" /><span>WhatsApp Documents</span></button>
                </div>
              </div>

              {/* IN-PLACE SECTIONS DISPATCH ACCESSIBLE TRIGGER STRIP */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between select-none">
                <span className="text-xs font-semibold text-slate-500">Advance down to register customer document verification checklist tokens:</span>
                <button type="button" onClick={handleProceedToKycSection} className="h-10 px-5 bg-[#0B1F5B] text-white font-black text-xs rounded-xl hover:bg-black transition-colors">Proceed to KYC →</button>
              </div>

              {/* ==========================================================================
                 STEP 10 — KYC DATA VERIFICATION MATRIX INLINE TABLE
                 ========================================================================== */}
              {isKycExpanded && (
                <div id="step10-kyc-section" className="bg-white border-2 border-indigo-100 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in scroll-mt-20">
                  <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b pb-1.5">Step 10 — KYC & Document Verification Matrix</span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white w-full">
                    <table className="w-full text-xs text-left text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50 font-black text-[9px] text-slate-400 uppercase border-b tracking-wider">
                          <th className="p-2.5 pl-4 w-[50%]">Evidence Document Requirement</th>
                          <th className="p-2.5 w-[25%]">Fulfillment Tracking Status</th>
                          <th className="p-2.5 text-center w-[25%]">Action Channel</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-[11px]">
                        {[
                          { key: 'panCard', label: 'PAN Card Proof *' },
                          { key: 'aadhaarCard', label: 'Aadhaar Identity Card *' },
                          { key: 'aadhaarAddress', label: 'Aadhaar Address Print Match *' },
                          { key: 'salarySlips', label: 'Salary Slips (3 Months) *' },
                          { key: 'form16', label: 'Form 16 Certificate Assessment *' },
                          { key: 'customerPhoto', label: 'Customer Photograph Evidence *' },
                          { key: 'cancelledCheque', label: 'Bank Cancelled Cheque *' }
                        ].map((doc) => (
                          <tr key={doc.key} className="hover:bg-slate-50/40">
                            <td className="p-2.5 pl-4 text-slate-900 font-bold">{doc.label}</td>
                            <td className="p-2.5">{documentsState[doc.key] ? <span className="text-emerald-700 font-black">✓ Verified</span> : <span className="text-amber-600 font-black">Pending Upload</span>}</td>
                            <td className="p-2.5 text-center"><button type="button" onClick={() => simulateDocumentUpload(doc.key)} className="h-7 px-2.5 border bg-white rounded-lg font-bold text-slate-700 hover:bg-slate-50 select-none">Upload</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Section 9 — Agent KYC Notes</span>
                    <textarea rows="2" value={kycNotes} onChange={(e) => setKycNotes(e.target.value)} placeholder="Pin verification notes (e.g. Customer uploaded salary slips...)" className="w-full bg-slate-50 border rounded-xl p-2 text-xs outline-none focus:bg-white" />
                    <button type="button" onClick={() => { if(kycNotes.trim()) { setSavedNotesList([kycNotes, ...savedNotesList]); setKycNotes(''); triggerToast('KYC note successfully saved.'); } }} className="h-7 px-3 bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-lg">Save Note</button>
                  </div>

                  <div className="pt-3 border-t flex justify-end">
                    <button type="button" onClick={handleProceedToMedicalSection} className="h-10 px-6 bg-black hover:bg-[#0B1F5B] text-white font-black text-xs rounded-xl transition-colors">Complete KYC & Proceed to Medical →</button>
                  </div>
                </div>
              )}

              {/* ==========================================================================
                 STEP 12 — MEDICAL SCHEDULING CONSOLE WORKSPACE
                 ========================================================================== */}
              {isMedicalExpanded && (
                <div id="step12-medical-section" className="bg-white border-2 border-indigo-100 rounded-2xl p-5 shadow-sm space-y-5 animate-fade-in scroll-mt-20">
                  <div className="border-b border-slate-100 pb-2 flex justify-between items-baseline">
                    <div>
                      <h2 className="text-base font-black text-[#0B1F5B] tracking-tight">Step 12 — Medical Requirements & Scheduling</h2>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Application #APP-2026-887654 | Customer: {inheritedLeadData.fullName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="border rounded-xl p-4 space-y-3 bg-slate-50/20">
                      <h4 className="text-xs font-black text-[#0B1F5B] uppercase tracking-wider">Tele-MER</h4>
                      {['16 Jun 2026 - 10:00 AM', '16 Jun 2026 - 02:00 PM'].map((slot) => (
                        <label key={slot} className="flex items-center gap-2 p-2 bg-white border rounded-lg cursor-pointer">
                          <input type="radio" checked={teleMerSlot === slot} onChange={() => setTeleMerSlot(slot)} name="teleMerGroup" className="text-[#0B1F5B] h-3.5 w-3.5" />
                          <span className="text-xs font-bold">{slot}</span>
                        </label>
                      ))}
                    </div>
                    <div className="border rounded-xl p-4 space-y-3 bg-slate-50/20">
                      <h4 className="text-xs font-black text-[#0B1F5B] uppercase tracking-wider">Diagnostic Center Appointment</h4>
                      {['HealthCare Labs', 'MedPlus Diagnostics'].map((partner) => (
                        <label key={partner} className="flex items-center gap-2 p-2 bg-white border rounded-lg cursor-pointer">
                          <input type="radio" checked={diagnosticPartner === partner} onChange={() => setDiagnosticPartner(partner)} name="diagPartnerGroup" className="text-[#0B1F5B] h-3.5 w-3.5" />
                          <span className="text-xs font-bold">{partner}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border border-dashed border-amber-200 bg-amber-50/20 rounded-xl text-[11px] font-semibold text-amber-900 space-y-1 select-none">
                    <span className="font-black text-[10px] uppercase block text-amber-950 mb-0.5">Medical Instructions Card</span>
                    <p>• Fast for 8–10 hours before blood test</p>
                    <p>• Carry valid government identity docs (PAN/Aadhaar)</p>
                  </div>

                  <div className="pt-3 border-t flex justify-end">
                    <button type="button" onClick={handleConfirmScheduling} className="h-11 px-6 bg-[#0B1F5B] hover:bg-black text-white font-black text-xs rounded-xl shadow-md transition-all">Confirm Scheduling</button>
                  </div>
                </div>
              )}

              {/* ==========================================================================
                 STEP 13 — MEDICAL REQUIREMENTS TRACKING HOOK CENTER
                 ========================================================================== */}
              {isTrackingExpanded && (
                <div id="step13-tracking-section" className="bg-white border-2 border-emerald-100 rounded-2xl p-5 shadow-md space-y-5 animate-fade-in scroll-mt-20 text-left">
                  <div className="border-b pb-2">
                    <h3 className="text-base font-black text-emerald-900 tracking-tight">Step 13 — Medical Tracking</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Live tracking dashboard processing diagnostic report files from lab partners.</p>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs w-full">
                    <table className="w-full text-xs text-left text-slate-600 border-collapse">
                      <tbody className="divide-y divide-slate-100 font-semibold text-[11px]">
                        <tr className="bg-emerald-50/20"><td className="p-2.5 pl-4 text-emerald-900 font-bold">Tele-MER:</td><td className="p-2.5 text-center text-emerald-700 font-black flex items-center justify-center gap-1">Completed ✓</td></tr>
                        <tr className="bg-emerald-50/20"><td className="p-2.5 pl-4 text-emerald-900 font-bold">Blood Test:</td><td className="p-2.5 text-center text-emerald-700 font-black flex items-center justify-center gap-1">Completed ✓</td></tr>
                        <tr className="bg-emerald-50/20"><td className="p-2.5 pl-4 text-emerald-900 font-bold">Reports Received</td><td className="p-2.5 text-center text-emerald-700 font-black flex items-center justify-center gap-1">Completed ✓</td></tr>
                        <tr><td className="p-2.5 pl-4 text-slate-500 font-medium">Medical Status:</td><td className="p-2.5 text-center text-amber-600 font-black uppercase text-[10px] tracking-wide animate-pulse">Awaiting Underwriting Review</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-4 border-t flex justify-end select-none">
                    <button type="button" onClick={() => setShowUnderwriterModal(true)} className="h-11 px-8 bg-emerald-600 hover:bg-black text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-white shrink-0" />
                      <span>Submit for Underwriting Review</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN SIDEBAR SUMMARY CANVAS PANEL */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-[74px] text-left select-none">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
                <div className="border-b border-slate-100 pb-1.5 flex items-center gap-1.5 text-[#0B1F5B]"><ShieldCheck className="w-4 h-4 shrink-0" /><h4>Proposal Snapshot</h4></div>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs font-semibold text-slate-600">
                  <div><span className="text-slate-400 text-[9px] uppercase block font-black">Proposal Number</span><span className="text-black font-mono font-bold block mt-0.5">PR-987654</span></div>
                  <div><span className="text-slate-400 text-[9px] uppercase block font-black">Customer Name</span><span className="text-black font-bold block mt-0.5 truncate">{inheritedLeadData.fullName}</span></div>
                  <div><span className="text-slate-400 text-[9px] uppercase block font-black">Cover Amount</span><span className="text-[#0B1F5B] font-bold block mt-0.5">{activeQuote.sumAssured}</span></div>
                  <div><span className="text-slate-400 text-[9px] uppercase block font-black">Premium Amount</span><span className="text-[#0B1F5B] font-black block mt-0.5">₹23,840</span></div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2 select-none">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1.5 mb-1">Advisory Action Tracker</span>
                <div className="text-slate-500 text-xs font-semibold leading-normal mb-2">Next Step: KYC Verification Pending. Expand verification modules to log evidence scans.</div>
                <button type="button" onClick={isKycExpanded ? handleProceedToMedicalSection : handleProceedToKycSection} className="w-full h-10 bg-[#0B1F5B] hover:bg-black text-white font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 focus:outline-none">
                  <span>{isKycExpanded ? "Proceed to Medical Scheduling →" : "Proceed to KYC →"}</span>
                </button>
              </div>
            </div>

          </main>
        </div>
      )}

    </div>
  );
}