// src/pages/registerflow.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { 
  User, Shield, Briefcase, FileText, Landmark, Key, CheckSquare, 
  ArrowLeft, ArrowRight, Upload, Eye, ClipboardCheck, ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

export default function RegisterFlow() {
  const navigate = useNavigate();
  const { setMasterLeadsData, setWizardLeadForm } = useLeads();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Form payload maps character-for-character to your production Mongoose schema rules
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '', middleName: '', lastName: '', dob: '', gender: 'Male',
    maritalStatus: 'Single', nationality: 'Indian', profilePhoto: null,
    mobileNumber: '', alternateMobileNumber: '', emailAddress: '', alternateEmail: '',
    currentAddress: '', city: '', state: '', pincode: '', country: 'India',
    agentType: 'Individual Agent', agentCode: 'AGT-' + Math.floor(100000 + Math.random() * 900000),
    branchLocation: '', reportingManager: '', joiningDate: '',
    totalExperience: '', previousCompany: '', previousAgentCode: '', yearsOfExperience: 0,
    irdaiLicenseNumber: '', licenseIssueDate: '', licenseExpiryDate: '', licenseCertificate: null,
    panNumber: '', aadhaarNumberPlaceholder: '[Aadhaar Redacted]', gstNumber: '',
    accountHolderName: '', bankName: '', accountNumber: '', confirmAccountNumber: '',
    ifscCode: '', branchName: '', preferredPaymentMethod: 'Bank Transfer', cancelledCheque: null,
    username: '', password: '', confirmPassword: '', securityQuestion: "Mother's Maiden Name", securityAnswer: '',
    amlDeclaration: false, kycConsent: false, termsAcceptance: false, codeOfConduct: false
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      if (!registrationForm.firstName.trim()) {
        triggerToast("First Name is required on Step 1.");
        return false;
      }
      if (!registrationForm.lastName.trim()) {
        triggerToast("Last Name is required on Step 1.");
        return false;
      }
      if (!registrationForm.emailAddress.trim()) {
        triggerToast("Email Address is required on Step 1.");
        return false;
      }
      if (!registrationForm.mobileNumber.trim()) {
        triggerToast("Mobile Number is required on Step 1.");
        return false;
      }
    }
    if (currentStep === 6) {
      if (!registrationForm.username.trim()) {
        triggerToast("Username is required on Step 6.");
        return false;
      }
      if (!registrationForm.password) {
        triggerToast("Password is required on Step 6.");
        return false;
      }
      if (registrationForm.password !== registrationForm.confirmPassword) {
        triggerToast("Passwords do not match.");
        return false;
      }
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegistrationForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUploadSimulate = (fieldKey) => {
    setRegistrationForm(prev => ({ ...prev, [fieldKey]: `STAGED_${fieldKey.toUpperCase()}_FILE.pdf` }));
    triggerToast(`Document linked successfully to file system metadata repository.`);
  };

  // ==========================================================================
  // DB LIVE CONNECTION FORK DISPATCHER
  // Transmits the 7-step data payload cleanly into MongoDB Atlas
  // ==========================================================================
  const handleFinalSubmitRegistration = async (e) => {
    e.preventDefault();

    if (registrationForm.password !== registrationForm.confirmPassword) {
      triggerToast("Credential Error: Passwords do not match.");
      return;
    }

    if (!registrationForm.amlDeclaration || !registrationForm.kycConsent || !registrationForm.termsAcceptance) {
      triggerToast("Validation Error: Please accept mandatory declarations and compliance fields.");
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationForm)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration processing pipeline failed.");
      }

      // Flush local memory contexts clear so the active session instantiates completely clean
      if (typeof setMasterLeadsData === 'function') setMasterLeadsData([]);
      if (typeof setWizardLeadForm === 'function') setWizardLeadForm({});

      // Sync auto-generated database registration parameters back into memory tracking state
      setRegistrationForm(prev => ({ ...prev, agentCode: data.agentCode }));
      setShowSuccessOverlay(true);

    } catch (error) {
      console.error("❌ Registration transmission failed:", error);
      triggerToast(`Pipeline Failure: ${error.message}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-16 w-full relative">
      
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#0B1F5B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 border border-blue-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome to the Team!</h2>
              <p className="text-sm font-black text-[#0B1F5B] uppercase tracking-wider">Authorized Broker Record Deployed</p>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed pt-2">
                Your credentials are live inside the network. Your tracking license identifier code is <span className="font-mono text-slate-900 font-extrabold bg-slate-50 px-1.5 py-0.5 border rounded">{registrationForm.agentCode}</span>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setShowSuccessOverlay(false); navigate('/login'); }}
              className="w-full h-11 bg-[#0B1F5B] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
            >
              Proceed to Login Terminal
            </button>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-3xs w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
        <div>
          <h1 className="font-black text-[#0B1F5B] tracking-tight text-xl">Agent Onboarding Workspace</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-1">Configure compliance metadata logs to deploy a new profile</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 border rounded-xl text-[10px] font-black uppercase text-slate-400 overflow-x-auto max-w-full scrollbar-none whitespace-nowrap">
          {[1, 2, 3, 4, 5, 6, 7].map(step => (
            <span key={step} className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${currentStep === step ? 'bg-[#0B1F5B] text-white shadow-3xs' : ''}`}>Step {step}</span>
          ))}
        </div>
      </header>

      <main className="max-w-[1250px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

            {/* STEP 1: PERSONAL INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-b pb-2 flex items-center gap-2 text-[#0B1F5B]">
                  <User className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider">Step 1 — Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" name="firstName" value={registrationForm.firstName} onChange={handleInputChange} placeholder="First Name *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none focus:bg-white" />
                  <input type="text" name="middleName" value={registrationForm.middleName} onChange={handleInputChange} placeholder="Middle Name" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                  <input type="text" name="lastName" value={registrationForm.lastName} onChange={handleInputChange} placeholder="Last Name *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Date of Birth *</label>
                    <input type="date" name="dob" value={registrationForm.dob} onChange={handleInputChange} className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Gender *</label>
                    <select name="gender" value={registrationForm.gender} onChange={handleInputChange} className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-bold text-slate-900 outline-none"><option>Male</option><option>Female</option><option>Other</option></select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="tel" name="mobileNumber" value={registrationForm.mobileNumber} onChange={handleInputChange} placeholder="Mobile Number *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                  <input type="email" name="emailAddress" value={registrationForm.emailAddress} onChange={handleInputChange} placeholder="Email Address *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                </div>
                <input type="text" name="currentAddress" value={registrationForm.currentAddress} onChange={handleInputChange} placeholder="Current Full Address *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                <div className="grid grid-cols-3 gap-4">
                  <input type="text" name="city" value={registrationForm.city} onChange={handleInputChange} placeholder="City *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                  <input type="text" name="state" value={registrationForm.state} onChange={handleInputChange} placeholder="State *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                  <input type="text" name="pincode" value={registrationForm.pincode} onChange={handleInputChange} placeholder="Pincode *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                </div>
              </div>
            )}

            {/* STEP 2: PROFESSIONAL INFORMATION */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="border-b pb-2 flex items-center gap-2 text-[#0B1F5B]">
                  <Briefcase className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider">Step 2 — Professional Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select name="agentType" value={registrationForm.agentType} onChange={handleInputChange} className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-bold outline-none"><option>Individual Agent</option><option>Corporate Agent</option><option>POSP Agent</option><option>Agency Manager</option></select>
                  {/* FIXED: Mapped explicit name tracking hooks parameters directly to the state property layout context */}
                  <input type="text" disabled name="agentCode" value={registrationForm.agentCode} className="w-full h-10 bg-slate-100 border rounded-xl px-3 text-xs font-mono font-bold text-slate-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Branch Location *</label>
                    <input type="text" name="branchLocation" value={registrationForm.branchLocation} onChange={handleInputChange} placeholder="e.g. Mumbai" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reporting Manager *</label>
                    <input type="text" name="reportingManager" value={registrationForm.reportingManager} onChange={handleInputChange} placeholder="Manager Name" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Joining Date *</label>
                    <input type="date" name="joiningDate" value={registrationForm.joiningDate} onChange={handleInputChange} className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: LICENSING & REGULATORY INFORMATION */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border-b pb-2 flex items-center gap-2 text-[#0B1F5B]">
                  <FileText className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider">Step 3 — Licensing & Regulatory Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">IRDAI License Number *</label>
                    <input type="text" name="irdaiLicenseNumber" value={registrationForm.irdaiLicenseNumber} onChange={handleInputChange} placeholder="License Number" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-mono outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">License Issue Date</label>
                    <input type="date" name="licenseIssueDate" value={registrationForm.licenseIssueDate} onChange={handleInputChange} className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">License Expiry Date</label>
                    <input type="date" name="licenseExpiryDate" value={registrationForm.licenseExpiryDate} onChange={handleInputChange} className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                  </div>
                </div>
                <input type="text" name="panNumber" value={registrationForm.panNumber} onChange={handleInputChange} placeholder="PAN Number *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-mono uppercase outline-none" />
              </div>
            )}

            {/* STEP 4: BANKING INFORMATION */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="border-b pb-2 flex items-center gap-2 text-[#0B1F5B]">
                  <Landmark className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider">Step 4 — Banking Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="accountHolderName" value={registrationForm.accountHolderName} onChange={handleInputChange} placeholder="Account Holder Name *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                  <input type="text" name="bankName" value={registrationForm.bankName} onChange={handleInputChange} placeholder="Bank Name *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="password" name="accountNumber" value={registrationForm.accountNumber} onChange={handleInputChange} placeholder="Account Number *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-mono outline-none" />
                  <input type="text" name="confirmAccountNumber" value={registrationForm.confirmAccountNumber} onChange={handleInputChange} placeholder="Confirm Account Number *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-mono outline-none" />
                  <input type="text" name="ifscCode" value={registrationForm.ifscCode} onChange={handleInputChange} placeholder="IFSC Code *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-mono uppercase outline-none" />
                </div>
                <input type="text" name="branchName" value={registrationForm.branchName} onChange={handleInputChange} placeholder="Branch Name *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
              </div>
            )}

            {/* STEP 5: DOCUMENTS FILE MANIFEST */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="border-b pb-2 flex items-center gap-2 text-[#0B1F5B]">
                  <Upload className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider">Step 5 — Verification Documents Manifest</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-semibold">
                  {['panCardDoc', 'aadhaarCardDoc', 'photoDoc', 'addressProofDoc', 'irdaiLicenseDoc', 'bankProofDoc'].map(docKey => (
                    <div key={docKey} className="p-3 border border-slate-200 bg-white rounded-xl flex items-center justify-between shadow-3xs">
                      <span className="text-slate-900 font-bold uppercase text-[10px] tracking-wide">{docKey.replace(/([A-Z])/g, ' $1')} *</span>
                      <button type="button" onClick={() => handleFileUploadSimulate(docKey)} className="h-7 px-3 border bg-slate-50 hover:bg-white rounded-lg text-[11px] font-black text-slate-700">{registrationForm[docKey] ? '✓ Linked' : 'Attach File'}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6: CREDENTIALS CONFIGURATION */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="border-b pb-2 flex items-center gap-2 text-[#0B1F5B]">
                  <Key className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider">Step 6 — Credentials Configuration</h3>
                </div>
                <input type="text" name="username" value={registrationForm.username} onChange={handleInputChange} placeholder="Username Unique Account Token *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="password" name="password" value={registrationForm.password} onChange={handleInputChange} placeholder="Secure Password *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-mono outline-none" />
                  <input type="password" name="confirmPassword" value={registrationForm.confirmPassword} onChange={handleInputChange} placeholder="Confirm Secure Password *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-mono outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3">
                  <select name="securityQuestion" value={registrationForm.securityQuestion} onChange={handleInputChange} className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-bold text-slate-800 outline-none"><option>Mother's Maiden Name</option><option>First School Name</option><option>City of Birth</option></select>
                  <input type="text" name="securityAnswer" value={registrationForm.securityAnswer} onChange={handleInputChange} placeholder="Security Answer Token *" className="w-full h-10 bg-slate-50 border rounded-xl px-3 text-xs font-semibold outline-none" />
                </div>
              </div>
            )}

            {/* STEP 7: DECLARATIONS & LIVE DATABASE INGESTION */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="border-b pb-2 flex items-center gap-2 text-[#0B1F5B]">
                  <CheckSquare className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider">Step 7 — Declarations & Compliance Checkpoint</h3>
                </div>
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border text-slate-500 text-[11px] font-medium leading-relaxed select-none">
                  <label className="flex items-start gap-3 cursor-pointer hover:text-black"><input type="checkbox" name="amlDeclaration" checked={registrationForm.amlDeclaration} onChange={handleInputChange} className="rounded text-[#0B1F5B] w-4 h-4 mt-0.5 shrink-0" /><span><b>AML Compliance:</b> I confirm no records of compliance infractions under money laundering tracking guidelines. *</span></label>
                  <label className="flex items-start gap-3 cursor-pointer hover:text-black"><input type="checkbox" name="kycConsent" checked={registrationForm.kycConsent} onChange={handleInputChange} className="rounded text-[#0B1F5B] w-4 h-4 mt-0.5 shrink-0" /><span><b>KYC Consent:</b> I grant clear consent verification clearances to authorize records deployment. *</span></label>
                  <label className="flex items-start gap-3 cursor-pointer hover:text-black"><input type="checkbox" name="termsAcceptance" checked={registrationForm.termsAcceptance} onChange={handleInputChange} className="rounded text-[#0B1F5B] w-4 h-4 mt-0.5 shrink-0" /><span><b>Terms & Conditions:</b> I accept premium architecture core data tracking directives. *</span></label>
                </div>
                <h2 className="text-xl font-black text-black tracking-tight leading-none">Review & Submit Application</h2>
<p className="text-xs font-medium text-slate-500 leading-relaxed mt-2">
  Please ensure all captured attributes for match documentation metrics. 
  <span 
    onClick={() => navigate('/login')} 
    className="block text-blue-600 font-bold underline cursor-pointer mt-2 hover:text-blue-800"
  >
    Return to Agent Login Page
  </span>
</p>
              </div>
            )}

            {/* CORE NAVIGATION ROW FOOTER */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-xs mt-6">
              <button 
                type="button" 
                disabled={currentStep === 1} 
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))} 
                className="h-10 px-4 border rounded-xl flex items-center gap-1 bg-white disabled:opacity-40 text-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              {currentStep < 7 ? (
                <button 
                  type="button" 
                  onClick={() => {
                    if (isStepValid()) {
                      setCurrentStep(prev => Math.min(7, prev + 1));
                    }
                  }} 
                  className="h-10 px-5 bg-[#0B1F5B] text-white font-black rounded-xl shadow-sm flex items-center gap-1"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleFinalSubmitRegistration} 
                  className="h-10 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl shadow-sm flex items-center gap-1"
                >
                  <span>Submit Application</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </button>
              )}
            </div>

          </form>
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-xs select-none space-y-3">
          <div className="border-b pb-2 flex items-center gap-1.5 text-slate-400">
            <ClipboardCheck className="w-4 h-4 text-slate-400" />
            <h4 className="font-black uppercase tracking-wider text-[10px]">Onboarding Context Logs</h4>
          </div>
          <div className="space-y-2">
            <div><span className="text-slate-400 text-[9px] uppercase block font-black">Cluster Status</span><span className="inline-block mt-1 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded font-extrabold text-[9px] uppercase tracking-wide">Awaiting Data Ingestion</span></div>
            <p className="text-slate-400 font-medium italic text-[11px] leading-relaxed pt-1">Fill fields across steps. Submitting commits encrypted profiles natively to MongoDB Atlas.</p>
          </div>
        </div>
      </main>
    </div>
  );
}