import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../../context/RegistrationContext';
import RegistrationLayout from './RegistrationLayout';

export default function CredentialsForm() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useRegistration();

  const handleValidationCheck = (e) => {
    e.preventDefault();
    navigate('/register/review-submit');
  };

  return (
    <RegistrationLayout currentStep={4}>
      <div className="w-full md:w-[65%] h-full bg-white p-6 sm:p-10 overflow-y-auto flex flex-col justify-between border-r border-slate-200 mx-auto">
        <div className="w-full max-w-xl mx-auto space-y-6">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 4 of 5: System Access</span>
            <h2 className="text-xl font-black text-[#0B1E46] tracking-tight mt-0.5">Credentials Setup</h2>
            <p className="text-xs text-slate-400 font-medium">Configure secure authentication fields to access the insurance execution system panels.</p>
          </div>

          <form onSubmit={handleValidationCheck} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Username</label>
              <input type="text" value={formData.username} onChange={e => updateFormData({ username: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#0F478D]" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Password</label>
                <input type="password" value={formData.password} onChange={e => updateFormData({ password: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#0F478D]" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Confirm Password</label>
                <input type="password" value={formData.confirmPassword} onChange={e => updateFormData({ confirmPassword: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#0F478D]" required />
              </div>
            </div>

            {/* Password Indicator Badge Row */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Password Strength</span>
              <div className="flex gap-1">
                <div className="h-1.5 w-1/4 rounded-full bg-emerald-500"></div>
                <div className="h-1.5 w-1/4 rounded-full bg-emerald-500"></div>
                <div className="h-1.5 w-1/4 rounded-full bg-slate-200"></div>
                <div className="h-1.5 w-1/4 rounded-full bg-slate-200"></div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Security Question</label>
              <select value={formData.securityQuestion} onChange={e => updateFormData({ securityQuestion: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#0F478D]" required>
                <option value="">Select a question</option>
                <option value="What was your first pet's name?">What was your first pet's name?</option>
                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Security Answer</label>
              <input type="text" value={formData.securityAnswer} onChange={e => updateFormData({ securityAnswer: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#0F478D]" required />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-6">
              <button type="button" onClick={() => navigate('/register/kyc-verification')} className="bg-white text-slate-700 border border-slate-200 font-bold text-xs py-2 px-5 rounded-xl">
                ← Back
              </button>
              <button type="submit" className="bg-[#0F478D] hover:bg-blue-700 text-white font-bold text-xs py-2 px-6 rounded-xl shadow-md">
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </RegistrationLayout>
  );
}