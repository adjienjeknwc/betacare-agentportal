// src/components/lead/LeadReviewSubmit.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext'; // Context binding
import { ShieldCheck, CheckCircle, AlertCircle, ArrowLeft, Bell, Activity } from 'lucide-react';

export default function LeadReviewSubmit() {
  const navigate = useNavigate();
  const { wizardLeadForm, addNewLeadToMaster, resetWizardForm } = useLeads();

  const steps = [
    { label: '1. Personal', active: false },
    { label: '2. Contact', active: false },
    { label: '3. Financial', active: false },
    { label: '4. Insurance', active: false },
    { label: '5. Documents', active: false },
    { label: '6. Review', active: true }
  ];

  // COMMITTING DYNAMIC WIZARD DATA INDICES TO THE LEDGER
  const handleFinalSubmit = (e) => {
    e.preventDefault();

    const generatedId = `#LD-${Math.floor(1000 + Math.random() * 9000)}`;
    const inputName = wizardLeadForm.fullName || 'Alexander Thompson';
    const nameInitials = inputName.split(' ').map(n => n[0]).join('').toUpperCase();

    const cleanNewLeadObject = {
      id: generatedId,
      name: inputName,
      interest: wizardLeadForm.planInterest || 'Term Life',
      score: '88', // Dynamic baseline metric score
      temp: 'HOT',  // Brand new incoming business is prioritized as HOT
      status: '• Sent',
      statusColor: 'text-blue-700 bg-blue-50 border-blue-100',
      time: 'Just now',
      initials: nameInitials,
      avatarBg: 'bg-blue-600'
    };

    // Push row directly to dynamic dashboard array state
    addNewLeadToMaster(cleanNewLeadObject);

    // Purge input variables memory and route directly to dashboard
    resetWizardForm();
    navigate('/lead-management');
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

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 max-w-4xl mx-auto text-center">
          <div className="space-y-2 select-none max-w-md mx-auto py-4">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-[#0F478D] rounded-2xl flex items-center justify-center mx-auto shadow-3xs mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-black tracking-tight leading-none">Review & Submit Application</h2>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Please ensure all captured attributes for <span className="font-bold text-slate-900">{wizardLeadForm.fullName || 'Alexander Thompson'}</span> match documentation metrics before committing data to active grids.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 text-left space-y-3.5 max-w-2xl mx-auto text-xs font-medium">
            <div className="flex items-center gap-2 text-[#0F478D] font-bold border-b border-slate-200/60 pb-2 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span>Underwriting Quality Assurance Checklist Passed</span>
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-slate-600">
              <div>• Profile Form Completeness</div> <div className="text-emerald-600 font-bold text-right">100% Secure</div>
              <div>• Reachability Channels Validated</div> <div className="text-emerald-600 font-bold text-right">Active Dialing Node</div>
              <div>• Target Configured Income</div> <div className="text-slate-900 font-bold text-right">₹{wizardLeadForm.annualIncome || '18,00,000'}</div>
              <div>• Verification Checksum Status</div> <div className="text-emerald-600 font-bold text-right">OK</div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between max-w-2xl mx-auto select-none">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Actions are final and immutable once committed.</span>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3 select-none">
          {/* QUICK QUOTE SANDBOX PASS-THROUGH */}
          <button 
            type="button" 
            onClick={() => navigate(`/lead-management/generate-quote/${wizardLeadForm.fullName ? 'DYNAMIC' : 'LD-8926'}`, { 
              state: { 
                leadData: {
                  fullName: wizardLeadForm.fullName || 'Alexander Thompson',
                  mobileNumber: wizardLeadForm.mobileNumber || '9876543210',
                  email: wizardLeadForm.email || 'alex.thompson@enterprise.io',
                  dob: wizardLeadForm.dob || '1988-05-14',
                  gender: wizardLeadForm.gender || 'Male',
                  occupation: wizardLeadForm.occupation || 'Software Engineer',
                  annualIncome: wizardLeadForm.annualIncome || '1800000',
                  city: wizardLeadForm.city || 'Mumbai',
                  state: 'Maharashtra',
                  smokingStatus: wizardLeadForm.smokingStatus || 'Non-Smoker'
                }
              } 
            })}
            className="w-full sm:w-auto h-11 px-5 border border-[#0F478D] bg-white text-[#0F478D] font-bold text-xs rounded-xl hover:bg-blue-50/50 transition-all flex items-center justify-center gap-1.5 focus:outline-none"
          >
            <Activity className="w-4 h-4" />
            <span>Generate Quote</span>
          </button>

          {/* RE-BOUND DISPATCH HOOK FOR THE REAL TIME CRM ARRAY */}
          <button 
            type="button" 
            onClick={handleFinalSubmit}
            className="w-full sm:w-auto h-11 px-6 bg-[#0B1F5B] hover:bg-[#0B1E46] text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center focus:outline-none"
          >
            <span>Commit Lead Portfolio</span>
          </button>
        </div>
      </main>
    </div>
  );
}