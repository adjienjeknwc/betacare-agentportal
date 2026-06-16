import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../../context/RegistrationContext';
import RegistrationLayout from './RegistrationLayout';
import { ShieldAlert, FileCheck, UploadCloud, AlertTriangle, Camera } from 'lucide-react';

export default function KYCUploadSection() {
  const navigate = useNavigate();
  const { formData } = useRegistration();

  return (
    <RegistrationLayout currentStep={3}>
      <div className="w-full md:w-[68%] h-full bg-white p-6 sm:p-10 overflow-y-auto flex flex-col justify-between border-r border-slate-200">
        <div className="w-full max-w-2xl mx-auto space-y-5">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Onboarding</span>
            <h2 className="text-xl font-black text-[#0B1E46] tracking-tight">KYC Verification</h2>
            <p className="text-xs text-slate-400 font-medium max-w-xl">To comply with IRDAI regulations, please upload high-resolution copies of your identification documents. Our AI assistant will verify them in real-time.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* PAN Card Row Field Container */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">PAN Card</label>
              <span className="block text-[10px] text-slate-400 font-medium">Identity verification</span>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>{formData.panCardFile}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">100%</span>
              </div>
            </div>

            {/* Aadhaar Card Container Field (Red Warning Flags State) */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Aadhaar Card</label>
              <span className="block text-[10px] text-slate-400 font-medium">Residence verification</span>
              <div className="p-3 bg-red-50/50 border border-red-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-red-700">
                  <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
                  <span>{formData.aadhaarCardFile}</span>
                </div>
                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded uppercase">Mismatch Detected</span>
              </div>
            </div>

            {/* Upload Area Slot: Agent License */}
            <UploadBox title="Agent License" sub="Professional certification" actionText="Click to upload license" />
            
            {/* Upload Area Slot: Address Proof */}
            <UploadBox title="Address Proof" sub="Utility bill or bank statement." actionText="Drag files here" />

            {/* Profile Photo Headshot Component Grid Section Block */}
            <div className="sm:col-span-2 border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left items-center">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Profile Photo</label>
                <span className="block text-[10px] text-slate-400 font-medium mb-2">Professional headshot for your agent ID card.</span>
                <ul className="text-[10px] text-slate-500 font-medium list-disc pl-3 space-y-0.5">
                  <li>Plain light-colored background</li>
                  <li>Eyes clearly visible, no sunglasses</li>
                  <li>Face should cover 70% of frame</li>
                </ul>
              </div>

              {/* Box placeholder graphics element */}
              <div className="border border-dashed border-slate-300 rounded-2xl aspect-square w-32 mx-auto flex flex-col items-center justify-center bg-slate-50 relative group overflow-hidden">
                <UploadCloud className="w-5 h-5 text-[#0F478D] mb-1" />
                <span className="text-[10px] font-bold text-slate-500">Upload Photo</span>
              </div>

              <div className="flex flex-col gap-2">
                <button type="button" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                  <Camera className="w-3.5 h-3.5" /> <span>Open Camera</span>
                </button>
                <span className="text-[10px] text-slate-400 text-center font-medium">PDF, JPG, PNG (Max 5MB)</span>
              </div>
            </div>

          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
            <button type="button" onClick={() => navigate('/register/professional-info')} className="bg-white text-slate-700 border border-slate-200 font-bold text-xs py-2 px-5 rounded-xl">
              ← Back
            </button>
            <div className="flex gap-2">
              <button type="button" className="bg-white text-slate-600 border border-slate-200 font-bold text-xs py-2 px-4 rounded-xl">Save Draft</button>
              <button type="button" onClick={() => navigate('/register/credentials')} className="bg-[#0F478D] hover:bg-blue-700 text-white font-bold text-xs py-2 px-5 rounded-xl shadow-md">
                Continue to Review
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-medium">
          <div className="flex gap-2"><a href="#">Home</a><a href="#">Agent Portal</a></div>
          <span>Support</span>
        </div>
      </div>

      {/* RIGHT COLUMN: AI LIVE AUDITOR ALERT NOTICE SIDEBAR BANNER */}
      <div className="hidden md:flex flex-col w-[32%] h-full bg-[#F8FAFC] p-6 justify-between overflow-y-auto">
        <div className="bg-white border-2 border-red-100 rounded-2xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">AI Verification Alert</span>
          </div>
          <p className="text-xs font-semibold text-slate-700 leading-relaxed">
            Aadhaar name mismatch detected. The name on your uploaded Aadhaar card does not exactly match your registration name <span className="text-[#0B1E46] font-extrabold">"Rahul K. Sharma"</span>. Please ensure names are identical or upload a supporting Gazette document.
          </p>
          <div className="flex gap-2 pt-1">
            <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-4 rounded-xl shadow-sm transition-colors">
              Re-upload
            </button>
            <button className="bg-white text-slate-500 border border-slate-200 text-xs font-bold py-1.5 px-4 rounded-xl">
              Help
            </button>
          </div>
        </div>
        <div className="text-right text-xs font-black text-slate-300">82%</div>
      </div>
    </RegistrationLayout>
  );
}

function UploadBox({ title, sub, actionText }) {
  return (
    <div className="space-y-1.5 text-left flex flex-col justify-between">
      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">{title}</label>
        <span className="block text-[10px] text-slate-400 font-medium">{sub}</span>
      </div>
      <div className="border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors p-4 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer min-h-[58px]">
        <span className="text-xs font-bold text-[#0F478D]">{actionText}</span>
        <span className="text-[9px] text-slate-400 font-medium">Drag and drop or Browse</span>
      </div>
    </div>
  );
}