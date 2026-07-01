import React from 'react';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProcessingTimeDetail() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-[#F5F7FB] p-6 space-y-4">
      <header className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button type="button" onClick={() => navigate(-1)} className="p-1.5 bg-white border rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-semibold text-[#0B1F5B]">Processing & Cycle Time Metrics</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border p-4 rounded-xl shadow-xs space-y-2">
          <h3 className="text-xs font-black text-slate-400 uppercase border-b pb-1.5 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Stage Breakdown Durations</span>
          </h3>
          <div className="space-y-2.5 text-xs font-bold text-slate-700">
            <div className="flex justify-between"><span>New Lead Distribution Sync</span><span className="text-slate-500">0.4 Days</span></div>
            <div className="flex justify-between"><span>Initial Consultation</span><span className="text-slate-500">1.2 Days</span></div>
            <div className="flex justify-between"><span>Underwriting Verification Check</span><span className="text-amber-600 font-extrabold">2.1 Days</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}