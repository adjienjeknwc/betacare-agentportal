import React from 'react';

export default function LeadTemperatureGuide() {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-4 shadow-xs select-none shrink-0">
      {/* SECTION HEADER BLOCK */}
      <div className="mb-3.5">
        <h4 className="text-xs font-black text-[#0B1F5B] uppercase tracking-wider">
          Lead Temperature Guide
        </h4>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          Understanding lead conversion probability and pipeline engagement definitions
        </p>
      </div>

      {/* THREE-COLUMN INLINE BADGE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* HOT STATUS CARD */}
        <div className="flex gap-3 items-start p-2.5 rounded-lg bg-slate-50/60 border border-slate-100">
          <span className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded border bg-red-50 text-red-600 border-red-100 uppercase shrink-0">
            HOT 🔥
          </span>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            High-conversion prospects actively engaging with proposals, quotes, or immediate follow-up tasks.
          </p>
        </div>

        {/* WARM STATUS CARD */}
        <div className="flex gap-3 items-start p-2.5 rounded-lg bg-slate-50/60 border border-slate-100">
          <span className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded border bg-amber-50 text-amber-600 border-amber-100 uppercase shrink-0">
            WARM 🟡
          </span>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Interested prospects requiring systematic nurturing, quote adjustments, or additional long-term consultation.
          </p>
        </div>

        {/* COLD STATUS CARD */}
        <div className="flex gap-3 items-start p-2.5 rounded-lg bg-slate-50/60 border border-slate-100">
          <span className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded border bg-blue-50/60 text-slate-500 border-slate-200 uppercase shrink-0">
            COLD ❄️
          </span>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Low-engagement leads requiring re-engagement workflows, target marketing, or deferred future outreach.
          </p>
        </div>

      </div>
    </div>
  );
}