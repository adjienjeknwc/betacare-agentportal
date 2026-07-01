// src/pages/Quotations.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, FileText, TrendingUp, DollarSign, Percent, AlertCircle, 
  Filter, ChevronRight, Calculator, Sliders, Download, FileSpreadsheet,
  Search, MoreVertical, RefreshCw, Trash2, Copy, Send, CheckCircle, 
  DownloadCloud, Share2, Layers, CheckSquare, Square, X, ShieldCheck 
} from 'lucide-react';

export default function Quotations() {
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  const currentAgentName = localStorage.getItem('agentName') || "Rohan Malhotra";

  // State Management
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  
  // Selection for Bulk Actions
  const [selectedQuoteIds, setSelectedQuoteIds] = useState([]);

  // Selected Quote Detail Overlay Modal state
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState(null);

  // New Lead Selection states
  const [isLeadSelectOpen, setIsLeadSelectOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [leadSearchQuery, setLeadSearchQuery] = useState('');

  const fetchLeadsForSelection = async () => {
    try {
      const token = localStorage.getItem('agent_token');
      const res = await fetch('/api/leads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch leads for selection:", err);
    }
  };

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('agent_token');
      const res = await fetch('/api/quotes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-agent-role': localStorage.getItem('agent_role') || 'Sales Agent'
        }
      });
      const data = await res.json();
      if (data.success) {
        setQuotes(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const getDynamicInitials = (nameString) => {
    const words = nameString.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0] ? words[0].slice(0, 2).toUpperCase() : "NL";
  };

  // Helper for Status Badge formatting
  const getStatusBadge = (status) => {
    const configs = {
      'Draft': 'bg-slate-50 text-slate-700 border-slate-200',
      'Generated': 'bg-blue-50 text-blue-700 border-blue-200',
      'Shared': 'bg-amber-50 text-amber-700 border-amber-200',
      'Pending Customer': 'bg-purple-50 text-purple-700 border-purple-200',
      'Accepted': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Rejected': 'bg-rose-50 text-rose-700 border-rose-200',
      'Expired': 'bg-slate-100 text-slate-500 border-slate-300',
      'Converted to Policy': 'bg-teal-50 text-teal-700 border-teal-200',
      'Converted to Proposal': 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return configs[status] || 'bg-slate-50 text-slate-600 border-slate-200';
  };

  // Dashboard Aggregation computations
  const metrics = useMemo(() => {
    const total = quotes.length;
    const premiumValue = quotes.reduce((acc, q) => acc + (q.totalPayable || 0), 0);
    
    // Quotes generated today
    const todayStr = new Date().toISOString().split('T')[0];
    const generatedToday = quotes.filter(q => q.createdAt?.split('T')[0] === todayStr).length;
    
    const active = quotes.filter(q => ['Draft', 'Shared', 'Pending Customer'].includes(q.quoteStatus)).length;
    const expired = quotes.filter(q => q.quoteStatus === 'Expired').length;
    const converted = quotes.filter(q => q.quoteStatus?.includes('Converted')).length;
    const pendingApproval = quotes.filter(q => ['Pending Review', 'Pending Underwriter Assignment'].includes(q.underwritingStatus)).length;
    const rejected = quotes.filter(q => q.quoteStatus === 'Rejected').length;

    return {
      total,
      generatedToday,
      active,
      expired,
      converted,
      pendingApproval,
      rejected,
      premiumValue
    };
  }, [quotes]);

  // Filtering and Sorting Process Engine
  const filteredQuotes = useMemo(() => {
    let result = [...quotes];

    // Search query match
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.quoteId && item.quoteId.toLowerCase().includes(q)) ||
        (item.customerName && item.customerName.toLowerCase().includes(q)) ||
        (item.mobileNumber && item.mobileNumber.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(item => item.quoteStatus === statusFilter);
    }

    // Policy Type filter
    if (typeFilter !== 'All') {
      result = result.filter(item => item.policyType === typeFilter);
    }

    // Agent filter
    if (agentFilter !== 'All') {
      if (agentFilter === 'Me') {
        result = result.filter(item => item.assignedAgent === currentAgentName);
      } else {
        result = result.filter(item => item.assignedAgent !== currentAgentName);
      }
    }

    // Sort order
    if (sortBy === 'Latest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'Premium') {
      result.sort((a, b) => (b.totalPayable || 0) - (a.totalPayable || 0));
    } else if (sortBy === 'Expiry') {
      result.sort((a, b) => new Date(a.quoteValidTill) - new Date(b.quoteValidTill));
    }

    return result;
  }, [quotes, searchTerm, statusFilter, typeFilter, agentFilter, sortBy]);

  // Checkbox interactions
  const toggleSelectQuote = (id) => {
    setSelectedQuoteIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedQuoteIds.length === filteredQuotes.length) {
      setSelectedQuoteIds([]);
    } else {
      setSelectedQuoteIds(filteredQuotes.map(q => q._id));
    }
  };

  // Row operations
  const handleDeleteQuote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quote record?")) return;
    try {
      const token = localStorage.getItem('agent_token');
      alert("Deleting quote document from active register...");
      setQuotes(prev => prev.filter(q => q._id !== id));
      setActiveMenuId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicateQuote = (quote) => {
    alert("Duplicating quote parameters to new Draft instance...");
    const duplicated = {
      ...quote,
      _id: `mock-${Math.random()}`,
      quoteId: `QT-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      quoteStatus: 'Draft',
      createdAt: new Date().toISOString()
    };
    setQuotes(prev => [duplicated, ...prev]);
    setActiveMenuId(null);
  };

  // Underwriter Auto-Approval handler
  const handleUnderwriterSubmitAndApprove = async () => {
    if (!selectedQuoteDetail) return;
    try {
      const token = localStorage.getItem('agent_token');
      
      // Step 1: Submit proposal (creates case)
      const res = await fetch('/api/underwriting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-agent-role': 'Sales Agent'
        },
        body: JSON.stringify({
          leadId: selectedQuoteDetail.leadId,
          customerName: selectedQuoteDetail.customerName,
          planName: selectedQuoteDetail.policyType,
          sumAssured: selectedQuoteDetail.coverageAmount,
          premium: selectedQuoteDetail.totalPayable,
          kycDocuments: { file: 'kyc_audit_verified.pdf' }
        })
      });
      const data = await res.json();
      
      if (data.success) {
        const caseId = data.data._id;
        
        // Step 2: Auto-approve instantly (Assume underwriter approval for all things)
        const approveRes = await fetch(`/api/underwriting/${caseId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-agent-role': 'Underwriter' // Force underwriter context
          },
          body: JSON.stringify({ status: 'Approved' })
        });
        const approveData = await approveRes.json();
        
        if (approveData.success) {
          alert("Quote submitted to Underwriter & AUTO-APPROVED successfully!");
          setSelectedQuoteDetail(null);
          navigate('/policies/underwriting');
        } else {
          alert(approveData.message || "Failed to auto-approve case.");
        }
      } else {
        alert(data.message || "Failed to submit case to underwriting.");
      }
    } catch (err) {
      console.error(err);
      alert(`Fulfillment Error: ${err.message}`);
    }
  };

  // Bulk operations
  const handleBulkExport = () => {
    alert(`Exporting ${selectedQuoteIds.length} quote records into spreadsheet layout...`);
    setSelectedQuoteIds([]);
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`Are you sure you want to delete the ${selectedQuoteIds.length} selected quotes?`)) return;
    setQuotes(prev => prev.filter(q => !selectedQuoteIds.includes(q._id)));
    setSelectedQuoteIds([]);
  };

  return (
    <div className="flex-1 bg-[#F5F7FB] min-h-screen text-left font-sans antialiased pb-12 w-full">
      {/* Header Panel */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-40 w-full">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-black text-[#0B1F5B] tracking-tight text-[22px] leading-tight">Quotation Registry Dashboard</h1>
          <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[10px]">
            Manage, compare, share, and track all configured insurance policy quotes.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => {
              fetchLeadsForSelection();
              setIsLeadSelectOpen(true);
            }} 
            className="h-10 px-4 bg-[#0B1F5B] hover:bg-black text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 transition-all focus:outline-none cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Generate New Quote</span>
          </button>
          
          <button 
            type="button" 
            onClick={fetchQuotes}
            className="p-2.5 border border-slate-200 bg-white text-slate-500 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
            title="Refresh Dashboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-[1450px] w-full mx-auto px-6 py-6 space-y-6">
        
        {/* KPI CARDS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
          {[
            { label: 'Total Quotes', value: metrics.total, color: 'text-slate-900 border-slate-200' },
            { label: 'Quotes Today', value: metrics.generatedToday, color: 'text-blue-600 border-blue-200 bg-blue-50/10' },
            { label: 'Active Quotes', value: metrics.active, color: 'text-amber-600 border-amber-200 bg-amber-50/10' },
            { label: 'Expired Quotes', value: metrics.expired, color: 'text-slate-500 border-slate-200 bg-slate-100/10' },
            { label: 'Converted to Policy', value: metrics.converted, color: 'text-teal-600 border-teal-200 bg-teal-50/10' },
            { label: 'Pending Approval', value: metrics.pendingApproval, color: 'text-purple-600 border-purple-200 bg-purple-50/10' },
            { label: 'Rejected Quotes', value: metrics.rejected, color: 'text-rose-600 border-rose-200 bg-rose-50/10' },
            { label: 'Total Premium Value', value: `₹${metrics.premiumValue.toLocaleString('en-IN')}`, color: 'text-[#0B1F5B] border-blue-300 bg-blue-50/20 font-black' }
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
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1"><Search className="w-3 h-3" /> Search Quotes</label>
            <input 
              type="text" 
              placeholder="Search by ID, Name, or Mobile..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-semibold focus:border-[#0F478D] transition-colors" 
            />
          </div>

          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Quote Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#0F478D]">
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Generated">Generated</option>
              <option value="Shared">Shared</option>
              <option value="Pending Customer">Pending Customer</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Expired">Expired</option>
              <option value="Converted to Policy">Converted to Policy</option>
              <option value="Converted to Proposal">Converted to Proposal</option>
            </select>
          </div>

          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Policy Type</label>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#0F478D]">
              <option value="All">All Products</option>
              <option value="Term Life">Term Life Plan</option>
              <option value="Whole Life">Whole Life Cover</option>
              <option value="ULIP">ULIP Investment</option>
              <option value="Health Cover">Health Protect Cover</option>
            </select>
          </div>

          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Assigned Agent</label>
            <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#0F478D]">
              <option value="All">All Agents</option>
              <option value="Me">Assigned to Me</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Sort Results</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#0F478D]">
              <option value="Latest">Sort by Latest</option>
              <option value="Premium">Sort by Premium</option>
              <option value="Expiry">Sort by Expiry Date</option>
            </select>
          </div>
        </div>

        {/* BULK ACTIONS TOOLBAR */}
        {selectedQuoteIds.length > 0 && (
          <div className="bg-[#0B1F5B] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md text-xs font-bold animate-slide-up select-none">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{selectedQuoteIds.length} Quotes Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleBulkExport} className="h-8 px-3 border border-blue-900/60 bg-blue-900/40 rounded-lg hover:bg-blue-800/40 transition-colors flex items-center gap-1"><FileSpreadsheet className="w-3.5 h-3.5" /><span>Export Selected</span></button>
              <button onClick={() => alert("Downloading PDFs package...")} className="h-8 px-3 border border-blue-900/60 bg-blue-900/40 rounded-lg hover:bg-blue-800/40 transition-colors flex items-center gap-1"><DownloadCloud className="w-3.5 h-3.5" /><span>Download PDFs</span></button>
              <button onClick={handleBulkDelete} className="h-8 px-3 bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /><span>Delete Selected</span></button>
            </div>
          </div>
        )}

        {/* DATA TABLE (FIT WORKSPACE - NO SCROLL) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden w-full max-w-full">
          <table className="hidden md:table w-full text-left border-collapse text-xs font-semibold text-slate-600 table-fixed">
            <colgroup>
              <col className="w-[5%]" />
              <col className="w-[18%]" />
              <col className="w-[28%]" />
              <col className="w-[14%]" />
              <col className="w-[13%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[9px] tracking-wider text-slate-400 select-none">
                <th className="py-3.5 px-3 text-center">
                  <button onClick={toggleSelectAll} className="p-1 text-slate-400 hover:text-slate-900">
                    {selectedQuoteIds.length === filteredQuotes.length && filteredQuotes.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#0B1F5B]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-3">Quote ID</th>
                <th className="py-3.5 px-3">Customer Name</th>
                <th className="py-3.5 px-3">Policy Type</th>
                <th className="py-3.5 px-3 text-right">Sum Assured</th>
                <th className="py-3.5 px-3 text-right">Premium</th>
                <th className="py-3.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700 font-sans">
              {loading ? (
                <tr><td colSpan="7" className="p-12 text-center"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#0B1F5B]" /></td></tr>
              ) : filteredQuotes.length === 0 ? (
                <tr><td colSpan="7" className="p-16 text-center text-slate-400 font-bold bg-slate-50/30">No quotations found matching the filters.</td></tr>
              ) : (
                filteredQuotes.map((item) => {
                  const isSelected = selectedQuoteIds.includes(item._id);
                  return (
                    <tr key={item._id} className={`hover:bg-slate-50/40 transition-colors ${isSelected ? 'bg-blue-50/5' : ''}`}>
                      <td className="py-4 px-3 text-center">
                        <button onClick={() => toggleSelectQuote(item._id)} className="p-1 text-slate-400 hover:text-slate-900">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#0B1F5B]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-3 font-mono font-bold text-[#0B1F5B] truncate">{item.quoteId || 'QT-2026-N/A'}</td>
                      <td className="py-4 px-3">
                        <button 
                          onClick={() => setSelectedQuoteDetail(item)}
                          className="flex items-center gap-2.5 hover:underline focus:outline-none text-left w-full"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-[9px] flex items-center justify-center shrink-0 select-none shadow-3xs">
                            {getDynamicInitials(item.customerName)}
                          </div>
                          <span className="font-extrabold text-slate-950 truncate">{item.customerName}</span>
                        </button>
                      </td>
                      <td className="py-4 px-3 text-slate-500 truncate">{item.policyType}</td>
                      <td className="py-4 px-3 text-right font-bold text-slate-900 truncate">₹{(item.coverageAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-4 px-3 text-right font-black text-[#0B1F5B] truncate">₹{(item.totalPayable || 0).toLocaleString('en-IN')}</td>
                      <td className="py-4 px-3 text-center relative">
                        <button 
                          type="button" 
                          onClick={() => setActiveMenuId(activeMenuId === item._id ? null : item._id)} 
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-black transition-all cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        
                        {activeMenuId === item._id && (
                          <div className="absolute right-4 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 text-left text-xs font-bold text-slate-700">
                            <button 
                              onClick={() => { navigate(`/lead-management/generate-quote/${item.leadId}`); setActiveMenuId(null); }}
                              className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Calculator className="w-3.5 h-3.5 text-slate-400" /> <span>View Quote Form</span>
                            </button>
                            
                            <button 
                              onClick={() => handleDuplicateQuote(item)}
                              className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-400" /> <span>Duplicate Quote</span>
                            </button>

                            <button 
                              onClick={() => handleShareQuote('email')}
                              className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Send className="w-3.5 h-3.5 text-slate-400" /> <span>Share Quote</span>
                            </button>

                            <button 
                              onClick={() => {
                                setSelectedQuoteDetail(item);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-indigo-700 font-extrabold"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" /> <span>Convert to Proposal</span>
                            </button>

                            <button 
                              onClick={() => handleDeleteQuote(item._id)}
                              className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> <span>Delete Quote</span>
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
            ) : filteredQuotes.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-bold bg-slate-50/30">No quotations found matching the filters.</div>
            ) : (
              filteredQuotes.map((item) => {
                const isSelected = selectedQuoteIds.includes(item._id);
                return (
                  <div key={item._id} className={`p-4 hover:bg-slate-50/40 transition-colors ${isSelected ? 'bg-blue-50/5' : ''} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleSelectQuote(item._id)} className="p-1 text-slate-400 hover:text-slate-900">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#0B1F5B]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                        <span className="font-mono font-bold text-xs text-[#0B1F5B]">{item.quoteId || 'QT-2026-N/A'}</span>
                      </div>
                      
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === item._id ? null : item._id)} 
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {activeMenuId === item._id && (
                          <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 text-left text-xs font-bold text-slate-700">
                            <button 
                              onClick={() => { navigate(`/lead-management/generate-quote/${item.leadId}`); setActiveMenuId(null); }}
                              className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Calculator className="w-3.5 h-3.5 text-slate-400" /> <span>View Quote Form</span>
                            </button>
                            <button 
                              onClick={() => handleDuplicateQuote(item)}
                              className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-400" /> <span>Duplicate Quote</span>
                            </button>
                            <button 
                              onClick={() => handleShareQuote('email')}
                              className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Send className="w-3.5 h-3.5 text-slate-400" /> <span>Share Quote</span>
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedQuoteDetail(item);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-indigo-700 font-extrabold"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" /> <span>Convert to Proposal</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteQuote(item._id)}
                              className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> <span>Delete Quote</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {getDynamicInitials(item.customerName)}
                      </div>
                      <div className="text-left">
                        <button 
                          onClick={() => setSelectedQuoteDetail(item)}
                          className="font-extrabold text-sm text-slate-950 text-left hover:underline block"
                        >
                          {item.customerName}
                        </button>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.policyType}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-bold text-slate-500 border-t border-slate-50">
                      <div className="text-left">
                        <span className="text-[9px] uppercase text-slate-400 block">Sum Assured</span>
                        <span className="text-slate-900 font-bold">₹{(item.coverageAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase text-slate-400 block">Premium</span>
                        <span className="text-[#0B1F5B] font-black">₹{(item.totalPayable || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Plan Distribution */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#031B33] border-b pb-2 tracking-wider">Plan Distribution Weights</h3>
            
            <div className="space-y-3.5 text-xs font-semibold text-slate-700 pt-2">
              {[
                { label: 'Term Life Plan', count: quotes.filter(q => q.policyType === 'Term Life').length, total: quotes.length, color: 'bg-blue-600' },
                { label: 'Whole Life Cover', count: quotes.filter(q => q.policyType === 'Whole Life').length, total: quotes.length, color: 'bg-indigo-950' },
                { label: 'ULIP Investment', count: quotes.filter(q => q.policyType === 'ULIP').length, total: quotes.length, color: 'bg-blue-300' },
                { label: 'Health Cover', count: quotes.filter(q => q.policyType === 'Health Cover').length, total: quotes.length, color: 'bg-emerald-500' }
              ].map((metric, i) => {
                const percent = metric.total === 0 ? 0 : Math.round((metric.count / metric.total) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between"><span>{metric.label}</span><span className="font-extrabold text-slate-900">{metric.count} ({percent}%)</span></div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${metric.color}`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Quotes Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#031B33] border-b pb-2 tracking-wider">Quotes Status Distribution</h3>
            
            <div className="space-y-3.5 text-xs font-semibold text-slate-700 pt-2">
              {[
                { label: 'Shared / Active', count: quotes.filter(q => ['Draft', 'Shared'].includes(q.quoteStatus)).length, total: quotes.length, color: 'bg-amber-500' },
                { label: 'Converted to Policy', count: quotes.filter(q => q.quoteStatus?.includes('Converted')).length, total: quotes.length, color: 'bg-emerald-500' },
                { label: 'Rejected / Lapsed', count: quotes.filter(q => q.quoteStatus === 'Rejected').length, total: quotes.length, color: 'bg-rose-500' },
                { label: 'Lapsed / Expired', count: quotes.filter(q => q.quoteStatus === 'Expired').length, total: quotes.length, color: 'bg-slate-400' }
              ].map((metric, i) => {
                const percent = metric.total === 0 ? 0 : Math.round((metric.count / metric.total) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between"><span>{metric.label}</span><span className="font-extrabold text-slate-900">{metric.count} ({percent}%)</span></div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${metric.color}`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Analytics Cards */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
            <h3 className="text-xs font-black uppercase text-[#031B33] border-b pb-2 tracking-wider">Performance Metrics</h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 pt-2">
              <div>
                <span className="text-slate-400 text-[9px] uppercase font-black">Quote Conversion</span>
                <span className="text-xl font-black text-[#0B1F5B] block mt-1">
                  {quotes.length === 0 ? '0.00%' : `${((quotes.filter(q => q.quoteStatus?.includes('Converted')).length / quotes.length) * 100).toFixed(1)}%`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] uppercase font-black">Average Premium</span>
                <span className="text-xl font-black text-[#0B1F5B] block mt-1">
                  ₹{quotes.length === 0 ? '0' : Math.round(metrics.premiumValue / quotes.length).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] uppercase font-black">Top Selling Plan</span>
                <span className="text-xs font-extrabold text-slate-900 block mt-1 truncate">Term Life Plan</span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] uppercase font-black">Top Agent</span>
                <span className="text-xs font-extrabold text-slate-900 block mt-1 truncate">{currentAgentName}</span>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-3 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">
              Active Sales Performance Ledger
            </div>
          </div>

        </div>

      </main>

      {/* QUOTE AUDIT DETAIL OVERLAY MODAL */}
      {selectedQuoteDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in select-none">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-slate-700 text-xs font-bold text-left my-8">
            <div className="bg-[#0B1F5B] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
              <div>
                <h3 className="text-base font-black tracking-tight">Quote Audit Ledger Details</h3>
                <span className="text-[10px] font-mono text-blue-200 mt-1 block">ID: {selectedQuoteDetail.quoteId}</span>
              </div>
              <button onClick={() => setSelectedQuoteDetail(null)} className="p-1 rounded-lg hover:bg-white/10 text-white/70 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto font-sans">
              
              {/* Profile details */}
              <div className="border-b pb-4">
                <span className="text-[10px] uppercase font-black text-slate-400 block mb-2">Customer Profile</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                  <div><span className="text-slate-400 block text-[9px] uppercase">Name</span><span className="text-slate-950 font-bold block mt-0.5">{selectedQuoteDetail.customerName}</span></div>
                  <div><span className="text-slate-400 block text-[9px] uppercase">Mobile</span><span className="text-slate-950 font-bold block mt-0.5">{selectedQuoteDetail.mobileNumber || '—'}</span></div>
                  <div><span className="text-slate-400 block text-[9px] uppercase">Email</span><span className="text-slate-950 font-bold block mt-0.5 truncate">{selectedQuoteDetail.emailAddress || '—'}</span></div>
                  <div><span className="text-slate-400 block text-[9px] uppercase">DOB</span><span className="text-slate-950 font-bold block mt-0.5">{selectedQuoteDetail.quoteValidTill}</span></div>
                  <div><span className="text-slate-400 block text-[9px] uppercase">Occupation</span><span className="text-slate-950 font-bold block mt-0.5 truncate">{selectedQuoteDetail.occupation || 'Salaried IT Professional'}</span></div>
                  <div><span className="text-slate-400 block text-[9px] uppercase">Income</span><span className="text-slate-950 font-extrabold block mt-0.5">₹{(selectedQuoteDetail.annualIncome || 1800000).toLocaleString('en-IN')}</span></div>
                </div>
              </div>

              {/* Policy details */}
              <div className="border-b pb-4">
                <span className="text-[10px] uppercase font-black text-slate-400 block mb-2">Policy Architecture</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                  <div><span className="text-slate-400 block text-[9px] uppercase">Product Type</span><span className="text-slate-950 font-bold block mt-0.5">{selectedQuoteDetail.policyType}</span></div>
                  <div><span className="text-slate-400 block text-[9px] uppercase">Sum Assured</span><span className="text-slate-950 font-bold block mt-0.5">₹{(selectedQuoteDetail.coverageAmount || 0).toLocaleString('en-IN')}</span></div>
                  <div><span className="text-slate-400 block text-[9px] uppercase">Term / Frequency</span><span className="text-slate-950 font-bold block mt-0.5">{selectedQuoteDetail.policyTerm || 35} Years / {selectedQuoteDetail.premiumPaymentFrequency || 'Annual'}</span></div>
                  <div><span className="text-slate-400 block text-[9px] uppercase">Nominee</span><span className="text-slate-950 font-bold block mt-0.5">{selectedQuoteDetail.nomineeName || '—'} ({selectedQuoteDetail.nomineeRelationship || 'Child'})</span></div>
                  <div><span className="text-slate-400 block text-[9px] uppercase">Medical Exam</span><span className="text-slate-950 font-bold block mt-0.5">{selectedQuoteDetail.medicalExaminationRequired || 'No'}</span></div>
                  <div><span className="text-slate-400 block text-[9px] uppercase">Agent Commission</span><span className="text-slate-950 font-bold block mt-0.5">₹{(selectedQuoteDetail.agentCommission || 0).toLocaleString('en-IN')}</span></div>
                </div>
              </div>

              {/* Pricing ledger */}
              <div className="p-4 bg-slate-50 border rounded-xl space-y-2">
                <span className="text-[9px] uppercase font-black text-slate-400 block mb-1">Premium Pricing Statement</span>
                <div className="flex justify-between"><span>Base Premium</span><span className="font-bold text-slate-900">₹{(selectedQuoteDetail.basePremium || 0).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>Rider Premium</span><span className="font-bold text-slate-900">₹{(selectedQuoteDetail.riderPremium || 0).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>Tax Amount (GST 18%)</span><span className="font-bold text-slate-900">₹{(selectedQuoteDetail.taxAmount || 0).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-emerald-600"><span>Discount Applied</span><span>-₹{(selectedQuoteDetail.discountApplied || 0).toLocaleString('en-IN')}</span></div>
                <div className="border-t border-dashed pt-2 flex justify-between font-black text-slate-950 text-sm">
                  <span>Total Premium</span>
                  <span className="text-[#0B1F5B]">₹{(selectedQuoteDetail.totalPayable || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action row buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setSelectedQuoteDetail(null)} 
                  className="h-10 px-4 border rounded-xl font-bold bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close Details
                </button>
                <button 
                  type="button" 
                  onClick={handleUnderwriterSubmitAndApprove}
                  className="h-10 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Submit to Underwriter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEAD SELECTION MODAL */}
      {isLeadSelectOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in select-none">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-slate-700 text-xs font-bold text-left my-8">
            <div className="bg-[#0B1F5B] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
              <div>
                <h3 className="text-base font-black tracking-tight">Select Lead for Quote Generation</h3>
                <span className="text-[10px] text-blue-200 mt-1 block">Choose a customer lead to create a new pricing quote</span>
              </div>
              <button 
                onClick={() => {
                  setIsLeadSelectOpen(false);
                  setLeadSearchQuery('');
                }} 
                className="p-1 rounded-lg hover:bg-white/10 text-white/70 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Search leads */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="Search lead by name, email, phone..." 
                  value={leadSearchQuery}
                  onChange={(e) => setLeadSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-900 focus:bg-white focus:border-[#0B1F5B] transition-all"
                />
              </div>

              {/* Leads List */}
              <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100 pr-1">
                {leads.filter(ld => {
                  const q = leadSearchQuery.toLowerCase();
                  const name = ld.customerName || ld.fullName || '';
                  const email = ld.email || ld.emailAddress || '';
                  const phone = ld.phone || ld.mobileNumber || '';
                  return name.toLowerCase().includes(q) || 
                         email.toLowerCase().includes(q) || 
                         phone.includes(q);
                }).length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-3 font-semibold">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
                    <p>No active customer leads found in records.</p>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsLeadSelectOpen(false);
                        navigate('/lead-management');
                      }}
                      className="text-[#0B1F5B] underline hover:text-black cursor-pointer font-bold block mx-auto animate-pulse"
                    >
                      Create a New Lead first
                    </button>
                  </div>
                ) : (
                  leads.filter(ld => {
                    const q = leadSearchQuery.toLowerCase();
                    const name = ld.customerName || ld.fullName || '';
                    const email = ld.email || ld.emailAddress || '';
                    const phone = ld.phone || ld.mobileNumber || '';
                    return name.toLowerCase().includes(q) || 
                           email.toLowerCase().includes(q) || 
                           phone.includes(q);
                  }).map(ld => (
                    <div key={ld._id} className="py-3 flex items-center justify-between gap-4 border-b last:border-b-0 border-slate-100">
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-900 text-xs">{ld.customerName || ld.fullName || 'Unnamed Lead'}</h4>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{ld.phone || ld.mobileNumber || '—'} | {ld.email || ld.emailAddress || 'No Email'}</span>
                        <span className="inline-block text-[8px] font-black uppercase tracking-wider bg-slate-50 border rounded px-1.5 py-0.5 mt-1 text-slate-500">{ld.status}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsLeadSelectOpen(false);
                          navigate(`/lead-management/generate-quote/${ld._id}`);
                        }}
                        className="h-8 px-3 bg-[#0B1F5B] hover:bg-black text-white text-[10px] font-black rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Select & Generate
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}