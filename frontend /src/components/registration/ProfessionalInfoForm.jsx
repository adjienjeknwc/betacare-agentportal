import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../../context/RegistrationContext';
import RegistrationLayout from './RegistrationLayout';
import { Sparkles, GraduationCap } from 'lucide-react';

export default function ProfessionalInfoForm() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useRegistration();

  const handleContinueExecution = (e) => {
    e.preventDefault();
    navigate('/register/kyc-verification');
  };

  return (
    <RegistrationLayout currentStep={2}>
      <div className="w-full md:w-[68%] h-full bg-white p-6 sm:p-10 overflow-y-auto flex flex-col justify-between border-r border-slate-200">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#0B1E46] tracking-tight">Professional Information</h2>
            <p className="text-xs text-slate-400 font-medium">Tell us about your background and current role within the insurance ecosystem.</p>
          </div>

          <form onSubmit={handleContinueExecution} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-2">Select Your Core Role</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <RoleCard title="Sales Agent" desc="Focus on individual life & health." active={formData.coreRole === 'Sales Agent'} onClick={() => updateFormData({ coreRole: 'Sales Agent' })} />
                <RoleCard title="Senior Advisor" desc="Wealth management specialist." active={formData.coreRole === 'Senior Advisor'} onClick={() => updateFormData({ coreRole: 'Senior Advisor' })} />
                <RoleCard title="Underwriter" desc="Risk assessment and approval." active={formData.coreRole === 'Underwriter'} onClick={() => updateFormData({ coreRole: 'Underwriter' })} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Employee/Agent ID</label>
                <input type="text" value={formData.employeeId} onChange={e => updateFormData({ employeeId: e.target.value })} placeholder="e.g. AG-88291" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#0F478D]" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Designation</label>
                <input type="text" value={formData.designation} onChange={e => updateFormData({ designation: e.target.value })} placeholder="e.g. Portfolio Manager" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#0F478D]" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Branch Location</label>
                <select value={formData.branchLocation} onChange={e => updateFormData({ branchLocation: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#0F478D]" required>
                  <option value="">Select Branch</option>
                  <option value="Mumbai Corporate Office">Mumbai Corporate Office</option>
                  <option value="Jaipur Main Hub">Jaipur Main Hub</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Years of Experience</label>
                <input type="number" value={formData.yearsOfExperience} onChange={e => updateFormData({ yearsOfExperience: e.target.value })} placeholder="Years" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#0F478D]" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">License Number</label>
                <input type="text" value={formData.licenseNumber} onChange={e => updateFormData({ licenseNumber: e.target.value })} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#0F478D]" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Specialization</label>
                <input type="text" value={formData.specialization} onChange={e => updateFormData({ specialization: e.target.value })} placeholder="Select Area" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#0F478D]" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Reporting Manager</label>
                <input type="text" value={formData.reportingManager} onChange={e => updateFormData({ reportingManager: e.target.value })} placeholder="Search for manager name..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#0F478D]" required />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
              <button type="button" onClick={() => navigate('/register/personal-details')} className="bg-white text-slate-700 border border-slate-200 font-bold text-xs py-2 px-5 rounded-xl">
                ← Back
              </button>
              <button type="submit" className="bg-[#0F478D] hover:bg-blue-700 text-white font-bold text-xs py-2 px-5 rounded-xl shadow-md">
                Continue to Documents →
              </button>
            </div>
          </form>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-medium">
          <span>© 2024 ABCD Life Insurance. All rights reserved.</span>
          <div className="gap-2 flex">
            <a href="#" className="underline">Privacy Policy</a>
            <a href="#" className="underline">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: RECRUITMENT SIDEBAR INSIGHTS PANEL */}
      <div className="hidden md:flex flex-col w-[32%] h-full bg-[#F8FAFC] p-6 justify-between overflow-y-auto">
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 text-[#0F478D]">
              <Sparkles className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Profile Validation</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">45%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Profile completeness score</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#0F478D] h-full w-[45%]"></div>
            </div>
            
            <div className="space-y-1.5 pt-1 text-[11px] font-semibold text-slate-600">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Next steps to 100%</span>
              <div className="flex items-center gap-1.5 text-emerald-600">✓ Personal Identity Verified</div>
              <div>• Submit License Credentials</div>
              <div>• Upload Certificate of Authority</div>
            </div>
            <p className="text-[11px] bg-blue-50/50 border border-blue-100 text-slate-600 p-2 rounded-xl leading-relaxed">
              <strong className="text-[#0F478D]">Pro-tip:</strong> Agents with a 100% score get their credentials approved 2.5x faster by our automated system.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Professional Perks</span>
            </div>
            <h5 className="text-xs font-bold text-slate-800">Lumina Academy Access</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">Access exclusive training and certification modules.</p>
          </div>
        </div>
        <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Support</div>
      </div>
    </RegistrationLayout>
  );
}

function RoleCard({ title, desc, active, onClick }) {
  return (
    <div onClick={onClick} className={`p-3 border rounded-xl cursor-pointer transition-all text-left space-y-1 ${active ? 'bg-blue-50/50 border-[#0F478D] ring-2 ring-blue-50' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
      <h4 className="text-xs font-bold text-slate-900 leading-none">{title}</h4>
      <p className="text-[10px] text-slate-500 font-medium leading-normal">{desc}</p>
    </div>
  );
}