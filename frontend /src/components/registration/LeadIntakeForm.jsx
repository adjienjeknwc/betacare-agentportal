// src/components/registration/LeadIntakeForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, ArrowLeft, ArrowRight, ClipboardList, User, Shield, 
  MapPin, Upload, FileText, CheckCircle2, ChevronRight, UserCheck 
} from 'lucide-react';

export default function LeadIntakeForm() {
  const navigate = useNavigate();
  const currentAgentName = localStorage.getItem('agentName') || "Rohan Malhotra";

  // State variables for Wizard Steps
  const [activeStep, setActiveStep] = useState(1);

  // Initialize form state with all required fields
  const [formData, setFormData] = useState({
    // Step 1: System & Lead Info
    leadId: `LD-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    leadSource: 'Website',
    leadStatus: 'New Lead',
    assignedAgent: currentAgentName,
    leadCreationDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    followUpDate: '',
    conversionProbability: 50,

    // Step 2: Customer Identity
    firstName: '',
    lastName: '',
    dob: '',
    age: 0,
    gender: 'Male',
    maritalStatus: 'Single',
    mobileNumber: '',
    alternateMobileNumber: '',
    emailAddress: '',

    // Step 3: Professional & Address
    occupation: '',
    employerName: '',
    annualIncome: 1800000,
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    country: 'India',

    // Step 4: KYC Verification Details
    panNumber: '',
    aadhaarNumber: '',
    aadhaarUpload: '',
    panUpload: '',
    incomeProofUpload: '',
    addressProofUpload: '',
    medicalReportUpload: '',
    photographUpload: '',

    // Step 5: Insurance Requirements
    insuranceType: 'Term Life',
    sumAssured: 28500000,
    policyTerm: 35,
    premiumPaymentFrequency: 'Annual',
    preferredPremiumBudget: 25000,
    existingLifeInsurance: 'No',
    existingInsurer: '',
    existingCoverageAmount: 0,

    // Step 6: Medical & Nominee details
    tobaccoUsage: 'No',
    alcoholConsumption: 'No',
    height: 175,
    weight: 70,
    medicalConditions: '',
    familyMedicalHistory: '',
    nomineeName: '',
    nomineeRelationship: 'Spouse',
    nomineeDob: '',
    nomineePercentage: 100,
    ridersRequired: [],

    // Step 7: Consents & Remarks
    preferredPaymentMode: 'UPI',
    preferredContactMethod: 'WhatsApp',
    smsConsent: true,
    emailConsent: true,
    whatsAppConsent: true,
    agentNotes: '',
    nextFollowUpDate: '',
    remarks: ''
  });

  // Calculate age automatically on DOB change
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      setFormData(prev => ({ ...prev, age: calculatedAge || 0 }));
    }
  }, [formData.dob]);

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxArrayChange = (key, val, checked) => {
    setFormData(prev => {
      const currentList = prev[key] || [];
      const updatedList = checked 
        ? [...currentList, val] 
        : currentList.filter(item => item !== val);
      return { ...prev, [key]: updatedList };
    });
  };

  const handleFileUploadMock = (key, files) => {
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [key]: files[0].name }));
    }
  };

  const handleSaveLead = async (andGenerateQuote = false) => {
    if (!formData.firstName || !formData.lastName || !formData.mobileNumber || !formData.dob) {
      alert("Please fill out all required attributes marked with (*)");
      return;
    }

    try {
      const token = localStorage.getItem('agent_token');
      // Format payload to meet minimal model constraints, passing the rest as schema-free fields
      const payload = {
        ...formData,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.emailAddress,
        phone: formData.mobileNumber,
        dob: formData.dob,
        annualIncome: Number(formData.annualIncome),
        city: formData.city,
        state: formData.state,
        coverageAmount: Number(formData.sumAssured),
        policyTerm: Number(formData.policyTerm),
        status: formData.leadStatus,
        productInterest: formData.insuranceType,
        temperature: formData.priority === 'High' ? 'Hot' : formData.priority === 'Medium' ? 'Warm' : 'Cold'
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        alert("Lead record created successfully!");
        if (andGenerateQuote) {
          navigate(`/lead-management/generate-quote/${result.data._id}`);
        } else {
          navigate('/lead-management');
        }
      } else {
        alert(result.message || "Failed to save lead.");
      }
    } catch (err) {
      console.error(err);
      alert("Fulfillment error while saving lead record.");
    }
  };

  const stepsList = [
    { num: 1, label: 'System & Source', icon: ClipboardList },
    { num: 2, label: 'Customer Identity', icon: User },
    { num: 3, label: 'Professional & Address', icon: MapPin },
    { num: 4, label: 'KYC & File Uploads', icon: Upload },
    { num: 5, label: 'Insurance Demands', icon: Shield },
    { num: 6, label: 'Medical & Nominee', icon: FileText },
    { num: 7, label: 'Consents & Notes', icon: UserCheck }
  ];

  return (
    <div className="flex-1 bg-[#F5F7FB] min-h-screen text-left font-sans antialiased pb-12 w-full">
      {/* Header Panel */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 w-full">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/lead-management')} 
            className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col items-start">
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[20px] leading-tight">
              Create Insurance Lead
            </h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[10px]">
              Ingesting Active Lead ID: {formData.leadId}
            </span>
          </div>
        </div>
      </header>

      {/* Main Form Body Workspace */}
      <main className="max-w-[1400px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side — Progress Stepper Indicators */}
        <div className="lg:col-span-3 space-y-2 lg:sticky lg:top-[112px]">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1.5">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider border-b pb-2 mb-3">Onboarding Wizard Steps</h3>
            
            {stepsList.map(step => {
              const Icon = step.icon;
              const isCurrent = step.num === activeStep;
              const isCompleted = step.num < activeStep;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(step.num)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isCurrent 
                      ? 'bg-blue-50 border border-blue-100 text-blue-700 font-black' 
                      : isCompleted 
                        ? 'text-emerald-700 hover:bg-slate-50' 
                        : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                    isCurrent 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-3xs' 
                      : isCompleted 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <span className="truncate">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side — Interactive Wizard Forms Container */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-black text-[#0B1F5B] uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>Section {activeStep}: {stepsList.find(s => s.num === activeStep)?.label}</span>
          </h2>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6 text-xs font-bold text-slate-600">
            
            {/* STEP 1: SYSTEM & LEAD INFO */}
            {activeStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Lead ID (Auto)</label>
                  <input type="text" value={formData.leadId} readOnly className="h-10 bg-slate-100 border border-slate-200 rounded-xl px-3 outline-none font-mono text-slate-900" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Lead Source</label>
                  <select value={formData.leadSource} onChange={e => handleFieldChange('leadSource', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                    <option value="Website">Website Intake</option>
                    <option value="Referral">Direct Referral</option>
                    <option value="Cold Call">Cold Outbound</option>
                    <option value="Social Media">Social Media campaign</option>
                    <option value="Partner Broker">Partner Broker network</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Lead Status</label>
                  <select value={formData.leadStatus} onChange={e => handleFieldChange('leadStatus', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                    <option value="New Lead">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Quote Shared">Quote Shared</option>
                    <option value="KYC Pending">KYC Pending</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Assigned Agent</label>
                  <input type="text" value={formData.assignedAgent} onChange={e => handleFieldChange('assignedAgent', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Lead Creation Date</label>
                  <input type="date" value={formData.leadCreationDate} onChange={e => handleFieldChange('leadCreationDate', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Priority</label>
                  <select value={formData.priority} onChange={e => handleFieldChange('priority', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Initial Follow-up Date</label>
                  <input type="date" value={formData.followUpDate} onChange={e => handleFieldChange('followUpDate', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Conversion Probability ({formData.conversionProbability}%)</label>
                  <input type="range" min="0" max="100" value={formData.conversionProbability} onChange={e => handleFieldChange('conversionProbability', e.target.value)} className="h-10 outline-none accent-[#0B1F5B]" />
                </div>
              </div>
            )}

            {/* STEP 2: CUSTOMER IDENTITY */}
            {activeStep === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">First Name *</label>
                  <input type="text" required value={formData.firstName} onChange={e => handleFieldChange('firstName', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Last Name *</label>
                  <input type="text" required value={formData.lastName} onChange={e => handleFieldChange('lastName', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Date of Birth *</label>
                  <input type="date" required value={formData.dob} onChange={e => handleFieldChange('dob', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Age (Auto)</label>
                  <input type="number" readOnly value={formData.age} className="h-10 bg-slate-100 border border-slate-200 rounded-xl px-3 outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Gender</label>
                  <select value={formData.gender} onChange={e => handleFieldChange('gender', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Marital Status</label>
                  <select value={formData.maritalStatus} onChange={e => handleFieldChange('maritalStatus', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Mobile Number *</label>
                  <input type="tel" required value={formData.mobileNumber} onChange={e => handleFieldChange('mobileNumber', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Alternate Mobile Number</label>
                  <input type="tel" value={formData.alternateMobileNumber} onChange={e => handleFieldChange('alternateMobileNumber', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Email Address</label>
                  <input type="email" value={formData.emailAddress} onChange={e => handleFieldChange('emailAddress', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                </div>
              </div>
            )}

            {/* STEP 3: PROFESSIONAL & ADDRESS DETAILS */}
            {activeStep === 3 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Occupation</label>
                    <input type="text" value={formData.occupation} onChange={e => handleFieldChange('occupation', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Employer Name</label>
                    <input type="text" value={formData.employerName} onChange={e => handleFieldChange('employerName', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Annual Income *</label>
                    <input type="number" required value={formData.annualIncome} onChange={e => handleFieldChange('annualIncome', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Address Line 1</label>
                    <input type="text" value={formData.addressLine1} onChange={e => handleFieldChange('addressLine1', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Address Line 2</label>
                    <input type="text" value={formData.addressLine2} onChange={e => handleFieldChange('addressLine2', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-5">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-slate-400 uppercase tracking-wide">City</label>
                    <input type="text" value={formData.city} onChange={e => handleFieldChange('city', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">State</label>
                    <input type="text" value={formData.state} onChange={e => handleFieldChange('state', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">PIN Code</label>
                    <input type="text" value={formData.pinCode} onChange={e => handleFieldChange('pinCode', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Country</label>
                    <input type="text" value={formData.country} onChange={e => handleFieldChange('country', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: KYC VERIFICATION DETAILS & FILE UPLOADS */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">PAN Number</label>
                    <input type="text" placeholder="ABCDE1234F" value={formData.panNumber} onChange={e => handleFieldChange('panNumber', e.target.value.toUpperCase())} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none font-mono text-slate-900" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Aadhaar Number</label>
                    <input type="text" placeholder="12-digit number" value={formData.aadhaarNumber} onChange={e => handleFieldChange('aadhaarNumber', e.target.value.replace(/\D/g,''))} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none font-mono text-slate-900" />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-4">Required Documents Scans (.pdf, .jpg, .png)</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                      { key: 'aadhaarUpload', label: 'Aadhaar Card Copy' },
                      { key: 'panUpload', label: 'PAN Card Copy' },
                      { key: 'incomeProofUpload', label: 'Income Proof (Form 16/Payslips)' },
                      { key: 'addressProofUpload', label: 'Address Proof (Utility Bill)' },
                      { key: 'medicalReportUpload', label: 'Medical Diagnostics Report' },
                      { key: 'photographUpload', label: 'Photograph (Passport Copy)' }
                    ].map((doc) => (
                      <div key={doc.key} className="p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col gap-3">
                        <span className="text-[10px] font-black uppercase text-slate-500">{doc.label}</span>
                        
                        <div className="flex items-center gap-2">
                          <label className="h-9 px-3 border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 bg-white text-slate-600 font-bold hover:bg-slate-50 cursor-pointer shadow-3xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Select File</span>
                            <input type="file" onChange={e => handleFileUploadMock(doc.key, e.target.files)} className="hidden" />
                          </label>
                          <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[140px]">
                            {formData[doc.key] || 'No file selected'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: INSURANCE REQUIREMENTS */}
            {activeStep === 5 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Insurance Type</label>
                  <select value={formData.insuranceType} onChange={e => handleFieldChange('insuranceType', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                    <option value="Term Life">Term Life Plan</option>
                    <option value="Whole Life">Whole Life Cover</option>
                    <option value="ULIP">ULIP Investment Plan</option>
                    <option value="Health Cover">Health Protect Cover</option>
                    <option value="Endowment">Endowment Savings Plan</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Sum Assured (Coverage Amount) *</label>
                  <input type="number" required value={formData.sumAssured} onChange={e => handleFieldChange('sumAssured', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Policy Term (Years) *</label>
                  <input type="number" required value={formData.policyTerm} onChange={e => handleFieldChange('policyTerm', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Premium Payment Frequency</label>
                  <select value={formData.premiumPaymentFrequency} onChange={e => handleFieldChange('premiumPaymentFrequency', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                    <option value="Annual">Annual Cycle</option>
                    <option value="Semi-Annual">Semi-Annual Cycle</option>
                    <option value="Quarterly">Quarterly Cycle</option>
                    <option value="Monthly">Monthly Auto-debit</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Preferred Premium Budget (₹)</label>
                  <input type="number" value={formData.preferredPremiumBudget} onChange={e => handleFieldChange('preferredPremiumBudget', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 uppercase tracking-wide">Existing Life Insurance?</label>
                  <select value={formData.existingLifeInsurance} onChange={e => handleFieldChange('existingLifeInsurance', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                    <option value="No">No active coverages</option>
                    <option value="Yes">Yes, holds policy covers</option>
                  </select>
                </div>
                {formData.existingLifeInsurance === 'Yes' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 uppercase tracking-wide">Existing Insurer Name</label>
                      <input type="text" value={formData.existingInsurer} onChange={e => handleFieldChange('existingInsurer', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 uppercase tracking-wide">Existing Coverage Amount (₹)</label>
                      <input type="number" value={formData.existingCoverageAmount} onChange={e => handleFieldChange('existingCoverageAmount', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 6: MEDICAL & NOMINEE DETAILS */}
            {activeStep === 6 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Tobacco Usage</label>
                    <select value={formData.tobaccoUsage} onChange={e => handleFieldChange('tobaccoUsage', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Alcohol Consumption</label>
                    <select value={formData.alcoholConsumption} onChange={e => handleFieldChange('alcoholConsumption', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Height (cm)</label>
                    <input type="number" value={formData.height} onChange={e => handleFieldChange('height', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Weight (kg)</label>
                    <input type="number" value={formData.weight} onChange={e => handleFieldChange('weight', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Personal Medical Conditions</label>
                    <textarea rows="2" placeholder="Describe any medical conditions, surgeries, chronic illnesses..." value={formData.medicalConditions} onChange={e => handleFieldChange('medicalConditions', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-sans font-semibold"></textarea>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Family Medical History</label>
                    <textarea rows="2" placeholder="List any family medical histories (e.g. diabetes, cardiac, cancer)..." value={formData.familyMedicalHistory} onChange={e => handleFieldChange('familyMedicalHistory', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-sans font-semibold"></textarea>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-4">Nominee Details Configuration</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 uppercase tracking-wide">Nominee Name</label>
                      <input type="text" value={formData.nomineeName} onChange={e => handleFieldChange('nomineeName', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none text-slate-900" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 uppercase tracking-wide">Nominee Relationship</label>
                      <select value={formData.nomineeRelationship} onChange={e => handleFieldChange('nomineeRelationship', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Other">Other Partner</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 uppercase tracking-wide">Nominee Date of Birth</label>
                      <input type="date" value={formData.nomineeDob} onChange={e => handleFieldChange('nomineeDob', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 uppercase tracking-wide">Nominee Percentage Share (%)</label>
                      <input type="number" min="0" max="100" value={formData.nomineePercentage} onChange={e => handleFieldChange('nomineePercentage', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <label className="text-slate-400 uppercase tracking-wide block mb-3">Optional Riders Required</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: 'ci', label: 'Critical Illness Rider' },
                      { id: 'adb', label: 'Accidental Death Rider' },
                      { id: 'wop', label: 'Waiver of Premium Rider' },
                      { id: 'dis', label: 'Permanent Disability Rider' }
                    ].map(rider => (
                      <label key={rider.id} className="p-3 border rounded-xl flex items-center gap-2.5 bg-slate-50/50 cursor-pointer hover:bg-slate-50 select-none">
                        <input 
                          type="checkbox" 
                          checked={(formData.ridersRequired || []).includes(rider.label)}
                          onChange={e => handleCheckboxArrayChange('ridersRequired', rider.label, e.target.checked)}
                          className="w-4 h-4 text-[#0B1F5B] rounded accent-[#0B1F5B]" 
                        />
                        <span>{rider.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: CONSENTS, REMARKS & FINAL SUMMARIES */}
            {activeStep === 7 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Preferred Payment Mode</label>
                    <select value={formData.preferredPaymentMode} onChange={e => handleFieldChange('preferredPaymentMode', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                      <option value="UPI">UPI Intent Node</option>
                      <option value="NetBanking">Net Banking Network</option>
                      <option value="Credit Card">Credit / Debit Card</option>
                      <option value="Direct Debit">NACH Direct Auto-debit</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Preferred Contact Method</label>
                    <select value={formData.preferredContactMethod} onChange={e => handleFieldChange('preferredContactMethod', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-2 outline-none">
                      <option value="WhatsApp">WhatsApp Message</option>
                      <option value="Email">Email Communication</option>
                      <option value="Phone call">Direct Phone Call</option>
                      <option value="SMS">Standard SMS text</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Agent Field Notes</label>
                    <textarea rows="3" placeholder="Ingest any core details, client specific demands..." value={formData.agentNotes} onChange={e => handleFieldChange('agentNotes', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-sans font-semibold"></textarea>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Compliance / Agent Remarks</label>
                    <textarea rows="3" placeholder="Audit remarks, compliance exceptions logs..." value={formData.remarks} onChange={e => handleFieldChange('remarks', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-sans font-semibold"></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 uppercase tracking-wide">Next Planned Follow-up Date</label>
                    <input type="date" value={formData.nextFollowUpDate} onChange={e => handleFieldChange('nextFollowUpDate', e.target.value)} className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none" />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <label className="text-slate-400 uppercase tracking-wide block mb-3">Compliance & Notification Consents</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'smsConsent', label: 'Allow Outbound SMS alerts' },
                      { key: 'emailConsent', label: 'Allow Outbound Email Newsletters' },
                      { key: 'whatsAppConsent', label: 'Allow Outbound WhatsApp Intents' }
                    ].map(consent => (
                      <label key={consent.key} className="p-3 border rounded-xl flex items-center gap-2.5 bg-slate-50/50 cursor-pointer hover:bg-slate-50 select-none">
                        <input 
                          type="checkbox" 
                          checked={formData[consent.key]}
                          onChange={e => handleFieldChange(consent.key, e.target.checked)}
                          className="w-4 h-4 text-[#0B1F5B] rounded accent-[#0B1F5B]" 
                        />
                        <span>{consent.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CORE NAVIGATION ROW FOOTER */}
            <div className="pt-5 border-t border-slate-100 flex items-center justify-between font-bold text-xs mt-6">
              <button 
                type="button" 
                disabled={activeStep === 1} 
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))} 
                className="h-10 px-4 border border-slate-200 rounded-xl flex items-center gap-1 bg-white disabled:opacity-40 text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {activeStep < 7 ? (
                <button 
                  type="button" 
                  onClick={() => setActiveStep(prev => Math.min(7, prev + 1))} 
                  className="h-10 px-5 bg-[#0B1F5B] text-white font-black rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer hover:bg-[#0B1E46] transition-all"
                >
                  <span>Next Section</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={() => handleSaveLead(false)} 
                    className="h-11 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Complete Lead Profile</span>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => handleSaveLead(true)} 
                    className="h-11 px-6 bg-[#0B1F5B] hover:bg-[#0B1E46] text-white font-black rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                    <span>Save & Generate Quote</span>
                  </button>
                </div>
              )}
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}