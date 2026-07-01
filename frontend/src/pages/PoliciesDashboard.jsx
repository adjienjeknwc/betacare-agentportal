// src/pages/PoliciesDashboard.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Plus, Download, Eye, Clock, ChevronDown, MoreVertical, Shield, 
  CreditCard, Calendar, AlertTriangle, ArrowLeft, ArrowRight, Save, User, 
  Briefcase, DollarSign, Heart, Layers, CheckCircle2, ShieldAlert, FileText, 
  Check, Upload, RefreshCw, X, FileSpreadsheet, DownloadCloud, Mail, Send, CheckSquare, Square
} from 'lucide-react';

export default function PoliciesDashboard() {
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  const currentAgentName = localStorage.getItem('agentName') || "Rohan Malhotra";

  // State Management
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [freqFilter, setFreqFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');

  // Bulk Selection State
  const [selectedPolicyIds, setSelectedPolicyIds] = useState([]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('agent_token');
      const res = await fetch('/api/policies', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-agent-role': localStorage.getItem('agent_role') || 'Sales Agent'
        }
      });
      const data = await res.json();
      if (data.success) {
        setPolicies(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const getDynamicInitials = (nameString) => {
    const words = nameString.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0] ? words[0].slice(0, 2).toUpperCase() : "AA";
  };

  // Helper for Status Badge formatting
  const getStatusBadge = (status) => {
    const configs = {
      'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Pending Payment': 'bg-slate-50 text-slate-700 border-slate-200',
      'Grace Period': 'bg-amber-50 text-amber-700 border-amber-200',
      'Lapsed': 'bg-rose-50 text-rose-700 border-rose-200',
      'Cancelled': 'bg-slate-100 text-slate-500 border-slate-300',
      'Matured': 'bg-blue-50 text-blue-700 border-blue-200',
      'Surrendered': 'bg-purple-50 text-purple-750 border-purple-200'
    };
    return configs[status] || 'bg-slate-50 text-slate-600 border-slate-200';
  };

  // Helper for Renewal status badge
  const getRenewalBadge = (dueDateStr) => {
    if (!dueDateStr) return { text: 'Paid', styles: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    const due = new Date(dueDateStr);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', styles: 'bg-rose-50 text-rose-700 border-rose-200' };
    } else if (diffDays === 0) {
      return { text: 'Due Today', styles: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' };
    } else {
      return { text: 'Upcoming', styles: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
  };

  // Dashboard calculations from live dataset
  const metrics = useMemo(() => {
    const totalCount = policies.length;
    const activeCount = policies.filter(p => p.policyStatus === 'Active').length;
    
    // Issued today
    const todayStr = new Date().toISOString().split('T')[0];
    const issuedToday = policies.filter(p => p.createdAt?.split('T')[0] === todayStr).length;

    const sumAssuredVal = policies.reduce((acc, p) => acc + (p.sumAssured || 0), 0);
    const annualPremiumVal = policies.reduce((acc, p) => acc + (p.totalAnnualPremium || 0), 0);

    // Premium due this month
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const premiumDueThisMonth = policies.reduce((acc, p) => {
      if (!p.nextPremiumDueDate) return acc;
      const d = new Date(p.nextPremiumDueDate);
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
        return acc + (p.totalAnnualPremium || 0);
      }
      return acc;
    }, 0);

    // Lapsed count
    const lapsedCount = policies.filter(p => p.policyStatus === 'Lapsed').length;

    return {
      total: totalCount,
      active: activeCount,
      issuedToday,
      sumAssured: sumAssuredVal,
      annualPremium: annualPremiumVal,
      dueThisMonth: premiumDueThisMonth,
      lapsed: lapsedCount
    };
  }, [policies]);

  // Filters & Sorting Execution
  const filteredPolicies = useMemo(() => {
    let result = [...policies];

    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(row => 
        row.policyNumber.toLowerCase().includes(q) ||
        row.customerName.toLowerCase().includes(q) ||
        (row.planName && row.planName.toLowerCase().includes(q))
      );
    }

    // Policy Type
    if (typeFilter !== 'All') {
      result = result.filter(row => row.planType === typeFilter);
    }

    // Policy Status
    if (statusFilter !== 'All') {
      result = result.filter(row => row.policyStatus === statusFilter);
    }

    // Premium Frequency
    if (freqFilter !== 'All') {
      result = result.filter(row => row.paymentFrequency === freqFilter);
    }

    // Sorting
    if (sortBy === 'Latest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'Renewal') {
      result.sort((a, b) => new Date(a.nextPremiumDueDate) - new Date(b.nextPremiumDueDate));
    } else if (sortBy === 'Premium') {
      result.sort((a, b) => (b.totalAnnualPremium || 0) - (a.totalAnnualPremium || 0));
    }

    return result;
  }, [policies, searchQuery, typeFilter, statusFilter, freqFilter, sortBy]);

  // DYNAMIC CHART WEIGHTS CALCULATORS
  const barChartMetrics = useMemo(() => {
    const last6Months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      last6Months.push({
        monthName: d.toLocaleString('en-US', { month: 'short' }),
        monthNum: d.getMonth(),
        year: d.getFullYear(),
        total: 0
      });
    }

    policies.forEach(p => {
      const pDate = new Date(p.createdAt || p.policyStartDate || today);
      const pMonth = pDate.getMonth();
      const pYear = pDate.getFullYear();
      
      const match = last6Months.find(m => m.monthNum === pMonth && m.year === pYear);
      if (match) {
        match.total += (p.premiumAmount || p.totalAnnualPremium || 0);
      }
    });

    const maxVal = Math.max(...last6Months.map(m => m.total), 10000); // fallback min value to avoid division by zero

    return last6Months.map(m => ({
      month: m.monthName.toUpperCase(),
      val: m.total,
      heightPercent: `${Math.max(10, Math.min(100, (m.total / maxVal) * 90 + 10))}%`
    }));
  }, [policies]);

  const distributionMetrics = useMemo(() => {
    if (policies.length === 0) {
      return [
        { label: 'Term', percentage: '0%', color: 'bg-[#0252D7]' },
        { label: 'Whole Life', percentage: '0%', color: 'bg-[#031B33]' },
        { label: 'ULIP', percentage: '0%', color: 'bg-[#D1E2FF]' }
      ];
    }
    const terms = policies.filter(p => p.planType === 'Term').length;
    const whole = policies.filter(p => p.planType === 'Whole Life' || p.planType === 'Whole').length;
    const ulip = policies.filter(p => p.planType === 'ULIP').length;
    const total = policies.length;

    return [
      { label: 'Term', percentage: `${Math.round((terms / total) * 100)}%`, color: 'bg-[#0252D7]' },
      { label: 'Whole Life', percentage: `${Math.round((whole / total) * 100)}%`, color: 'bg-[#031B33]' },
      { label: 'ULIP', percentage: `${Math.round((ulip / total) * 100)}%`, color: 'bg-[#D1E2FF]' }
    ];
  }, [policies]);

  // Bulk interactions
  const toggleSelectPolicy = (id) => {
    setSelectedPolicyIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPolicyIds.length === filteredPolicies.length) {
      setSelectedPolicyIds([]);
    } else {
      setSelectedPolicyIds(filteredPolicies.map(p => p._id));
    }
  };

  const handleBulkExport = () => {
    alert(`Exporting ${selectedPolicyIds.length} policies to spreadsheet workbook...`);
    setSelectedPolicyIds([]);
  };

  const handleBulkRemind = () => {
    alert(`Dispatched renewal payment reminders to ${selectedPolicyIds.length} customer contact endpoints.`);
    setSelectedPolicyIds([]);
  };

  // Row operations
  const triggerDownloadPDF = (policyNo) => {
    alert(`Generating Official Policy Schedule Contract PDF for Policy ${policyNo}...`);
    setActiveMenuId(null);
  };

  const triggerReminder = (clientName) => {
    alert(`Sending premium renewal email/SMS notification to ${clientName}.`);
    setActiveMenuId(null);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setStatusFilter('All');
    setFreqFilter('All');
    setSortBy('Latest');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-16 w-full relative">
      
      {/* Header Panel */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-40 w-full shadow-3xs">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-black text-[#0B1F5B] tracking-tight text-[22px] leading-tight">Active Policy Dashboard</h1>
          <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[10px]">
            Enterprise summary logs, billing collections, and coverage registers.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => navigate('/policies/new')} 
            className="h-10 px-4 bg-[#0B1F5B] hover:bg-black text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all focus:outline-none cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Issue New Policy</span>
          </button>
          
          <button 
            type="button" 
            onClick={fetchPolicies}
            className="p-2.5 border border-slate-200 bg-white text-slate-500 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
            title="Refresh Dashboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-[1450px] w-full mx-auto px-6 py-6 space-y-6">

        {/* KPI CARDS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
          {[
            { label: 'Total Active Policies', value: metrics.active, color: 'text-emerald-600 border-emerald-200 bg-emerald-50/10' },
            { label: 'Policies Issued Today', value: metrics.issuedToday, color: 'text-blue-600 border-blue-200 bg-blue-50/10' },
            { label: 'Total Sum Assured', value: `₹${metrics.sumAssured.toLocaleString('en-IN')}`, color: 'text-slate-900 border-slate-200 font-black' },
            { label: 'Total Annual Premium', value: `₹${metrics.annualPremium.toLocaleString('en-IN')}`, color: 'text-[#0B1F5B] border-blue-300 bg-blue-50/20 font-black' },
            { label: 'Premium Due This Month', value: `₹${metrics.dueThisMonth.toLocaleString('en-IN')}`, color: 'text-amber-600 border-amber-200 bg-amber-50/10' },
            { label: 'Lapsed Policies', value: metrics.lapsed, color: 'text-rose-600 border-rose-200 bg-rose-50/10' }
          ].map((kpi, idx) => (
            <div key={idx} className={`bg-white border rounded-2xl p-4 shadow-3xs flex flex-col items-start ${kpi.color}`}>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{kpi.label}</span>
              <span className="text-xl font-black mt-1 block leading-none">{kpi.value}</span>
            </div>
          ))}
        </div>

        {/* SEARCH & FILTERS CONTROLS */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-3xs grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end text-xs font-bold text-slate-700 select-none">
          <div className="flex flex-col items-start w-full md:col-span-2 lg:col-span-2">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1"><Search className="w-3 h-3" /> Search Policies</label>
            <input 
              type="text" 
              placeholder="Search Policy No, Name, Plan..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-semibold focus:border-[#0F478D] transition-colors" 
            />
          </div>

          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Policy Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#0F478D]">
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Payment">Pending Payment</option>
              <option value="Grace Period">Grace Period</option>
              <option value="Lapsed">Lapsed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Matured">Matured</option>
            </select>
          </div>

          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Policy Type</label>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#0F478D]">
              <option value="All">All Types</option>
              <option value="Term">Term Plan</option>
              <option value="Whole Life">Whole Life</option>
              <option value="ULIP">ULIP</option>
            </select>
          </div>

          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Frequency</label>
            <select value={freqFilter} onChange={e => setFreqFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#0F478D]">
              <option value="All">All cycles</option>
              <option value="Annual">Annual</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Sort Results</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#0F478D]">
              <option value="Latest">Sort by Latest</option>
              <option value="Renewal">Sort by Renewal Date</option>
              <option value="Premium">Sort by Premium</option>
            </select>
          </div>
        </div>

        {/* BULK ACTIONS TOOLBAR */}
        {selectedPolicyIds.length > 0 && (
          <div className="bg-[#0B1F5B] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md text-xs font-bold animate-slide-up select-none">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{selectedPolicyIds.length} Policies Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleBulkExport} className="h-8 px-3 border border-blue-900/60 bg-blue-900/40 rounded-lg hover:bg-blue-800/40 transition-colors flex items-center gap-1"><FileSpreadsheet className="w-3.5 h-3.5" /><span>Export Policies</span></button>
              <button onClick={handleBulkRemind} className="h-8 px-3 bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1"><Send className="w-3.5 h-3.5 text-emerald-400" /><span>Send Renewal Reminders</span></button>
            </div>
          </div>
        )}

        {/* DATA TABLE (MVP SCROLL CONTAINER - COHESIVE COLUMNS) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden w-full max-w-full">
          <div className="w-full">
            <table className="hidden md:table w-full text-left border-collapse text-xs font-semibold text-slate-600 table-fixed">
              <colgroup>
                <col className="w-[5%]" />
                <col className="w-[18%]" />
                <col className="w-[22%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[12%]" />
                <col className="w-[8%]" />
                <col className="w-[5%]" />
              </colgroup>
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[9px] tracking-wider text-slate-400 select-none">
                  <th className="py-3 px-3 text-center">
                    <button onClick={toggleSelectAll} className="p-1 text-slate-400 hover:text-slate-900">
                      {selectedPolicyIds.length === filteredPolicies.length && filteredPolicies.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-[#0B1F5B]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Policy Number</th>
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Policy Type</th>
                  <th className="py-3 px-3 text-right">Sum Assured</th>
                  <th className="py-3 px-3 text-right">Premium</th>
                  <th className="py-3 px-3">Policy Status</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {loading ? (
                  <tr><td colSpan="8" className="p-12 text-center"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#0B1F5B]" /></td></tr>
                ) : filteredPolicies.length === 0 ? (
                  <tr><td colSpan="8" className="p-16 text-center text-slate-400 font-bold bg-slate-50/30">No active policies found in registry logs.</td></tr>
                ) : (
                  filteredPolicies.map((row) => {
                    const isSelected = selectedPolicyIds.includes(row._id);
                    return (
                      <tr key={row._id} className={`hover:bg-slate-50/40 transition-colors ${isSelected ? 'bg-blue-50/5' : ''}`}>
                        <td className="py-4 px-3 text-center">
                          <button onClick={() => toggleSelectPolicy(row._id)} className="p-1 text-slate-400 hover:text-slate-900">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#0B1F5B]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-3 font-mono font-bold text-[#0B1F5B] truncate">{row.policyNumber}</td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-6 h-6 rounded-lg bg-indigo-950 text-white font-black text-[9px] flex items-center justify-center shrink-0 select-none shadow-3xs">
                              {getDynamicInitials(row.customerName)}
                            </div>
                            <span className="font-extrabold text-slate-950 truncate">{row.customerName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-slate-500 truncate">{row.planType} Plan</td>
                        <td className="py-4 px-3 text-right font-bold text-slate-900 truncate">₹{(row.sumAssured || 0).toLocaleString('en-IN')}</td>
                        <td className="py-4 px-3 text-right font-black text-[#0B1F5B] truncate">₹{(row.totalAnnualPremium || 0).toLocaleString('en-IN')}</td>
                        <td className="py-4 px-3">
                          <span className={`px-2 py-0.5 border text-[9px] font-black uppercase tracking-wider rounded-md ${getStatusBadge(row.policyStatus)}`}>
                            {row.policyStatus}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-center relative">
                          <button 
                            type="button" 
                            onClick={() => setActiveMenuId(activeMenuId === row._id ? null : row._id)} 
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-black transition-all cursor-pointer"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                          
                          {activeMenuId === row._id && (
                            <div className="absolute right-4 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 text-left text-xs font-bold text-slate-700">
                              <button 
                                onClick={() => { navigate(`/policies/${row.policyNumber}`); setActiveMenuId(null); }}
                                className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" /> <span>Inspect Details</span>
                              </button>
                              
                              <button 
                                onClick={() => triggerDownloadPDF(row.policyNumber)}
                                className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-400" /> <span>Download Policy PDF</span>
                              </button>

                              <button 
                                onClick={() => triggerReminder(row.customerName)}
                                className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Send className="w-3.5 h-3.5 text-slate-400" /> <span>Send Reminder</span>
                              </button>

                              <button 
                                onClick={() => {
                                  alert("Navigating to Customer Dashboard Portal view...");
                                  navigate(`/customer-dashboard/${row._id}`);
                                }}
                                className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-teal-650"
                              >
                                <User className="w-3.5 h-3.5" /> <span>Customer Dashboard</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* MOBILE CARDS VIEW */}
            <div className="md:hidden divide-y divide-slate-100 bg-white">
              {loading ? (
                <div className="p-8 text-center"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#0B1F5B]" /></div>
              ) : filteredPolicies.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-bold bg-slate-50/30">No active policies found in registry logs.</div>
              ) : (
                filteredPolicies.map((row) => {
                  const isSelected = selectedPolicyIds.includes(row._id);
                  return (
                    <div key={row._id} className={`p-4 hover:bg-slate-50/40 transition-colors ${isSelected ? 'bg-blue-50/5' : ''} space-y-3`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleSelectPolicy(row._id)} className="p-1 text-slate-400 hover:text-slate-900">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#0B1F5B]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                          <span className="font-mono font-bold text-xs text-[#0B1F5B]">{row.policyNumber}</span>
                        </div>
                        
                        <div className="relative">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === row._id ? null : row._id)} 
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeMenuId === row._id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 text-left text-xs font-bold text-slate-700">
                              <button 
                                onClick={() => { navigate(`/policies/${row.policyNumber}`); setActiveMenuId(null); }}
                                className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" /> <span>Inspect Details</span>
                              </button>
                              
                              <button 
                                onClick={() => triggerDownloadPDF(row.policyNumber)}
                                className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-400" /> <span>Download Policy PDF</span>
                              </button>

                              <button 
                                onClick={() => triggerReminder(row.customerName)}
                                className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Send className="w-3.5 h-3.5 text-slate-400" /> <span>Send Reminder</span>
                              </button>

                              <button 
                                onClick={() => {
                                  alert("Navigating to Customer Dashboard Portal view...");
                                  navigate(`/customer-dashboard/${row._id}`);
                                }}
                                className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-teal-650"
                              >
                                <User className="w-3.5 h-3.5" /> <span>Customer Dashboard</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-950 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {getDynamicInitials(row.customerName)}
                          </div>
                          <div className="text-left">
                            <h4 className="font-extrabold text-sm text-slate-950">{row.customerName}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{row.planType} Plan</p>
                          </div>
                        </div>
                        
                        <span className={`px-2 py-0.5 border text-[9px] font-black uppercase tracking-wider rounded-md ${getStatusBadge(row.policyStatus)}`}>
                          {row.policyStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-bold text-slate-500 border-t border-slate-50">
                        <div className="text-left">
                          <span className="text-[9px] uppercase text-slate-400 block font-bold">Sum Assured</span>
                          <span className="text-slate-900 font-bold">₹{(row.sumAssured || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] uppercase text-slate-400 block font-bold">Premium</span>
                          <span className="text-[#0B1F5B] font-black">₹{(row.totalAnnualPremium || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* METRIC GRAPHS ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full select-none items-start">
          
          {/* Monthly collections */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-[340px] justify-between text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-xs font-black uppercase text-[#031B33] tracking-wider">Premium Collections Trend</h4>
              <span className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-black text-slate-500 uppercase">Last 6 Months</span>
            </div>
            <div className="w-full h-48 flex items-end gap-4 px-2 pb-2 border-b border-slate-100">
              {barChartMetrics.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end px-2 max-w-[65px] group">
                  <div 
                    className="w-full rounded-t bg-[#0B1F5B] hover:bg-blue-600 cursor-pointer transition-all duration-300" 
                    style={{ height: bar.heightPercent }}
                    title={`Premium Collected: ₹${bar.val.toLocaleString('en-IN')}`}
                  ></div>
                  <span className="text-[9px] font-black text-slate-400 tracking-tight mt-2 shrink-0 uppercase">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policy plan type distribution */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-[340px] justify-between text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
              <h4 className="text-xs font-black uppercase text-[#031B33] tracking-wider">Plan Portfolio Weight</h4>
              <button type="button" className="p-1 hover:bg-slate-50 border border-slate-100 rounded-lg transition-colors focus:outline-none"><MoreVertical className="w-4 h-4 text-slate-400" /></button>
            </div>
            
            <div className="flex items-center justify-center gap-8 py-4 px-2 my-auto w-full">
              <div className="relative w-32 h-32 rounded-full border-[14px] border-[#0252D7] flex flex-col items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border-[14px] border-[#031B33] rotate-45 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-full border-[14px] border-[#D1E2FF] -rotate-90 pointer-events-none"></div>
                <span className="text-base font-black text-slate-950 tracking-tight leading-none">
                  {policies.length}
                </span>
                <span className="text-[9px] font-black text-slate-400 mt-0.5 uppercase tracking-wider">Total</span>
              </div>
              <div className="space-y-3 flex-1 text-xs font-bold text-slate-700">
                {distributionMetrics.map((metric, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded block shrink-0 ${metric.color}`}></span>
                      <span className="text-slate-500 font-semibold">{metric.label}</span>
                    </div>
                    <span className="text-slate-950 font-black text-right min-w-[35px]">{metric.percentage}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-3 text-[10px] font-black text-slate-400 text-center uppercase tracking-widest">Portfolio Summary Distribution Weights</div>
          </div>

        </div>

      </main>

    </div>
  );
}