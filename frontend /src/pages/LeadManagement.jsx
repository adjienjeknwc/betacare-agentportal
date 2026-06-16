// src/pages/LeadManagement.jsx
import React, { useState, useMemo } from 'react';
import { 
  Search, Bell, Plus, SlidersHorizontal, BarChart3, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeadTemperatureGuide from '../components/lead/LeadTemperatureGuide';

export default function LeadManagement() {
  const navigate = useNavigate();

  // 1. RECONCILED OPERATIONAL LEAD MASTER MATRIX DATA
  const masterLeadsData = [
    { id: '#LD-8924', name: 'Arjun Mehta', interest: 'Term Life', score: '85', temp: 'HOT', status: '• Sent', statusColor: 'text-blue-700 bg-blue-50 border-blue-100', time: '2h ago', initials: 'AM', avatarBg: 'bg-blue-600' },
    { id: '#LD-8925', name: 'Sara Khan', interest: 'ULIP', score: '65', temp: 'WARM', status: 'Contacted', statusColor: 'text-amber-700 bg-amber-50 border-amber-100', time: 'Yesterday', initials: 'SK', avatarBg: 'bg-indigo-500' },
    { id: '#LD-8926', name: 'Rohan Joshi', interest: 'Term Life', score: '92', temp: 'HOT', status: 'Proposal', statusColor: 'text-purple-700 bg-purple-50 border-purple-100', time: '15m ago', initials: 'RJ', avatarBg: 'bg-emerald-600' },
    { id: '#LD-8710', name: 'Meera Nair', interest: 'Whole Life', score: '45', temp: 'COLD', status: 'Contacted', statusColor: 'text-amber-700 bg-amber-50 border-amber-100', time: '3 days ago', initials: 'MN', avatarBg: 'bg-slate-500' },
    { id: '#LD-8645', name: 'Vikram Sai', interest: 'ULIP', score: '78', temp: 'WARM', status: '• Sent', statusColor: 'text-blue-700 bg-blue-50 border-blue-100', time: '4 days ago', initials: 'VS', avatarBg: 'bg-teal-600' },
    { id: '#LD-8520', name: 'Ananya Rao', interest: 'Term Life', score: '89', temp: 'HOT', status: 'Proposal', statusColor: 'text-purple-700 bg-purple-50 border-purple-100', time: '1 week ago', initials: 'AR', avatarBg: 'bg-rose-600' }
  ];

  // 2. SEARCH & FILTER INTERACTION STATE MANAGERS
  const [searchQuery, setSearchQuery] = useState('');
  const [tempFilter, setTempFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  // 3. REGIONAL SEARCH LOGIC PROCESSING RUNNER
  const filteredLeads = useMemo(() => {
    return masterLeadsData.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            lead.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTemp = tempFilter === 'All' || lead.temp === tempFilter;
      const matchesProduct = productFilter === 'All' || lead.interest === productFilter;

      return matchesSearch && matchesTemp && matchesProduct;
    });
  }, [searchQuery, tempFilter, productFilter]);

  // Pagination parameters resolution calculations
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const paginatedLeads = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setTempFilter('All');
    setProductFilter('All');
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] overflow-x-hidden">
      
      {/* FIXED HEADER SYSTEM */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 select-none gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-2xl font-bold text-[#0B1F5B] tracking-tight leading-none">
            Lead Management
          </h1>
          <div className="w-64 relative flex items-center ml-3 hidden sm:flex">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search operational records..." 
              className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 text-xs outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 ml-auto">
          <button 
            type="button" 
            onClick={() => navigate('/register/personal-details')}
          className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-10 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm shrink-0 self-start sm:self-auto focus:outline-none select-none"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Lead</span>
        </button>

          <div className="h-5 w-px bg-slate-200 shrink-0"></div>

          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg relative shrink-0 focus:outline-none">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span>
          </button>

          <div className="flex items-center gap-2.5 select-none shrink-0">
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

      {/* MAIN CONTAINER LAYOUT AREA */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        
        <div className="w-full text-left select-none">
          <span className="text-slate-400 text-xs font-bold tracking-tight bg-slate-100 border px-2.5 py-1 rounded-md">
            Showing {filteredLeads.length} total leads across operational sectors
          </span>
        </div>

        {/* DROPDOWN FILTER CHIPS BAR */}
        <div className="w-full flex items-center justify-between bg-white border border-slate-200 p-2 rounded-xl shadow-3xs shrink-0 select-none gap-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div className="bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-[10px] font-bold h-8 px-2 flex items-center gap-1 shrink-0">
              <span className="text-slate-400">Timeline:</span>
              <select className="bg-transparent border-none outline-none text-[#0B1F5B] font-extrabold text-[10px] cursor-pointer">
                <option>Last 30 Days</option><option>Last 60 Days</option>
              </select>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-[10px] font-bold h-8 px-2 flex items-center gap-1 shrink-0">
              <span className="text-slate-400">Temperature:</span>
              <select 
                value={tempFilter}
                onChange={(e) => { setTempFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none outline-none text-[#0B1F5B] font-extrabold text-[10px] cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="HOT">HOT 🔥</option>
                <option value="WARM">WARM 🟡</option>
                <option value="COLD">COLD ❄️</option>
              </select>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-[10px] font-bold h-8 px-2 flex items-center gap-1 shrink-0">
              <span className="text-slate-400">Product:</span>
              <select 
                value={productFilter}
                onChange={(e) => { setProductFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none outline-none text-[#0B1F5B] font-extrabold text-[10px] cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Term Life">Term Life</option>
                <option value="Whole Life">Whole Life</option>
                <option value="ULIP">ULIP</option>
              </select>
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleClearFilters}
            className="text-xs font-semibold text-[#0B1F5B] hover:underline focus:outline-none pl-2 shrink-0 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {/* METRIC CARD TARGET STYLING SYSTEM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none w-full">
          <LeadKPICard title="TOTAL LEADS" count={masterLeadsData.length} />
          <LeadKPICard title="HOT LEADS" count={masterLeadsData.filter(l=>l.temp==='HOT').length} highlightColor="border-t-2 border-t-rose-500" />
          <LeadKPICard title="WARM LEADS" count={masterLeadsData.filter(l=>l.temp==='WARM').length} />
          <LeadKPICard title="CONVERSIONS PIPELINE" count="210" badge="+8 Today" />
        </div>

        {/* FUNNEL WORKFLOW BLOCK */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 shrink-0 text-left">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2 select-none">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Sales Funnel Efficiency</h3>
            <button 
              type="button" 
              onClick={() => navigate('/lead-management/analytics')}
              className="text-[#0F478D] font-bold text-xs flex items-center gap-1 hover:underline focus:outline-none"
            >
              <BarChart3 className="w-3.5 h-3.5" /> <span>View Detailed Analytics</span>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <FunnelNode stage="NEW LEAD" value="300" progress="w-full" active />
            <FunnelNode stage="CONTACTED" value="240" progress="w-[80%]" />
            <FunnelNode stage="INTERESTED" value="210" progress="w-[70%]" />
            <FunnelNode stage="QUOTE SHARED" value="180" progress="w-[60%]" />
            <FunnelNode stage="PROPOSAL" value="120" progress="w-[40%]" />
            <FunnelNode stage="CONVERTED" value="45" progress="w-[15%]" success />
          </div>
        </div>

        {/* ACTIVE LEADS DISPATCH DATA TABLE METRICS ROW SHEET */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col w-full">
          <div className="px-5 py-3.5 border-b border-slate-200 flex justify-between items-center bg-white shrink-0 select-none">
            <h3 className="text-sm font-bold text-slate-700 tracking-tight uppercase">Active Leads</h3>
            <span className="text-[11px] text-slate-400 font-bold">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
            </span>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse table-auto min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                  <th className="py-2.5 px-5 w-24">LEAD ID</th>
                  <th className="py-2.5 px-5">CUSTOMER NAME</th>
                  <th className="py-2.5 px-5 w-40">PRODUCT INTEREST</th>
                  <th className="py-2.5 px-5 w-24 text-center">SCORE</th>
                  <th className="py-2.5 px-5 w-32 text-center">TEMPERATURE</th>
                  <th className="py-2.5 px-5 w-32 text-center">STATUS</th>
                  <th className="py-2.5 px-5 w-36">LAST FOLLOW-UP</th>
                  <th className="py-2.5 px-5 w-16 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {paginatedLeads.map((lead, idx) => (
                  <tr key={`${lead.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-5 font-mono text-[11px] font-bold text-slate-400">{lead.id}</td>
                    <td className="py-3 px-5 text-left">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md ${lead.avatarBg} text-white text-[9px] font-bold flex items-center justify-center shrink-0 select-none`}>
                          {lead.initials}
                        </div>
                        <span className="font-bold text-slate-800 tracking-tight">{lead.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 font-semibold text-slate-500 text-left">{lead.interest}</td>
                    <td className="py-3 px-5 text-center">
                      <span className="font-extrabold text-slate-800 bg-slate-50 border px-2 py-0.5 rounded-md text-[10px]">
                        {lead.score}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className={`text-[9px] font-black tracking-wide px-2 py-0.5 rounded border uppercase ${
                        lead.temp === 'HOT' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {lead.temp}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-wide whitespace-nowrap ${lead.statusColor}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-slate-400 text-[10px] whitespace-nowrap text-left">{lead.time}</td>
                    <td className="py-3 px-5 text-center">
                      {/* DETAILED WORKSPACE ROUTER TRIGGER — PERFECT ID RESOLUTION BOUNDS */}
                      <button 
                        type="button" 
                        onClick={() => navigate(`/lead-management/details/${lead.id.replace('#', '')}`, { state: { lead } })}
                        className="text-slate-400 hover:text-[#0F478D] font-bold p-1 focus:outline-none transition-colors"
                        title="Launch Onboarding Workspace"
                      >
                        <ChevronRight className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ACTIVE COUNTERS PAGINATION FOOTER BAR */}
          <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs select-none">
            <span className="text-slate-400 font-bold">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button 
                type="button" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1 rounded-lg border bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2.5 py-0.5 rounded-md bg-[#0F478D] text-white font-bold">{currentPage}</span>
              <button 
                type="button" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1 rounded-lg border bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <LeadTemperatureGuide />
      </main>
    </div>
  );
}

function LeadKPICard({ title, count, badge, highlightColor }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-center min-h-[76px] relative overflow-hidden flex-1 text-left ${highlightColor || ''}`}>
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">{title}</h4>
      <div className="flex items-baseline justify-between pt-1">
        <h3 className="text-xl font-black text-[#0B1E46] tracking-tight leading-none">{count}</h3>
        {badge && <span className="text-[8px] font-extrabold bg-blue-50 text-[#0F478D] border border-blue-100 px-1.5 py-0.5 rounded-sm uppercase">{badge}</span>}
      </div>
    </div>
  );
}

function FunnelNode({ stage, value, progress, active, success }) {
  return (
    <div className={`p-2.5 border rounded-xl flex flex-col justify-between h-[68px] ${active ? 'bg-blue-50/40 border-[#0F478D]' : 'bg-slate-50/60 border-slate-200'}`}>
      <div>
        <h4 className={`text-[9px] font-black tracking-wider leading-none mb-1 text-left ${active ? 'text-[#0F478D]' : 'text-slate-400'}`}>{stage}</h4>
        <span className="text-base font-black text-slate-900 tracking-tight leading-none block text-left">{value}</span>
      </div>
      <div className="w-full bg-slate-200 h-1 rounded-full mt-1 overflow-hidden">
        <div className={`h-full rounded-full ${success ? 'bg-emerald-500' : 'bg-[#0F478D]'} ${progress}`}></div>
      </div>
    </div>
  );
}