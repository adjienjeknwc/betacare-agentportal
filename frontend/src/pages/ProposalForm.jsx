// src/pages/ProposalForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Save, ShieldCheck, Heart, User, Landmark, ClipboardList, 
  CheckCircle2, AlertTriangle, FileText, Upload, ShieldAlert, Sparkles, Building2, UserCheck
} from 'lucide-react';
import { fetchFromPortal } from './api';

export default function ProposalForm() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [lead, setLead] = useState(location.state?.lead || null);
  const [loading, setLoading] = useState(!lead);
  const [toastMsg, setToastMsg] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  const quoteParams = location.state?.quoteParams || {
    planName: 'Betacare Life Term Protect',
    policyType: 'Term Life',
    sumAssured: 28500000,
    totalPayable: 23840,
    premiumFrequency: 'Annual'
  };

  // Real-world IRDAI life insurance proposal form state fields
  const [formData, setFormData] = useState({
    // Tab 1: Proposer & Insured Details
    salutation: 'Mr.',
    fullName: lead?.customerName || 'Rahul Sharma',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    dob: lead?.dob || '1992-05-14',
    gender: lead?.gender || 'Male',
    maritalStatus: 'Married',
    education: 'Post Graduate / Masters',
    panNumber: lead?.panNumber || 'ABCDE1234F',
    aadhaarNumber: lead?.aadhaarNumber || '9876 5432 1098',
    ckycNumber: 'CKYC-99882233110',
    residenceStatus: 'Resident Indian',
    city: lead?.city || 'Mumbai',
    state: lead?.state || 'Maharashtra',
    pincode: lead?.pincode || '400050',
    addressLine: lead?.address || 'Apt 402, Skyline Residency, Bandra West',

    // Tab 2: Nominee & Appointee Details
    nomineeName: lead?.nomineeName || 'Sneha Sharma',
    nomineeRelationship: lead?.nomineeRelationship || 'Spouse',
    nomineeDob: '1994-08-22',
    nomineeAge: '32',
    nomineeSharePercent: 100,
    nomineePan: 'XYZPQ9876M',
    hasMinorNominee: false,
    appointeeName: '',
    appointeeRelationship: '',

    // Tab 3: Occupation & Income
    profession: lead?.occupation || 'Salaried Software Architect',
    employerName: 'Infosys Technologies Ltd',
    annualIncome: lead?.annualIncome || 1800000,
    incomeSource: 'Salary',
    incomeProofType: 'Form 16 & Latest 3-Months Payslips',
    taxBracket: '30% Slab',
    fatcaDecl: 'India Tax Resident Only',

    // Tab 4: Comprehensive Medical, Family & Lifestyle History
    heightCm: 175,
    weightKg: 72,
    bmi: 23.5, // Auto-computed (72 / (1.75 * 1.75))
    smokingStatus: lead?.smokingStatus || 'Non-Smoker',
    alcoholStatus: 'Social Consumer (Occasional)',
    hasPreExistingIllness: 'No',
    preExistingDetails: '',
    hasChronicAilments: 'No',
    hasHospitalizationHistory: 'No',
    fatherHealth: 'Living & Healthy (Age 64)',
    motherHealth: 'Living & Healthy (Age 60)',
    familyMedicalHistory: 'No hereditary cardiovascular or malignant conditions recorded.',
    hazardousOccupation: 'No (Desk / Office Job)',

    // Tab 5: Existing Insurance Portfolio History
    hasExistingPolicies: 'No',
    existingInsurers: '',
    existingTotalSumAssured: 0,
    declinedOrPostponedHistory: 'No (Never Declined, Postponed or Rated Up)',

    // Tab 6: Bank Payout Account & Declarations
    bankHolderName: lead?.customerName || 'Rahul Sharma',
    bankName: 'HDFC Bank Ltd',
    bankAccountNumber: '50100421298451',
    bankIfscCode: 'HDFC0000060',
    accountType: 'Savings Account',
    branchName: 'Bandra West Branch, Mumbai',
    agentCode: 'AGT-475547',
    agreedToDeclaration: false,
    agreedToUnderwritingTerms: false
  });

  useEffect(() => {
    if (!lead && leadId !== 'new') {
      const fetchLead = async () => {
        try {
          const data = await fetchFromPortal(`/leads/single/${leadId}`);
          if (data) {
            setLead(data);
            setFormData(prev => ({
              ...prev,
              fullName: data.customerName || prev.fullName,
              dob: data.dob || prev.dob,
              gender: data.gender || prev.gender,
              city: data.city || prev.city,
              state: data.state || prev.state,
              annualIncome: data.annualIncome || prev.annualIncome,
              panNumber: data.panNumber || prev.panNumber,
              aadhaarNumber: data.aadhaarNumber || prev.aadhaarNumber,
              bankHolderName: data.customerName || prev.fullName
            }));
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchLead();
    } else {
      setLoading(false);
    }
  }, [leadId, lead]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleInputChange = (field, val) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: val };
      // Auto-compute BMI if height or weight changes
      if (field === 'heightCm' || field === 'weightKg') {
        const hMeters = (updated.heightCm || 175) / 100;
        const wKg = updated.weightKg || 70;
        updated.bmi = Number((wKg / (hMeters * hMeters)).toFixed(1));
      }
      return updated;
    });
  };

  const handleSaveDraft = async () => {
    try {
      const token = localStorage.getItem('agent_token');
      await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'Proposal Intake',
          proposalFormData: formData
        })
      });
      showToast('Official proposal draft saved to secure customer vault!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextTab = () => {
    const sequence = ['personal', 'nominee', 'occupation', 'medical', 'portfolio', 'bank'];
    const currentIndex = sequence.indexOf(activeTab);
    if (currentIndex < sequence.length - 1) {
      setActiveTab(sequence[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (!formData.agreedToDeclaration || !formData.agreedToUnderwritingTerms) {
        showToast('Please check all legal declarations and underwriting disclosures to proceed.');
        return;
      }
      navigate(`/lead-management/document-upload/${leadId}`, { 
        state: { lead, quoteParams, proposalFormData: formData } 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-slate-500">
        <Landmark className="w-8 h-8 animate-spin text-[#0B1F5B] mb-2" />
        <span className="text-xs font-bold uppercase tracking-wider">Loading Official Proposal Workspace...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#F5F7FB] text-left font-sans pb-20 w-full relative">
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-[#0B1F5B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 border border-blue-900 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Application Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-3xs w-full">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => navigate(`/lead-management/create-proposal/${leadId}`)} 
            className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[20px] leading-none">
              Digital Insurance Proposal Form (IRDAI Intake)
            </h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[9px]">
              Proposal Application Ref: #{leadId ? leadId.toUpperCase() : 'NEW-PROPOSAL'} • Plan: {quoteParams.planName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={handleSaveDraft} 
            className="h-9 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-xs text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>Save Draft</span>
          </button>
        </div>
      </header>

      {/* Sticky Step Navigation Bar */}
      <div className="bg-white border-b border-slate-200 w-full sticky top-[69px] z-30 select-none shadow-3xs">
        <div className="max-w-[1100px] mx-auto px-6 flex justify-between gap-1 overflow-x-auto text-[11px] font-black uppercase tracking-wider">
          {[
            { id: 'personal', label: '1. Proposer & Life Assured', icon: User },
            { id: 'nominee', label: '2. Nominee & Beneficiary', icon: Heart },
            { id: 'occupation', label: '3. Occupation & Income', icon: ClipboardList },
            { id: 'medical', label: '4. Medical & Lifestyle', icon: ShieldCheck },
            { id: 'portfolio', label: '5. Existing Coverage', icon: FileText },
            { id: 'bank', label: '6. Bank & Declarations', icon: Landmark }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors ${
                activeTab === tab.id 
                  ? 'border-[#0B1F5B] text-[#0B1F5B] font-extrabold' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-[1100px] w-full mx-auto px-6 py-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          
          {/* TAB 1: Proposer & Insured Details */}
          {activeTab === 'personal' && (
            <div className="space-y-5 text-xs font-semibold text-slate-650 text-left">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0B1F5B]" /> Section A — Proposer & Life Assured Personal Identity
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Step 1 of 6</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Salutation</label>
                  <select value={formData.salutation} onChange={e => handleInputChange('salutation', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-900">
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Full Legal Name (As per PAN/Aadhaar)</label>
                  <input type="text" value={formData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Father's Full Name</label>
                  <input type="text" value={formData.fatherName} onChange={e => handleInputChange('fatherName', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Mother's Full Name</label>
                  <input type="text" value={formData.motherName} onChange={e => handleInputChange('motherName', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Date of Birth</label>
                  <input type="date" value={formData.dob} onChange={e => handleInputChange('dob', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Gender</label>
                  <select value={formData.gender} onChange={e => handleInputChange('gender', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-900">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Third Gender">Third Gender</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Marital Status</label>
                  <select value={formData.maritalStatus} onChange={e => handleInputChange('maritalStatus', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-900">
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Educational Qualification</label>
                  <select value={formData.education} onChange={e => handleInputChange('education', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-900">
                    <option value="Post Graduate / Masters">Post Graduate / Masters</option>
                    <option value="Graduate / Bachelor Degree">Graduate / Bachelor Degree</option>
                    <option value="Higher Secondary (12th Pass)">Higher Secondary (12th Pass)</option>
                    <option value="Metriculation (10th Pass)">Metriculation (10th Pass)</option>
                  </select>
                </div>
              </div>

              {/* Identity & Tax Proof Numbers */}
              <div className="border-t pt-4 space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Government Identifiers & Address Vault</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase text-[10px] font-black">PAN Card Number</label>
                    <input type="text" value={formData.panNumber} onChange={e => handleInputChange('panNumber', e.target.value.toUpperCase())} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold font-mono uppercase" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase text-[10px] font-black">Aadhaar Card Number</label>
                    <input type="text" value={formData.aadhaarNumber} onChange={e => handleInputChange('aadhaarNumber', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold font-mono" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase text-[10px] font-black">CKYC Reference Identifier</label>
                    <input type="text" value={formData.ckycNumber} onChange={e => handleInputChange('ckycNumber', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-slate-400 uppercase text-[10px] font-black">Residential Address</label>
                    <input type="text" value={formData.addressLine} onChange={e => handleInputChange('addressLine', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase text-[10px] font-black">City, State & Pincode</label>
                    <div className="flex gap-2">
                      <input type="text" value={formData.city} placeholder="City" onChange={e => handleInputChange('city', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 text-slate-900 font-bold w-1/3" />
                      <input type="text" value={formData.state} placeholder="State" onChange={e => handleInputChange('state', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 text-slate-900 font-bold w-1/3" />
                      <input type="text" value={formData.pincode} placeholder="Pincode" onChange={e => handleInputChange('pincode', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 text-slate-900 font-bold w-1/3 font-mono" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Nominee Details */}
          {activeTab === 'nominee' && (
            <div className="space-y-5 text-xs font-semibold text-slate-650 text-left">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600" /> Section B — Beneficiary & Nominee Allocation
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Step 2 of 6</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Primary Nominee Full Name</label>
                  <input type="text" value={formData.nomineeName} onChange={e => handleInputChange('nomineeName', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Relationship to Insured</label>
                  <select value={formData.nomineeRelationship} onChange={e => handleInputChange('nomineeRelationship', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-900">
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Nominee Date of Birth</label>
                  <input type="date" value={formData.nomineeDob} onChange={e => handleInputChange('nomineeDob', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Nominee Share Allocation (%)</label>
                  <input type="number" value={formData.nomineeSharePercent} onChange={e => handleInputChange('nomineeSharePercent', Number(e.target.value))} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Nominee PAN / Identity Reference</label>
                  <input type="text" value={formData.nomineePan} onChange={e => handleInputChange('nomineePan', e.target.value.toUpperCase())} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold font-mono uppercase" />
                </div>
              </div>

              {/* Appointee Details (If Nominee is Minor) */}
              <div className="border-t pt-4 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={formData.hasMinorNominee} 
                    onChange={e => handleInputChange('hasMinorNominee', e.target.checked)} 
                    className="accent-[#0B1F5B]" 
                  />
                  <span className="text-slate-900 font-bold">Nominee is a Minor (Below 18 Years) — Require Appointee Details</span>
                </label>

                {formData.hasMinorNominee && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-black">Appointee Full Name</label>
                      <input type="text" value={formData.appointeeName} onChange={e => handleInputChange('appointeeName', e.target.value)} className="h-10 bg-white border rounded-xl px-3 text-slate-900 font-bold" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-black">Relationship to Minor Nominee</label>
                      <input type="text" value={formData.appointeeRelationship} onChange={e => handleInputChange('appointeeRelationship', e.target.value)} className="h-10 bg-white border rounded-xl px-3 text-slate-900 font-bold" />
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: Occupation & Income */}
          {activeTab === 'occupation' && (
            <div className="space-y-5 text-xs font-semibold text-slate-650 text-left">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#0B1F5B]" /> Section C — Financial & Occupational Eligibility Profile
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Step 3 of 6</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Occupation Category</label>
                  <input type="text" value={formData.profession} onChange={e => handleInputChange('profession', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Employer / Corporate Business Entity Name</label>
                  <input type="text" value={formData.employerName} onChange={e => handleInputChange('employerName', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Annual Gross Inflow Income (₹)</label>
                  <input type="number" value={formData.annualIncome} onChange={e => handleInputChange('annualIncome', Number(e.target.value))} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Primary Source of Income</label>
                  <select value={formData.incomeSource} onChange={e => handleInputChange('incomeSource', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-900">
                    <option value="Salary">Corporate Salary</option>
                    <option value="Business Profits">Business Profits / Self-Employed</option>
                    <option value="Professional Practice">Professional Practice Fees (Doctor/CA/Lawyer)</option>
                    <option value="Agriculture">Agricultural Income</option>
                    <option value="Investments & Rent">Capital Investment & Rental Yields</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Income Verification Proof Submitted</label>
                  <select value={formData.incomeProofType} onChange={e => handleInputChange('incomeProofType', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-900">
                    <option value="Form 16 & Latest 3-Months Payslips">Form 16 & Latest 3-Months Payslips</option>
                    <option value="ITR V Acknowledgement (2 Years)">ITR V Acknowledgement (2 Years)</option>
                    <option value="Audited P&L Account Statement">Audited P&L Account Statement</option>
                    <option value="Bank Account Statement (6 Months)">Bank Account Statement (6 Months)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">FATCA / Tax Residency Status</label>
                  <select value={formData.fatcaDecl} onChange={e => handleInputChange('fatcaDecl', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-900">
                    <option value="India Tax Resident Only">India Tax Resident Only</option>
                    <option value="Dual Tax Resident (US/FATCA Reportable)">Dual Tax Resident (US/FATCA Reportable)</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Medical Questions */}
          {activeTab === 'medical' && (
            <div className="space-y-5 text-xs font-semibold text-slate-650 text-left">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Section D — Health, Lifestyle & Medical Underwriting History
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Step 4 of 6</span>
              </div>

              {/* Physical Parameters & BMI */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Height (in cm)</label>
                  <input type="number" value={formData.heightCm} onChange={e => handleInputChange('heightCm', Number(e.target.value))} className="h-10 bg-white border rounded-xl px-3 text-slate-900 font-bold" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Weight (in kg)</label>
                  <input type="number" value={formData.weightKg} onChange={e => handleInputChange('weightKg', Number(e.target.value))} className="h-10 bg-white border rounded-xl px-3 text-slate-900 font-bold" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Calculated BMI Index</label>
                  <div className="h-10 bg-white border rounded-xl px-3 flex items-center justify-between text-slate-900 font-bold font-mono">
                    <span>{formData.bmi} kg/m²</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-sans ${
                      formData.bmi >= 18.5 && formData.bmi <= 24.9 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {formData.bmi >= 18.5 && formData.bmi <= 24.9 ? 'Normal' : 'Overweight'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lifestyle Habits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Tobacco / Smoking Usage</label>
                  <select value={formData.smokingStatus} onChange={e => handleInputChange('smokingStatus', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-900">
                    <option value="Non-Smoker">Non-Smoker (Never Used Tobacco)</option>
                    <option value="Smoker (Cigarettes/Gutka/Vape)">Smoker (Cigarettes / Gutka / Vape)</option>
                    <option value="Ex-Smoker (Quit > 3 Years)">Ex-Smoker (Quit &gt; 3 Years)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Alcohol Consumption</label>
                  <select value={formData.alcoholStatus} onChange={e => handleInputChange('alcoholStatus', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-900">
                    <option value="None / Abstaining">None / Abstaining</option>
                    <option value="Social Consumer (Occasional)">Social Consumer (Occasional)</option>
                    <option value="Regular Consumer (> 2 Pegs/Day)">Regular Consumer (&gt; 2 Pegs/Day)</option>
                  </select>
                </div>
              </div>

              {/* Medical History Checklist */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Pre-existing Medical Condition Questionnaire</h4>
                
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border">
                  <div>
                    <span className="font-bold text-slate-900 block">Diabetes, Hypertension or Heart Disease</span>
                    <span className="text-slate-450 block mt-0.5">Has the client been diagnosed or treated for high blood pressure, elevated blood sugar or cardiovascular conditions?</span>
                  </div>
                  <select value={formData.hasPreExistingIllness} onChange={e => handleInputChange('hasPreExistingIllness', e.target.value)} className="h-9 w-24 bg-white border rounded-lg px-2 font-bold text-slate-900">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border">
                  <div>
                    <span className="font-bold text-slate-900 block">Surgical & Hospitalization History</span>
                    <span className="text-slate-450 block mt-0.5">Has the applicant undergone major surgical operation or hospital stay exceeding 5 consecutive days in the past 5 years?</span>
                  </div>
                  <select value={formData.hasHospitalizationHistory} onChange={e => handleInputChange('hasHospitalizationHistory', e.target.value)} className="h-9 w-24 bg-white border rounded-lg px-2 font-bold text-slate-900">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border">
                  <div>
                    <span className="font-bold text-slate-900 block">Hazardous Occupation / Adventure Sports</span>
                    <span className="text-slate-450 block mt-0.5">Does the applicant engage in underground mining, aviation, deep sea diving or military operations?</span>
                  </div>
                  <select value={formData.hazardousOccupation} onChange={e => handleInputChange('hazardousOccupation', e.target.value)} className="h-9 w-24 bg-white border rounded-lg px-2 font-bold text-slate-900">
                    <option value="No (Desk / Office Job)">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: Existing Insurance Portfolio */}
          {activeTab === 'portfolio' && (
            <div className="space-y-5 text-xs font-semibold text-slate-650 text-left">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> Section E — Existing Insurance Portfolio & Past Proposal History
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Step 5 of 6</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase text-[10px] font-black">Holds Existing Life Insurance Policies</label>
                  <select value={formData.hasExistingPolicies} onChange={e => handleInputChange('hasExistingPolicies', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-900">
                    <option value="No">No (First Time Insurance Applicant)</option>
                    <option value="Yes">Yes (Holds Active Policies with Insurers)</option>
                  </select>
                </div>

                {formData.hasExistingPolicies === 'Yes' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-black">Insurer Names & Policy Numbers</label>
                      <input type="text" placeholder="e.g. HDFC Life (Pol #9988221)" value={formData.existingInsurers} onChange={e => handleInputChange('existingInsurers', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 uppercase text-[10px] font-black">Total Existing Sum Assured (₹)</label>
                      <input type="number" value={formData.existingTotalSumAssured} onChange={e => handleInputChange('existingTotalSumAssured', Number(e.target.value))} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                    </div>
                  </>
                )}
              </div>

              <div className="border-t pt-4 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Past Proposal Underwriting Decision History</h4>
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border">
                  <div>
                    <span className="font-bold text-slate-900 block">Has any life insurance proposal ever been declined, postponed, or issued with extra premium?</span>
                    <span className="text-slate-450 block mt-0.5">Disclose any historical adverse underwriting ratings across all life insurance companies in India.</span>
                  </div>
                  <select value={formData.declinedOrPostponedHistory} onChange={e => handleInputChange('declinedOrPostponedHistory', e.target.value)} className="h-10 w-44 bg-white border rounded-xl px-2 font-bold text-slate-900">
                    <option value="No (Never Declined, Postponed or Rated Up)">No (Clean Record)</option>
                    <option value="Yes (Issued with Extra Premium)">Yes (Rated Up)</option>
                    <option value="Yes (Declined / Postponed)">Yes (Declined / Postponed)</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: Bank Details & Declarations */}
          {activeTab === 'bank' && (
            <div className="space-y-6 text-xs font-semibold text-slate-650 text-left">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#0B1F5B]" /> Section F — Bank Account Details & Legal Declarations
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Step 6 of 6</span>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Direct Auto-Debit & Payout Bank Account Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase text-[10px] font-black">Account Holder Name (As in Passbook)</label>
                    <input type="text" value={formData.bankHolderName} onChange={e => handleInputChange('bankHolderName', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase text-[10px] font-black">Bank Entity Name</label>
                    <input type="text" value={formData.bankName} onChange={e => handleInputChange('bankName', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase text-[10px] font-black">Account Number</label>
                    <input type="text" value={formData.bankAccountNumber} onChange={e => handleInputChange('bankAccountNumber', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold font-mono" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase text-[10px] font-black">IFSC Code & Account Type</label>
                    <div className="flex gap-2">
                      <input type="text" value={formData.bankIfscCode} onChange={e => handleInputChange('bankIfscCode', e.target.value.toUpperCase())} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold font-mono uppercase flex-1" />
                      <select value={formData.accountType} onChange={e => handleInputChange('accountType', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-900 flex-1">
                        <option value="Savings Account">Savings Account</option>
                        <option value="Current Account">Current Account</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent Confidentiality Code & Verification */}
              <div className="bg-blue-50/20 border border-blue-150 rounded-2xl p-4 space-y-2 text-left">
                <div className="flex items-center gap-2 text-[#0B1F5B] text-xs font-black uppercase tracking-wider">
                  <UserCheck className="w-4 h-4" /> Agent Confidential Report (ACR) Validation
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Authorized Agent Code</span>
                    <span className="text-slate-900 font-bold font-mono block mt-0.5">{formData.agentCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Agent Recommendation</span>
                    <span className="text-emerald-700 font-extrabold block mt-0.5">Verified Identity & Solvency — Recommended</span>
                  </div>
                </div>
              </div>

              {/* Legal Declarations */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">IRDAI Statutory Disclosures & Consent</h4>
                
                <label className="p-4 border border-blue-100 bg-blue-50/10 rounded-2xl flex items-start gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={formData.agreedToDeclaration} 
                    onChange={e => handleInputChange('agreedToDeclaration', e.target.checked)} 
                    className="mt-0.5 accent-[#0B1F5B]" 
                  />
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-extrabold">I certify and verify all statements to be true and accurate</span>
                    <span className="text-[10px] text-slate-450 font-semibold block mt-0.5 leading-relaxed">
                      I hereby declare that the statements made in this proposal are true and complete. I authorize Betacare Life Insurance and its underwriting medical team to exchange medical and financial records with certified CKYC and Aadhaar vaults.
                    </span>
                  </div>
                </label>

                <label className="p-4 border border-blue-100 bg-blue-50/10 rounded-2xl flex items-start gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={formData.agreedToUnderwritingTerms} 
                    onChange={e => handleInputChange('agreedToUnderwritingTerms', e.target.checked)} 
                    className="mt-0.5 accent-[#0B1F5B]" 
                  />
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-extrabold">Agreement to Underwriting Risk Review & Anti-Money Laundering (AML) Guidelines</span>
                    <span className="text-[10px] text-slate-450 font-semibold block mt-0.5 leading-relaxed">
                      I confirm compliance with Section 45 of Insurance Act 1938 and understand that non-disclosure of material facts may impact proposal evaluation.
                    </span>
                  </div>
                </label>
              </div>

            </div>
          )}

          {/* Action Footer Button Strip */}
          <div className="pt-4 border-t flex justify-between items-center select-none">
            <button
              type="button"
              onClick={() => {
                const sequence = ['personal', 'nominee', 'occupation', 'medical', 'portfolio', 'bank'];
                const currentIndex = sequence.indexOf(activeTab);
                if (currentIndex > 0) setActiveTab(sequence[currentIndex - 1]);
              }}
              disabled={activeTab === 'personal'}
              className={`h-11 px-5 border border-slate-200 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                activeTab === 'personal' ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>← Previous Section</span>
            </button>

            <button
              type="button"
              onClick={handleNextTab}
              className="h-11 px-6 bg-[#0B1F5B] hover:bg-black text-white font-black text-xs rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-md"
            >
              <span>{activeTab === 'bank' ? 'Proceed to Document Upload →' : 'Next Section →'}</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
