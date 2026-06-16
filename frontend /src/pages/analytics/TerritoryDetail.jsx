import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TerritoryDetail() {
  const navigate = useNavigate();
  const { city } = useParams();

  return (
    <div className="w-full min-h-screen bg-[#F5F7FB] p-6 space-y-4">
      <header className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button type="button" onClick={() => navigate(-1)} className="p-1.5 bg-white border rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-semibold text-[#0B1F5B] capitalize">Territory: {city}</h1>
      </header>

      <div className="bg-white border p-4 rounded-xl shadow-xs">
        <h4 className="text-xs font-black text-slate-400 uppercase border-b pb-2 mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>Regional Parameter Allocation</span>
        </h4>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Isolating performance targets for <strong className="capitalize">{city}</strong> territory jurisdiction data logs.
        </p>
      </div>
    </div>
  );
}