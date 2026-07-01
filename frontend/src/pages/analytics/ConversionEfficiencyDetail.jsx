import React from 'react';
import { ArrowLeft, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ConversionEfficiencyDetail() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-[#F5F7FB] p-6 space-y-4">
      <header className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button type="button" onClick={() => navigate(-1)} className="p-1.5 bg-white border rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-semibold text-[#0B1F5B]">Conversion Efficiency Deep-Dive</h1>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border p-4 rounded-xl shadow-xs md:col-span-2">
          <h3 className="text-xs font-black text-slate-400 uppercase border-b pb-2 mb-3">Funnel Trend Analysis</h3>
          <div className="space-y-3 text-xs font-semibold text-slate-700">
            <div className="flex justify-between py-1 border-b"><span>Baseline Conversion Target</span><span className="text-slate-500">12.4%</span></div>
            <div className="flex justify-between py-1 border-b"><span>Current Active Performance</span><span className="text-emerald-600 font-extrabold">15.0%</span></div>
            <div className="flex justify-between py-1 border-b"><span>Month-over-Month Velocity</span><span className="text-emerald-600">+2.6% Lift</span></div>
          </div>
        </div>

        <div className="bg-white border p-4 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>Identified Bottlenecks</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Significant leakage detected at the <strong>Proposal to Converted</strong> junction step. Projections indicate a 62% customer response abandonment vector during premium acceptances.
          </p>
        </div>
      </div>
    </div>
  );
}