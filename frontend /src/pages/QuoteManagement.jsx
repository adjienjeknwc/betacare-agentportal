// src/pages/QuoteManagement.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, CheckCircle2, FileText, Activity, Download, 
  Send, MessageSquare, Shield, Layers, User, Check, AlertTriangle, Star, ShieldCheck, Heart, Clock
} from 'lucide-react';

export default function QuoteManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const { leadId } = useParams();

  // 1. DYNAMIC LEAD DATA INHERITANCE MAP (ZERO DUPLICATE CONTEXT ENTRY)
  const inheritedLeadData = useMemo(() => {
    return location.state?.leadData || {
      fullName: 'Rahul Sharma',
      mobileNumber: '9876543210',
      email: 'rahul.sharma@insuranceportal.io',
      dob: '1994-05-14',
      gender: 'Male',
      occupation: 'Salaried IT Professional',
      annualIncome: '1800000',
      city: 'Mumbai',
      state: 'Maharashtra',
      smokingStatus: 'Non-Smoker',
      address: '7224 Oak Creek Terrace, Mumbai, MH 400001'
    };
  }, [location.state]);

  // 2. UNIFIED WORKFLOW STATES (SINGLE COMPREHENSIVE CANVAS VIEW)
  const [selectedInsurerId, setSelectedInsurerId] = useState('icici');
  const [isQuoteFinalized, setIsQuoteFinalized] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState('Draft');

  // Step 8 Verification Checkbox Manifest Flags
  const [declarations, setDeclarations] = useState({
    benefitsExplained: false,
    exclusionsExplained: false,
    ridersExplained: false,
    premiumExplained: false,
    consentObtained: false,
    customerUnderstandFeatures: false,
    customerUnderstandExclusions: false,
    customerAgreesPremium: false,
    customerAuthorizesSubmission: false
  });

  // Consolidated Single Screen Input Blueprint State Registry
  const [formData, setFormData] = useState({
    // Step 1 Supplementary Personal & Occupational Fields
    maritalStatus: 'Married',
    nationality: 'Indian',
    residentStatus: 'Resident Indian',
    panNumber: 'BVPPR4412K',
    aadhaarNumber: 'XXXX-XXXX-8821',
    employerName: 'Enterprise Core Solutions Ltd',
    employmentType: 'Full-Time Permanent',
    industrySector: 'Information Technology',
    experienceYears: '8',
    alcoholConsumption: 'None',
    tobaccoUsage: 'None',
    existingMedicalConditions: 'No Declared Pre-existing Illnesses',

    // Step 2 Need Analysis Profile Matrix
    monthlyExpenses: '65000',
    existingLifeCover: '2500000',
    homeLoanOutstanding: '4000000',
    personalLoans: '500000',
    otherLiabilities: '300000',
    existingInvestments: '1200000',
    goalChildEducation: '3000000',
    goalChildMarriage: '2500000',
    goalRetirementCorpus: '15000000',
    goalWealthTransfer: '5000000',
    manualOverrideCoverage: '',

    // Step 3 & 4 Policy Architecture
    productType: 'Term Insurance',
    sumAssured: '28500000', // ₹2.85 Crore Target
    policyTerm: '35',
    premiumPaymentTerm: '20 Years',
    premiumFrequency: 'Half-Yearly',
    coverStartDate: '2026-06-12',

    // Step 5 Supplementary Rider Toggles
    riderCriticalIllness: true,
    riderAccidentalDeath: true,
    riderWaiverPremium: true,
    riderPermanentDisability: false,
    riderTerminalIllness: true,
    riderIncomeBenefit: false,
    riderHospitalCash: false
  });

  // Chronological Age Calculator
  const calculatedClientAge = useMemo(() => {
    if (!inheritedLeadData.dob) return 32;
    return Math.max(18, 2026 - new Date(inheritedLeadData.dob).getFullYear());
  }, [inheritedLeadData.dob]);

  // Step 2: Actuarial HLV & Protection Needs Analytics Engine
  const analysisMetrics = useMemo(() => {
    const income = parseFloat(inheritedLeadData.annualIncome) || 1800000;
    const liabilities = (parseFloat(formData.homeLoanOutstanding) || 0) + (parseFloat(formData.personalLoans) || 0) + (parseFloat(formData.otherLiabilities) || 0);
    const futureGoals = (parseFloat(formData.goalChildEducation) || 0) + (parseFloat(formData.goalChildMarriage) || 0) + (parseFloat(formData.goalRetirementCorpus) || 0) + (parseFloat(formData.goalWealthTransfer) || 0);
    const currentCovers = parseFloat(formData.existingLifeCover) || 0;

    const hlv = income * 15;
    const replacementNeed = (income * 0.7) * (formData.policyTerm ? parseInt(formData.policyTerm) : 35);
    const recommendedCover = hlv + liabilities + futureGoals - currentCovers;

    return {
      hlv: hlv,
      incomeReplacement: replacementNeed,
      liabilityProtection: liabilities,
      recommended: Math.max(2500000, recommendedCover)
    };
  }, [inheritedLeadData.annualIncome, formData.homeLoanOutstanding, formData.personalLoans, formData.otherLiabilities, formData.goalChildEducation, formData.goalChildMarriage, formData.goalRetirementCorpus, formData.goalWealthTransfer, formData.existingLifeCover, formData.policyTerm]);

  // 3. STEP 7: COMPREHENSIVE MULTI-CARRIER RISK COMPARISON MATRICES SHEET
  const quoteComparisonMatrix = useMemo(() => {
    const isSmoker = inheritedLeadData.smokingStatus === 'Smoker';
    let baseHdfc = 16500;
    if (isSmoker) baseHdfc = Math.round(baseHdfc * 1.65);

    let riderSum = 0;
    if (formData.riderCriticalIllness) riderSum += 2100;
    if (formData.riderAccidentalDeath) riderSum += 1600;
    if (formData.riderWaiverPremium) riderSum += 800;
    if (formData.riderTerminalIllness) riderSum += 1200;

    let frequencyMultiplier = 0.52;
    if (formData.premiumFrequency === 'Annual') frequencyMultiplier = 1.0;
    else if (formData.premiumFrequency === 'Quarterly') frequencyMultiplier = 0.27;
    else if (formData.premiumFrequency === 'Monthly') frequencyMultiplier = 0.09;

    const baseCost = Math.round(baseHdfc * frequencyMultiplier);
    const riderCost = Math.round(riderSum * frequencyMultiplier);
    const taxCost = Math.round((baseCost + riderCost) * 0.18);
    const finalGrossTotal = baseCost + riderCost + taxCost;

    return {
      hdfc: {
        id: 'hdfc', name: 'HDFC Life', plan: 'Click 2 Protect', sumAssured: '₹2.85 Crore', term: '35 Years', ppt: '20 Years', premium: Math.round(finalGrossTotal * 1.04), monthly: '₹2,070', csr: '99.4%', solvency: '1.92', medStatus: 'Tele-MER Pending', badge: 'Best Value', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-100', base: Math.round(baseCost * 1.04), riders: Math.round(riderCost * 1.04), gst: Math.round(taxCost * 1.04), ci: 2300, adb: 1800, textReason: '• Suitable profile risk configuration matching\n• Optimal premium-to-cover metrics'
      },
      icici: {
        id: 'icici', name: 'ICICI Prudential', plan: 'iProtect Smart', sumAssured: '₹2.85 Crore', term: '35 Years', ppt: '20 Years', premium: 23840, monthly: '₹1,986', csr: '98.9%', solvency: '2.12', medStatus: 'Standard Medical Required', badge: '🏆 Recommended', badgeClass: 'bg-indigo-600 text-white border-[#0B1F5B] font-black', base: 16500, riders: 3700, gst: 3640, ci: 2100, adb: 1600, textReason: '• Lowest annual premium among compared plans\n• Meets required coverage amount\n• Suitable for client age and income profile\n• Strong claim settlement performance'
      },
      max: {
        id: 'max', name: 'Max Life', plan: 'Smart Secure Plus', sumAssured: '₹2.85 Crore', term: '35 Years', ppt: '20 Years', premium: Math.round(finalGrossTotal * 0.95), monthly: '₹2,017', csr: '99.6%', solvency: '1.88', medStatus: 'Tele-MER Confirmed', badge: '🛡 Highest CSR', badgeClass: 'bg-amber-50 text-amber-700 border-amber-100', base: Math.round(baseCost * 0.93), riders: Math.round(riderCost * 0.96), gst: Math.round(taxCost * 0.94), ci: 1950, adb: 1450, textReason: '• Market-leading Claim Settlement Ratio (CSR)\n• Flexible payment interval calibration configurations'
      }
    };
  }, [inheritedLeadData.smokingStatus, formData.policyTerm, formData.premiumPaymentTerm, formData.premiumFrequency, formData.riderCriticalIllness, formData.riderAccidentalDeath, formData.riderWaiverPremium, formData.riderTerminalIllness]);

  const activeQuote = useMemo(() => {
    return quoteComparisonMatrix[selectedInsurerId] || quoteComparisonMatrix.icici;
  }, [quoteComparisonMatrix, selectedInsurerId]);

  // 4. INTERCEPT BROWSER ROUTING ACTIONS
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = (e) => {
      e.preventDefault();
      setShowExitModal(true);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCommitFinalQuote = () => {
    setIsQuoteFinalized(true);
    setQuoteStatus('Generated');
    triggerToast(`Success: Final quote generated for ${activeQuote.name}. Review Section Unlocked.`);
    
    setTimeout(() => {
      document.getElementById('step8-review-section-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleFinalSubmitApplication = () => {
    if (!declarations.benefitsExplained || !declarations.exclusionsExplained || !declarations.consentObtained || !declarations.customerUnderstandFeatures || !declarations.customerAgreesPremium) {
      triggerToast('Compliance Halt: Please tick all Agent Declarations and Customer Consent checkboxes.');
      return;
    }
    setQuoteStatus('Converted to Proposal');
    triggerToast('Proposal submission committed. Advancing to confirmation desk...');
    
    navigate('/lead-management/proposal-confirmation', {
      state: { activeQuote, inheritedLeadData, formData }
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-16 w-full max-w-full relative">
      
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#0B1F5B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 border border-blue-900 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {showExitModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-amber-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-black text-slate-900 tracking-tight">Active Advisory Workspace</h3>
            </div>
            <p className="text-xs font-semibold text-slate-500 leading-normal">Exiting now will discard current calculations and selections.</p>
            <div className="flex justify-end gap-2 pt-1 text-xs font-bold">
              <button type="button" onClick={() => setShowExitModal(false)} className="px-4 py-2 border rounded-xl text-slate-700">Maintain Session</button>
              <button type="button" onClick={() => { setShowExitModal(false); navigate('/lead-management'); }} className="px-4 py-2 bg-rose-600 text-white rounded-xl">Discard & Exit</button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-3xs w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/lead-management')} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[22px] leading-none">Quote Generation Desk</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-1.5">Consolidated Single-Screen Insurance Structuring Canvas</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1450px] w-full mx-auto px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN WORKSPACE */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1 — CLIENT INFORMATION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1">Step 1 — Client Information</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
              <div><label className="text-slate-500 block text-[10px] uppercase">Full Name</label><input type="text" value={inheritedLeadData.fullName} readOnly className="w-full h-9 bg-slate-50 border rounded-lg px-2.5 font-bold outline-none" /></div>
              <div><label className="text-slate-500 block text-[10px] uppercase">Date of Birth</label><input type="text" value={inheritedLeadData.dob} readOnly className="w-full h-9 bg-slate-50 border rounded-lg px-2.5 font-bold outline-none" /></div>
              <div><label className="text-slate-500 block text-[10px] uppercase">Age</label><input type="text" value={`${calculatedClientAge} Years`} readOnly className="w-full h-9 bg-slate-50 border rounded-lg px-2.5 text-[#0B1F5B] font-black outline-none" /></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold pt-2 border-t border-slate-50">
              <div><label className="text-slate-500 block text-[10px] uppercase">Occupation</label><input type="text" value={inheritedLeadData.occupation} readOnly className="w-full h-9 bg-slate-50 border rounded-lg px-2.5 outline-none" /></div>
              <div><label className="text-slate-500 block text-[10px] uppercase">Employer Name</label><input type="text" value={formData.employerName} onChange={(e) => setFormData({...formData, employerName: e.target.value})} className="w-full h-9 bg-white border rounded-lg px-2.5 outline-none" /></div>
              <div><label className="text-slate-500 block text-[10px] uppercase">Annual Income</label><input type="text" value={`₹${parseFloat(inheritedLeadData.annualIncome).toLocaleString()}`} readOnly className="w-full h-9 bg-slate-50 border rounded-lg px-2.5 font-bold outline-none" /></div>
            </div>
          </div>

          {/* STEP 2 — NEED ANALYSIS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1">Step 2 — Need Analysis Financial Calculator</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-semibold">
              <div><label className="text-slate-500 block">Monthly Expenses</label><input type="number" value={formData.monthlyExpenses} onChange={(e) => setFormData({...formData, monthlyExpenses: e.target.value})} className="w-full h-8 bg-white border rounded-lg px-2 outline-none" /></div>
              <div><label className="text-slate-500 block">Home Loan Balance</label><input type="number" value={formData.homeLoanOutstanding} onChange={(e) => setFormData({...formData, homeLoanOutstanding: e.target.value})} className="w-full h-8 bg-white border rounded-lg px-2 outline-none" /></div>
              <div><label className="text-slate-500 block">Existing Active Covers</label><input type="number" value={formData.existingLifeCover} onChange={(e) => setFormData({...formData, existingLifeCover: e.target.value})} className="w-full h-8 bg-white border rounded-lg px-2 outline-none" /></div>
            </div>
          </div>

          {/* STEP 3, 4 & 5 — POLICY STRUCTURING */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1">Steps 3, 4 & 5 — Plan Structure & Appended Riders</span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-semibold">
              <div><label className="text-slate-500 block">Product Type</label><input type="text" value={formData.productType} readOnly className="w-full h-9 bg-slate-50 border rounded-lg px-1 font-bold" /></div>
              <div><label className="text-slate-500 block">Sum Assured</label><select value={formData.sumAssured} className="w-full h-9 bg-white border rounded-lg px-1 outline-none"><option value="28500000">₹2.85 Crore Plan</option></select></div>
              <div><label className="text-slate-500 block">Term Horizons</label><select className="w-full h-9 bg-white border rounded-lg px-1 outline-none"><option>35 Years / 20 Pay</option></select></div>
              <div><label className="text-slate-500 block">Frequency</label><select value={formData.premiumFrequency} onChange={(e) => setFormData({...formData, premiumFrequency: e.target.value})} className="w-full h-9 bg-white border rounded-lg px-1 outline-none"><option>Half-Yearly</option><option>Annual</option></select></div>
            </div>
          </div>

          {/* STEP 6 & 7 — REAL-TIME COMPREHENSIVE INSURANCE COMPARISON TABLE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1">Step 7 — Quote Comparison & Selection Table</span>
            <div className="border border-slate-200 rounded-xl bg-white shadow-3xs w-full overflow-hidden">
              <table className="w-full text-xs text-slate-600 table-fixed border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-black text-[10px] text-slate-400 uppercase tracking-wider border-b">
                    <th className="p-2.5 text-center w-[8%]">Select</th>
                    <th className="p-2.5 text-left w-[24%]">Insurer</th>
                    <th className="p-2.5 text-left w-[22%]">Product Name</th>
                    <th className="p-2.5 text-right w-[14%]">Cover Limit</th>
                    <th className="p-2.5 text-center w-[12%]">Term / PPT</th>
                    <th className="p-2.5 text-right w-[20%]">Premium Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-[11px]">
                  {Object.values(quoteComparisonMatrix).map((row) => (
                    <tr key={row.id} onClick={() => setSelectedInsurerId(row.id)} className={`hover:bg-slate-50/40 transition-colors cursor-pointer ${selectedInsurerId === row.id ? 'bg-blue-50/10' : ''}`}>
                      <td className="p-2.5 text-center"><input type="radio" checked={selectedInsurerId === row.id} onChange={() => setSelectedInsurerId(row.id)} name="deskInsurerSelectGroup" className="text-[#0B1F5B] cursor-pointer h-3.5 w-3.5" /></td>
                      <td className="p-2.5"><span className="font-bold text-black block truncate">{row.name}</span><span className={`inline-block border text-[8px] font-black uppercase px-1 rounded mt-0.5 ${row.badgeClass}`}>{row.badge}</span></td>
                      <td className="p-2.5 text-slate-500 truncate">{row.plan}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900 whitespace-nowrap">{row.sumAssured}</td>
                      <td className="p-2.5 text-center font-semibold text-slate-700 whitespace-nowrap">{row.term}</td>
                      <td className="p-2.5 text-right font-black text-[#0B1F5B] text-xs whitespace-nowrap">₹{row.premium.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button type="button" onClick={() => triggerToast('Cached parameters in memory.')} className="h-9 px-4 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50">Save Draft</button>
              <button type="button" onClick={handleCommitFinalQuote} className="h-10 px-6 bg-black hover:bg-[#0B1F5B] text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 focus:outline-none"><Activity className="w-4 h-4 text-emerald-400" /><span>Generate Final Quote</span></button>
            </div>
          </div>

          {/* STEP 8 — FINAL QUOTE REVIEW */}
          {isQuoteFinalized && (
            <div id="step8-review-section-anchor" className="bg-white border-2 border-indigo-100 rounded-2xl p-5 shadow-md space-y-5 animate-fade-in text-left w-full max-w-full overflow-hidden">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-[#0B1F5B] tracking-tight">Step 8 — Final Quote Review</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Audit complete inherited parameters prior to final proposal validation routing.</p>
                </div>
                <span className="text-[10px] font-mono font-black text-slate-400">QT-2026-001245</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-xl p-4 bg-white shadow-3xs space-y-2 text-xs font-semibold text-slate-600">
                  <span className="font-black text-[#0B1F5B] block border-b pb-1.5 text-[10px] uppercase">Complete Policy Summary</span>
                  <div className="flex justify-between"><span>Selected Insurer:</span><span className="text-black font-extrabold">{activeQuote.name}</span></div>
                  <div className="flex justify-between"><span>Plan Blueprint:</span><span className="text-black font-bold">{activeQuote.plan}</span></div>
                  <div className="flex justify-between"><span>Sum Assured Cover:</span><span className="text-[#0B1F5B] font-black">{activeQuote.sumAssured}</span></div>
                  <div className="flex justify-between"><span>Policy Term Horizons:</span><span className="text-slate-900 font-medium">{activeQuote.term}</span></div>
                  <div className="flex justify-between"><span>Premium Payment Term:</span><span className="text-black font-medium">{formData.premiumPaymentTerm}</span></div>
                  <div className="flex justify-between"><span>Payment Frequency:</span><span className="text-slate-900 font-extrabold">{formData.premiumFrequency}</span></div>
                  <div className="flex justify-between"><span>Claim Settlement (CSR):</span><span className="text-emerald-600 font-black">{activeQuote.csr}</span></div>
                </div>

                <div className="border rounded-xl p-4 space-y-2 text-xs font-semibold text-slate-600">
                  <span className="font-black text-[#0B1F5B] block border-b pb-1.5 text-[10px] uppercase">Client Details</span>
                  <div className="flex justify-between"><span>Client Name:</span><span className="text-black font-bold truncate max-w-[140px]">{inheritedLeadData.fullName}</span></div>
                  <div className="flex justify-between"><span>Underwriting Age:</span><span className="text-black font-medium">{calculatedClientAge} Years Old</span></div>
                  <div className="flex justify-between"><span>Occupation Track:</span><span className="text-slate-900 font-medium truncate max-w-[140px]">{inheritedLeadData.occupation}</span></div>
                  <div className="flex justify-between"><span>Annual Income:</span><span className="text-slate-900 font-bold">₹{parseFloat(inheritedLeadData.annualIncome).toLocaleString()}</span></div>
                </div>
              </div>

              {/* BOUND EVENT TRIGGER ARRAYS TO PREVENT ADVISOR INTERCEPT LOCKS */}
              <div className="p-4 border border-slate-200 bg-slate-50/40 rounded-xl space-y-2.5 text-xs font-semibold text-slate-700 select-none">
                <span className="text-[10px] font-black uppercase text-[#0B1F5B] block mb-1">Agent Verification & Customer Consent Statements</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={declarations.benefitsExplained} onChange={(e) => setDeclarations({...declarations, benefitsExplained: e.target.checked})} className="rounded text-[#0B1F5B]" /> <span>Benefits explained to client</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={declarations.exclusionsExplained} onChange={(e) => setDeclarations({...declarations, exclusionsExplained: e.target.checked})} className="rounded text-[#0B1F5B]" /> <span>Exclusions explained thoroughly</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={declarations.customerUnderstandFeatures} onChange={(e) => setDeclarations({...declarations, customerUnderstandFeatures: e.target.checked})} className="rounded text-[#0B1F5B]" /> <span>Customer understands product features</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={declarations.customerAgreesPremium} onChange={(e) => setDeclarations({...declarations, customerAgreesPremium: e.target.checked})} className="rounded text-[#0B1F5B]" /> <span>Customer agrees to modal premium amount configurations</span></label>
                  <label className="flex items-center gap-2 cursor-pointer sm:col-span-2 border-t pt-2 mt-1"><input type="checkbox" checked={declarations.consentObtained} onChange={(e) => setDeclarations({...declarations, consentObtained: e.target.checked})} className="rounded text-[#0B1F5B]" /> <span className="text-[#0B1F5B] font-extrabold">Customer authorizes proposal application submission</span></label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
                <button type="button" onClick={() => triggerToast('Proposal contract files generated in system vault.')} className="w-full sm:w-auto h-10 px-4 border bg-white border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5"><Download className="w-3.5 h-3.5 text-slate-400" /><span>Download Proposal Form</span></button>
                <button type="button" onClick={handleFinalSubmitApplication} className="w-full sm:w-auto h-11 px-6 bg-[#0B1F5B] hover:bg-black text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1">
                  <span>Proceed to Proposal Submission →</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN SIDEBAR CANVAS */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-[74px] text-left select-none">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
            <div className="border-b border-slate-100 pb-1.5 flex items-center gap-1.5 text-[#0B1F5B]"><ShieldCheck className="w-4 h-4" /><h4>Selected Quote Summary</h4></div>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs font-semibold text-slate-600">
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Insurer</span><span className="text-black font-extrabold block mt-0.5 truncate">{activeQuote.name}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Plan</span><span className="text-slate-900 font-bold block mt-0.5 truncate">{activeQuote.plan}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Sum Assured</span><span className="text-[#0B1F5B] font-black block mt-0.5 text-xs">{activeQuote.sumAssured}</span></div>
              <div><span className="text-slate-400 text-[9px] uppercase block font-black">Modal Premium</span><span className="text-slate-900 font-black block mt-0.5">₹{activeQuote.premium.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-1">Premium Breakdown Section</span>
            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between"><span>Base Premium</span><span className="font-bold text-slate-900">₹{activeQuote.base.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Rider Premium</span><span className="font-bold text-slate-900">₹{activeQuote.riders.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>GST (18%)</span><span className="font-bold text-slate-900">₹{activeQuote.gst.toLocaleString()}</span></div>
              <div className="flex justify-between border-t border-dashed pt-2 mt-1"><span className="font-black text-black">Total Premium</span><span className="text-sm font-black text-[#0B1F5B]">₹{activeQuote.premium.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}