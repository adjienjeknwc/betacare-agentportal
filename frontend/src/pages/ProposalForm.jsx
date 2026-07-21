// src/pages/ProposalForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, ShieldCheck, Heart, User, Landmark, ClipboardList, CheckCircle2 } from 'lucide-react';
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

  // Form state fields
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: lead?.customerName || '',
    dob: lead?.dob || '',
    gender: lead?.gender || 'Male',
    city: lead?.city || '',
    state: lead?.state || 'Maharashtra',
    
    // Nominee Details
    nomineeName: 'Sneha Sharma',
    nomineeRelationship: 'Spouse',
    nomineeAge: '32',

    // Occupation & Income
    profession: lead?.occupation || 'Salaried Software Engineer',
    employerName: 'Infosys Technologies',
    annualIncome: lead?.annualIncome || 1800000,
    incomeSource: 'Salary',

    // Medical Questions
    hasPreExistingIllness: 'No',
    hasChronicAilments: 'No',
    hasHospitalizationHistory: 'No',

    // Existing Policies
    hasExistingPolicies: 'No',
    existingCoverageAmount: 0,

    // Bank Details
    bankHolderName: lead?.customerName || '',
    bankName: 'HDFC Bank Ltd',
    bankAccountNumber: '50100421298451',
    bankIfscCode: 'HDFC0000060',

    // Declaration
    agreedToDeclaration: false
  });

  useEffect(() => {
    if (!lead) {
      const fetchLead = async () => {
        try {
          const data = await fetchFromPortal(`/leads/single/${leadId}`);
          setLead(data);
          setFormData(prev => ({
            ...prev,
            fullName: data.customerName || '',
            dob: data.dob || '',
            gender: data.gender || 'Male',
            city: data.city || '',
            state: data.state || 'Maharashtra',
            annualIncome: data.annualIncome || 1800000,
            bankHolderName: data.customerName || ''
          }));
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchLead();
    }
  }, [leadId, lead]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSaveDraft = async () => {
    try {
      const token = localStorage.getItem('agent_token');
      // Save draft details
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
      showToast('Proposal draft saved successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextTab = () => {
    const sequence = ['personal', 'nominee', 'occupation', 'medical', 'bank'];
    const currentIndex = sequence.indexOf(activeTab);
    if (currentIndex < sequence.length - 1) {
      setActiveTab(sequence[currentIndex + 1]);
    } else {
      // Navigate to document upload
      if (!formData.agreedToDeclaration) {
        showToast('Please accept the customer declaration checkbox to proceed.');
        return;
      }
      navigate(`/lead-management/document-upload/${leadId}`, { state: { lead, quoteParams, proposalFormData: formData } });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-slate-500">
        <Landmark className="w-8 h-8 animate-spin text-[#0B1F5B] mb-2" />
        <span className="text-xs font-bold uppercase tracking-wider">Loading Proposal Workspace...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#F5F7FB] text-left font-sans pb-16 w-full relative">
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-[#0B1F5B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 border border-blue-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-3xs w-full">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate(`/lead-management/create-proposal/${leadId}`)} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[20px] leading-none">Step 3 — Proposal Details Intake Form</h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[9px]">ID Reference: {leadId.toUpperCase()}</span>
          </div>
        </div>
        <button onClick={handleSaveDraft} className="h-9 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-xs text-slate-700 flex items-center gap-1.5 cursor-pointer">
          <Save className="w-3.5 h-3.5 text-slate-400" />
          <span>Save Draft</span>
        </button>
      </header>

      {/* Tabs navigation */}
      <div className="bg-white border-b border-slate-200 w-full sticky top-[69px] z-30 select-none">
        <div className="max-w-[1000px] mx-auto px-6 flex justify-between gap-2 overflow-x-auto text-[11px] font-black uppercase tracking-wider">
          {[
            { id: 'personal', label: '1. Personal Details', icon: User },
            { id: 'nominee', label: '2. Nominee Details', icon: Heart },
            { id: 'occupation', label: '3. Occupation & Income', icon: ClipboardList },
            { id: 'medical', label: '4. Medical & Risk History', icon: ShieldCheck },
            { id: 'bank', label: '5. Bank Details', icon: Landmark }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === tab.id ? 'border-[#0B1F5B] text-[#0B1F5B]' : 'border-transparent text-slate-450'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-[1000px] w-full mx-auto px-6 py-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          
          {/* TAB 1: Personal Details */}
          {activeTab === 'personal' && (
            <div className="space-y-4 text-xs font-semibold text-slate-650">
              <h3 className="text-sm font-black text-slate-900 border-b pb-2 uppercase tracking-wider">Personal details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase">Full Name</label>
                  <input type="text" value={formData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase">Date of Birth</label>
                  <input type="date" value={formData.dob} onChange={e => handleInputChange('dob', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase">Gender</label>
                  <select value={formData.gender} onChange={e => handleInputChange('gender', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-950">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase">City & State</label>
                  <div className="flex gap-2">
                    <input type="text" value={formData.city} placeholder="City" onChange={e => handleInputChange('city', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold flex-1" />
                    <input type="text" value={formData.state} placeholder="State" onChange={e => handleInputChange('state', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold flex-1" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Nominee Details */}
          {activeTab === 'nominee' && (
            <div className="space-y-4 text-xs font-semibold text-slate-650">
              <h3 className="text-sm font-black text-slate-900 border-b pb-2 uppercase tracking-wider">Beneficiary / Nominee Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase">Nominee Full Name</label>
                  <input type="text" value={formData.nomineeName} onChange={e => handleInputChange('nomineeName', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase">Relationship to Insured</label>
                  <select value={formData.nomineeRelationship} onChange={e => handleInputChange('nomineeRelationship', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-950">
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Child">Child</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase">Nominee Age (Years)</label>
                  <input type="number" value={formData.nomineeAge} onChange={e => handleInputChange('nomineeAge', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Occupation & Income */}
          {activeTab === 'occupation' && (
            <div className="space-y-4 text-xs font-semibold text-slate-650">
              <h3 className="text-sm font-black text-slate-900 border-b pb-2 uppercase tracking-wider">Professional Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase">Occupation Profession</label>
                  <input type="text" value={formData.profession} onChange={e => handleInputChange('profession', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase">Employer / Corporate Entity</label>
                  <input type="text" value={formData.employerName} onChange={e => handleInputChange('employerName', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase">Annual Inflow Income (₹)</label>
                  <input type="number" value={formData.annualIncome} onChange={e => handleInputChange('annualIncome', Number(e.target.value))} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase">Source of Income</label>
                  <select value={formData.incomeSource} onChange={e => handleInputChange('incomeSource', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-2 font-bold text-slate-950">
                    <option value="Salary">Corporate Salary</option>
                    <option value="Business">Business Profits</option>
                    <option value="Professional Practice">Professional Practice Fees</option>
                    <option value="Agriculture">Agricultural Surplus</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Medical Questions */}
          {activeTab === 'medical' && (
            <div className="space-y-5 text-xs font-semibold text-slate-650">
              <h3 className="text-sm font-black text-slate-900 border-b pb-2 uppercase tracking-wider">Underwriting Medical History</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border">
                  <div>
                    <span className="font-bold text-slate-900 block">Pre-existing Illnesses</span>
                    <span className="text-slate-450 block mt-0.5">Has the client been diagnosed with Diabetes, Heart Ailments, or Hypertension?</span>
                  </div>
                  <select value={formData.hasPreExistingIllness} onChange={e => handleInputChange('hasPreExistingIllness', e.target.value)} className="h-9 w-24 bg-white border rounded-lg px-2 font-bold text-slate-950">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border">
                  <div>
                    <span className="font-bold text-slate-900 block">Chronic Chronic Conditions</span>
                    <span className="text-slate-450 block mt-0.5">Is the client currently on regular life support or long-term medication plans?</span>
                  </div>
                  <select value={formData.hasChronicAilments} onChange={e => handleInputChange('hasChronicAilments', e.target.value)} className="h-9 w-24 bg-white border rounded-lg px-2 font-bold text-slate-950">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border">
                  <div>
                    <span className="font-bold text-slate-900 block">Hospitalization History</span>
                    <span className="text-slate-450 block mt-0.5">Has the client been admitted to any surgical care unit in the past 5 years?</span>
                  </div>
                  <select value={formData.hasHospitalizationHistory} onChange={e => handleInputChange('hasHospitalizationHistory', e.target.value)} className="h-9 w-24 bg-white border rounded-lg px-2 font-bold text-slate-950">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Bank Details & Declarations */}
          {activeTab === 'bank' && (
            <div className="space-y-6 text-xs font-semibold text-slate-650">
              <div>
                <h3 className="text-sm font-black text-slate-900 border-b pb-2 uppercase tracking-wider">Premium Payout Bank Account Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase">Account Holder Name</label>
                    <input type="text" value={formData.bankHolderName} onChange={e => handleInputChange('bankHolderName', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase">Bank Name</label>
                    <input type="text" value={formData.bankName} onChange={e => handleInputChange('bankName', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase">Account Number</label>
                    <input type="text" value={formData.bankAccountNumber} onChange={e => handleInputChange('bankAccountNumber', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold font-mono" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase">IFSC Code</label>
                    <input type="text" value={formData.bankIfscCode} onChange={e => handleInputChange('bankIfscCode', e.target.value)} className="h-10 bg-slate-50 border rounded-xl px-3 text-slate-900 font-bold font-mono" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Legal Declaration</h4>
                <label className="p-4 border border-blue-100 bg-blue-50/10 rounded-2xl flex items-start gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={formData.agreedToDeclaration} onChange={e => handleInputChange('agreedToDeclaration', e.target.checked)} className="mt-0.5 accent-[#0B1F5B]" />
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-extrabold">I verify and certify declarations</span>
                    <span className="text-[10px] text-slate-450 font-semibold block mt-0.5 leading-relaxed">
                      I hereby declare and warrant that the answers given above are true and complete in every particular. I authorize the underwriting committee to verify all occupational and medical claims via authorized digital vaults.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Action strip footer */}
          <div className="pt-4 border-t flex justify-end">
            <button
              onClick={handleNextTab}
              className="h-11 px-6 bg-[#0B1F5B] hover:bg-black text-white font-black text-xs rounded-xl flex items-center justify-center cursor-pointer"
            >
              <span>{activeTab === 'bank' ? 'Proceed to Document Upload →' : 'Next Section →'}</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
