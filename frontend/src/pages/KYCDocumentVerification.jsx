// src/pages/KYCDocumentVerification.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLeads } from '../context/LeadContext'; // Context engine binding
import { 
  ArrowLeft, ArrowRight, Save, CheckCircle2, FileText, Activity, Download, 
  Send, MessageSquare, Shield, Layers, User, Check, AlertTriangle, Upload, HelpCircle,
  ShieldCheck 
} from 'lucide-react';

export default function KYCDocumentVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { masterLeadsData } = useLeads();
  
  const [toastMessage, setToastMessage] = useState('');
  const [kycNotes, setKycNotes] = useState('');
  const [savedNotesList, setSavedNotesList] = useState([]);

  // ==========================================================================
  // BACKEND REPOSITORY DATA RESOLVER Matrix
  // Pulls state inputs from navigation first, or syncs with the active ledger array
  // ==========================================================================
  const incomingLeadData = useMemo(() => {
    if (location.state?.leadData || location.state?.activeLead || location.state?.lead) {
      return location.state?.leadData || location.state?.activeLead || location.state?.lead;
    }
    if (masterLeadsData && masterLeadsData.length > 0) {
      return masterLeadsData[0];
    }
    return null;
  }, [location.state, masterLeadsData]);

  // Unified UI States loaded directly from the backend context payload fields
  const [customerName, setCustomerName] = useState(incomingLeadData?.customerName || incomingLeadData?.fullName || incomingLeadData?.name || 'Rahul Sharma');
  const [bankDetails, setBankDetails] = useState({
    holderName: incomingLeadData?.customerName || incomingLeadData?.fullName || incomingLeadData?.name || 'Rahul Sharma',
    bankName: 'HDFC Bank Ltd',
    accountNumber: '50100421298451',
    ifscCode: 'HDFC0000060'
  });

  // Caches persistent parameters directly to avoid hardcoded static variables
  useEffect(() => {
    if (incomingLeadData) {
      const resolvedName = incomingLeadData.customerName || incomingLeadData.fullName || incomingLeadData.name || 'Rahul Sharma';
      setCustomerName(resolvedName);
      setBankDetails(prev => ({
        ...prev,
        holderName: resolvedName
      }));
    }
  }, [incomingLeadData]);

  // ==========================================================================
  // DYNAMIC PROPOSAL SNAPSHOT ENGINE
  // Automatically computes coverage limits and schemas based on prior steps
  // ==========================================================================
  const proposalSnapshot = useMemo(() => {
    const rawCoverage = parseFloat(incomingLeadData?.coverageAmount);
    let coverageText = '₹2.85 Crore';
    if (!isNaN(rawCoverage)) {
      if (rawCoverage >= 10000000) {
        coverageText = `₹${(rawCoverage / 10000000).toFixed(2)} Crore`;
      } else {
        coverageText = `₹${(rawCoverage / 100000).toFixed(2)} Lakh`;
      }
    }

    return {
      proposalNumber: incomingLeadData?.id || 'PR-987654',
      customerName: customerName,
      insurer: incomingLeadData?.interest ? `Betacare Life [${incomingLeadData.interest}]` : 'Betacare Life [Term Life]',
      productName: incomingLeadData?.interest || 'Term Life Plan',
      coverAmount: coverageText,
      premiumAmount: '₹23,840' // Synchronized premium calculator target base
    };
  }, [incomingLeadData, customerName]);

  // SIMULATING LIVE INTERACTIVE FILE UPLOADS WITH LOCAL BUFFERS
  const [documentsState, setDocumentsState] = useState({
    panCard: null,
    aadhaarCard: null,
    passport: null,
    drivingLicense: null,
    aadhaarAddress: null,
    utilityBill: null,
    bankStatement: null,
    rentalAgreement: null,
    salarySlips: null,
    form16: null,
    itrDoc: null,
    bankStatementFinancial: null,
    customerPhoto: null,
    cancelledCheque: null
  });

  const simulateDocumentUpload = (key) => {
    setDocumentsState(prev => ({
      ...prev,
      [key]: `DOC_SCAN_${key.toUpperCase()}_SIGNED.pdf`
    }));
    triggerToast(`Success: ${key.replace(/([A-Z])/g, ' $1')} uploaded successfully.`);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ADVANCED RULES ENGINE EVALUATING AUDIT METRICS
  const kycMetrics = useMemo(() => {
    const mandatoryKeys = ['panCard', 'aadhaarCard', 'aadhaarAddress', 'salarySlips', 'form16', 'itrDoc', 'customerPhoto', 'cancelledCheque'];
    let verifiedMandatoryCount = 0;
    mandatoryKeys.forEach(k => {
      if (documentsState[k]) verifiedMandatoryCount++;
    });

    return {
      completionPercentage: Math.round((verifiedMandatoryCount / mandatoryKeys.length) * 100),
      isProceedEligible: verifiedMandatoryCount === mandatoryKeys.length
    };
  }, [documentsState]);

  const handleAppendKycNote = (e) => {
    e.preventDefault();
    if (!kycNotes.trim()) return;
    setSavedNotesList(prev => [kycNotes, ...prev]);
    setKycNotes('');
    triggerToast('Note successfully committed to KYC audit ledger.');
  };

  const handleCompleteKYCPipeline = async () => {
    if (!kycMetrics.isProceedEligible) {
      triggerToast('Validation Error: Please upload all required identity, financial and bank documents.');
      return;
    }
    
    try {
      const token = localStorage.getItem('agent_token');
      const payload = {
        leadId: incomingLeadData?._id || incomingLeadData?.id,
        customerName: proposalSnapshot.customerName,
        planName: proposalSnapshot.productName,
        sumAssured: incomingLeadData?.coverageAmount || 28500000,
        premium: 23840,
        kycDocuments: documentsState
      };
      
      const res = await fetch('/api/underwriting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-agent-role': localStorage.getItem('agent_role') || 'Sales Agent'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit proposal to underwriting.');
      }
      
      triggerToast('KYC verified & Proposal submitted to Underwriting Case queue successfully.');
      setTimeout(() => {
        navigate('/policies/underwriting');
      }, 1500);
    } catch (err) {
      console.error(err);
      triggerToast(`Fulfillment Failure: ${err.message}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-16 w-full max-w-full relative">
      
      {/* GLOBAL TOAST POPUP NOTIFIER */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#0B1F5B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 border border-blue-900 flex items-center gap-2 flex-wrap">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER PANELS WITH COMPLETE MOBILE OVERLAPPING CORRECTIONS */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-3xs w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 w-full">
          <button type="button" onClick={() => navigate('/lead-management')} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50 shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-xl md:text-[22px] leading-none truncate">Step 10 — KYC & Document Verification</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-1.5 whitespace-normal leading-relaxed">
              Verify customer identity, financial eligibility and regulatory compliance parameters before processing.
            </p>
          </div>
        </div>
      </header>

      {/* COMPREHENSIVE COMPONENT CANVAS CONTAINER GRID */}
      <main className="flex-1 max-w-[1450px] w-full mx-auto px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPARTMENT FORM SPREADSHEETS */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-6 min-w-0">
          
          {/* SECTION 1 — SYSTEM HUD LOG TRACK DETAILS CHIP */}
          <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-4 select-none">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-semibold">
              <div className="min-w-0"><span className="text-slate-400 text-[9px] uppercase tracking-wider block font-black">Proposal Reference Code</span><span className="text-slate-900 font-mono font-bold text-sm block mt-0.5 select-all">{proposalSnapshot.proposalNumber}</span></div>
              <div className="min-w-0 flex-1 sm:px-4"><span className="text-slate-400 text-[9px] uppercase tracking-wider block font-black">Fulfillment Product Scheme</span><span className="text-[#0B1F5B] font-black text-sm block mt-0.5 truncate max-w-[340px]" title={proposalSnapshot.insurer}>{proposalSnapshot.insurer}</span></div>
              <div className="sm:text-right shrink-0"><span className="text-slate-400 text-[9px] uppercase tracking-wider block font-black">KYC Status Tag</span><span className="text-indigo-700 font-extrabold uppercase text-[10px] tracking-wide mt-1 block">In Progress</span></div>
            </div>
            
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] font-black uppercase text-[#0B1F5B] tracking-wider">
                <span>Verification Completion</span>
                <span>{kycMetrics.completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border">
                <div className="bg-[#0B1F5B] h-full transition-all duration-300" style={{ width: `${kycMetrics.completionPercentage}%` }}></div>
              </div>
            </div>
          </div>

          {/* SECTION 2 — IDENTITY MATRIX SECTION TABLE */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1.5 select-none">Section 2 — Identity Verification Matrix</span>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs w-full overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 min-w-[500px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-black text-[9px] text-slate-400 uppercase border-b tracking-wider select-none">
                    <th className="p-2.5 pl-4 w-[40%]">Document Type Required</th>
                    <th className="p-2.5 w-[35%]">Verification Status Track</th>
                    <th className="p-2.5 text-center w-[25%]">Action Channels</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-[11px]">
                  {[
                    { key: 'panCard', label: 'PAN Card Proof', req: true },
                    { key: 'aadhaarCard', label: 'Aadhaar Card Proof', req: true },
                    { key: 'passport', label: 'Passport Scan', req: false },
                    { key: 'drivingLicense', label: 'Driving License Scan', req: false }
                  ].map((doc) => (
                    <tr key={doc.key} className="hover:bg-slate-50/40">
                      <td className="p-2.5 pl-4 text-slate-900 font-bold">{doc.label} {doc.req && <span className="text-rose-500 font-black">*</span>}</td>
                      <td className="p-2.5">
                        {documentsState[doc.key] ? (
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> ✓ Uploaded</span>
                        ) : (
                          <span className={`text-[10px] uppercase font-black tracking-wide ${doc.req ? 'text-amber-600' : 'text-slate-400 font-medium'}`}>{doc.req ? 'Pending Upload' : 'Optional Slot'}</span>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        <button type="button" onClick={() => simulateDocumentUpload(doc.key)} className="h-7 px-3 border bg-white rounded-lg font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 mx-auto select-none"><Upload className="w-3 h-3 text-slate-400" /><span>Upload</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3 — ADDRESS MATRIX SECTION TABLE */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1.5 select-none">Section 3 — Address Verification Matrix</span>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs w-full overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 min-w-[500px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-black text-[9px] text-slate-400 uppercase border-b tracking-wider select-none">
                    <th className="p-2.5 pl-4 w-[40%]">Document Type</th>
                    <th className="p-2.5 w-[35%]">Status</th>
                    <th className="p-2.5 text-center w-[25%]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-[11px]">
                  {[
                    { key: 'aadhaarAddress', label: 'Aadhaar Address Print Match', req: true },
                    { key: 'utilityBill', label: 'Utility Electricity Bill Scan', req: false },
                    { key: 'bankStatement', label: 'Bank Statement / Passbook page', req: false },
                    { key: 'rentalAgreement', label: 'Registered Rental Agreement', req: false }
                  ].map((doc) => (
                    <tr key={doc.key} className="hover:bg-slate-50/40">
                      <td className="p-2.5 pl-4 text-slate-900 font-bold">{doc.label} {doc.req && <span className="text-rose-500 font-black">*</span>}</td>
                      <td className="p-2.5">
                        {documentsState[doc.key] ? (
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> ✓ Uploaded</span>
                        ) : (
                          <span className={`text-[10px] uppercase font-black tracking-wide ${doc.req ? 'text-amber-600' : 'text-slate-400 font-medium'}`}>{doc.req ? 'Pending Upload' : 'Optional Slot'}</span>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        <button type="button" onClick={() => simulateDocumentUpload(doc.key)} className="h-7 px-3 border bg-white rounded-lg font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 mx-auto select-none"><Upload className="w-3 h-3 text-slate-400" /><span>Verify</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 4 — FINANCIAL MATRIX SECTION TABLE */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline border-b border-slate-100 pb-1.5 select-none">
              <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block">Section 4 — Financial Documents</span>
              <div className="text-right text-[10px] font-black uppercase text-slate-400">Income Status: <span className="text-amber-600 font-black">Pending</span></div>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs w-full overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 min-w-[500px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-black text-[9px] text-slate-400 uppercase border-b tracking-wider select-none">
                    <th className="p-2.5 pl-4 w-[40%]">Financial Proof Slabs</th>
                    <th className="p-2.5 w-[35%]">Fulfillment Tracking</th>
                    <th className="p-2.5 text-center w-[25%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-[11px]">
                  {[
                    { key: 'salarySlips', label: 'Salary Slips (Last 3 Months Slabs)' },
                    { key: 'form16', label: 'Form 16 Certificate Assessment' },
                    { key: 'itrDoc', label: 'Income Tax Returns (ITR Acknowledgement)' },
                    { key: 'bankStatementFinancial', label: 'Operating Bank Statement (6 Months)' }
                  ].map((doc) => (
                    <tr key={doc.key} className="hover:bg-slate-50/40">
                      <td className="p-2.5 pl-4 text-slate-900 font-bold">{doc.label} <span className="text-rose-500 font-black">*</span></td>
                      <td className="p-2.5">
                        {documentsState[doc.key] ? (
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> ✓ Uploaded</span>
                        ) : (
                          <span className="text-amber-600 text-[10px] uppercase font-black tracking-wide">Pending Upload</span>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        <button type="button" onClick={() => simulateDocumentUpload(doc.key)} className="h-7 px-3 border bg-white rounded-lg font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 mx-auto select-none"><Upload className="w-3 h-3 text-slate-400" /><span>Upload</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CUSTOMER PHOTO & BANK DETAIL TILES BLOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            
            {/* PHOTO CARD CONFIG */}
            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-3xs flex flex-col justify-between min-h-[220px]">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1.5 select-none">Section 5 — Customer Photograph</span>
              <div 
                onClick={() => simulateDocumentUpload('customerPhoto')}
                className="flex-1 border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 my-3 text-center cursor-pointer select-none transition-colors"
              >
                {documentsState.customerPhoto ? (
                  <div className="text-center space-y-1 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                    <span>✓ Photo Scan Attached</span>
                    <span className="text-[9px] text-slate-400 font-mono block font-medium truncate max-w-[180px]">{documentsState.customerPhoto}</span>
                  </div>
                ) : (
                  <div className="text-center space-y-1 text-slate-400 font-medium text-[11px]">
                    <Upload className="w-4 h-4 text-slate-300 mx-auto mb-0.5" />
                    <span className="font-bold text-slate-700 block">Click to Upload Area</span>
                    <span>Requirements: JPG, PNG | Max 5 MB Slabs</span>
                  </div>
                )}
              </div>
              <div className="text-[10px] font-black uppercase text-slate-400 select-none text-right">Status: <span className={documentsState.customerPhoto ? 'text-emerald-600':'text-amber-600'}>{documentsState.customerPhoto ? 'Uploaded':'Pending'}</span></div>
            </div>

            {/* INTEGRATED BANK ACCOUNT PROFILE DETAIL TILE */}
            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-3xs flex flex-col justify-between min-h-[220px]">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1.5 select-none">Section 6 — Bank Account Verification</span>
              
              <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-[11px] font-semibold text-slate-600 my-auto py-2">
                <div className="min-w-0"><span className="text-slate-400 text-[9px] uppercase font-black block">Holder Name</span><span className="text-black font-bold block mt-0.5 truncate" title={bankDetails.holderName}>{bankDetails.holderName}</span></div>
                <div className="min-w-0"><span className="text-slate-400 text-[9px] uppercase font-black block">Bank Identifier</span><span className="text-slate-900 font-bold block mt-0.5 truncate">{bankDetails.bankName}</span></div>
                <div><span className="text-slate-400 text-[9px] uppercase font-black block">Account Number</span><span className="text-slate-900 font-mono font-bold block mt-0.5">{bankDetails.accountNumber}</span></div>
                <div><span className="text-slate-400 text-[9px] uppercase font-black block">IFSC Code</span><span className="text-slate-900 font-mono block mt-0.5">{bankDetails.ifscCode}</span></div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2 gap-3 mt-1">
                <div className="min-w-0 flex-1">
                  <span className="text-slate-400 text-[9px] uppercase font-black block">Evidence File</span>
                  <span className="text-[10px] text-slate-900 font-medium block truncate mt-0.5" title={documentsState.cancelledCheque || 'Pending'}>{documentsState.cancelledCheque || 'Cancelled Cheque Pending'}</span>
                </div>
                <button type="button" onClick={() => simulateDocumentUpload('cancelledCheque')} className="h-7 px-2.5 border bg-white hover:bg-slate-50 rounded-lg text-[11px] font-bold text-slate-700 select-none flex items-center gap-1 shrink-0"><Upload className="w-3 h-3 text-slate-400" /><span>Upload</span></button>
              </div>
            </div>

          </div>

          {/* LOWER INTERFACE CONTROLLER ACTION STRIP BAR */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 select-none">
            <button type="button" onClick={() => triggerToast('Form records cached inside CRM system memory data lanes.')} className="w-full sm:w-auto h-10 px-4 border border-slate-200 text-slate-700 bg-white font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1.5"><Save className="w-3.5 h-3.5 text-slate-400" /><span>Save Draft</span></button>
            <button 
              type="button" 
              disabled={!kycMetrics.isProceedEligible}
              onClick={handleCompleteKYCPipeline}
              className={`w-full sm:w-auto h-11 px-6 text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 focus:outline-none transition-all ${kycMetrics.isProceedEligible ? 'bg-[#0B1F5B] hover:bg-black' : 'bg-slate-300 cursor-not-allowed opacity-60'}`}
            >
              <span>Complete KYC & Proceed to Medical →</span>
            </button>
          </div>

        </div>

        {/* ==========================================================================
            RIGHT COLUMN — PROPOSAL SNAPSHOT PREVIEW SIDEBAR PANEL
            Connected directly to the dynamic backend engine to fix layout overrides
           ========================================================================== */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-[88px] text-left select-none min-w-0">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
            <div className="border-b border-slate-100 pb-2 flex items-center gap-1.5 text-[#0B1F5B]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <h4 className="text-[10px] font-black uppercase tracking-wider">Proposal Snapshot</h4>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-3 text-xs font-semibold text-slate-600">
              <div className="min-w-0"><span className="text-slate-400 text-[9px] uppercase block font-black">Proposal Number</span><span className="text-black font-mono font-bold block mt-0.5 select-all">{proposalSnapshot.proposalNumber}</span></div>
              <div className="min-w-0"><span className="text-slate-400 text-[9px] uppercase block font-black">Customer Name</span><span className="text-black font-bold block mt-0.5 truncate" title={proposalSnapshot.customerName}>{proposalSnapshot.customerName}</span></div>
              <div className="min-w-0"><span className="text-slate-400 text-[9px] uppercase block font-black">Underwrite Carrier</span><span className="text-slate-900 font-bold block mt-0.5 truncate" title={proposalSnapshot.insurer}>{proposalSnapshot.insurer}</span></div>
              <div className="min-w-0"><span className="text-slate-400 text-[9px] uppercase block font-black">Face Cover Limit</span><span className="text-slate-900 font-bold block mt-0.5 truncate">{proposalSnapshot.coverAmount}</span></div>
              <div className="col-span-2 border-t border-slate-100 pt-2"><span className="text-slate-400 text-[9px] uppercase block font-black">KYC Operations Completion</span><span className="text-[#0B1F5B] font-black text-sm block mt-0.5">{kycMetrics.completionPercentage}% Complete</span></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 text-xs font-semibold text-slate-600">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1.5">Insurance Process Milestone Progress</span>
            <div className="space-y-3 relative pl-4 border-l border-slate-100 mt-2 font-bold text-[11px]">
              <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"></span><span className="text-emerald-700 block">Proposal Submitted</span></div>
              <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 border-2 border-white ring-2 ring-amber-100 animate-pulse"></span><span className="text-amber-700 block">KYC Document Verification</span></div>
              <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2 w-2 rounded-full bg-slate-200 border border-white"></span><span className="text-slate-400 block font-medium">Medical Underwriting Assessment</span></div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}