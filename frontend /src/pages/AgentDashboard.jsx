// src/pages/AgentDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // FIXED: Added missing hook import
import { Plus, Search, Bell, Clock, ChevronRight } from 'lucide-react';

export default function AgentDashboard() {
  const navigate = useNavigate(); // FIXED: Initialized the routing companion engine

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
      {/* GLOBAL HEADER */}
      <header className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-10">
        <div className="w-96 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input type="text" placeholder="Search leads, policies, or claims...." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs outline-none focus:bg-white focus:border-[#0F478D] transition-all placeholder:text-slate-400" />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg relative">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span>
          </button>
          <div className="h-8 w-px bg-slate-200 mx-1"></div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              {/* Enforced sharp contrast on header user tags */}
              <h4 className="text-xs font-bold text-black leading-none">Rohan Malhotra</h4>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Senior Agent</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0B1E46] to-[#0F478D] flex items-center justify-center text-white text-xs font-bold shadow-md">RM</div>
          </div>
        </div>
      </header>

      {/* WORKSPACE CENTRAL HUB MATRIX */}
      <main className="flex-1 w-full p-6 overflow-y-auto bg-[#F8FAFC] space-y-6">
        {/* Hero banner block */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex justify-between items-center relative overflow-hidden">
          <div className="space-y-1 z-10 text-left">
            {/* FIXED COLOR: True solid black heading style configuration */}
            <h3 className="text-lg font-black text-black tracking-tight">Good Morning, Rohan</h3>
            <p className="text-slate-500 text-xs font-medium max-w-xl leading-relaxed">
              You have <span className="text-[#0F478D] font-bold">12 pending follow-ups</span>, <span className="text-[#0F478D] font-bold">4 renewals due today</span>, and <span className="text-[#0F478D] font-bold">3 high-conversion prospects</span> currently flagged in your tracking pipelines.
            </p>
          </div>
          <div className="flex gap-2.5 z-10 shrink-0">
            {/* COMPLETED LINKING: Points accurately to the correct physical location wrapper path */}
            <button 
              type="button" 
              onClick={() => navigate('/register/personal-details')}
              className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-10 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm focus:outline-none select-none"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add Lead</span>
            </button>
            <button 
              type="button"
              onClick={() => navigate('/quotations')}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold h-10 px-4 rounded-xl flex items-center transition-colors focus:outline-none select-none"
            >
              Generate Proposal
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-slate-50 rounded-full pointer-events-none z-0 opacity-50"></div>
        </div>

        {/* METRIC KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KPICard title="Total Leads" score="1,248" footer="vs 1,114 last month" />
          <KPICard title="Active Policies" score="842" footer="Retention rate: 98.2%" />
          <KPICard title="Monthly Revenue" score="$124,500" footer="Top 5% among agents" />
          <KPICard title="Pending Renewals" score="28" footer="4 due within 24 hours" />
        </div>

        {/* MATRIX SECTION DATA GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[340px]">
              <div className="flex justify-between items-start mb-4 text-left">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sales Performance</h4>
                  <span className="text-[11px] text-slate-500 font-medium">Total premiums collected vs Target</span>
                </div>
                <div className="bg-slate-100 p-0.5 rounded-lg flex gap-1">
                  <button className="bg-white text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">Monthly</button>
                  <button className="text-slate-500 text-[10px] font-semibold px-2.5 py-1">Quarterly</button>
                </div>
              </div>
              <div className="flex-1 w-full flex items-end gap-3 pt-4 border-b border-slate-100 pb-2">
                <BarColumn month="JAN" height="h-[40%]" />
                <BarColumn month="FEB" height="h-[55%]" />
                <BarColumn month="MAR" height="h-[45%]" />
                <BarColumn month="APR" height="h-[75%]" />
                <BarColumn month="MAY" height="h-[60%]" />
                <BarColumn month="JUN" height="h-[90%]" current />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Hot Leads</h4>
                  <span className="text-[11px] text-slate-500 font-medium">Conversion velocity: 14.2 days avg.</span>
                </div>
                <button onClick={() => navigate('/lead-management')} className="text-[#0F478D] font-bold text-xs flex items-center gap-1"><span>View All</span> <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2.5">
                <LeadRow name="Vikram Singh" type="Term Life + Critical Ill" score="94" initials="VS" color="bg-indigo-500" status="Contacted (28)" />
                <LeadRow name="Priya Lakshmi" type="Education Wealth Plan" score="88" initials="PL" color="bg-emerald-500" status="Proposal (15)" />
                <LeadRow name="Rahul Kapoor" type="Family Floater Plus" score="72" initials="RK" color="bg-amber-500" status="Negotiation (8)" />
              </div>
            </div>
          </div>

          <div className="space-y-6 text-left">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Tasks</h4>
                <span className="bg-amber-50 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-100">4 Remaining</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.5 rounded-sm">Urgent Renewal</span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 10:30 AM</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">Call Sunil Verma for Life-Policy #3291 renewal</p>
                  <div className="flex gap-2">
                    <button className="bg-[#0F478D] text-white text-[10px] font-bold px-3 py-1 rounded-md">Call Now</button>
                    <button className="bg-white text-slate-500 border border-slate-200 text-[10px] font-bold px-3 py-1 rounded-md">Reschedule</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-baseline">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Target</h4>
                <span className="text-xs font-black text-black">$90k / <span className="text-slate-400">$120k</span></span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#0F478D] to-emerald-500 h-full w-[75%]"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function KPICard({ title, score, footer }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden text-left">
      <div className="space-y-1">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 leading-none">{title}</h4>
        <h3 className="text-2xl font-black text-black tracking-tight pt-1">{score}</h3>
      </div>
      <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-3 text-[11px]">
        <span className="text-slate-400 font-medium">{footer}</span>
      </div>
    </div>
  );
}

function BarColumn({ month, height, current }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
      <div className="w-full relative flex justify-center items-end h-full">
        <div className={`w-full rounded-t-md transition-all ${current ? 'bg-gradient-to-t from-[#0B1E46] to-[#0F478D]' : 'bg-slate-200 group-hover:bg-slate-300'} ${height}`}></div>
      </div>
      <span className={`text-[10px] font-bold ${current ? 'text-[#0F478D]' : 'text-slate-400'}`}>{month}</span>
    </div>
  );
}

function LeadRow({ name, type, score, initials, color, status }) {
  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 transition-all text-left">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${color} text-white font-bold text-xs flex items-center justify-center shadow-xs`}>{initials}</div>
        <div>
          <h5 className="text-xs font-bold text-black leading-none mb-1">{name}</h5>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{type}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-center shadow-xs">
          <span className="text-xs font-black text-black">{score}</span>
        </div>
      </div>
    </div>
  );
}