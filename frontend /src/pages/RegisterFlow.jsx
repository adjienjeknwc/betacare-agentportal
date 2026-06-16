import React, { createContext, useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, User, Briefcase, FileText, FileBadge, 
  UploadCloud, AlertCircle, ChevronRight, ChevronLeft, Camera, 
  Lock, Eye, EyeOff, ShieldAlert
} from 'lucide-react';

// ==========================================
// 1. GLOBAL STATE CONTEXT
// ==========================================
const RegistrationContext = createContext();

export default function RegisterFlow() {
  const [formData, setFormData] = useState({
    personal: { firstName: 'John', lastName: 'Doe', mobile: '+91 98765 43210', email: 'john.doe@email.com', dob: '', gender: '', address: '', city: 'Mumbai', state: '', pin: '400001' },
    professional: { role: 'Sales Agent', employeeId: '', designation: '', branch: '', experience: '', license: '', specialization: '', manager: '' },
    kyc: { pan: null, aadhaar: null, license: null, addressProof: null, photo: null },
    credentials: { username: '', password: '', confirmPassword: '', securityQuestion: '', securityAnswer: '', twoFactor: true },
    declaration: false
  });

  const updateFormData = (section, data) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };

  return (
    <RegistrationContext.Provider value={{ formData, updateFormData, setFormData }}>
      <RegistrationLayout />
    </RegistrationContext.Provider>
  );
}

