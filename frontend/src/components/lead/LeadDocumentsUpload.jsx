// src/components/registration/LeadDocumentsUpload.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LeadDocumentsUpload() {
  const navigate = useNavigate();

  const steps = [
    { label: '1. Personal', active: false },
    { label: '2. Contact', active: false },
    { label: '3. Financial', active: false },
    { label: '4. Insurance', active: false },
    { label: '5. Documents', active: true },
    { label: '6. Review', active: false }
  ];

  const handleProceedToReview = (e) => {
    e.preventDefault();
    navigate('/register/review');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] text-left font-sans antialiased pb-12">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/register/insurance-info')} className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none"><ArrowLeft className="w-4 h-4" /></button>
          <h1 className="text-2xl font-bold text-black tracking-tight leading-none">Add New Lead</h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-6 space-y-6">
        <div className="w-full bg-white border border-slate-200 p-3 rounded-xl shadow-3xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
            {steps.map((step, idx) => (
              <div key={idx} className={`py-1.5 px-2 rounded-lg text-xs font-bold tracking-tight border ${step.active ? 'bg-white text-[#0F478D] border-[#0F478D] font-black shadow-3xs' : 'bg-slate-50/60 text-slate-400 border-transparent'}`}>{step.label}</div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-1 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-black tracking-tight leading-none">KYC File Validation</h2>
            <p className="text-xs font-medium text-slate-500 max-w-xl mx-auto">Upload required onboarding credentials to finish compliance.</p>
          </div>

          <div className="p-6 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl space-y-2 max-w-2xl mx-auto text-center select-none">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-slate-700">Digital KYC Attachment Staged</p>
            <p className="text-[10px] text-slate-400 font-medium">Mandatory file validation records pass sandbox validation parameters automatically.</p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end max-w-2xl mx-auto">
            <button type="button" onClick={handleProceedToReview} className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-10 px-5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm focus:outline-none">
              <span>Go to Final Review</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}