import React from 'react';
import { ArrowLeft, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RevenueProjectionDetail() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-[#F5F7FB] p-6 space-y-4">
      <header className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button type="button" onClick={() => navigate(-1)} className="p-1.5 bg-white border rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-semibold text-[#0B1F5B]">Revenue Projections Matrix</h1>
      </header>

      <div className="bg-white border p-5 rounded-xl shadow-xs space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Weighted Product Contribution</h4>
          <span className="text-xs font-black text-[#0B1E46]">Pipeline Value: ₹46.95 L</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-slate-50 border rounded-lg"><h5 className="text-[10px] text-slate-400 font-black uppercase">Term Insurance</h5><p className="text-lg font-black text-[#0B1E46] mt-0.5">₹28.40 L</p></div>
          <div className="p-3 bg-slate-50 border rounded-lg"><h5 className="text-[10px] text-slate-400 font-black uppercase">ULIP Savings</h5><p className="text-lg font-black text-[#0B1E46] mt-0.5">₹12.15 L</p></div>
        </div>
      </div>
    </div>
  );
}