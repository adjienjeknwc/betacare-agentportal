// src/pages/Quotations.jsx

import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { 

  Search, Plus, Filter, ArrowUpRight, TrendingUp, Shield, 

  Layers, HelpCircle, Calendar, CheckCircle, Flame, Snowflake, 

  Calculator, Sliders, Download, FileSpreadsheet 

} from 'lucide-react';



export default function Quotations() {

  const navigate = useNavigate();

  

  // State indicators matching layout control interfaces from your screenshot

  const [policyFilter, setPolicyFilter] = useState('All');

  const [statusFilter, setStatusFilter] = useState('All');

  const [dateFilter, setDateFilter] = useState('Last 30 Days');



  // FUNNEL METRIC DATA STREAM DEFINED DIRECTLY FROM PREVIOUS SCHEMATICS

  const funnelSteps = [

    { percentage: '100%', label: 'Lead Created', count: '5,200', unit: 'leads', bgBadge: 'bg-[#031B33] text-white' },

    { percentage: '85%', label: 'Quote Generated', count: '4,420', unit: 'quotes', bgBadge: 'bg-[#062F59] text-white' },

    { percentage: '60%', label: 'Proposal Shared', count: '2,652', unit: 'shared', bgBadge: 'bg-[#2563EB] text-white' },

    { percentage: '45%', label: 'Customer Viewed', count: '1,193', unit: 'viewed', bgBadge: 'bg-[#0252D7] text-white' },

    { percentage: '30%', label: 'Accepted', count: '895', unit: 'accepted', bgBadge: 'bg-[#2B5B93] text-white border border-blue-200/40' }

  ];



  // REAL DATA ROWS SYNCHRONIZED EXACTLY WITH "Screenshot 2026-06-10 at 3.46.55 PM.png"

  const quotationEntries = [

    { id: '#QT-9012', name: 'Arjun Mehta', initials: 'AM', color: 'bg-blue-100 text-[#0F478D]', type: 'Term Life', premium: '$1,250/yr', temp: 'Hot', tempColor: 'bg-red-50 text-red-600 border-red-100', status: 'Accepted', statusDot: 'bg-emerald-500' },

    { id: '#QT-9013', name: 'Sanya Kapoor', initials: 'SK', color: 'bg-purple-100 text-purple-700', type: 'Whole Life', premium: '$4,800/yr', temp: 'Warm', tempColor: 'bg-amber-50 text-amber-600 border-amber-100', status: 'Pending', statusDot: 'bg-amber-400' },

    { id: '#QT-9014', name: 'Rahul Prasad', initials: 'RP', color: 'bg-indigo-100 text-indigo-700', type: 'ULIP', premium: '$12,000/yr', temp: 'Cold', tempColor: 'bg-blue-50 text-blue-500 border-blue-100', status: 'Shared', statusDot: 'bg-blue-500' },

    { id: '#QT-8892', name: 'David Lee', initials: 'DL', color: 'bg-slate-100 text-slate-700', type: 'Term Life', premium: '$980/yr', temp: 'Cold', tempColor: 'bg-blue-50 text-blue-500 border-blue-100', status: 'Expired', statusDot: 'bg-rose-400' }

  ];



  const handleClearFilters = () => {

    setPolicyFilter('All');

    setStatusFilter('All');

    setDateFilter('Last 30 Days');

  };



  return (

    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] px-6 py-6 space-y-6 text-left font-sans antialiased pb-24 relative">

      

      {/* GLOBAL HEADER TOP TITLE REGISTRATION */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">

        <div>

          <h1 className="text-2xl font-black text-black tracking-tight leading-none">Quotations Desk</h1>

          <p className="text-xs font-medium text-slate-500 mt-1.5">Manage product proposal configurations, premium options, and funnel conversion tracking loops.</p>

        </div>

        <button 

          type="button" 

          onClick={() => navigate('/register/personal-details')}

          className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-10 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm shrink-0 self-start sm:self-auto focus:outline-none"

        >

          <Plus className="w-4 h-4" />

          <span>New Quote Configuration</span>

        </button>

      </div>



      {/* METRIC CARD STATS BLOCKS ROW */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none w-full">

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs">

          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Active Proposals</span>

          <h3 className="text-2xl font-black text-black mt-1">4,420</h3>

          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">

            <TrendingUp className="w-3 h-3" /> <span>+12.4% this week</span>

          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs">

          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Premium Target</span>

          <h3 className="text-2xl font-black text-black mt-1">$384,900</h3>

          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-0.5 mt-1">Avg. value: $870</div>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs">

          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Conversion Clearance</span>

          <h3 className="text-2xl font-black text-black mt-1">20.25%</h3>

          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">Top 10% Agent Group</div>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs">

          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Pending Underwriting Review</span>

          <h3 className="text-2xl font-black text-black mt-1">14</h3>

          <div className="text-[11px] text-amber-600 font-bold flex items-center gap-0.5 mt-1">3 SLA critical</div>

        </div>

      </div>



      {/* PIPELINE QUOTATION FUNNEL SLAT - PRESERVED UNBROKEN */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-full">

        <div className="text-left border-b border-slate-100 pb-4 mb-6 select-none">

          <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase">Quotation Funnel</h4>

        </div>

        <div className="w-full overflow-x-auto pb-2 scrollbar-none">

          <div className="min-w-[850px] flex items-start justify-between px-4 relative">

            {funnelSteps.map((step, idx) => (

              <React.Fragment key={idx}>

                <div className="flex flex-col items-center space-y-3.5 text-center w-36 relative z-10 select-none">

                  <div className={`w-12 h-12 rounded-full ${step.bgBadge} flex items-center justify-center font-black text-xs shadow-md`}>

                    {step.percentage}

                  </div>

                  <div className="space-y-0.5">

                    <h5 className="text-xs font-extrabold text-[#051F3D] leading-tight px-1">{step.label}</h5>

                    <div className="text-xs font-bold text-slate-600">{step.count}</div>

                    <div className="text-[10px] font-semibold text-slate-400 lowercase tracking-tight">{step.unit}</div>

                  </div>

                </div>

                {idx < funnelSteps.length - 1 && <div className="flex-1 h-px bg-slate-300 relative top-6 mx-2 shrink-0 self-start" />}

              </React.Fragment>

            ))}

          </div>

        </div>

      </div>



      {/* ==========================================================================

         CENTRAL RECONCILED ARCHITECTURE LAYOUT GRID: SIDEBAR HUB + DATA BOXES

         ========================================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">

        

        {/* LEFT COLUMN: ACTIVE FILTER CONTROLS & COMPREHENSIVE RECORDS SLAT TABLE */}

        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">

          

          {/* INTERACTIVE FILTERS ROW BLOCK MATCHES SCREENSHOT GRAPHICS */}

          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 p-4 border border-slate-100 rounded-xl select-none">

            <div className="flex flex-wrap items-center gap-3">

              

              {/* POLICY SELECTION FILTER CHIP */}

              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 h-10 min-w-[150px] focus-within:border-[#0F478D] transition-all">

                <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />

                <span className="text-xs font-bold text-slate-500 mr-1">Policy Type:</span>

                <span className="text-xs font-black text-black">{policyFilter}</span>

                <select 

                  value={policyFilter} 

                  onChange={(e) => setPolicyFilter(e.target.value)}

                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer font-bold"

                >

                  <option>All</option>

                  <option>Term Life</option>

                  <option>Whole Life</option>

                  <option>ULIP</option>

                </select>

                <span className="text-[9px] text-slate-400 ml-auto font-bold">▼</span>

              </div>



              {/* STATUS TRACKER SELECTION FILTER CHIP */}

              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 h-10 min-w-[130px] focus-within:border-[#0F478D] transition-all">

                <CheckCircle className="w-3.5 h-3.5 text-slate-400 mr-2" />

                <span className="text-xs font-bold text-slate-500 mr-1">Status:</span>

                <span className="text-xs font-black text-black">{statusFilter}</span>

                <select 

                  value={statusFilter} 

                  onChange={(e) => setStatusFilter(e.target.value)}

                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer font-bold"

                >

                  <option>All</option>

                  <option>Accepted</option>

                  <option>Pending</option>

                  <option>Shared</option>

                  <option>Expired</option>

                </select>

                <span className="text-[9px] text-slate-400 ml-auto font-bold">▼</span>

              </div>



              {/* DATE RANGE RECONCILIATION FILTER CHIP */}

              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 h-10 min-w-[160px] focus-within:border-[#0F478D] transition-all">

                <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2" />

                <span className="text-xs font-bold text-slate-500 mr-1">Date:</span>

                <span className="text-xs font-black text-black">{dateFilter}</span>

                <select 

                  value={dateFilter} 

                  onChange={(e) => setDateFilter(e.target.value)}

                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer font-bold"

                >

                  <option>Last 30 Days</option>

                  <option>Last Quarter</option>

                  <option>Financial Year 2026</option>

                </select>

                <span className="text-[9px] text-slate-400 ml-auto font-bold">▼</span>

              </div>



            </div>



            {/* RESET EVENT ACTIONS LINK */}

            <button 

              type="button" 

              onClick={handleClearFilters}

              className="text-xs font-bold text-[#0F478D] hover:text-black hover:underline cursor-pointer transition-colors focus:outline-none"

            >

              Clear All Filters

            </button>

          </div>



          {/* QUOTATION SCREENSHOT RECONCILED ROW GRID TABLE */}

          <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[700px] text-xs font-medium text-slate-600 border-collapse">

              <thead>

                <tr className="border-b border-slate-200 text-slate-400 text-left font-black uppercase tracking-wider text-[10px] bg-slate-50/20">

                  <th className="pb-3 pt-2 pl-3">Quote ID</th>

                  <th className="pb-3 pt-2">Customer Name</th>

                  <th className="pb-3 pt-2">Policy Type</th>

                  <th className="pb-3 pt-2">Premium</th>

                  <th className="pb-3 pt-2">Lead Temp</th>

                  <th className="pb-3 pt-2">Status</th>

                  <th className="pb-3 pt-2 text-right pr-3">Action</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100 font-sans">

                {quotationEntries.map((row, index) => (

                  <tr key={index} className="hover:bg-slate-50/40 transition-colors group">

                    

                    {/* QUOTE IDENTIFICATION TOKEN */}

                    <td className="py-4 pl-3 font-bold text-slate-900 tracking-tight">{row.id}</td>

                    

                    {/* AVATAR + CUSTOMER IDENTIFIER */}

                    <td className="py-4">

                      <div className="flex items-center gap-3">

                        <div className={`w-7 h-7 rounded-lg ${row.color} font-black text-[10px] flex items-center justify-center shadow-3xs shrink-0 select-none`}>

                          {row.initials}

                        </div>

                        <span className="font-bold text-black group-hover:text-[#0F478D] transition-colors">{row.name}</span>

                      </div>

                    </td>

                    

                    {/* COVERAGE CLASS SELECTION */}

                    <td className="py-4 font-semibold text-slate-600">{row.type}</td>

                    

                    {/* MONETARY VALUE RATES VALUE */}

                    <td className="py-4 font-black text-black">{row.premium}</td>

                    

                    {/* TEMPERATURE VELOCITY METRIC BADGE CHIPS */}

                    <td className="py-4">

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit select-none ${row.tempColor}`}>

                        {row.temp === 'Hot' && <Flame className="w-3 h-3 text-red-500 fill-red-500" />}

                        {row.temp === 'Warm' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}

                        {row.temp === 'Cold' && <Snowflake className="w-3 h-3 text-blue-400" />}

                        <span>{row.temp}</span>

                      </span>

                    </td>

                    

                    {/* PIPELINE LOG CONVERSION STATUS INDICATOR CHIPS */}

                    <td className="py-4">

                      <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-800 select-none">

                        <span className={`w-2 h-2 rounded-full ${row.statusDot}`}></span>

                        <span>{row.status}</span>

                      </div>

                    </td>



                    {/* INTERACTIVE LINK EXPANSIONS */}

                    <td className="py-4 text-right pr-3">

                      <button type="button" onClick={() => navigate('/analytics/premium-calculator')} className="text-[#0F478D] font-bold hover:underline inline-flex items-center gap-0.5 focus:outline-none">

                        <span>View</span> <ArrowUpRight className="w-3 h-3" />

                      </button>

                    </td>



                  </tr>

                ))}

              </tbody>

            </table>

          </div>



          {/* LOWER GRID PAGINATION COMPONENT SLAT ROW CONTAINER */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400 select-none">

            <span>Showing 1 to 4 of 4,280 entries</span>

            <div className="flex items-center gap-1 text-slate-600 text-xs">

              <button type="button" className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-bold disabled:opacity-50" disabled>Previous</button>

              <button type="button" className="h-8 w-8 rounded-lg bg-[#0F478D] font-black text-white flex items-center justify-center shadow-3xs">1</button>

              <button type="button" className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-bold flex items-center justify-center">2</button>

              <button type="button" className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-bold flex items-center justify-center">3</button>

              <button type="button" className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-bold">Next</button>

            </div>

          </div>



          {/* CORE PRIMARY ACTION ALIGNMENT LINE FORWARD */}

          <div className="flex items-center justify-between pt-2 border-t border-slate-50">

            <button type="button" className="text-slate-500 hover:text-black text-xs font-bold flex items-center gap-1 focus:outline-none">

              <FileSpreadsheet className="w-4 h-4 text-slate-400" />

              <span>Export Report</span>

            </button>

            <button 

              type="button" 

              onClick={() => navigate('/register/personal-details')}

              className="bg-[#041A3A] hover:bg-black text-white text-xs font-bold h-9 px-4 rounded-lg flex items-center gap-1.5 shadow-sm transition-all focus:outline-none"

            >

              <Plus className="w-3.5 h-3.5" />

              <span> New Lead</span>

            </button>

          </div>



        </div>



        {/* RIGHT COLUMN: QUICK TOOLS PANEL HOOD PLATFORM (MATCHES SCREENSHOT SPEC) */}

        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">

          <div className="border-b border-slate-100 pb-2.5 text-left select-none">

            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Quick Tools</h4>

          </div>



          {/* ACTION BUTTON MATRIX MODULE LINKS */}

          <div className="space-y-2 text-left">

            

            {/* CALCULATOR LINK HUB */}

            <button 

              type="button"

              onClick={() => navigate('/analytics/premium-calculator')}

              className="w-full p-3 bg-slate-50/60 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 rounded-xl flex items-start gap-3 transition-all text-xs focus:outline-none group"

            >

              <Calculator className="w-4 h-4 text-[#0F478D] mt-0.5 shrink-0" />

              <div className="space-y-0.5">

                <div className="font-extrabold text-slate-900 group-hover:text-[#0F478D] transition-colors">Premium Calculator</div>

                <div className="text-[10px] font-medium text-slate-400 leading-normal">Execute quote premium algorithms against risk parameters.</div>

              </div>

            </button>



            {/* COMPARISON SLIDERS TRIGGER GRID */}

            <button 

              type="button"

              onClick={() => navigate('/quotations/policy-comparison')}

              className="w-full p-3 bg-slate-50/60 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 rounded-xl flex items-start gap-3 transition-all text-xs focus:outline-none group"

            >

              <Sliders className="w-4 h-4 text-[#0F478D] mt-0.5 shrink-0" />

              <div className="space-y-0.5">

                <div className="font-extrabold text-slate-900 group-hover:text-[#0F478D] transition-colors">Policy Comparison Grid</div>

                <div className="text-[10px] font-medium text-slate-400 leading-normal">Cross-analyze product structures side-by-side.</div>

              </div>

            </button>



            {/* FILE CHART DOWNLOAD DESKS */}

            <button 

              type="button"

              className="w-full p-3 bg-slate-50/60 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 rounded-xl flex items-start gap-3 transition-all text-xs focus:outline-none group"

            >

              <Download className="w-4 h-4 text-[#0F478D] mt-0.5 shrink-0" />

              <div className="space-y-0.5">

                <div className="font-extrabold text-slate-900 group-hover:text-[#0F478D] transition-colors">Download Rate Charts</div>

                <div className="text-[10px] font-medium text-slate-400 leading-normal">Fetch up-to-date actuarial sheets locally.</div>

              </div>

            </button>



          </div>

        </div>



      </div>



      

    </div>

  );

}