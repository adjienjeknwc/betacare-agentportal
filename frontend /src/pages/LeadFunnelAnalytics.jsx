// src/pages/LeadFunnelAnalytics.jsx
import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Users, Clock, Award, MapPin, Calendar, Download, CheckCircle, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LeadFunnelAnalytics() {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('Last 30 Days');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const triggerMockExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    }, 1500);
  };

  const agents = [
    { name: 'Rohan Sharma', closed: '42', revenue: '₹14,50,000', rate: '24.2%' },
    { name: 'Priya Patel', closed: '38', revenue: '₹12,80,000', rate: '21.5%' }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB]">
      
      {/* UNIFIED DESIGN SYSTEM TOP HEADER ROW */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 select-none gap-4">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => navigate('/lead-management')}
            className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 transition-all focus:outline-none shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-bold text-[#0B1F5B] tracking-tight leading-none">
            Funnel Conversion Analytics
          </h1>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={triggerMockExport}
            disabled={isExporting}
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold h-9 px-3 rounded-xl flex items-center gap-1.5 transition-all focus:outline-none"
          >
            {isExporting ? <span className="w-3.5 h-3.5 border-2 border-[#0F478D] border-t-transparent rounded-full animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isExporting ? 'Compiling...' : exportComplete ? 'Report Saved' : 'Download Summary'}</span>
          </button>

          <div className="h-5 w-px bg-slate-200 shrink-0"></div>

          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg relative shrink-0 focus:outline-none">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span>
          </button>
          
          <div className="flex items-center gap-2.5 select-none">
            <div className="text-right hidden md:block">
              <h4 className="text-xs font-bold text-slate-900 leading-none">Agent John</h4>
              <span className="text-[9px] text-slate-400 font-black tracking-wider block mt-0.5">PREMIUM BROKER</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#0F478D] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
              AJ
            </div>
          </div>
        </div>
      </header>

      {/* COMPACT ANALYTICS CONTAINER WORKSPACE CANVAS */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        
        {/* KPI CARD GRID: Grid 4 gap 6 inside layout constraint boundaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none w-full">
          <AnalyticsKPICard title="CONVERSION EFFICIENCY" value="15.0%" subtitle="Standard baseline 12.4%" icon={TrendingUp} onClick={() => navigate('/lead-management/analytics/conversion-efficiency')} />
          <AnalyticsKPICard title="TOTAL CLOSED LEADS" value="140" subtitle="+18 Added this month" icon={Users} onClick={() => navigate('/lead-management/analytics/closed-leads')} />
          <AnalyticsKPICard title="AVG PROCESSING TIME" value="4.2 Days" subtitle="Figma benchmark 5 days" icon={Clock} onClick={() => navigate('/lead-management/analytics/processing-time')} />
          <AnalyticsKPICard title="REVENUE PROJECTION" value="₹46.95 L" subtitle="Weighted forward look" icon={Award} onClick={() => navigate('/lead-management/analytics/revenue-projection')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs lg:col-span-2 space-y-3">
            <div className="border-b pb-2"><h3 className="text-xs font-black uppercase text-slate-400">Pipeline Stage Optimization</h3></div>
            <div className="space-y-2.5">
              <FunnelChartBar label="New Lead" volume="300" percent="100%" width="w-full" bg="bg-[#0B1E46]" />
              <FunnelChartBar label="Contacted" volume="240" percent="80%" width="w-[80%]" bg="bg-[#0F478D]" />
              <FunnelChartBar label="Converted" volume="45" percent="15%" width="w-[15%]" bg="bg-emerald-600" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="border-b pb-2"><h3 className="text-xs font-black uppercase text-slate-400">Lead Temperature Profiles</h3></div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black text-slate-500"><span>HOT LEADS 🔥</span><span>85 (6.8%)</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[7%]" /></div>
              <div className="flex justify-between text-[10px] font-black text-slate-500"><span>WARM LEADS 🟡</span><span>432 (34.6%)</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[35%]" /></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
            <div className="border-b pb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /><h3 className="text-xs font-black uppercase text-slate-400">Territory Performance</h3></div>
            <div className="divide-y text-xs font-medium">
              <div className="py-2.5 flex justify-between cursor-pointer hover:text-[#0F478D]" onClick={() => navigate('/lead-management/analytics/territory/mumbai')}><span>Mumbai (HQ)</span><span className="font-bold">512 Leads</span></div>
              <div className="py-2.5 flex justify-between cursor-pointer hover:text-[#0F478D]" onClick={() => navigate('/lead-management/analytics/territory/delhi')}><span>Delhi (NCR)</span><span className="font-bold">340 Leads</span></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
            <div className="border-b pb-2 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /><h3 className="text-xs font-black uppercase text-slate-400">Acquisition Channels Matrix</h3></div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
              <div className="p-2 bg-slate-50 border rounded-xl"><h5>Website</h5><p className="text-sm font-black mt-0.5">412</p></div>
              <div className="p-2 bg-slate-50 border rounded-xl"><h5>Referral</h5><p className="text-sm font-black mt-0.5">310</p></div>
              <div className="p-2 bg-slate-50 border rounded-xl"><h5>Campaign</h5><p className="text-sm font-black mt-0.5">265</p></div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

function AnalyticsKPICard({ title, value, subtitle, icon: Icon, onClick }) {
  return (
    <div onClick={onClick} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all border-l-4 border-l-[#0F478D] flex-1">
      <div>
        <h4 className="text-[10px] font-black uppercase text-slate-400">{title}</h4>
        <h3 className="text-xl font-black text-[#0B1E46] mt-0.5">{value}</h3>
        <span className="text-[10px] text-slate-400 block mt-0.5">{subtitle}</span>
      </div>
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Icon className="w-4 h-4" /></div>
    </div>
  );
}

function FunnelChartBar({ label, volume, percent, width, bg }) {
  return (
    <div className="flex items-center text-xs font-bold gap-3">
      <div className="w-20 text-slate-500 truncate">{label}</div>
      <div className="flex-1 bg-slate-100 h-6 rounded-md overflow-hidden relative border border-slate-200/40">
        <div className={`h-full flex items-center px-2 text-white font-black text-[10px] ${bg} ${width}`}>{volume} units</div>
        <div className="absolute right-2.5 top-1 text-[10px] text-slate-400 font-extrabold">{percent}</div>
      </div>
    </div>
  );
}