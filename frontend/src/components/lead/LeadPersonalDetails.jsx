// src/components/registration/LeadPersonalDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext'; // Context binding
import { User, Calendar, ArrowRight, ArrowLeft, Bell } from 'lucide-react';

export default function LeadPersonalDetails() {
  const navigate = useNavigate();
  const { wizardLeadForm, updateWizardForm } = useLeads();

  // 1. STATE MANAGEMENT CONTROL WITH BACKEND WRAPPER SYNC
  const [formData, setFormData] = useState({
    firstName: 'sqwd',
    lastName: 'xscw',
    dob: wizardLeadForm?.dob || '2026-06-19', // Standardized YYYY-MM-DD input field mapping
    gender: wizardLeadForm?.gender || 'Male Group',
    maritalStatus: 'Single / Unmarried'
  });

  // 2. STEPPER LABEL ARRAY DEF DEFINITIONS MATCHING SCREENSHOT EXACTLY
  const steps = [
    { label: '1. Personal', active: true },
    { label: '2. Contact', active: false },
    { label: '3. Financial', active: false },
    { label: '4. Insurance', active: false },
    { label: '5. Documents', active: false },
    { label: '6. Review', active: false }
  ];

  // 3. SEQUENTIAL SUBMIT HANDLER REDIRECTION TRIGGER
  const handleSaveAndContinue = (e) => {
    e.preventDefault();
    
    // Construct a unified name mapping variable string for index processing tables
    const parsedFullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

    // Commit individual section parameters safely to the shared ledger buffer
    updateWizardForm({
      fullName: parsedFullName,
      dob: formData.dob,
      gender: formData.gender === 'Male Group' ? 'Male' : formData.gender === 'Female Group' ? 'Female' : 'Other'
    });

    // Moves sequentially to step 2: Contact Info Form Workspace
    navigate('/register/contact-info', { state: { personalData: formData } });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] text-left font-sans antialiased pb-12">
      
      {/* ADD NEW LEAD UPPER TOP BAR COMPONENT SHELL */}
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 select-none">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 transition-colors focus:outline-none shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-black tracking-tight leading-none">Add New Lead</h1>
            <span className="text-[10px] font-extrabold bg-blue-50 text-[#0F478D] border border-blue-100 px-2 py-0.5 rounded-md tracking-wider uppercase">
              Step 1 of 6
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg relative focus:outline-none">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span>
          </button>
          <div className="flex items-center gap-2 select-none">
            <div className="text-right">
              <h4 className="text-xs font-bold text-black leading-none">Agent John</h4>
              <span className="text-[9px] text-slate-400 font-black tracking-wider block mt-0.5">PREMIUM BROKER</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#0F478D] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">AJ</div>
          </div>
        </div>
      </header>

      {/* CORE FORM WORKSPACE CONTAINER BODY */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-6 space-y-6">
        
        {/* SEQUENTIAL STEPS PROGRESSION SUBHEADER HUD CHIP BAR */}
        <div className="w-full bg-white border border-slate-200 p-3 rounded-xl shadow-3xs select-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`py-1.5 px-2 rounded-lg text-xs font-bold tracking-tight border transition-colors ${
                  step.active 
                    ? 'bg-white text-[#0F478D] border-[#0F478D] font-black shadow-3xs' 
                    : 'bg-slate-50/60 text-slate-400 border-transparent'
                }`}
              >
                {step.label}
              </div>
            ))}
          </div>
        </div>

        {/* PERSONAL DETAILS CARD INPUT LAYER CONFIGURATION BOX */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-1 border-b border-slate-100 pb-4 select-none">
            <h2 className="text-lg font-black text-black tracking-tight leading-none">Personal Details</h2>
            <p className="text-xs font-medium text-slate-500 max-w-xl mx-auto">
              Capture fundamental customer profile metrics required to establish initial underwriting matrices.
            </p>
          </div>

          <form onSubmit={handleSaveAndContinue} className="space-y-5 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* FIRST NAME INPUT */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold select-none text-left">Customer First Name</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input 
                    required 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="e.g. sqwd" 
                    className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>

              {/* LAST NAME INPUT */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold select-none text-left">Customer Last Name</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input 
                    required 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="e.g. xscw" 
                    className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>

              {/* DATE OF BIRTH INPUT */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold select-none text-left">Date of Birth</label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input 
                    required 
                    type="date" 
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>

              {/* GENDER GROUP DROPDOWN */}
              <div className="space-y-1.5 text-left">
                <label className="block text-slate-700 font-bold select-none">Gender Group</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl px-3 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-bold cursor-pointer transition-all"
                >
                  <option>Male Group</option>
                  <option>Female Group</option>
                  <option>Alternative Demographics</option>
                </select>
              </div>

              {/* MARITAL STATUS DROPDOWN */}
              <div className="space-y-1.5 text-left sm:col-span-1">
                <label className="block text-slate-700 font-bold select-none">Marital Status</label>
                <select 
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                  className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-xl px-3 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-bold cursor-pointer transition-all"
                >
                  <option>Single / Unmarried</option>
                  <option>Married Partner Profile</option>
                  <option>Divorced / Widowed Status</option>
                </select>
              </div>

            </div>

            {/* ACTION SUBMIT FOOTER MODULE BLOCK STRIP */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end select-none">
              <button 
                type="submit"
                className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-10 px-5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm focus:outline-none"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}