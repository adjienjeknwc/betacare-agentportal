// src/pages/PoliciesDashboard.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Download, Eye, Clock, ChevronDown, MoreVertical, Shield, 
  CreditCard, Calendar, AlertTriangle, ArrowLeft, ArrowRight, Save, User, 
  Briefcase, DollarSign, Heart, Layers, CheckCircle2, ShieldAlert, FileText, Check, Upload, 
} from 'lucide-react';

export default function PoliciesDashboard() {
  const navigate = useNavigate();
  
  // 1. CORE SEARCH & LIFECYCLE FILTER DASHBOARD STATES
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeframe, setTimeframe] = useState('Last 6 Months');
  const [activeMenu, setActiveMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 2; 

  // 2. ONBOARDING WIZARD MODAL STATE ENGAGEMENTS
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // 3. MASTER APPLICATION FORM DATA DATA TREES
  const [policyForm, setPolicyForm] = useState({
    // Step 1: Select Lead
    selectedLeadId: 'Sarah Mitchell',
    // Step 2: Plan Customization
    planType: 'Term Life',
    sumAssured: '12500000',
    paymentFrequency: 'Annual',
    // Step 3: Client Details
    fullName: 'Alexander Thompson',
    dob: '1988-05-14',
    nationalId: 'XXX-XX-XXXX',
    maritalStatus: 'Married',
    occupation: 'Software Engineer',
    engageHazardous: 'No',
    smokingStatus: 'Non-Smoker',
    annualIncome: '120000',
    nomineeName: 'Sarah Thompson',
    nomineeRelation: 'Spouse',
    nomineeShare: '100',
    agentNotes: '',
    // Step 4: Documents Upload Manifest Marks
    identityProofUploaded: true,
    addressProofUploaded: false,
    incomeProofUploaded: true
  });

  // 4. MAIN CENTRAL DATA BASE LIST GRID RECORDS
  const [policyRecords, setPolicyRecords] = useState([
    { id: 'AB-LIFE-7728391', name: 'Arjun Mehta', initials: 'AM', color: 'bg-blue-100 text-[#0B1F5B]', plan: 'Heritage Elite Term', type: 'Term', sumAssured: 12500000, premium: 20532, renewal: 'Oct 25, 2026', status: 'Active', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'AB-LIFE-9912044', name: 'Sarah Kapoor', initials: 'SK', color: 'bg-purple-100 text-purple-700', plan: 'Wealth Secure Plus', type: 'Endowment', sumAssured: 8500000, premium: 15200, renewal: 'May 12, 2026', status: 'Renewal Due', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'AB-LIFE-4431980', name: 'Rajiv Jain', initials: 'RJ', color: 'bg-indigo-100 text-indigo-700', plan: 'Smart Term Plan', type: 'Term', sumAssured: 20000000, premium: 32100, renewal: 'Jan 18, 2027', status: 'Active', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'AB-LIFE-2211876', name: 'Priya Lakshmi', initials: 'PL', color: 'bg-slate-100 text-slate-700', plan: 'Family Shield', type: 'Whole Life', sumAssured: 5000000, premium: 8900, renewal: 'Mar 05, 2026', status: 'Lapsed', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' }
  ]);

  // 5. DATA FILTERS AND PAGINATION CALCULATOR RUNNERS
  const filteredRecords = useMemo(() => {
    return policyRecords.filter(row => {
      const matchesSearch = 
        row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.plan.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesType = typeFilter === 'All' || row.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || row.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [policyRecords, searchQuery, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage) || 1;
  const verifiedCurrentPage = currentPage > totalPages ? totalPages : currentPage;

  const paginatedRecords = useMemo(() => {
    const startIndex = (verifiedCurrentPage - 1) * recordsPerPage;
    return filteredRecords.slice(startIndex, startIndex + recordsPerPage);
  }, [filteredRecords, verifiedCurrentPage]);

  // 6. HISTOGRAM RENDERING COORDINATES MAPS
  const barChartMetrics = [
    { month: 'Jan', heightPercent: '42%' },
    { month: 'Feb', heightPercent: '62%' },
    { month: 'Mar', heightPercent: '56%' },
    { month: 'Apr', heightPercent: '74%' },
    { month: 'May', heightPercent: '82%' },
    { month: 'Jun', heightPercent: '94%' }
  ];

  const distributionMetrics = [
    { label: 'Term Life', percentage: '45%', color: 'bg-[#0252D7]' },
    { label: 'Whole Life', percentage: '30%', color: 'bg-[#031B33]' },
    { label: 'Endowment', percentage: '25%', color: 'bg-[#D1E2FF]' }
  ];

  // SUBMIT WIZARD CREATION AND ADD TO ACTIVE POLICIES TABLE DISPATCH
  const handleFinalizeSubmission = () => {
    const generatedPolicyId = `AB-LIFE-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newRecordNode = {
      id: generatedPolicyId,
      name: policyForm.fullName,
      initials: policyForm.fullName.split(' ').map(n => n[0]).join(''),
      color: 'bg-emerald-100 text-emerald-800',
      plan: policyForm.planType === 'Term Life' ? 'Heritage Elite Term' : 'Wealth Secure Plus',
      type: policyForm.planType === 'Term Life' ? 'Term' : 'Endowment',
      sumAssured: parseInt(policyForm.sumAssured),
      premium: policyForm.planType === 'Term Life' ? 20532 : 15200,
      renewal: 'Jun 11, 2027',
      status: 'Active',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };

    setPolicyRecords(prev => [newRecordNode, ...prev]);
    setIsWizardOpen(false);
    setWizardStep(1);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-12 w-full relative">
      
      {/* GLOBAL PROFILE HEADER BAR */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs select-none">
        <div className="relative flex items-center flex-1 max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search by Policy No, Customer Name or Policy Holder..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#0B1F5B] transition-all"
          />
        </div>

        <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
          <button 
            type="button" 
            onClick={() => { setIsWizardOpen(true); setWizardStep(1); }}
            className="bg-[#0B1F5B] hover:bg-black text-white text-xs font-bold h-10 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm focus:outline-none"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add Policy</span>
          </button>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <h4 className="text-xs font-bold text-slate-900 leading-none">Alex Thompson</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Senior Broker</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0B1F5B] to-indigo-900 flex items-center justify-center text-white text-xs font-black shadow-md select-none">AT</div>
          </div>
        </div>
      </div>

      {/* DASHBOARD HEADER TITLE */}
      <div className="text-left select-none mt-6 px-6">
        <h1 className="text-2xl font-bold text-[#0B1F5B] tracking-tight leading-none">Active Policies</h1>
        <p className="text-xs font-medium text-slate-500 mt-1.5">Enterprise summary logs, collection tracking timelines, and compliance profiles.</p>
      </div>

      {/* FILTER CONTROL PANEL */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-3xs select-none mx-6 mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-9 min-w-[160px]">
            <span className="text-xs font-bold text-slate-500 mr-1">Policy Type:</span>
            <span className="text-xs font-black text-slate-900">{typeFilter}</span>
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer font-bold">
              <option value="All">All Types</option>
              <option value="Term">Term Plan</option>
              <option value="Whole Life">Whole Life</option>
              <option value="Endowment">Endowment</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-auto" />
          </div>

          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-9 min-w-[160px]">
            <span className="text-xs font-bold text-slate-500 mr-1">Status:</span>
            <span className="text-xs font-black text-slate-900">{statusFilter}</span>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer font-bold">
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Renewal Due">Renewal Due</option>
              <option value="Lapsed">Lapsed</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-auto" />
          </div>
          
          <button type="button" onClick={() => { setSearchQuery(''); setTypeFilter('All'); setStatusFilter('All'); setCurrentPage(1); }} className="text-xs font-bold text-[#0B1F5B] hover:underline focus:outline-none ml-2">Reset Filters</button>
        </div>

        <button type="button" className="text-[#0B1F5B] border border-slate-200 hover:bg-slate-50 bg-white font-bold text-xs h-9 px-3 rounded-xl flex items-center gap-1.5 transition-colors focus:outline-none">
          <Download className="w-3.5 h-3.5" /> <span>Export Data</span>
        </button>
      </div>

      {/* CENTRAL RECORDS TABLE WORKSPACE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative z-10 mx-6 mt-6">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[950px] text-xs font-medium text-slate-600 border-collapse table-fixed">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[22%]" />
              <col className="w-[14%]" />
              <col className="w-[11%]" />
              <col className="w-[11%]" />
              <col className="w-[12%]" />
              <col className="w-[5%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-left font-black uppercase tracking-wider text-[10px] bg-slate-50/40">
                <th className="pb-3 pt-2 pl-3">Policy Number</th>
                <th className="pb-3 pt-2">Customer</th>
                <th className="pb-3 pt-2">Plan Architecture</th>
                <th className="pb-3 pt-2">Sum Assured</th>
                <th className="pb-3 pt-2">Premium</th>
                <th className="pb-3 pt-2">Renewal Due</th>
                <th className="pb-3 pt-2">Status</th>
                <th className="pb-3 pt-2 text-right pr-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {paginatedRecords.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="py-4 pl-3 font-bold text-[#0B1F5B] tracking-tight truncate">{row.id}</td>
                  <td className="py-4 truncate">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg ${row.color} font-black text-[9px] flex items-center justify-center shadow-3xs shrink-0 select-none`}>{row.initials}</div>
                      <span className="font-bold text-black truncate">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-4 truncate">
                    <span className="font-bold text-slate-900 block leading-tight truncate">{row.plan}</span>
                    <span className="text-[9px] font-black tracking-wider text-slate-400 block mt-0.5 uppercase">{row.type} Plan</span>
                  </td>
                  <td className="py-4 font-black text-black truncate">₹{row.sumAssured.toLocaleString()}</td>
                  <td className="py-4 font-black text-[#0B1F5B] truncate">₹{row.premium.toLocaleString()}</td>
                  <td className="py-4 font-bold text-slate-600 truncate">{row.renewal}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 select-none ${row.badgeClass}`}>
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-3 relative">
                    <div className="flex items-center justify-end gap-1.5">
                      <button type="button" onClick={() => setActiveMenu(activeMenu === row.id ? null : row.id)} className="p-1 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition-all"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                    {activeMenu === row.id && (
                      <div className="absolute right-3 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 text-left text-xs font-semibold text-slate-700">
                        <button type="button" onClick={() => setActiveMenu(null)} className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-[#0A2540] font-bold">
                          <Eye className="w-3.5 h-3.5 text-slate-400" /> <span>View Details</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL FOOTER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-2 text-xs font-semibold text-slate-400 select-none">
          <span>Showing {((verifiedCurrentPage - 1) * recordsPerPage) + 1}–{Math.min(filteredRecords.length, verifiedCurrentPage * recordsPerPage)} of {filteredRecords.length} Policies</span>
          <div className="flex items-center gap-1 text-slate-600">
            <button type="button" onClick={() => setCurrentPage(pageNum => Math.max(1, pageNum - 1))} className="h-8 px-2 border border-slate-200 bg-white hover:bg-slate-50 font-bold">&lt;</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} type="button" onClick={() => setCurrentPage(i + 1)} className={`h-8 w-8 rounded-lg font-black flex items-center justify-center ${verifiedCurrentPage === i + 1 ? 'bg-[#0B1F5B] text-white shadow-md' : 'border border-slate-200 bg-white hover:bg-slate-50'}`}>{i + 1}</button>
            ))}
            <button type="button" onClick={() => setCurrentPage(pageNum => Math.min(totalPages, pageNum + 1))} className="h-8 px-2 border border-slate-200 bg-white hover:bg-slate-50 font-bold">&gt;</button>
          </div>
        </div>
      </div>

      {/* METRIC GRAPHS ANALYTICS FOOTER SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full select-none items-start px-6 mt-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-[340px] justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h4 className="text-sm font-bold text-[#031B33] tracking-tight">Monthly Premium Collection</h4>
            <span className="text-xs bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg font-bold text-slate-700">{timeframe}</span>
          </div>
          <div className="w-full h-48 flex items-end gap-4 px-2 pb-2 border-b border-slate-200">
            {barChartMetrics.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end px-2 max-w-[65px]">
                <div className="w-full rounded-t-md bg-[#3B82F6]" style={{ height: bar.heightPercent }}></div>
                <span className="text-[11px] font-bold text-slate-400 tracking-tight mt-2 shrink-0">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-[340px] justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
            <h4 className="text-sm font-bold text-[#031B33] tracking-tight">Policy Distribution</h4>
            <button type="button" className="p-1 hover:bg-slate-50 border border-slate-100 rounded-lg transition-colors focus:outline-none"><MoreVertical className="w-4 h-4 text-slate-400" /></button>
          </div>
          <div className="flex items-center justify-center gap-8 py-4 px-2 my-auto w-full">
            <div className="relative w-32 h-32 rounded-full border-[14px] border-[#0252D7] flex flex-col items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-full border-[14px] border-[#031B33] rotate-45 pointer-events-none"></div>
              <div className="absolute inset-0 rounded-full border-[14px] border-[#D1E2FF] -rotate-90 pointer-events-none"></div>
              <span className="text-sm font-black text-slate-900 tracking-tight leading-none">12.4k</span>
              <span className="text-[9px] font-black text-slate-400 mt-0.5 uppercase tracking-wider">Total</span>
            </div>
            <div className="space-y-3 flex-1 text-xs font-bold text-slate-700">
              {distributionMetrics.map((metric, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded block shrink-0 ${metric.color}`}></span>
                    <span className="text-slate-500 font-semibold">{metric.label}</span>
                  </div>
                  <span className="text-slate-900 font-black text-right min-w-[35px]">{metric.percentage}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 text-[10px] font-extrabold text-slate-400 text-center uppercase tracking-widest">Portfolio Summary Distribution Weights</div>
        </div>
      </div>

      {/* ==========================================================================
         7. FULL MULTI-STEP ONBOARDING WIZARD INTERFACE (MODAL CONTINUATION WINDOW)
         ========================================================================== */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-3xs flex items-center justify-center z-50 p-4 font-sans select-none antialiased">
          <div className="bg-white border border-slate-200 w-full max-w-[850px] h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-700 text-xs font-semibold">
            
            {/* MODAL TITLE TOP BAR DESK */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0B1F5B] flex items-center justify-center text-white font-black text-sm">N</div>
                <div>
                  <h3 className="text-sm font-black text-[#0B1F5B] uppercase tracking-tight leading-none">New Application</h3>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">Step {wizardStep} of 5</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsWizardOpen(false)}
                className="text-slate-400 hover:text-black font-black text-sm p-1 hover:bg-slate-200/50 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* PROGRESS INDICATOR BAR SLAT */}
            <div className="w-full bg-slate-100 h-1.5 shrink-0 relative">
              <div 
                className="bg-[#0B1F5B] h-full transition-all duration-300"
                style={{ width: `${(wizardStep / 5) * 100}%` }}
              ></div>
            </div>

            {/* CENTRAL WORKSPACE ACCORDION HUB SCROLL CONTAINER */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
              
              {/* STEP 1: SELECT LEAD */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-slate-900 font-extrabold text-sm tracking-tight">Step 1: Select Lead Target</h4>
                    <p className="text-[11px] text-slate-400">Choose a qualified entry context module from the database network logs.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3.5">
                    <div 
                      onClick={() => setPolicyForm({...policyForm, selectedLeadId: 'Sarah Mitchell'})}
                      className={`p-4 border rounded-xl cursor-pointer flex justify-between items-center transition-all ${policyForm.selectedLeadId === 'Sarah Mitchell' ? 'border-[#0B1F5B] bg-blue-50/10' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <div>
                        <h5 className="font-extrabold text-slate-900 text-xs">Sarah Mitchell</h5>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">s.mitchell@enterprise.com | +1 (555) 234-8890</p>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">92% Match Profile</span>
                    </div>

                    <div 
                      onClick={() => setPolicyForm({...policyForm, selectedLeadId: 'James Arrington'})}
                      className={`p-4 border rounded-xl cursor-pointer flex justify-between items-center transition-all ${policyForm.selectedLeadId === 'James Arrington' ? 'border-[#0B1F5B] bg-blue-50/10' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <div>
                        <h5 className="font-extrabold text-slate-900 text-xs">James Arrington</h5>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">james.a@global.net | +1 (555) 902-1143</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">New Lead</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PLAN SELECTION */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-slate-900 font-extrabold text-sm tracking-tight">Step 2: Plan Selection Matrix</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Term Life', 'Whole Life', 'ULIP'].map((plan) => (
                      <div 
                        key={plan}
                        onClick={() => setPolicyForm({...policyForm, planType: plan})}
                        className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col justify-between h-28 ${policyForm.planType === plan ? 'border-[#0B1F5B] bg-blue-50/20' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        <h5 className="font-extrabold text-slate-900">{plan} Variant</h5>
                        <span className="text-[11px] text-slate-400 font-medium leading-tight">Tailored structural actuarial option model.</span>
                        <span className="text-[10px] font-black text-[#0B1F5B] mt-2 block">Starting at $45/mo</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block uppercase text-[10px]">Sum Assured Pref ($)</label>
                      <input type="number" value={policyForm.sumAssured} onChange={(e) => setPolicyForm({...policyForm, sumAssured: e.target.value})} className="w-full h-9 bg-white border border-slate-200 rounded-lg px-3 font-bold text-black outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block uppercase text-[10px]">Payment Frequency</label>
                      <select value={policyForm.paymentFrequency} onChange={(e) => setPolicyForm({...policyForm, paymentFrequency: e.target.value})} className="w-full h-9 bg-white border border-slate-200 rounded-lg px-3 font-bold text-black outline-none cursor-pointer">
                        <option>Annual</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CLIENT DETAILS INFORMATION INTAKE */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-slate-900 font-extrabold text-sm tracking-tight">Step 3: Client Details Intake</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block uppercase text-[10px]">Legal Full Name</label>
                      <input type="text" value={policyForm.fullName} onChange={(e) => setPolicyForm({...policyForm, fullName: e.target.value})} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 font-bold text-black outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block uppercase text-[10px]">Date of Birth</label>
                      <input type="date" value={policyForm.dob} onChange={(e) => setPolicyForm({...policyForm, dob: e.target.value})} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 font-bold text-black outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block uppercase text-[10px]">Primary Occupation</label>
                      <input type="text" value={policyForm.occupation} onChange={(e) => setPolicyForm({...policyForm, occupation: e.target.value})} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 font-bold text-black outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block uppercase text-[10px]">Annual Income ($)</label>
                      <input type="number" value={policyForm.annualIncome} onChange={(e) => setPolicyForm({...policyForm, annualIncome: e.target.value})} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 font-bold text-black outline-none" />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-xl space-y-3">
                    <span className="text-[10px] font-black uppercase text-[#0B1F5B] block">Nominee Disclosure Beneficiary</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input type="text" value={policyForm.nomineeName} onChange={(e) => setPolicyForm({...policyForm, nomineeName: e.target.value})} className="h-8 bg-white border border-slate-200 rounded-lg px-2 text-black" placeholder="Name" />
                      <select value={policyForm.nomineeRelation} onChange={(e) => setPolicyForm({...policyForm, nomineeRelation: e.target.value})} className="h-8 bg-white border border-slate-200 rounded-lg px-2 text-black"><option>Spouse</option><option>Child</option></select>
                      <input type="number" value={policyForm.nomineeShare} onChange={(e) => setPolicyForm({...policyForm, nomineeShare: e.target.value})} className="h-8 bg-white border border-slate-200 rounded-lg px-2 text-black" placeholder="Share %" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: KYC & DOCUMENTS VERIFICATION DESK */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-slate-900 font-extrabold text-sm tracking-tight">Step 4: KYC Document Upload Matrix</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 border border-slate-200 bg-slate-50/50 rounded-xl flex items-center justify-between">
                      <div>
                        <h5 className="font-extrabold text-slate-900">Identity Proof File Scan</h5>
                        <p className="text-[11px] text-slate-400 font-medium">Passport_Scan_JohnDoe.pdf (2.4 MB) Uploaded successfully.</p>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">Verified</span>
                    </div>

                    <div className="p-4 border border-slate-200 bg-slate-50/50 rounded-xl flex items-center justify-between">
                      <div>
                        <h5 className="font-extrabold text-slate-900">Address Proof Document</h5>
                        <p className="text-[11px] text-slate-400 font-medium">Utility bill, bank statement logs, or statement file requirements.</p>
                      </div>
                      <button type="button" className="h-7 px-3 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1">
                        <Upload className="w-3 h-3" /> <span>Upload file</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW APPLICATION SUBMISSION OVERVIEW */}
              {wizardStep === 5 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-slate-900 font-extrabold text-sm tracking-tight">Step 5: Final Verification Review</h4>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 font-medium text-xs">
                    <div><span className="text-slate-400 block text-[10px] font-black uppercase tracking-wider">Primary Applicant Holder Name Tag:</span> <span className="text-black font-extrabold">{policyForm.fullName}</span></div>
                    <div><span className="text-slate-400 block text-[10px] font-black uppercase tracking-wider">Assigned Scheme Product Blueprint:</span> <span className="text-[#0B1F5B] font-black">{policyForm.planType} Package Framework</span></div>
                    <div><span className="text-slate-400 block text-[10px] font-black uppercase tracking-wider">Target Benefit sum Coverage ($):</span> <span className="text-slate-900 font-extrabold">${parseInt(policyForm.sumAssured).toLocaleString()}</span></div>
                  </div>

                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 text-emerald-800 rounded-xl flex items-start gap-2 text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Underwriting automated evaluation scoring engine mapping logs cleared. Application forms ready to commit to final deployment indexes.</span>
                  </div>
                </div>
              )}

            </div>

            {/* MODAL FOOTER SLAT BAR NAVIGATION INTERACTION ACTION LINK CONTROLLERS */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 select-none">
              <button 
                type="button"
                onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                disabled={wizardStep === 1}
                className="h-9 px-4 border border-slate-200 bg-white rounded-xl font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> <span>Previous Step</span>
              </button>

              {wizardStep === 5 ? (
                <button 
                  type="button"
                  onClick={handleFinalizeSubmission}
                  className="h-9 px-5 bg-emerald-700 hover:bg-black text-white font-black rounded-xl flex items-center gap-1 shadow transition-all"
                >
                  <span>Issue New Policy</span>
                  <Check className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={() => setWizardStep(prev => Math.min(5, prev + 1))}
                  className="h-9 px-5 bg-[#0B1F5B] hover:bg-black text-white font-black rounded-xl flex items-center gap-1 shadow transition-all"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}