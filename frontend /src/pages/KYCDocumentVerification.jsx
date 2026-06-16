// src/pages/KYCDocumentVerification.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Save, CheckCircle2, FileText, Activity, Download, 
  Send, MessageSquare, Shield, Layers, User, Check, AlertTriangle, Upload, HelpCircle 
} from 'lucide-react';

export default function KYCDocumentVerification() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [kycNotes, setKycNotes] = useState('');
  const [savedNotesList, setSavedNotesList] = useState([]);

  // 1. HARD CODED EXPLICIT CASE CONFIGURATIONS FOR PR-987654
  const proposalSnapshot = {
    proposalNumber: 'PR-987654',
    customerName: 'Rahul Sharma',
    insurer: 'ICICI Prudential',
    productName: 'iProtect Smart',
    coverAmount: '₹2.85 Crore',
    premiumAmount: '₹23,840'
  };

  // 2. STATE REPOSITORY FOR SIMULATING LIVE INTERACTIVE FILE UPLOADS
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

  // Bank Form State Bindings
  const [bankDetails, setBankDetails] = useState({
    holderName: 'Rahul Sharma',
    bankName: 'HDFC Bank Ltd',
    accountNumber: '50100421298451',
    ifscCode: 'HDFC0000060'
  });

  // Action simulation handler for linking mock scans
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

  // 3. DYNAMIC MATHEMATICAL ENGINE EVALUATING ADVISOR METRICS
  const kycMetrics = useMemo(() => {
    // Mandated rules array checks criteria variables
    const mandatoryKeys = ['panCard', 'aadhaarCard', 'aadhaarAddress', 'salarySlips', 'form16', 'itrDoc', 'customerPhoto', 'cancelledCheque'];
    const totalCount = Object.values(documentsState).filter(Boolean).length;
    
    let verifiedMandatoryCount = 0;
    mandatoryKeys.forEach(k => {
      if (documentsState[k]) verifiedMandatoryCount++;
    });

    const completionPercentage = Math.round((verifiedMandatoryCount / mandatoryKeys.length) * 100);
    const isProceedEligible = verifiedMandatoryCount === mandatoryKeys.length;

    return {
      totalUploaded: totalCount,
      completionPercentage: completionPercentage,
      isProceedEligible: isProceedEligible
    };
  }, [documentsState]);

  const handleAppendKycNote = (e) => {
    e.preventDefault();
    if (!kycNotes.trim()) return;
    setSavedNotesList(prev => [kycNotes, ...prev]);
    setKycNotes('');
    triggerToast('Note successfully committed to KYC audit ledger.');
  };

  // Proceed to Step 11: Medical Requirements scheduling node
  const handleCompleteKYCPipeline = () => {
    if (!kycMetrics.isProceedEligible) {
      triggerToast('Validation Error: Please upload all required identity, financial and bank documents.');
      return;
    }
    triggerToast('KYC records verified. Launching Step 11: Medical Underwriting...');
    // Simulated path routing to match your lifecycle timeline flows
    navigate('/lead-management');
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

      {/* COMPACT STYLISH STEPS HUD BAR HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-3xs w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[22px] leading-none">Step 10 — KYC & Document Verification</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-1.5">
              Verify customer identity, financial eligibility and regulatory compliance before medical underwriting and policy processing.
            </p>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER LAYOUT AREAS */}
      <main className="flex-1 max-w-[1450px] w-full mx-auto px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN DATA DESK SPREADSHEET CANVAS */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
          
          {/* SECTION 1 — KYC STATUS OVERVIEW summary card */}
          <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-3 select-none">
            <div className="flex justify-between items-center text-xs font-semibold">
              <div><span className="text-slate-400 text-[9px] uppercase tracking-wider block font-black">Proposal Reference Code</span><span className="text-slate-900 font-mono font-bold text-sm block mt-0.5">{proposalSnapshot.proposalNumber}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase tracking-wider block font-black">Fulfillment Product Scheme</span><span className="text-[#0B1F5B] font-black text-sm block mt-0.5">{proposalSnapshot.insurer} — {proposalSnapshot.productName}</span></div>
              <div className="text-right"><span className="text-slate-400 text-[9px] uppercase tracking-wider block font-black">KYC Status Tag</span><span className="text-indigo-700 font-extrabold uppercase text-[10px] tracking-wide mt-1 block">In Progress</span></div>
            </div>
            
            {/* PROGRESS Completion tracker slider hud */}
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

          {/* SECTION 2 — IDENTITY VERIFICATION GRID SHEET TABLE */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1.5 select-none">Section 2 — Identity Verification Matrix</span>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs w-full">
              <table className="w-full text-xs text-left text-slate-600 table-fixed border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-black text-[9px] text-slate-400 uppercase border-b tracking-wider">
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
                      <td className="p-2.5 pl-4 text-slate-900 font-bold">
                        {doc.label} {doc.req && <span className="text-rose-500 font-black">*</span>}
                      </td>
                      <td className="p-2.5">
                        {documentsState[doc.key] ? (
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> ✓ Uploaded</span>
                        ) : (
                          <span className={`text-[10px] uppercase font-black tracking-wide ${doc.req ? 'text-amber-600' : 'text-slate-400 font-medium'}`}>{doc.req ? 'Pending Upload' : 'Optional Slat'}</span>
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

          {/* SECTION 3 — ADDRESS VERIFICATION GRID SHEET TABLE */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1.5 select-none">Section 3 — Address Verification Matrix</span>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs w-full">
              <table className="w-full text-xs text-left text-slate-600 table-fixed border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-black text-[9px] text-slate-400 uppercase border-b tracking-wider">
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
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> ✓ Uploaded</span>
                        ) : (
                          <span className={`text-[10px] uppercase font-black tracking-wide ${doc.req ? 'text-amber-600' : 'text-slate-400 font-medium'}`}>{doc.req ? 'Pending Upload' : 'Optional Slat'}</span>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        <button type="button" onClick={() => simulateDocumentUpload(doc.key)} className="h-7 px-3 border bg-white rounded-lg font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 mx-auto select-none"><Upload className="w-3 h-3 text-slate-400" /><span>{doc.req ? 'Verify' : 'Upload'}</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 4 — FINANCIAL ELIGIBILITY MATRIX INVOICES TABLE */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline border-b border-slate-100 pb-1.5 select-none">
              <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block">Section 4 — Financial Documents</span>
              <div className="text-right text-[10px] font-black uppercase text-slate-400">Income Verification Status: <span className="text-amber-600">Pending</span></div>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs w-full">
              <table className="w-full text-xs text-left text-slate-600 table-fixed border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-black text-[9px] text-slate-400 uppercase border-b tracking-wider">
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
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> ✓ Uploaded</span>
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

          {/* LOWER GRID LAYOUT TILES ROW LAYER (PHOTO & BANK ACCOUNTS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* SECTION 5 — CUSTOMER PHOTOGRAPH BLOCK CARD */}
            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-3xs space-y-3 flex flex-col justify-between h-[210px]">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1 select-none">Section 5 — Customer Photograph</span>
              
              <div 
                onClick={() => simulateDocumentUpload('customerPhoto')}
                className="flex-1 border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer select-none transition-colors"
              >
                {documentsState.customerPhoto ? (
                  <div className="text-center space-y-1 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                    <span>✓ Photo Scan Attached</span>
                    <span className="text-[10px] text-slate-400 font-mono block font-medium truncate max-w-[200px]">{documentsState.customerPhoto}</span>
                  </div>
                ) : (
                  <div className="text-center space-y-1 text-slate-400 font-medium text-[11px]">
                    <Upload className="w-5 h-5 text-slate-300 mx-auto" />
                    <span className="font-bold text-slate-700 block">Click to Upload Area</span>
                    <span>Requirements: JPG, PNG | Max 5 MB Slabs</span>
                  </div>
                )}
              </div>
              <div className="text-[10px] font-black uppercase text-slate-400 select-none text-right">Photo Status: <span className={documentsState.customerPhoto ? 'text-emerald-600':'text-amber-600'}>{documentsState.customerPhoto ? 'Uploaded':'Pending'}</span></div>
            </div>

            {/* SECTION 6 — BANK ACCOUNT VERIFICATION CORE RECORD CARD */}
            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-3xs space-y-2.5 flex flex-col justify-between h-[210px]">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1 select-none">Section 6 — Bank Account Verification</span>
              
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-semibold text-slate-600">
                <div><span className="text-slate-400 text-[9px] uppercase font-black block">Holder Name</span><span className="text-black font-bold block mt-0.5 truncate">{bankDetails.holderName}</span></div>
                <div><span className="text-slate-400 text-[9px] uppercase font-black block">Bank Identifier</span><span className="text-slate-900 font-bold block mt-0.5 truncate">{bankDetails.bankName}</span></div>
                <div><span className="text-slate-400 text-[9px] uppercase font-black block">Account Number</span><span className="text-slate-900 font-mono font-bold block mt-0.5">{bankDetails.accountNumber}</span></div>
                <div><span className="text-slate-400 text-[9px] uppercase font-black block">IFSC Slabs Code</span><span className="text-[#0B1F5B] font-mono font-black block mt-0.5">{bankDetails.ifscCode}</span></div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-2 gap-4">
                <div>
                  <span className="text-slate-400 text-[9px] uppercase font-black block">Evidence Uploaded</span>
                  <span className="text-[11px] text-slate-900 font-medium block truncate max-w-[150px] mt-0.5">{documentsState.cancelledCheque || 'Passbook / Cancelled Cheque Pending'}</span>
                </div>
                <button type="button" onClick={() => simulateDocumentUpload('cancelledCheque')} className="h-7 px-3 border bg-white hover:bg-slate-50 rounded-lg text-[11px] font-bold text-slate-700 select-none flex items-center gap-1 shrink-0"><Upload className="w-3 h-3 text-slate-400" /><span>Upload Link</span></button>
              </div>
            </div>

          </div>

          {/* SECTION 7 — AUTOMATED REAL-TIME VERIFICATION CHECKS CENTRAL ENGINE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 select-none">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b pb-1.5">Section 7 — Automated Verification Engine Tracker</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-700">
              {[
                { name: 'PAN Verification', ok: !!documentsState.panCard },
                { name: 'CKYC Verification Registry', ok: !!documentsState.panCard && !!documentsState.aadhaarCard },
                { name: 'Aadhaar Verification Check', ok: !!documentsState.aadhaarCard },
                { name: 'Income Slabs Validation', ok: !!documentsState.salarySlips && !!documentsState.form16 },
                { name: 'Duplicate Policy Underwrite Check', ok: true },
                { name: 'AML Compliance Screening Slabs', ok: true }
              ].map((engine, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 border rounded-xl bg-slate-50/30">
                  <span className="text-slate-900 truncate pr-2" title={engine.name}>{engine.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase border tracking-wider shrink-0 ${engine.ok ? 'text-emerald-700 bg-emerald-50 border-emerald-100':'text-amber-600 bg-amber-50 border-amber-100'}`}>{engine.ok ? 'Verified':'Pending'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 9 — AGENT LOG NOTATION MEMO INTERFACE COMPONENT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 select-none">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1">Section 9 — Agent KYC Servicing Notes Log</span>
            
            <form onSubmit={handleAppendKycNote} className="space-y-2">
              <textarea 
                rows="2" 
                value={kycNotes}
                onChange={(e) => setKycNotes(e.target.value)}
                placeholder="Pin verification logs (e.g. Customer uploaded salary slips, additional address requested...)" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none text-slate-900 font-medium leading-relaxed focus:bg-white" 
              />
              <div className="flex justify-end pt-0.5">
                <button type="submit" className="h-7 px-4 bg-[#0B1F5B] hover:bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors">Save Note Memo</button>
              </div>
            </form>

            {savedNotesList.length > 0 && (
              <div className="space-y-1.5 pt-1.5 border-t max-h-28 overflow-y-auto">
                {savedNotesList.map((note, i) => (
                  <div key={i} className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-semibold text-slate-600 leading-normal truncate">{note}</div>
                ))}
              </div>
            )}
          </div>

          {/* PRIMARY FLOW DIRECTIONS ACTION CONTROLLER FOOTER HUB */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 select-none border-t border-slate-100">
            <button type="button" onClick={() => triggerToast('Form structure cached cleanly inside persistent CRM local temporary tables.')} className="w-full sm:w-auto h-10 px-4 border border-slate-200 text-slate-700 bg-white font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1.5"><Save className="w-3.5 h-3.5 text-slate-400" /><span>Save Draft</span></button>
            
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

        {/* RIGHT COLUMN SIDEBAR PANEL CANVAS: RUNTIME HIGHLIGHT CHIPI MONITOR */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-[88px] text-left select-none">
          
          {/* POLICY SNAPSHOT PANEL MONITOR MONITOR CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
            <div className="border-b border-slate-100 pb-1.5 flex items-center gap-1.5 text-[#0B1F5B]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <h4 className="text-[10px] font-black uppercase tracking-wider">Proposal Snapshot</h4>
            </div>

            <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs font-semibold text-slate-600">
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Proposal Number</span><span className="text-black font-mono font-bold block mt-0.5 select-all">{proposalSnapshot.proposalNumber}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Customer Name</span><span className="text-black font-bold block mt-0.5 truncate">{proposalSnapshot.customerName}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Underwrite Carrier</span><span className="text-slate-900 font-bold block mt-0.5 truncate">{proposalSnapshot.insurer}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Face Cover Limit</span><span className="text-slate-900 font-bold block mt-0.5">{proposalSnapshot.coverAmount}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Modal Premium Amount</span><span className="text-[#0B1F5B] font-black block mt-0.5">{proposalSnapshot.premiumAmount}</span></div>
              <div className="col-span-2 border-t pt-2 mt-0.5"><span className="text-slate-400 text-[9px] uppercase block font-black">KYC Operations Completion</span><span className="text-[#0B1F5B] font-black text-sm block mt-0.5">{kycMetrics.completionPercentage}% Complete</span></div>
            </div>
          </div>

          {/* SECTION 8 — COMPLETION TRACKER DOCUMENT CHECKLIST */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2.5 text-xs font-semibold text-slate-600">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1">Section 8 — Document Checklist</span>
            <div className="space-y-2 font-bold text-[11px]">
              <div className="flex justify-between items-center"><span>PAN Card Proof</span><span className={documentsState.panCard ? 'text-emerald-600':'text-amber-600 font-medium'}>{documentsState.panCard ? '✓ Verified':'Pending'}</span></div>
              <div className="flex justify-between items-center"><span>Aadhaar Identity Proof</span><span className={documentsState.aadhaarCard ? 'text-emerald-600':'text-amber-600 font-medium'}>{documentsState.aadhaarCard ? '✓ Verified':'Pending'}</span></div>
              <div className="flex justify-between items-center"><span>Address Proof Matching</span><span className={documentsState.aadhaarAddress ? 'text-emerald-600':'text-amber-600 font-medium'}>{documentsState.aadhaarAddress ? '✓ Verified':'Pending'}</span></div>
              <div className="flex justify-between items-center"><span>Financial Income Proof Slabs</span><span className={(documentsState.salarySlips && documentsState.form16 && documentsState.itrDoc) ? 'text-emerald-600':'text-amber-600 font-medium'}>{(documentsState.salarySlips && documentsState.form16 && documentsState.itrDoc) ? '✓ Verified':'Pending'}</span></div>
              <div className="flex justify-between items-center"><span>Customer Photo Evidence</span><span className={documentsState.customerPhoto ? 'text-emerald-600':'text-amber-600 font-medium'}>{documentsState.customerPhoto ? '✓ Verified':'Pending'}</span></div>
              <div className="flex justify-between items-center"><span>Bank Account Verification</span><span className={documentsState.cancelledCheque ? 'text-emerald-600':'text-amber-600 font-medium'}>{documentsState.cancelledCheque ? '✓ Verified':'Pending'}</span></div>
            </div>
          </div>

          {/* UNDERWRITING MEDICAL SCHEDULING RULES PREVIEW CHIP */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 text-xs font-semibold text-slate-600">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1">Medical Requirement Previews</span>
            <div className="space-y-2 relative pl-4 border-l border-slate-100 mt-1">
              <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"></span><span className="text-emerald-700 font-bold block leading-tight">✓ Tele-MER Required</span></div>
              <div className="relative"><span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"></span><span className="text-emerald-700 font-bold block leading-tight">✓ Blood Profile Assessment Required</span></div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed pt-1 border-t border-dashed">
              Medical appointment scheduling operations block will unlock automatically once central KYC document verification passes.
            </p>
          </div>

          {/* WORKFLOW TIMELINE PATH LOG LOG CHIP TRAIL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 text-xs font-semibold text-slate-600">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1">Insurance Process Milestone Progress</span>
            <div className="space-y-2.5 relative pl-4 border-l border-slate-100 mt-1 font-bold text-[11px]">
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