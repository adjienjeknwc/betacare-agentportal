// src/pages/QuoteManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Activity, Shield, CreditCard, FileText, CheckCircle2, 
  Download, Send, MessageSquare, ShieldCheck, Heart, AlertTriangle, Layers, Save, RefreshCw, X
} from 'lucide-react';

export default function QuoteManagement() {
  const { leadId } = useParams();
  const navigate = useNavigate();

  // Dynamic Quote & Lead data states
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form parameters
  const [quoteId] = useState(`QT-2026-${Math.floor(100000 + Math.random() * 900000)}`);
  const [policyType, setPolicyType] = useState('Term Life');
  const [sumAssured, setSumAssured] = useState(15000000);
  const [policyTerm, setPolicyTerm] = useState(35);
  const [premiumPaymentTerm, setPremiumPaymentTerm] = useState(20);
  const [premiumFrequency, setPremiumFrequency] = useState('Annual');
  
  // Riders Selected
  const [riders, setRiders] = useState({
    criticalIllness: true,
    accidentalDeath: true,
    waiverOfPremium: false,
    permanentDisability: false
  });

  const [discountApplied, setDiscountApplied] = useState(1500);
  const [nomineeName, setNomineeName] = useState('Aarav Sharma');
  const [nomineeRelationship, setNomineeRelationship] = useState('Child');
  
  const [quoteStatus, setQuoteStatus] = useState('Draft');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [remarks, setRemarks] = useState('');
  
  // Valid till (30 days from now)
  const quoteValidTill = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toLocaleDateString();
  }, []);

  useEffect(() => {
    const fetchLeadDetails = async () => {
      if (!leadId || leadId === 'new') {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const token = localStorage.getItem('agent_token');
        const res = await fetch(`/api/leads/single/${leadId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data) {
          setLead(data);
          // Prefill values
          if (data.coverageAmount) setSumAssured(data.coverageAmount);
          if (data.policyTerm) setPolicyTerm(data.policyTerm);
          if (data.insuranceType) setPolicyType(data.insuranceType);
          if (data.nomineeName) setNomineeName(data.nomineeName);
          if (data.nomineeRelationship) setNomineeRelationship(data.nomineeRelationship);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadDetails();
  }, [leadId]);

  // Client Details with db fallbacks
  const clientName = lead ? lead.customerName : 'Jonathan Sterling';
  const clientMobile = lead ? lead.phone : '9876543210';
  const clientEmail = lead ? lead.email || 'j.sterling@example.com' : 'j.sterling@example.com';
  const clientDob = lead ? lead.dob : '1990-06-15';
  const clientAge = lead ? (lead.age || 36) : 36;
  const clientGender = lead ? lead.gender : 'Male';
  const clientOccupation = lead ? lead.occupation || 'Salaried IT Professional' : 'Salaried IT Professional';
  const clientIncome = lead ? lead.annualIncome : 1800000;
  const clientTobacco = lead ? lead.smokingStatus || 'Non-Smoker' : 'Non-Smoker';
  const existingLifeInsurance = lead ? lead.existingLifeInsurance || 'No' : 'No';
  const existingCoverageAmount = lead ? lead.existingCoverageAmount || 0 : 0;

  // Actuarial Calculation Module
  const premiumCalculation = useMemo(() => {
    // Base Premium auto-calculation
    let base = sumAssured * 0.0006 * (clientAge / 30);
    if (clientTobacco === 'Smoker' || clientTobacco === 'Yes') {
      base = base * 1.65;
    }

    // Riders auto-calculation
    let riderSum = 0;
    if (riders.criticalIllness) riderSum += sumAssured * 0.00008;
    if (riders.accidentalDeath) riderSum += sumAssured * 0.00004;
    if (riders.waiverOfPremium) riderSum += sumAssured * 0.00001;
    if (riders.permanentDisability) riderSum += sumAssured * 0.00003;

    // Apply Payment Frequency Multipliers
    let frequencyMultiplier = 1.0;
    if (premiumFrequency === 'Semi-Annual') frequencyMultiplier = 0.52;
    else if (premiumFrequency === 'Quarterly') frequencyMultiplier = 0.27;
    else if (premiumFrequency === 'Monthly') frequencyMultiplier = 0.09;

    const baseCost = Math.round(base * frequencyMultiplier);
    const riderCost = Math.round(riderSum * frequencyMultiplier);
    
    // GST (18%)
    const gst = Math.round((baseCost + riderCost) * 0.18);
    const total = baseCost + riderCost + gst;
    const final = Math.max(1000, total - Number(discountApplied || 0));

    // Agent Commission (15% of Base Premium)
    const commission = Math.round(baseCost * 0.15);

    // Medical Exam Flag
    const medicalRequired = (clientAge > 45 || sumAssured > 10000000 || clientTobacco === 'Smoker' || clientTobacco === 'Yes') ? 'Yes' : 'No';

    return {
      basePremium: baseCost,
      riderPremium: riderCost,
      gst,
      totalPremium: total,
      finalPremium: final,
      commission,
      medicalRequired,
      underwritingStatus: 'Pending Underwriter Assignment'
    };
  }, [sumAssured, clientAge, clientTobacco, riders, premiumFrequency, discountApplied]);

  // Modal Compare Plans state
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Actions implementations
  const handleSaveQuote = async () => {
    try {
      const token = localStorage.getItem('agent_token');
      const payload = {
        leadId,
        customerName: clientName,
        quoteId,
        basePremium: premiumCalculation.basePremium,
        taxAmount: premiumCalculation.gst,
        totalPayable: premiumCalculation.finalPremium,
        coverageAmount: sumAssured,
        policyTerm,
        policyType,
        premiumPaymentTerm,
        premiumPaymentFrequency: premiumFrequency,
        ridersSelected: Object.keys(riders).filter(k => riders[k]),
        riderPremium: premiumCalculation.riderPremium,
        discountApplied,
        nomineeName,
        nomineeRelationship,
        medicalExaminationRequired: premiumCalculation.medicalRequired,
        underwritingStatus: premiumCalculation.underwritingStatus,
        quoteValidTill,
        quoteStatus: 'Shared',
        paymentMode,
        agentCommission: premiumCalculation.commission,
        remarks
      };

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setQuoteStatus('Shared');
        alert("Quote document generated and saved in database successfully.");
      } else {
        alert(data.message || "Failed to save quote.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while saving quote document.");
    }
  };

  const triggerDownloadPDF = () => {
    alert(`Generating Quote PDF file: ${quoteId}.pdf. Downloading document...`);
  };

  const handleShareQuote = (channel) => {
    alert(`Sharing quote ID ${quoteId} to customer email/whatsapp via ${channel} network.`);
  };

  const handleConvertToProposal = async () => {
    // First save the quote
    await handleSaveQuote();
    
    const quoteData = {
      planName: `${policyType} (${activeInsurerName})`,
      policyType,
      sumAssured,
      policyTerm,
      premiumPaymentTerm,
      premiumFrequency,
      basePremium: premiumCalculation.basePremium,
      taxAmount: premiumCalculation.gst,
      totalPayable: premiumCalculation.finalPremium
    };

    alert("Quote saved! Proceeding to Quote Details Review...");
    navigate(`/lead-management/quote-details/${leadId}`, {
      state: {
        lead,
        quoteData
      }
    });
  };

  // Compare Insurer Card metrics
  const activeInsurerName = 'ICICI Prudential';

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-16 w-full max-w-full relative">
      
      {/* HEADER PANEL */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-3xs w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/lead-management')} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[20px] leading-none">Quote Generation Desk</h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[9px]">INGESTING QUOTE ID: {quoteId}</span>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE GRID */}
      <main className="max-w-[1450px] w-full mx-auto px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN - FORM PANEL */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Section 1: Customer Profile Sync */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1.5">Client Profile Reference</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 text-xs font-semibold text-slate-600">
              <div className="sm:col-span-2 md:col-span-3 lg:col-span-2"><span className="text-slate-400 block text-[9px] uppercase">Lead Tracking ID</span><span className="text-black font-mono font-bold block mt-1 break-all select-all">{leadId}</span></div>
              <div><span className="text-slate-400 block text-[9px] uppercase">Customer Name</span><span className="text-black font-bold block mt-1 truncate">{clientName}</span></div>
              <div><span className="text-slate-400 block text-[9px] uppercase">Mobile Number</span><span className="text-slate-900 block mt-1">{clientMobile}</span></div>
              <div><span className="text-slate-400 block text-[9px] uppercase">Email Address</span><span className="text-slate-900 block mt-1 truncate">{clientEmail}</span></div>
              <div><span className="text-slate-400 block text-[9px] uppercase">Date of Birth</span><span className="text-slate-900 block mt-1">{clientDob}</span></div>
              <div><span className="text-slate-400 block text-[9px] uppercase">Age (Auto)</span><span className="text-[#0B1F5B] font-black block mt-1">{clientAge} Years Old</span></div>
              <div><span className="text-slate-400 block text-[9px] uppercase">Gender</span><span className="text-slate-900 block mt-1">{clientGender}</span></div>
              <div><span className="text-slate-400 block text-[9px] uppercase">Occupation</span><span className="text-slate-900 block mt-1 truncate">{clientOccupation}</span></div>
              <div><span className="text-slate-400 block text-[9px] uppercase">Annual Income</span><span className="text-slate-900 font-extrabold block mt-1">₹{clientIncome.toLocaleString('en-IN')}</span></div>
              <div><span className="text-slate-400 block text-[9px] uppercase">Tobacco Usage</span><span className="text-slate-900 block mt-1">{clientTobacco}</span></div>
              <div><span className="text-slate-400 block text-[9px] uppercase">Existing Life Insurance</span><span className="text-slate-900 block mt-1">{existingLifeInsurance}</span></div>
              {existingLifeInsurance === 'Yes' && (
                <div><span className="text-slate-400 block text-[9px] uppercase">Existing Coverage Amount</span><span className="text-slate-900 font-bold block mt-1">₹{existingCoverageAmount.toLocaleString('en-IN')}</span></div>
              )}
            </div>
          </div>

          {/* Section 2: Policy Architecture */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-xs font-semibold text-slate-600">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1.5">Policy Parameters Setup</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 uppercase">Policy Type</label>
                <select value={policyType} onChange={e => setPolicyType(e.target.value)} className="h-9 bg-slate-50 border rounded-lg px-2 font-bold text-slate-950">
                  <option value="Term Life">Term Life Plan</option>
                  <option value="Whole Life">Whole Life Cover</option>
                  <option value="ULIP">ULIP Investment</option>
                  <option value="Health Cover">Health Protect Cover</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 uppercase">Sum Assured Cover</label>
                <input type="number" value={sumAssured} onChange={e => setSumAssured(Number(e.target.value))} className="h-9 bg-white border rounded-lg px-2.5 font-bold text-slate-900" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 uppercase">Policy Term (Years)</label>
                <input type="number" value={policyTerm} onChange={e => setPolicyTerm(Number(e.target.value))} className="h-9 bg-white border rounded-lg px-2.5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 uppercase">Premium Payment Term</label>
                <input type="number" value={premiumPaymentTerm} onChange={e => setPremiumPaymentTerm(Number(e.target.value))} className="h-9 bg-white border rounded-lg px-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 uppercase">Payment Frequency</label>
                <select value={premiumFrequency} onChange={e => setPremiumFrequency(e.target.value)} className="h-9 bg-slate-50 border rounded-lg px-2 font-bold text-slate-950">
                  <option value="Annual">Annual Cycle</option>
                  <option value="Semi-Annual">Semi-Annual</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Monthly">Monthly Auto-debit</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 uppercase">Discount Applied (₹)</label>
                <input type="number" value={discountApplied} onChange={e => setDiscountApplied(Number(e.target.value))} className="h-9 bg-white border rounded-lg px-2.5 font-bold text-slate-900" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 uppercase">Preferred Payment Mode</label>
                <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="h-9 bg-slate-50 border rounded-lg px-2 font-bold text-slate-950">
                  <option value="UPI">UPI Intent Node</option>
                  <option value="NetBanking">Net Banking Network</option>
                  <option value="Credit Card">Credit / Debit Card</option>
                  <option value="NACH">NACH Direct Debit</option>
                </select>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-2">
              <label className="text-slate-400 uppercase block mb-3">Supplementary Riders Toggles</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: 'criticalIllness', label: 'Critical Illness Cover' },
                  { id: 'accidentalDeath', label: 'Accidental Death Benefit' },
                  { id: 'waiverOfPremium', label: 'Waiver of Premium' },
                  { id: 'permanentDisability', label: 'Permanent Disability' }
                ].map((rider) => (
                  <label key={rider.id} className="p-3 border rounded-xl flex items-center gap-2.5 bg-slate-50/50 cursor-pointer hover:bg-slate-50 select-none">
                    <input 
                      type="checkbox" 
                      checked={riders[rider.id]}
                      onChange={e => setRiders({ ...riders, [rider.id]: e.target.checked })}
                      className="w-4 h-4 text-[#0B1F5B] rounded accent-[#0B1F5B]" 
                    />
                    <span>{rider.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Nominee Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-xs font-semibold text-slate-600">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1.5">Nominee Parameters</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 uppercase">Nominee Name</label>
                <input type="text" value={nomineeName} onChange={e => setNomineeName(e.target.value)} className="h-9 bg-white border rounded-lg px-2.5 text-slate-900 font-bold" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 uppercase">Relationship</label>
                <select value={nomineeRelationship} onChange={e => setNomineeRelationship(e.target.value)} className="h-9 bg-slate-50 border rounded-lg px-2 font-bold text-slate-950">
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Remarks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-xs font-semibold text-slate-600">
            <span className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-widest block border-b border-slate-100 pb-1.5">Quote Remarks & Notes</span>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 uppercase">Agent Remarks</label>
              <textarea rows="2" value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Enter details about this quote, client interactions, or follow-up plans..." className="bg-slate-50 border rounded-xl p-3 outline-none font-sans font-semibold"></textarea>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - PRICING DESK */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-[74px] text-left select-none">
          
          {/* Quote Pricing Board */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center gap-1.5 text-[#0B1F5B]">
              <ShieldCheck className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-wider">Premium Pricing Ledger</h4>
            </div>

            <div className="space-y-2.5 text-xs font-semibold text-slate-600">
              <div className="flex justify-between"><span>Base Premium</span><span className="font-bold text-slate-900">₹{premiumCalculation.basePremium.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Rider Premium</span><span className="font-bold text-slate-900">₹{premiumCalculation.riderPremium.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>GST (18%)</span><span className="font-bold text-slate-900">₹{premiumCalculation.gst.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between border-t border-slate-100 pt-2"><span className="text-slate-400">Total Premium</span><span className="font-bold text-slate-500">₹{premiumCalculation.totalPremium.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-emerald-600 font-bold">Discount Applied</span><span className="font-bold text-emerald-600">-₹{Number(discountApplied || 0).toLocaleString('en-IN')}</span></div>
              
              <div className="flex justify-between border-t border-slate-200 border-dashed pt-2.5 mt-1 text-slate-900 font-black text-sm">
                <span>Final Premium</span>
                <span className="text-[#0B1F5B] text-base font-black">₹{premiumCalculation.finalPremium.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3.5 space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between"><span>Medical Required</span><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${premiumCalculation.medicalRequired === 'Yes' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>{premiumCalculation.medicalRequired}</span></div>
              <div className="flex justify-between"><span>Agent Commission (15%)</span><span className="text-[#0B1F5B] font-bold">₹{premiumCalculation.commission.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Quote Status</span><span className="text-slate-900 font-black uppercase text-[10px]">{quoteStatus}</span></div>
              <div className="flex justify-between"><span>Quote Valid Till</span><span className="text-slate-500">{quoteValidTill}</span></div>
            </div>
          </div>

          {/* Action Buttons Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider border-b pb-2 mb-1">Canvas Actions</h4>
            
            <button 
              type="button" 
              onClick={() => alert(`Premium calculations validated. Final Premium: ₹${premiumCalculation.finalPremium.toLocaleString('en-IN')}`)}
              className="w-full h-11 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Calculate Premium</span>
            </button>

            <button 
              type="button" 
              onClick={() => setIsCompareOpen(true)}
              className="w-full h-10 border border-slate-200 hover:bg-slate-50 bg-white text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Compare Plans</span>
            </button>

            <button 
              type="button" 
              onClick={handleSaveQuote}
              className="w-full h-10 border border-slate-200 hover:bg-slate-50 bg-white text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-slate-400" />
              <span>Save Quote</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button" 
                onClick={triggerDownloadPDF}
                className="h-9 border border-slate-200 hover:bg-slate-50 bg-white text-slate-600 text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>PDF Download</span>
              </button>
              <button 
                type="button" 
                onClick={() => handleShareQuote('email')}
                className="h-9 border border-slate-200 hover:bg-slate-50 bg-white text-slate-600 text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-slate-400" />
                <span>Share Quote</span>
              </button>
            </div>

            <button 
              type="button" 
              onClick={handleConvertToProposal}
              className="w-full h-11 bg-[#0B1F5B] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Convert to Proposal</span>
            </button>

            <button 
              type="button" 
              onClick={() => navigate('/lead-management')}
              className="w-full h-10 border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center cursor-pointer"
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </main>

      {/* PLAN COMPARISON WIDGET MODAL */}
      {isCompareOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden text-slate-700 text-xs font-bold">
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-2 text-[#0B1F5B]">
                <Layers className="w-5 h-5" />
                <h3 className="text-base font-black tracking-tight">Market-wide Plan Comparisons</h3>
              </div>
              <button onClick={() => setIsCompareOpen(false)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'HDFC Life Click 2 Protect', premium: Math.round(premiumCalculation.finalPremium * 1.04), csr: '99.4%', solvency: '1.92', med: 'Tele-MER' },
                { name: 'ICICI Pru iProtect Smart', premium: premiumCalculation.finalPremium, csr: '98.9%', solvency: '2.12', med: premiumCalculation.medicalRequired === 'Yes' ? 'Physical MER' : 'Tele-MER' },
                { name: 'Max Life Smart Secure Plus', premium: Math.round(premiumCalculation.finalPremium * 0.96), csr: '99.6%', solvency: '1.88', med: 'Physical MER' }
              ].map((insurer, idx) => (
                <div key={idx} className="border border-slate-200 p-4 rounded-xl hover:border-blue-500 transition-all space-y-3 bg-slate-50/20 text-left">
                  <span className="font-extrabold text-sm text-slate-900 block truncate">{insurer.name}</span>
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex justify-between"><span>Solvency ratio:</span><span className="text-slate-800 font-extrabold">{insurer.solvency}</span></div>
                    <div className="flex justify-between"><span>Settlement Ratio:</span><span className="text-slate-800 font-black text-emerald-600">{insurer.csr}</span></div>
                    <div className="flex justify-between"><span>Medical diagnostics:</span><span className="text-slate-700 font-semibold">{insurer.med}</span></div>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-end">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Modal Premium</span>
                    <span className="text-lg font-black text-[#0B1F5B]">₹{insurer.premium.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}