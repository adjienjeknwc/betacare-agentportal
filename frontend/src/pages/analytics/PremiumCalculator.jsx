// src/pages/analytics/PremiumCalculator.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, HelpCircle, Save, Download, User, Activity, DollarSign, Settings, Award
} from 'lucide-react';

export default function PremiumCalculator() {
  const navigate = useNavigate();

  // 1. DYNAMIC COMPACT FORM INPUT STATES
  const [inputs, setInputs] = useState({
    customerName: 'Arjun Mehta',
    age: 35,
    gender: 'Male',
    maritalStatus: 'Married',
    isSmoker: 'No',
    alcohol: 'Occasional',
    medicalHistory: 'None',
    annualIncome: 1200000,
    coverageAmount: 10000000,
    policyType: 'Term Life',
    policyTerm: 25,
    frequency: 'Annual',
    riderCritical: true,
    riderAccident: true,
    riderWaiver: false,
    riderHospital: false
  });

  // 2. LIVE ACTUARIAL COMPUTED VALUE TUNING STATES
  const [metrics, setMetrics] = useState({
    basePremium: 0,
    riderCharges: 0,
    gst: 0,
    totalPayable: 0,
    monthlyPremium: 0,
    deathBenefit: 0,
    maturityBenefit: 0,
    riskLevel: 'Low',
    recommendedPlan: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 3. LIVE MATHEMATICAL ENGINE RUNNER
  useEffect(() => {
    let factor = parseFloat(inputs.age) * 15;
    if (inputs.isSmoker === 'Yes') factor *= 1.6;
    if (inputs.gender === 'Male') factor *= 1.1;
    if (inputs.policyType === 'ULIP') factor *= 2.2;
    if (inputs.policyType === 'Retirement Plan') factor *= 2.5;

    const computedBase = Math.round((parseFloat(inputs.coverageAmount) * 0.0001) + factor);
    
    let computedRiders = 0;
    if (inputs.riderCritical) computedRiders += Math.round(computedBase * 0.15);
    if (inputs.riderAccident) computedRiders += Math.round(computedBase * 0.08);
    if (inputs.riderWaiver) computedRiders += Math.round(computedBase * 0.05);
    if (inputs.riderHospital) computedRiders += Math.round(computedBase * 0.04);

    const subTotal = computedBase + computedRiders;
    const computedGst = Math.round(subTotal * 0.18); 
    const computedTotalPayable = subTotal + computedGst;

    let monthlySplit = Math.round(computedTotalPayable / 12);
    if (inputs.frequency === 'Monthly') monthlySplit = Math.round((subTotal * 1.05) / 12);

    const computedDeathBenefit = Math.max(inputs.coverageAmount, computedBase * 10);
    const computedMaturity = inputs.policyType === 'Term Life' ? 0 : Math.round(inputs.annualIncome * 0.4 * inputs.policyTerm);

    let risk = 'Low';
    if (inputs.age > 50 || inputs.isSmoker === 'Yes') risk = 'High';
    else if (inputs.age > 40 || inputs.alcohol === 'Regular') risk = 'Moderate';

    let planName = 'Term Life Secure Plus';
    if (inputs.policyType === 'ULIP') planName = 'Smart Alpha Equity Growth Plan';
    if (inputs.policyType === 'Retirement Plan') planName = 'Guaranteed Lifetime Pension Assurance';

    setMetrics({
      basePremium: computedBase,
      riderCharges: computedRiders,
      gst: computedGst,
      totalPayable: computedTotalPayable,
      monthlyPremium: monthlySplit,
      deathBenefit: computedDeathBenefit,
      maturityBenefit: computedMaturity,
      riskLevel: risk,
      recommendedPlan: planName
    });
  }, [inputs]);

  const handleActionTrigger = (msg) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (msg === 'save') {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      }
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] relative pb-20">
      
      {/* SCOPED FORM-INPUT OVERRIDES */}
      <style dangerouslySetInnerHTML={{__html: `
        .form-input-box {
          width: 100%;
          height: 38px;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding-left: 12px;
          padding-right: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #0F172A;
          outline: none;
          transition: all 0.15s ease-in-out;
        }
        .form-input-box:focus {
          background-color: #FFFFFF;
          border-color: #0F478D;
          box-shadow: 0 0 0 1px rgba(15, 71, 141, 0.1);
        }
      `}} />

      {/* 1. STANDARDIZED NAVBAR HEADER - WIDTH ESCAPE PROTECTION */}
      <header className="w-full h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 select-none gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            type="button" 
            onClick={() => navigate('/quotations')}
            className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 transition-colors shrink-0 focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-bold text-[#0B1F5B] tracking-tight leading-none whitespace-nowrap truncate">
            Premium Calculator
          </h1>
        </div>

        <div className="flex items-center gap-4 shrink-0 ml-auto">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg relative focus:outline-none shrink-0">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span>
          </button>
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg focus:outline-none shrink-0 hidden sm:block">
            <HelpCircle className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5 select-none shrink-0">
            <div className="text-right hidden sm:block">
              <h4 className="text-xs font-bold text-slate-900 leading-none">John Smith</h4>
              <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase block mt-0.5">PREMIUM AGENT</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#0F478D] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">JS</div>
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE CONTENT CANVAS */}
      <main className="flex-1 w-full max-w-[1450px] mx-auto px-6 py-6 overflow-y-auto space-y-6">
        
        <div className="w-full text-left select-none">
          <p className="text-xs font-medium text-slate-500">
            Calculate personalized life insurance premiums and generate customer-ready quotations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
          
          {/* LEFT SECTION: CRM DATA ENTRY INPUTS */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-5">
            
            <div className="space-y-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[#0B1F5B] font-bold text-xs uppercase tracking-wide">
                <User className="w-4 h-4 text-slate-400" /> <span>Section 1 — Personal Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputWrapper label="Customer Name">
                  <input type="text" name="customerName" value={inputs.customerName} onChange={handleInputChange} className="form-input-box" />
                </InputWrapper>
                <InputWrapper label="Age Base Threshold">
                  <input type="number" name="age" value={inputs.age} onChange={handleInputChange} className="form-input-box" />
                </InputWrapper>
                <InputWrapper label="Gender Profiling">
                  <select name="gender" value={inputs.gender} onChange={handleInputChange} className="form-input-box">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </InputWrapper>
                <InputWrapper label="Marital Status Code">
                  <select name="maritalStatus" value={inputs.maritalStatus} onChange={handleInputChange} className="form-input-box">
                    <option>Single</option><option>Married</option><option>Divorced</option>
                  </select>
                </InputWrapper>
              </div>
            </div>

            <div className="space-y-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[#0B1F5B] font-bold text-xs uppercase tracking-wide">
                <Activity className="w-4 h-4 text-slate-400" /> <span>Section 2 — Health & Lifestyle Metrics</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputWrapper label="Smoking Status Profile">
                  <select name="isSmoker" value={inputs.isSmoker} onChange={handleInputChange} className="form-input-box font-bold text-rose-600">
                    <option value="No">No / Non-Smoker</option>
                    <option value="Yes">Yes / Active Smoker 🔥</option>
                  </select>
                </InputWrapper>
                <InputWrapper label="Alcohol Consumption Frequency">
                  <select name="alcohol" value={inputs.alcohol} onChange={handleInputChange} className="form-input-box">
                    <option>None</option><option>Occasional</option><option>Regular</option>
                  </select>
                </InputWrapper>
                <InputWrapper label="Existing Medical Diagnosis History">
                  <select name="medicalHistory" value={inputs.medicalHistory} onChange={handleInputChange} className="form-input-box">
                    <option>None</option><option>Diabetes</option><option>Hypertension</option>
                  </select>
                </InputWrapper>
              </div>
            </div>

            <div className="space-y-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[#0B1F5B] font-bold text-xs uppercase tracking-wide">
                <DollarSign className="w-4 h-4 text-slate-400" /> <span>Section 3 — Financial Profile Scope</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputWrapper label="Verified Gross Annual Income (₹)">
                  <input type="number" name="annualIncome" value={inputs.annualIncome} onChange={handleInputChange} className="form-input-box" />
                </InputWrapper>
                <InputWrapper label="Desired Capital Sum Assured Coverage (₹)">
                  <select name="coverageAmount" value={inputs.coverageAmount} onChange={handleInputChange} className="form-input-box font-extrabold text-[#0B1F5B]">
                    <option value={5000000}>₹50 Lakh Plan</option>
                    <option value={10000000}>₹1 Crore Secure Shield</option>
                    <option value={20000000}>₹2 Crore Elite Shield</option>
                  </select>
                </InputWrapper>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#0B1F5B] font-bold text-xs uppercase tracking-wide">
                <Settings className="w-4 h-4 text-slate-400" /> <span>Section 4 — Policy Allocation Metrics</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputWrapper label="Product Base Classification Segment">
                  <select name="policyType" value={inputs.policyType} onChange={handleInputChange} className="form-input-box font-bold">
                    <option>Term Life</option><option>ULIP</option><option>Retirement Plan</option>
                  </select>
                </InputWrapper>
                <InputWrapper label="Locked Policy Term Interval (Years)">
                  <input type="number" name="policyTerm" value={inputs.policyTerm} onChange={handleInputChange} className="form-input-box" />
                </InputWrapper>
                <InputWrapper label="Premium Invoicing Frequency Ledger">
                  <select name="frequency" value={inputs.frequency} onChange={handleInputChange} className="form-input-box">
                    <option>Annual</option><option>Half-Yearly</option><option>Quarterly</option><option>Monthly</option>
                  </select>
                </InputWrapper>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Optional Asset Protection Riders</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <RiderCheckbox label="Critical Illness Rider (+15%)" name="riderCritical" checked={inputs.riderCritical} onChange={handleInputChange} />
                  <RiderCheckbox label="Accidental Death Shield (+8%)" name="riderAccident" checked={inputs.riderAccident} onChange={handleInputChange} />
                  <RiderCheckbox label="Waiver of Premium Tier (+5%)" name="riderWaiver" checked={inputs.riderWaiver} onChange={handleInputChange} />
                  <RiderCheckbox label="Daily Hospitalization Cash (+4%)" name="riderHospital" checked={inputs.riderHospital} onChange={handleInputChange} />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SECTION: ACTUARIAL CALCULATIONS AND INSIGHTS */}
          <div className="lg:col-span-5 space-y-5 w-full">
            
            <div className="bg-[#0B1E46] text-white rounded-2xl p-5 shadow-sm space-y-4">
              <div className="border-b border-white/10 pb-2">
                <h3 className="text-xs font-black tracking-widest uppercase text-slate-400">Live Premium Calculations Ledger</h3>
              </div>

              <div className="flex justify-between items-baseline py-1 gap-2">
                <span className="text-xs text-slate-300 font-medium">Total Standard Annual Premium</span>
                <span className="text-3xl font-black tracking-tight text-white whitespace-nowrap">₹{metrics.totalPayable.toLocaleString('en-IN')}</span>
              </div>

              <div className="divide-y divide-white/5 text-xs font-semibold text-slate-300 space-y-2 pt-1">
                <div className="flex justify-between pt-2"><span>Actuarial Base Underwriting Charge</span><span>₹{metrics.basePremium.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between pt-2"><span>Aggregated Voluntary Rider Extensions</span><span>₹{metrics.riderCharges.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between pt-2"><span>Statutory Central GST Tier (18%)</span><span>₹{metrics.gst.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between pt-2 text-white font-extrabold bg-white/5 p-2 rounded-lg border border-white/10 items-center">
                  <span>Estimated Pro-Rata Monthly Split</span>
                  <span className="whitespace-nowrap">₹{metrics.monthlyPremium.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3">
              <div className="border-b pb-1.5"><h4 className="text-[10px] font-black tracking-wider uppercase text-slate-400">Guaranteed Assured Benefit Breakdown</h4></div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <span className="text-[9px] font-black tracking-wider uppercase text-slate-400 block">Sum Assured Death Payout</span>
                  <p className="text-base font-black text-rose-600 mt-1">₹{(metrics.deathBenefit / 100000).toFixed(1)} Lakh</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <span className="text-[9px] font-black tracking-wider uppercase text-slate-400 block">Maturity Benefit Return</span>
                  <p className="text-base font-black text-emerald-600 mt-1">
                    {metrics.maturityBenefit > 0 ? `₹${(metrics.maturityBenefit / 100000).toFixed(1)} Lakh` : 'Pure Term Risk'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3 border-l-4 border-l-[#0F478D]">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#0B1F5B] uppercase tracking-wide">
                <Award className="w-4 h-4 text-[#0F478D]" /> <span>Smart Recommendation Engine Insights</span>
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-extrabold text-slate-800 bg-blue-50/50 border border-blue-100 p-1.5 rounded-md block">Matched Plan: {metrics.recommendedPlan}</h5>
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed pt-1">
                  Optimized based on incoming annual asset threshold logs of ₹{inputs.annualIncome.toLocaleString('en-IN')}, age parameters, and explicit active rider coverage directives.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t text-[10px] font-bold">
                <span className="text-slate-400 uppercase">Actuarial Risk Rating:</span>
                <span className={`px-2 py-0.5 rounded font-black border uppercase tracking-wide ${
                  metrics.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : metrics.riskLevel === 'Moderate' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'
                }`}>{metrics.riskLevel} Risk Profile</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* 3. STICKY ACTION FOOTER BAR - FIXED ALIGNMENT TO PREVENT RIGHT SIDE GAP */}
      <footer className="fixed bottom-0 left-[260px] right-0 h-16 bg-white border-t border-slate-200 px-6 flex items-center justify-between shadow-md z-20 select-none">
        <button 
          type="button"
          onClick={() => navigate('/quotations')}
          className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 transition-colors focus:outline-none shrink-0"
        >
          Cancel Matrix
        </button>
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar ml-2">
          <button 
            type="button"
            onClick={() => handleActionTrigger('save')}
            disabled={isProcessing}
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 transition-colors focus:outline-none shrink-0"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>{isSaved ? 'Calculation Saved ✓' : 'Save Calculation'}</span>
          </button>
          
          <button 
            type="button"
            onClick={() => handleActionTrigger('pdf')}
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 transition-colors focus:outline-none shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>{isProcessing ? 'Compiling...' : 'Download PDF Proposal'}</span>
          </button>

          <button 
            type="button"
            onClick={() => navigate('/lead-management/add-lead/personal-details')}
            className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-9 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm focus:outline-none shrink-0"
          >
            <span>Convert to Proposal</span>
          </button>
        </div>
      </footer>

    </div>
  );
}

function InputWrapper({ label, children }) {
  return (
    <div className="space-y-1 min-w-0 w-full">
      <label className="text-[11px] font-bold text-slate-700 block truncate">{label}</label>
      {children}
    </div>
  );
}

function RiderCheckbox({ label, name, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/60 cursor-pointer select-none transition-colors text-[11px] font-bold text-slate-700 min-w-0 w-full">
      <input 
        type="checkbox" 
        name={name} 
        checked={checked} 
        onChange={onChange} 
        className="w-3.5 h-3.5 text-[#0F478D] focus:ring-[#0F478D] border-slate-300 rounded shrink-0 cursor-pointer"
      />
      <span className="truncate">{label}</span>
    </label>
  );
}