// ==========================================
// 2. MASTER LAYOUT & SIDEBAR
// ==========================================
function RegistrationLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const steps = [
    { path: 'personal-details', name: 'Personal', num: 1 },
    { path: 'professional-info', name: 'Professional', num: 2 },
    { path: 'kyc-verification', name: 'KYC', num: 3 },
    { path: 'credentials', name: 'Credentials', num: 4 },
    { path: 'review-submit', name: 'Review', num: 5 }
  ];

  const currentStepIndex = steps.findIndex(s => location.pathname.includes(s.path));
  const currentStep = currentStepIndex !== -1 ? currentStepIndex + 1 : 1;

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex font-sans text-gray-900">
      
      {/* Fixed Left Sidebar[cite: 12] */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-col hidden md:flex shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20">
        <div className="p-6 flex flex-col items-center border-b border-gray-100">
          <div className="w-16 h-20 bg-[#0F478D] text-white flex items-center justify-center rounded-b-[2rem] rounded-t-lg shadow-inner mb-4">
            <span className="text-4xl font-black">A</span>
          </div>
          <h1 className="font-bold text-gray-900 leading-tight">Agent Registration</h1>
          <p className="text-xs text-gray-500 font-medium">Step {currentStep} of 5</p>
        </div>

        <nav className="flex-1 p-6">
          <ul className="space-y-6 relative before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-[0px] before:h-full before:w-[2px] before:bg-gray-100">
            {steps.map((s, i) => {
              const isPast = currentStep > s.num;
              const isActive = currentStep === s.num;
              return (
                <li key={s.num} className="flex items-center gap-4 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    isActive ? 'bg-[#0F478D] border-[#0F478D] text-white shadow-md' : 
                    isPast ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-sm font-bold ${isActive ? 'text-[#0F478D]' : isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button onClick={() => navigate('/login')} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
            ← Back to Login
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="personal-details" replace />} />
              <Route path="personal-details" element={<Step1Personal />} />
              <Route path="professional-info" element={<Step2Professional />} />
              <Route path="kyc-verification" element={<Step3KYC />} />
              <Route path="credentials" element={<Step4Credentials />} />
              <Route path="review-submit" element={<Step5Review />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 3. PAGE COMPONENTS
// ==========================================

/* --- STEP 1: PERSONAL DETAILS[cite: 12] --- */
function Step1Personal() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(RegistrationContext);

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
          <p className="text-sm text-gray-500 mt-1">Please provide your legal name as it appears on your government IDs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Input label="First Name" value={formData.personal.firstName} onChange={e => updateFormData('personal', {firstName: e.target.value})} />
          <Input label="Last Name" value={formData.personal.lastName} onChange={e => updateFormData('personal', {lastName: e.target.value})} />
          <Input label="Mobile Number" value={formData.personal.mobile} onChange={e => updateFormData('personal', {mobile: e.target.value})} />
          <Input label="Email Address" value={formData.personal.email} onChange={e => updateFormData('personal', {email: e.target.value})} type="email" />
          <Input label="Date of Birth" value={formData.personal.dob} onChange={e => updateFormData('personal', {dob: e.target.value})} type="date" placeholder="mm/dd/yyyy" />
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Gender</label>
            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#0F478D] focus:ring-2 focus:ring-blue-50">
              <option>Select Gender</option><option>Male</option><option>Female</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Input label="Permanent Address" value={formData.personal.address} onChange={e => updateFormData('personal', {address: e.target.value})} placeholder="Street, Building, Flat No." />
          </div>
          <Input label="City" value={formData.personal.city} onChange={e => updateFormData('personal', {city: e.target.value})} />
          <Input label="PIN Code" value={formData.personal.pin} onChange={e => updateFormData('personal', {pin: e.target.value})} />
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium">All your data is encrypted and handled<br/>according to our Privacy Policy.</p>
          <button onClick={() => navigate('../professional-info')} className="px-6 py-3 bg-[#0F478D] text-white font-bold rounded-xl hover:bg-[#0B1E46] transition-all flex items-center shadow-md">
            Next Step <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

/* --- STEP 2: PROFESSIONAL INFO[cite: 13] --- */
function Step2Professional() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(RegistrationContext);

  const roles = [
    { title: 'Sales Agent', desc: 'Focus on individual life & health.' },
    { title: 'Senior Advisor', desc: 'Wealth management specialist.' },
    { title: 'Underwriter', desc: 'Risk assessment and approval.' }
  ];

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Information</h2>
          <p className="text-gray-500 mb-8">Tell us about your background and current role within the insurance ecosystem.</p>
          
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Select Your Core Role</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {roles.map(r => (
              <div key={r.title} onClick={() => updateFormData('professional', {role: r.title})} className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.professional.role === r.title ? 'border-[#0F478D] bg-blue-50/50' : 'border-gray-100 hover:border-gray-300'}`}>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{r.title}</h3>
                <p className="text-xs text-gray-500 font-medium">{r.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Input label="Employee/Agent ID" placeholder="e.g. AG-88291" />
            <Input label="Designation" placeholder="e.g. Portfolio Manager" />
            <Input label="Branch Location" placeholder="Select Branch" />
            <Input label="Years of Experience" placeholder="Years" />
            <Input label="License Number" placeholder="INS-XXXX-XXXX" />
            <Input label="Reporting Manager" placeholder="Search for manager name..." />
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <button onClick={() => navigate('../personal-details')} className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <button onClick={() => navigate('../kyc-verification')} className="px-6 py-3 bg-[#0F478D] text-white font-bold rounded-xl hover:bg-[#0B1E46] transition-all flex items-center shadow-md">
              Continue to Documents <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* AI Profile Validation Sidebar[cite: 13] */}
        <div className="bg-[#0B1E46] rounded-2xl shadow-lg p-6 text-white h-fit relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck className="w-24 h-24" /></div>
          <h3 className="text-xs font-bold text-blue-200 tracking-widest uppercase mb-6 relative z-10">AI PROFILE VALIDATION</h3>
          
          <div className="bg-white/10 rounded-xl p-5 mb-6 relative z-10 border border-white/20">
            <p className="text-sm font-medium text-blue-100 mb-1">Profile completeness score</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-black">45%</span>
            </div>
            <div className="w-full bg-blue-900 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full w-[45%]"></div></div>
          </div>

          <div className="relative z-10">
            <p className="text-sm font-bold mb-4">Next steps to 100%</p>
            <ul className="space-y-3 text-sm text-blue-100 font-medium">
              <li className="flex items-center gap-2 text-green-400"><CheckCircle2 className="w-4 h-4" /> Personal Identity Verified</li>
              <li className="flex items-center gap-2"><div className="w-4 h-4 border border-blue-400 rounded-full"></div> Submit License Credentials</li>
              <li className="flex items-center gap-2"><div className="w-4 h-4 border border-blue-400 rounded-full"></div> Upload Certificate of Authority</li>
            </ul>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

/* --- STEP 3: KYC VERIFICATION[cite: 11] --- */
function Step3KYC() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">KYC Verification <span className="bg-blue-100 text-[#0F478D] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Secure Onboarding</span></h2>
        <p className="text-gray-500 mb-8 max-w-2xl text-sm leading-relaxed">To comply with IRDAI regulations, please upload high-resolution copies of your identification documents. Our AI assistant will verify them in real-time.</p>
        
        <div className="space-y-4 mb-8">
          
          {/* Upload Card 1 */}
          <div className="p-4 border border-gray-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between bg-gray-50/50 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0F478D]"><FileText className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">PAN Card</h4>
                <p className="text-xs text-gray-500 font-medium">Identity verification</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900">pan_card_copy.pdf</p>
                <p className="text-[10px] text-green-600 font-bold">100% Uploaded</p>
              </div>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm w-full md:w-auto">Re-upload</button>
            </div>
          </div>

          {/* AI Alert Card[cite: 11] */}
          <div className="p-5 border border-red-200 bg-red-50 rounded-xl shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-red-900 text-sm mb-1">AI Verification Alert</h4>
                <p className="text-xs text-red-700 font-medium leading-relaxed">Aadhaar name mismatch detected. The name on your uploaded Aadhaar card does not exactly match your registration name "Rahul K. Sharma". Please ensure names are identical or upload a supporting Gazette document.</p>
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 shadow-sm">Re-upload</button>
                  <button className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-xs font-bold hover:bg-red-50">Help</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* File Drop Area */}
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-[#0F478D] mb-3 group-hover:scale-110 transition-transform"><UploadCloud className="w-6 h-6" /></div>
            <p className="text-sm font-bold text-gray-900">Drag and drop or Browse</p>
            <p className="text-xs text-gray-500 font-medium mt-1">PDF, JPG, PNG (Max 5MB)</p>
          </div>

        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button onClick={() => navigate('../professional-info')} className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <div className="flex gap-3">
             <button className="px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all hidden sm:block">Save Draft</button>
             <button onClick={() => navigate('../credentials')} className="px-6 py-3 bg-[#0F478D] text-white font-bold rounded-xl hover:bg-[#0B1E46] transition-all flex items-center shadow-md">
                Continue to Review <ChevronRight className="w-4 h-4 ml-1" />
             </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

/* --- STEP 4: CREDENTIALS SETUP (Custom implementation of flow) --- */
function Step4Credentials() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Credentials</h2>
          <p className="text-gray-500 text-sm">Set up your secure login details for the Agent Portal.</p>
        </div>

        <div className="space-y-6 mb-8">
          <Input label="Username / Portal ID" placeholder="Create a unique username" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Password" type="password" placeholder="••••••••" />
            <Input label="Confirm Password" type="password" placeholder="••••••••" />
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
             <label className="flex items-center gap-3 cursor-pointer">
               <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0F478D] focus:ring-[#0F478D]" defaultChecked />
               <div>
                 <span className="text-sm font-bold text-gray-900 block">Enable Two-Factor Authentication (2FA)</span>
                 <span className="text-xs font-medium text-gray-500">Adds an extra layer of security requiring an OTP during login.</span>
               </div>
             </label>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button onClick={() => navigate('../kyc-verification')} className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <button onClick={() => navigate('../review-submit')} className="px-6 py-3 bg-[#0F478D] text-white font-bold rounded-xl hover:bg-[#0B1E46] transition-all flex items-center shadow-md">
            Continue to Review <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

/* --- STEP 5: REVIEW & SUBMIT[cite: 10] --- */
function Step5Review() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      // Auto redirect to login after success
      setTimeout(() => navigate('/login'), 2000);
    }, 1500);
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center mt-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600"><CheckCircle2 className="w-10 h-10" /></div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Registration Submitted!</h2>
        <p className="text-gray-500 font-medium mb-6">Your application is under review. You will be redirected to the login page momentarily.</p>
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0F478D] rounded-full animate-spin mx-auto"></div>
      </motion.div>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-500 mb-8 text-sm font-medium">Please confirm all details are correct before submitting your application for verification.</p>
        
        <div className="space-y-6 mb-8">
          
          {/* Card 1[cite: 10] */}
          <div className="border border-gray-200 rounded-xl p-6 relative">
            <button onClick={() => navigate('../personal-details')} className="absolute top-6 right-6 text-xs font-bold text-[#0F478D] hover:underline">Edit</button>
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</span><span className="text-sm font-bold text-gray-900">Alexander J. Sterling</span></div>
              <div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</span><span className="text-sm font-bold text-gray-900">a.sterling@financial.com</span></div>
              <div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Phone Number</span><span className="text-sm font-bold text-gray-900">+1 (555) 012-3456</span></div>
              <div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Residential Address</span><span className="text-sm font-bold text-gray-900">4522 Oakwood Dr, Suite 300, Dallas, TX</span></div>
            </div>
          </div>

          {/* Card 2[cite: 10] */}
          <div className="border border-gray-200 rounded-xl p-6 relative">
            <button onClick={() => navigate('../professional-info')} className="absolute top-6 right-6 text-xs font-bold text-[#0F478D] hover:underline">Edit</button>
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
              Professional Details
              <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase mr-10">Status: Pending Approval</span>
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">License Type</span><span className="text-sm font-bold text-gray-900">Life & Health Insurance</span></div>
              <div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Agency ID</span><span className="text-sm font-bold text-gray-900">TX-99201-B</span></div>
              <div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Experience</span><span className="text-sm font-bold text-gray-900">8+ Years</span></div>
              <div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Specialization</span><span className="text-sm font-bold text-gray-900">High Net Worth Estate Planning</span></div>
            </div>
          </div>

          {/* Declaration[cite: 10] */}
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 flex items-start gap-4">
             <input type="checkbox" id="declare" className="mt-1 w-4 h-4 rounded border-blue-300 text-[#0F478D] focus:ring-[#0F478D]" required />
             <label htmlFor="declare" className="cursor-pointer">
               <span className="text-sm font-bold text-gray-900 block mb-1">Declaration and Professional Conduct</span>
               <span className="text-xs font-medium text-gray-600 leading-relaxed block">I hereby declare that all information provided is accurate to the best of my knowledge. I agree to abide by the Agent Compliance Agreement and the Terms of Service of ABCD Life Insurance.</span>
             </label>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-100 gap-4">
          <button onClick={() => navigate('../credentials')} className="w-full sm:w-auto px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center">
            Edit Information
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3 bg-[#0F478D] text-white font-bold rounded-xl hover:bg-[#0B1E46] transition-all flex items-center justify-center shadow-md disabled:opacity-70">
            {isSubmitting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Processing...</>
            ) : (
              <>Submit Registration <CheckCircle2 className="w-4 h-4 ml-2" /></>
            )}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

// ==========================================
// 4. SHARED UI COMPONENTS
// ==========================================

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full h-full pb-10"
    >
      {children}
    </motion.div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none transition-all focus:bg-white focus:border-[#0F478D] focus:ring-2 focus:ring-blue-50 placeholder-gray-400"
      />
    </div>
  );
}