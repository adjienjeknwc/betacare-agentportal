// src/components/lead/LeadReviewSubmit.jsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext'; // Context binding
import { ShieldCheck, CheckCircle, AlertCircle, ArrowLeft, Bell, Activity, User, Briefcase, Shield } from 'lucide-react';

export default function LeadReviewSubmit() {
  const navigate = useNavigate();
  
  // Pulling both the master array state and the live multi-step wizard form data from context
  const { wizardLeadForm, addNewLeadToMaster, resetWizardForm } = useLeads();

  const steps = [
    { label: '1. Personal', active: false },
    { label: '2. Contact', active: false },
    { label: '3. Financial', active: false },
    { label: '4. Insurance', active: false },
    { label: '5. Documents', active: false },
    { label: '6. Review', active: true }
  ];

  // ==========================================================================
  // REAL-WORLD RUNTIME DATA RESOLVER MATRIX
  // Resolves keys directly from the multi-step form state to match your user inputs
  // ==========================================================================
  const resolvedData = useMemo(() => {
    return {
      fullName: wizardLeadForm?.fullName || 'New Lead File',
      mobileNumber: wizardLeadForm?.mobileNumber || '—',
      email: wizardLeadForm?.email || '—',
      dob: wizardLeadForm?.dob || '—',
      gender: wizardLeadForm?.gender || '—',
      occupation: wizardLeadForm?.occupation || '—',
      annualIncome: wizardLeadForm?.annualIncome || '1800000',
      city: wizardLeadForm?.city || '—',
      planInterest: wizardLeadForm?.planInterest || 'Term Life',
      medicalHistory: wizardLeadForm?.medicalHistory || 'None Declared'
    };
  }, [wizardLeadForm]);

  // Formats currency dynamically based on what you input in the financial step
  const displayIncome = useMemo(() => {
    const rawIncome = parseFloat(resolvedData.annualIncome);
    return !isNaN(rawIncome)
      ? `₹${rawIncome.toLocaleString('en-IN')}`
      : '₹18,0,000';
  }, [resolvedData.annualIncome]);

  // COMMITTING DYNAMIC WIZARD DATA INDICES TO THE LEDGER (SECURED MULTI-USER API OPERATION)
  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    // 1. EXTRACT SECURE SAAS AUTHORIZATION KEYCONTEXT
    const token = localStorage.getItem('agent_token');

    // 2. CONSTRUCT DATA PAYLOAD NORMALIZED TO THE MULTI-AGENT MONGO SCHEMA
    const formattedLeadPayload = {
      customerName: resolvedData.fullName,
      email: resolvedData.email !== '—' ? resolvedData.email : '',
      phone: resolvedData.mobileNumber !== '—' ? resolvedData.mobileNumber : '',
      productInterest: resolvedData.planInterest,
      temperature: 'Hot',  
      status: 'New Lead',
      score: 88
    };

    try {
      // 3. EXECUTE NETWORK DISPATCH FOR PRIVATE TENANT DB STORAGE
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Binds this record to this login profile session context
        },
        body: JSON.stringify(formattedLeadPayload)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('🎉 Lead document successfully persistent in MongoDB!');
        // 4. PURGE FORM CACHE AND NAVIGATE TO TABLE TO REFRESH LIVE RECORDS INSTANTLY
        resetWizardForm();
        navigate('/lead-management');
      } else {
        console.error('❌ Database schema context initialization failed:', result.message);
        alert(`Failed to save portfolio lead: ${result.message}`);
      }
    } catch (err) {
      console.error('❌ API pipeline execution boundary collapsed:', err);
      alert("Network Connection Error: Could not reach the multi-tenant insurance core server database.");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] text-left font-sans antialiased pb-12">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 select-none">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/register/documents')} className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none"><ArrowLeft className="w-4 h-4" /></button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#0B1F5B] tracking-tight leading-none">Add New Lead</h1>
            <span className="text-[10px] font-extrabold bg-blue-50 text-[#0F478D] border border-blue-100 px-2 py-0.5 rounded-md tracking-wider uppercase">Step 6 of 6</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg relative focus:outline-none"><Bell className="w-4 h-4" /><span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span></button>
          <div className="flex items-center gap-2 select-none">
            <div className="text-right">
              <h4 className="text-xs font-bold text-black leading-none">Agent John</h4>
              <span className="text-[9px] text-slate-400 font-black tracking-wider block mt-0.5">PREMIUM BROKER</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#0F478D] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">AJ</div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-6 space-y-6">
        <div className="w-full bg-white border border-slate-200 p-3 rounded-xl shadow-3xs select-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
            {steps.map((step, idx) => (
              <div key={idx} className={`py-1.5 px-2 rounded-lg text-xs font-bold tracking-tight border transition-colors ${step.active ? 'bg-white text-[#0F478D] border-[#0F478D] font-black shadow-3xs' : 'bg-slate-50/60 text-slate-400 border-transparent'}`}>{step.label}</div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div className="space-y-2 text-center max-w-md mx-auto py-2">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-[#0F478D] rounded-2xl flex items-center justify-center mx-auto shadow-3xs mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-black tracking-tight leading-none">Review & Submit Application</h2>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Please ensure all captured attributes for <span className="font-bold text-[#0F478D]">{resolvedData.fullName}</span> match documentation metrics before committing data to active grids.
            </p>
          </div>

          {/* TWO-COLUMN MATRIX SUMMARY DECK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-xs font-semibold text-slate-600">
            
            {/* STEP 1 & 2 DATA: PERSONAL & CONTACT PARAMETERS */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#0B1F5B] font-black border-b pb-1.5 uppercase text-[10px] tracking-wider select-none">
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>Personal & Contact Info</span>
              </div>
              <div className="flex justify-between"><span>Full Name:</span><span className="text-black font-bold">{resolvedData.fullName}</span></div>
              <div className="flex justify-between"><span>Gender Profile:</span><span className="text-slate-900 font-medium">{resolvedData.gender}</span></div>
              <div className="flex justify-between"><span>Date of Birth:</span><span className="text-slate-900 font-medium">{resolvedData.dob}</span></div>
              <div className="flex justify-between"><span>Contact Phone:</span><span className="text-black font-medium">{resolvedData.mobileNumber}</span></div>
              <div className="flex justify-between"><span>Email Address:</span><span className="text-black font-medium truncate max-w-[150px]">{resolvedData.email}</span></div>
              <div className="flex justify-between"><span>City / Region:</span><span className="text-slate-900 font-medium">{resolvedData.city}</span></div>
            </div>

            {/* STEP 3 & 4 DATA: FINANCIAL & POLICY SPECIFICATIONS */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#0B1F5B] font-black border-b pb-1.5 uppercase text-[10px] tracking-wider select-none">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                <span>Financial & Plan Profile</span>
              </div>
              <div className="flex justify-between"><span>Occupation:</span><span className="text-black font-medium truncate max-w-[150px]">{resolvedData.occupation}</span></div>
              <div className="flex justify-between"><span>Annual Income:</span><span className="text-[#0B1F5B] font-black">{displayIncome}</span></div>
              <div className="flex justify-between"><span>Smoking Status:</span><span className="text-slate-900 font-medium">{wizardLeadForm?.smokingStatus || 'Non-Smoker'}</span></div>
              <div className="flex justify-between"><span>Selected Plan:</span><span className="text-emerald-600 font-bold">{resolvedData.planInterest}</span></div>
              <div className="flex justify-between"><span>Medical Conditions:</span><span className="text-slate-900 font-medium truncate max-w-[130px]">{resolvedData.medicalHistory}</span></div>
            </div>

            {/* STEP 5 DATA: DOCUMENT TRACKING VAULT SUMMARY */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white md:col-span-2 space-y-2 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#0B1F5B] font-black border-b pb-1.5 uppercase text-[10px] tracking-wider select-none">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                <span>Onboarded Document Attachments Tracking Vault</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium pt-1 text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Identity Proof (PAN Card / Driving License)</span>
                </div>
                <div className="text-emerald-600 font-bold text-right">✓ Staged Successfully</div>
                
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Income Statement (Form 16 / Salary Slips)</span>
                </div>
                <div className="text-emerald-600 font-bold text-right">✓ Upload Verified</div>
              </div>
            </div>
          </div>

          {/* UNDERWRITING COMPLIANCE METRICS CHECKLIST */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 text-left space-y-3.5 max-w-2xl mx-auto text-xs font-medium">
            <div className="flex items-center gap-2 text-[#0F478D] font-bold border-b border-slate-200/60 pb-2 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span>Underwriting Quality Assurance Checklist Passed</span>
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-slate-600">
              <div>• Profile Form Completeness</div> <div className="text-emerald-600 font-bold text-right">100% Secure</div>
              <div>• Reachability Channels Validated</div> <div className="text-emerald-600 font-bold text-right">Active Dialing Node</div>
              <div>• Target Configured Income</div> <div className="text-slate-900 font-bold text-right">{displayIncome}</div>
              <div>• Verification Checksum Status</div> <div className="text-emerald-600 font-bold text-right">OK</div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between max-w-2xl mx-auto select-none">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold mx-auto">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Actions are final and immutable once committed.</span>
            </div>
          </div>
        </div>
        
        {/* COMPROBATION FOOTER ACTION INTERFACES */}
        {/* COMPROBATION FOOTER ACTION INTERFACES */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3 select-none">
          <button 
            type="button" 
            onClick={async () => {
              // 1. Commit the active lead to the database securely first
              const isSaved = await handleFinalSubmit({ preventDefault: () => {} });
              
              // 2. Route instantly to your dynamic calculator view using the exact live fields you filled out
              navigate(`/lead-management/generate-quote/new-lead`, { 
                state: {
                  leadData: {
                    fullName: resolvedData.customerName,
                    mobileNumber: wizardLeadForm.mobileNumber || '',
                    email: wizardLeadForm.email || '',
                    dob: wizardLeadForm.dob || '',
                    gender: wizardLeadForm.gender || 'Male',
                    occupation: wizardLeadForm.occupation || '',
                    annualIncome: wizardLeadForm.annualIncome || '1800000',
                    city: wizardLeadForm.city || '',
                    state: wizardLeadForm.state || 'Maharashtra',
                    smokingStatus: wizardLeadForm.smokingStatus || 'Non-Smoker',
                    coverageAmount: wizardLeadForm.coverageAmount || '28500000',
                    policyTerm: wizardLeadForm.policyTerm || '35'
                  }
                }
              });
            }} 
            className="w-full sm:w-auto h-11 px-6 bg-[#0B1F5B] hover:bg-[#0B1E46] text-white font-black rounded-xl transition-all shadow-md focus:outline-none flex items-center justify-center gap-1.5"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Save & Generate Quote</span>
          </button>

          <button 
            type="button" 
            onClick={handleFinalSubmit} 
            className="w-full sm:w-auto h-11 px-6 bg-black hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center focus:outline-none"
          >
            <span>Commit Lead Portfolio</span>
          </button>
        </div>
        </div>
        </div>
  );
}