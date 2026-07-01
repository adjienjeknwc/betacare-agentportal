import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../../context/RegistrationContext';
import { useAuth } from '../../App';
import RegistrationLayout from './RegistrationLayout';
import { FileText, Edit2, Loader2 } from 'lucide-react';

export default function ReviewSubmitPage() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useRegistration();
  const { setRegistrationSuccessMessage } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFinalSubmission = (e) => {
    e.preventDefault();
    if (!formData.declarationAccepted) return;

    setLoading(true);
    // Simulate real-time database write execution pipeline latency
    setTimeout(() => {
      setLoading(false);
      setRegistrationSuccessMessage('Registration submitted successfully. Please login after approval.');
      navigate('/login');
    }, 1500);
  };

  return (
    <RegistrationLayout currentStep={5}>
      <div className="w-full bg-white p-6 sm:p-10 overflow-y-auto flex flex-col justify-between">
        <div className="w-full max-w-4xl mx-auto space-y-6 text-left">
          
          <div className="flex justify-between items-end border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 5 of 5</span>
              <h2 className="text-xl font-black text-[#0B1E46] tracking-tight mt-0.5">Review & Submit</h2>
              <p className="text-xs text-slate-400 font-medium">Please confirm all details are correct before submitting your application for verification.</p>
            </div>
            <button type="button" onClick={() => navigate('/register/personal-details')} className="text-xs font-bold text-[#0F478D] hover:underline flex items-center gap-1">
              <Edit2 className="w-3 h-3" /> <span>Edit Information</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box Module Area: Personal Information Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                <h4 className="text-xs font-extrabold text-[#0B1E46] uppercase tracking-wider">Personal Information</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Full Name</span><span className="font-semibold text-slate-800">Alexander J. Sterling</span></div>
                <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Phone Number</span><span className="font-semibold text-slate-800">{formData.mobileNumber}</span></div>
                <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Email Address</span><span className="font-semibold text-slate-800">{formData.emailAddress}</span></div>
                <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Residential Address</span><span className="font-semibold text-slate-800 text-[11px] leading-tight block pt-0.5">4522 Oakwood Dr, Suite 300, Dallas, TX</span></div>
              </div>
            </div>

            {/* Box Module Area: Professional Details Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                <h4 className="text-xs font-extrabold text-[#0B1E46] uppercase tracking-wider">Professional Details</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div><span className="block text-[10px] font-bold text-slate-400 uppercase">License Type</span><span className="font-semibold text-slate-800">Life & Health Insurance</span></div>
                <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Agency ID</span><span className="font-mono font-bold text-slate-900 bg-slate-200/60 px-1.5 py-0.5 rounded text-[11px]">TX-99201-B</span></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Territory</span><span className="font-semibold text-slate-800">Texas North</span></div>
                  <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Experience</span><span className="font-semibold text-slate-800">8+ Years</span></div>
                </div>
                <div><span className="block text-[10px] font-bold text-slate-400 uppercase">Specialization</span><span className="font-semibold text-slate-800 text-[11px] leading-tight block">High Net Worth Estate Planning</span></div>
              </div>
            </div>

            {/* Box Module Area: Uploaded Documents Grid Check */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
              <h4 className="text-xs font-extrabold text-[#0B1E46] uppercase tracking-wider border-b border-slate-200/60 pb-1.5">Uploaded Documents</h4>
              
              <div className="space-y-2">
                <FileRow name="State_License.pdf" size="2.4 MB" badge="VERIFIED" badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200" />
                <FileRow name="Identity_Proof.jpg" size="1.1 MB" badge="CLEAR" badgeColor="bg-blue-50 text-blue-700 border-blue-200" />
                <FileRow name="Tax_ID_Form.pdf" size="0.8 MB" badge="SCAN OK" badgeColor="bg-slate-100 text-slate-700 border-slate-300" />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 text-[10px] font-semibold text-amber-800 flex justify-between items-center mt-2">
                <span>Status: <strong className="uppercase">Pending Approval</strong></span>
              </div>
            </div>

          </div>

          {/* DECLARATION ACCEPTANCE BOX SECTION */}
          <form onSubmit={handleFinalSubmission} className="border-t border-slate-100 pt-5 space-y-5">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <h5 className="text-xs font-bold text-[#0B1E46] mb-1.5">Declaration and Professional Conduct</h5>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.declarationAccepted} 
                  onChange={e => updateFormData({ declarationAccepted: e.target.checked })} 
                  className="w-4 h-4 rounded border-slate-300 text-[#0F478D] focus:ring-0 mt-0.5 cursor-pointer" 
                  required 
                />
                <span className="text-[11px] text-slate-600 font-medium leading-relaxed select-none">
                  I hereby declare that all information provided is accurate to the best of my knowledge. I agree to abide by the Agent Compliance Agreement and the Terms of Service of Betacare Life Insurance.
                </span>
              </label>
            </div>

            {/* Dynamic Buttons Handler triggers */}
            <div className="flex justify-between items-center pt-2">
              <button type="button" onClick={() => navigate('/register/credentials')} className="bg-white text-slate-700 border border-slate-200 font-bold text-xs py-2 px-5 rounded-xl">
                ← Back
              </button>
              
              <button 
                type="submit" 
                disabled={loading || !formData.declarationAccepted}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs py-2.5 px-8 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Application...</span>
                  </>
                ) : (
                  <span>Submit Registration</span>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </RegistrationLayout>
  );
}

function FileRow({ name, size, badge, badgeColor }) {
  return (
    <div className="p-2 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-[11px]">
      <div className="flex items-center gap-2 max-w-[60%] overflow-hidden">
        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="truncate font-semibold text-slate-800 leading-none">{name}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[9px] text-slate-400 font-medium">{size}</span>
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${badgeColor}`}>{badge}</span>
      </div>
    </div>
  );
}