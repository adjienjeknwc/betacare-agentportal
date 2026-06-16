// src/pages/analytics/PolicyComparison.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, HelpCircle, Plus, Trash2, Check, X, Shield, 
  Sparkles, FileText, Download, Share2, Save, ArrowRight, Layers, SlidersHorizontal
} from 'lucide-react';

export default function PolicyComparison() {
  const navigate = useNavigate();

  // 1. EXTENSIVE ENTERPRISE INSURANCE MASTER DATABANK
  const policyDatabase = {
    "Term Life Secure": {
      name: "Term Life Secure", type: "Term Life", risk: "Low", premiumRange: "Low", monthlyPremium: "₹1,250", annualPremium: "₹14,200",
      coverage: "₹1 Crore", term: "25 Years", maturity: "Pure Risk (₹0 Base)", claimRatio: "99.2%", taxBenefit: "Section 80C Exempt",
      lockIn: "None", returnPotential: "Guaranteed Protection", riders: "Critical Illness, Accidental Death", medicalReq: "Full Tele-Medical",
      surrender: "Zero Value", audience: "Young Professionals", ageGroup: "21 - 45 Years", style: "Conservative Protection",
      pros: ["Lowest Premium Cost", "High Death Benefit Cover", "Flexible Added Riders"], cons: ["No Maturity Cash Value", "Strict Underwriting Rules"],
      criticalIllness: "Optional (Extra Cost)", accidentalDeath: "Included", waiverPremium: "Optional", hospitalCash: "Not Available"
    },
    "ULIP Growth Plus": {
      name: "ULIP Growth Plus", type: "ULIP Plan", risk: "High", premiumRange: "High", monthlyPremium: "₹4,800", annualPremium: "₹55,000",
      coverage: "₹50 Lakh", term: "15 Years", maturity: "Market Linked (~₹14.5 Lakh)", claimRatio: "98.6%", taxBenefit: "Sec 80C & 10(10D)",
      lockIn: "5 Years", returnPotential: "Market Linked (12-14% Est)", riders: "Premium Waiver Shield", medicalReq: "Self Declaration Only",
      surrender: "Allowed post 5Y", audience: "Aggressive Investors", ageGroup: "25 - 40 Years", style: "Market-Linked Growth",
      pros: ["Wealth Accumulation Factor", "Tax Exempt Yields", "Fund Switching Options"], cons: ["Market Volatility Risk", "5-Year Lock-in Restriction"],
      criticalIllness: "Not Available", accidentalDeath: "Optional", waiverPremium: "Included", hospitalCash: "Optional"
    },
    "Family Shield Plan": {
      name: "Family Shield Plan", type: "Family Floater", risk: "Low", premiumRange: "Medium", monthlyPremium: "₹2,650", annualPremium: "₹30,500",
      coverage: "₹75 Lakh", term: "20 Years", maturity: "Guaranteed (₹4.2 Lakh Payout)", claimRatio: "99.0%", taxBenefit: "Section 80C Eligible",
      lockIn: "None", returnPotential: "Fixed 5.5% Return", riders: "Hospital Cash Daily", medicalReq: "Basic Vitals Checked",
      surrender: "Guaranteed Scale", audience: "Married with Kids", ageGroup: "30 - 50 Years", style: "Balanced Family Security",
      pros: ["Comprehensive Group Cover", "Guaranteed Maturity Cash", "Relaxed Underwriting"], cons: ["Higher Premium Track", "Moderate Inflation Lag"],
      criticalIllness: "Optional", accidentalDeath: "Included", waiverPremium: "Optional", hospitalCash: "Included"
    },
    "Retirement Secure": {
      name: "Retirement Secure", type: "Annuity", risk: "Low", premiumRange: "High", monthlyPremium: "₹8,000", annualPremium: "₹92,000",
      coverage: "₹40 Lakh", term: "30 Years", maturity: "Lifetime Deferred Annuity", claimRatio: "98.9%", taxBenefit: "Sec 80CCC Benefit",
      lockIn: "10 Years", returnPotential: "Guaranteed Fixed Pension", riders: "Spouse Pension Cover", medicalReq: "No Medicals Required",
      surrender: "Restricted Value", audience: "Retirement Planning", ageGroup: "35 - 55 Years", style: "Guaranteed Income Flow",
      pros: ["Lifetime Income Security", "Spousal Protection Cover", "No Medical Underwriting"], cons: ["Highly Illiquid Asset", "Lower Yield Versus Equity"],
      criticalIllness: "Not Available", accidentalDeath: "Not Available", waiverPremium: "Included", hospitalCash: "Not Available"
    }
  };

  // 2. ACTIVE DROPDOWN MUTATION STATES
  const [selectedPolicies, setSelectedPolicies] = useState([
    "Term Life Secure",
    "ULIP Growth Plus",
    "Family Shield Plan"
  ]);

  const [globalFilters, setGlobalFilters] = useState({
    type: 'All',
    risk: 'All',
    premium: 'All'
  });

  const [consultationNotes, setConsultationNotes] = useState(
    "Customer prefers lower premium track initially.\nInterested in long-term child education milestone targets.\nLooking for absolute section 80C tax-saving eligibility profiles."
  );
  const [isSaved, setIsSaved] = useState(false);

  // Dynamic state modification rules
  const handleDropdownChange = (index, value) => {
    setSelectedPolicies(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addPolicyColumn = () => {
    if (selectedPolicies.length < 4) {
      const remaining = Object.keys(policyDatabase).find(p => !selectedPolicies.includes(p));
      setSelectedPolicies(prev => [...prev, remaining || Object.keys(policyDatabase)[0]]);
    }
  };

  const removePolicyColumn = (index) => {
    if (selectedPolicies.length > 1) {
      setSelectedPolicies(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] overflow-x-hidden relative pb-20">
      
      {/* 1. STANDARDIZED DASHBOARD TOP NAVBAR */}
      <header className="w-full h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 select-none gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            type="button" 
            onClick={() => navigate('/quotations')}
            className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 transition-colors shrink-0 focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold text-[#0B1F5B] tracking-tight leading-none whitespace-nowrap">
            Policy Comparison Grid
          </h1>
        </div>

        {/* Global Utilities Frame */}
        <div className="flex items-center gap-4 shrink-0 ml-auto">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg relative focus:outline-none shrink-0">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span>
          </button>
          <div className="flex items-center gap-2.5 select-none shrink-0">
            <div className="text-right hidden sm:block">
              <h4 className="text-xs font-bold text-slate-900 leading-none">John Smith</h4>
              <span className="text-[9px] text-slate-400 font-black tracking-wider block mt-0.5">PREMIUM AGENT</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#0F478D] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">JS</div>
          </div>
        </div>
      </header>

      {/* 2. MAIN SCROLL CONTAINER COMPACT WORKSPACE */}
      <main className="flex-1 w-full max-w-[1450px] mx-auto px-6 py-6 overflow-y-auto space-y-6">
        
        {/* Caption Description Strip */}
        <div className="w-full text-left select-none">
          <p className="text-sm text-slate-500 font-medium">
            Compare insurance plans, premiums, returns and benefits to recommend the best policy for your customer.
          </p>
        </div>

        {/* TOP CONTROL HUB TOOLBAR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-4 select-none">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
            
            {/* Dynamic Column Mutators */}
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={addPolicyColumn}
                disabled={selectedPolicies.length >= 4}
                className="bg-blue-50 hover:bg-blue-100 text-[#0F478D] border border-blue-200 text-xs font-bold h-8 px-3 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
              >
                <Plus className="w-3.5 h-3.5" /> Add Policy Column
              </button>
            </div>

            {/* Quick Filters Group */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" /> <span>Filters:</span>
              </div>
              <select className="bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] h-8 px-2 rounded-lg focus:outline-none focus:border-[#0F478D]">
                <option>Policy Type: All</option><option>Term Plan</option><option>Investment (ULIP)</option>
              </select>
              <select className="bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] h-8 px-2 rounded-lg focus:outline-none focus:border-[#0F478D]">
                <option>Risk Profile: All</option><option>Low Risk</option><option>High Risk</option>
              </select>
            </div>
          </div>

          {/* POLICY SELECTOR SELECTION DROPDOWN COLUMN CELLS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 items-center">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider hidden lg:block">Active Selection Slot:</div>
            {selectedPolicies.map((activeName, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-between gap-1.5 relative group">
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-[#0F478D] block uppercase tracking-wide">Slot Profile {String.fromCharCode(65 + idx)}</span>
                  <select 
                    value={activeName}
                    onChange={(e) => handleDropdownChange(idx, e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer pt-0.5"
                  >
                    {Object.keys(policyDatabase).map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                {selectedPolicies.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removePolicyColumn(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors focus:outline-none"
                    title="Remove allocation track"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MAIN SIDE-BY-SIDE SIDE COMPARISON MATRIX COMPACT MATRIX TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden flex flex-col w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse table-fixed min-w-[750px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-400 tracking-wider select-none">
                  <th className="py-3 px-5 w-52 bg-slate-50 border-r sticky left-0 z-10">CORE COMPARISON ATTRIBUTES</th>
                  {selectedPolicies.map((pName, idx) => (
                    <th key={idx} className="py-3 px-5 text-[#0B1F5B] font-extrabold uppercase border-r bg-blue-50/20">
                      Policy Slot {String.fromCharCode(65 + idx)}: <span className="block text-slate-800 font-bold normal-case text-xs pt-0.5">{pName}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                
                {/* FINANCIAL ATTRIBUTES MAPPING LINES */}
                <tr className="bg-slate-50/40 font-bold text-[10px] text-[#0F478D] uppercase tracking-wide select-none">
                  <td colSpan={selectedPolicies.length + 1} className="py-1 px-5 border-y border-slate-200/60 bg-slate-100/40">1. Premium Invoicing Matrices</td>
                </tr>
                <ComparisonRow label="Estimated Monthly Premium" attr="monthlyPremium" keys={selectedPolicies} db={policyDatabase} highlight={true} />
                <ComparisonRow label="Standard Annual Premium" attr="annualPremium" keys={selectedPolicies} db={policyDatabase} />
                
                <tr className="bg-slate-50/40 font-bold text-[10px] text-[#0F478D] uppercase tracking-wide select-none">
                  <td colSpan={selectedPolicies.length + 1} className="py-1 px-5 border-y border-slate-200/60 bg-slate-100/40">2. Coverage Scale & Return Horizon Benefit Payouts</td>
                </tr>
                <ComparisonRow label="Capital Sum Assured Cover" attr="coverage" keys={selectedPolicies} db={policyDatabase} boldText={true} />
                <ComparisonRow label="Policy Horizon Duration" attr="term" keys={selectedPolicies} db={policyDatabase} />
                <ComparisonRow label="Estimated Maturity Payout" attr="maturity" keys={selectedPolicies} db={policyDatabase} />
                <ComparisonRow label="Claim Settlement Ratio" attr="claimRatio" keys={selectedPolicies} db={policyDatabase} greenText={true} />

                <tr className="bg-slate-50/40 font-bold text-[10px] text-[#0F478D] uppercase tracking-wide select-none">
                  <td colSpan={selectedPolicies.length + 1} className="py-1 px-5 border-y border-slate-200/60 bg-slate-100/40">3. Lock-in Regulations & Structural Risk Scales</td>
                </tr>
                <ComparisonRow label="Taxation Relief Status" attr="taxBenefit" keys={selectedPolicies} db={policyDatabase} />
                <ComparisonRow label="Mandatory Lock-in Period" attr="lockIn" keys={selectedPolicies} db={policyDatabase} />
                <ComparisonRow label="Actuarial Risk Level Classification" attr="risk" keys={selectedPolicies} db={policyDatabase} />
                <ComparisonRow label="Long Term Yield Potential" attr="returnPotential" keys={selectedPolicies} db={policyDatabase} />
                <ComparisonRow label="Medical Screening Requirements" attr="medicalReq" keys={selectedPolicies} db={policyDatabase} />
                <ComparisonRow label="Surrender Liquid Valuations" attr="surrender" keys={selectedPolicies} db={policyDatabase} />

              </tbody>
            </table>
          </div>
        </div>

        {/* RIDER BENEFITS COMPARISON COMPARATIVE MATRIX COMPACT MODULE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3">
          <div className="border-b border-slate-100 pb-2 select-none">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Asset Protection Rider Integration Grid</h3>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs table-fixed min-w-[650px] divide-y divide-slate-100">
              <thead>
                <tr className="text-[10px] font-bold uppercase text-slate-400 tracking-wider select-none">
                  <th className="py-2 w-48">RIDER CLASS OPTION</th>
                  {selectedPolicies.map((pName, i) => (<th key={i} className="py-2 px-4 truncate">{pName}</th>))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                <ComparisonRow label="Critical Illness Base Cover" attr="criticalIllness" keys={selectedPolicies} db={policyDatabase} />
                <ComparisonRow label="Accidental Death Shield" attr="accidentalDeath" keys={selectedPolicies} db={policyDatabase} />
                <ComparisonRow label="Waiver of Premium Tier" attr="waiverPremium" keys={selectedPolicies} db={policyDatabase} />
                <ComparisonRow label="Daily Hospitalization Cash" attr="hospitalCash" keys={selectedPolicies} db={policyDatabase} />
              </tbody>
            </table>
          </div>
        </div>

        {/* PROS AND CONS ANALYSIS SPLITS CARD BLOCK */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {selectedPolicies.map((pName, idx) => {
            const current = policyDatabase[pName];
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
                <div>
                  <div className="border-b pb-1.5 mb-3 flex justify-between items-center select-none">
                    <span className="text-[9px] font-black tracking-wider text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded uppercase">Slot {String.fromCharCode(65 + idx)} Summary</span>
                    <h4 className="text-xs font-black text-[#0B1F5B] truncate max-w-[150px]">{pName}</h4>
                  </div>
                  
                  {/* PROS MAPPING LAYER */}
                  <div className="space-y-1.5 mb-4">
                    <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-wider select-none">Core Advantages:</h5>
                    {current.pros.map((pro, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> <span>{pro}</span>
                      </div>
                    ))}
                  </div>

                  {/* CONS MAPPING LAYER */}
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-wider select-none">Risk Constraints:</h5>
                    {current.cons.map((con, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 font-medium">
                        <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" /> <span>{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CHARTS PROFILE REPLICATION GRAPHICS GRID BLOCK CHIPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-none">
          
          {/* VISUAL ANALYTICS CARD 1: PREMIUM RATIO COMPARISON */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3">
            <div className="border-b pb-1.5"><h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Actuarial Annual Premium Cost Allocation Metric</h4></div>
            <div className="space-y-2 pt-2">
              {selectedPolicies.map((pName, i) => {
                const current = policyDatabase[pName];
                const numericalPremium = parseInt(current.annualPremium.replace(/[^\d]/g, ''), 10) || 0;
                const ratioPct = Math.min(100, Math.round((numericalPremium / 92000) * 100));
                return (
                  <div key={i} className="space-y-1 text-xs font-bold">
                    <div className="flex justify-between text-slate-600"><span>{pName}</span><span className="text-[#0B1F5B] font-black">{current.annualPremium}/yr</span></div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/30">
                      <div className="h-full bg-[#0F478D] rounded-full transition-all" style={{ width: `${ratioPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VISUAL ANALYTICS CARD 2: CUSTOMER TARGET DEMOGRAPHIC PERSONA MATCH */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3">
            <div className="border-b pb-1.5"><h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Strategic Target Audience Alignment Profiles</h4></div>
            <div className="divide-y divide-slate-100 text-xs font-medium">
              {selectedPolicies.map((pName, i) => {
                const current = policyDatabase[pName];
                return (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="text-slate-900 font-bold block">{pName}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Investment Allocation: {current.style}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-[#0F478D] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider">{current.audience}</span>
                      <span className="text-[9px] text-slate-400 font-black block mt-0.5 uppercase">Ages {current.ageGroup}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* EXECUTIVE RECOMMENDATION & NOTES WRAPPER MATRIX SEGMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* SMART INTELLIGENCE RECOMMENDATION CONSOLE */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs border-l-4 border-l-blue-600 space-y-3 flex flex-col justify-between h-full min-h-[200px]">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#0B1F5B] uppercase tracking-wide select-none">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" /> <span>Recommendation Engine Target</span>
              </div>
              <div className="pt-1">
                <h5 className="text-xs font-black text-slate-800 bg-blue-50 border px-2 py-1.5 rounded-lg inline-block">Recommended Option: Term Life Secure</h5>
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed pt-2">
                  Best aligned configuration suited for explicit young professional age profiling vectors, risk avoidance patterns, and immediate high-protection asset locking targets.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 select-none border-t border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider">
              <div><span>Affordability Rating</span><span className="block text-xs font-black text-emerald-600 pt-0.5">9.4 / 10</span></div>
              <div><span>Risk Harmony</span><span className="block text-xs font-black text-[#0B1F5B] pt-0.5">Optimal Match</span></div>
              <div><span>Long Value Yield</span><span className="block text-xs font-black text-slate-800 pt-0.5">High Protection</span></div>
            </div>
          </div>

          {/* DYNAMIC AGENT NOTES ENTRY COMPONENT BLOCK */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3 flex flex-col justify-between h-full min-h-[200px]">
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider select-none">Consultation Notes & Direct Client Preferences</h4>
              <textarea 
                rows={3}
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                placeholder="Type customer consultation parameters here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#0F478D] transition-all resize-none shadow-inner"
              />
            </div>
            
            <div className="flex items-center justify-end select-none pt-1">
              <button 
                type="button"
                onClick={() => {
                  setIsSaved(true);
                  setTimeout(() => setIsSaved(false), 2000);
                }}
                className="bg-slate-100 hover:bg-slate-200 border text-slate-700 font-bold text-xs h-8 px-3 rounded-lg transition-colors flex items-center gap-1 focus:outline-none"
              >
                <Save className="w-3.5 h-3.5 text-slate-400" />
                <span>{isSaved ? "Notes Committed ✓" : "Commit Changes"}</span>
              </button>
            </div>
          </div>

        </div>

        {/* CENTRAL REGULATORY DIRECTIVE COMPLIANCE PANEL SLIDER CHIP */}
        <div className="w-full bg-slate-100/70 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2 select-none text-[10px] font-bold text-slate-400">
          <Shield className="w-4 h-4 text-slate-400 shrink-0" />
          <span>All displayed policy parameters, compliance profiles, and comparison metrics strictly comply with current IRDAI insurance aggregation rules and financial analysis standard criteria rules.</span>
        </div>

      </main>

      {/* 3. ADHERED COMPACT STICKY BOTTOM TOOLBAR ACTION BAR */}
      <footer className="fixed bottom-0 left-[260px] right-0 h-16 bg-white border-t border-slate-200 px-6 flex items-center justify-between shadow-xl z-20 select-none">
        <button 
          type="button"
          onClick={() => navigate('/quotations')}
          className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs h-9 px-4 rounded-xl transition-colors focus:outline-none"
        >
          Return to Ledger
        </button>
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar ml-2">
          <button type="button" className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 transition-colors focus:outline-none"><Download className="w-3.5 h-3.5 text-slate-400" /><span>Download PDF Grid</span></button>
          <button type="button" className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 transition-colors focus:outline-none"><Share2 className="w-3.5 h-3.5 text-slate-400" /><span>Share Proposal</span></button>
          <button 
            type="button"
            onClick={() => navigate('/lead-management/add-lead/personal-details')}
            className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-9 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm focus:outline-none"
          >
            <span>Generate Active Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

    </div>
  );
}

// Presentational Sub-tier grid generation row logic
function ComparisonRow({ label, attr, keys, db, highlight, boldText, greenText }) {
  return (
    <tr className={`transition-colors border-r ${highlight ? 'bg-blue-50/10 font-bold' : 'hover:bg-slate-50/40'}`}>
      <td className="py-2.5 px-5 font-bold text-slate-500 border-r bg-slate-50/30 sticky left-0 z-10 w-52 truncate">{label}</td>
      {keys.map((pKey, i) => {
        const rowVal = db[pKey]?.[attr] || "Not Available";
        return (
          <td key={i} className={`py-2.5 px-5 border-r truncate ${
            boldText || highlight ? 'font-extrabold text-[#0B1E46]' : greenText ? 'text-emerald-600 font-bold' : 'text-slate-700'
          }`}>
            {rowVal === "Included" ? <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Covered</span> : rowVal}
          </td>
        );
      })}
    </tr>
  );
}