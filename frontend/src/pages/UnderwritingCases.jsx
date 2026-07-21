import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Shield, FileText, CheckCircle2, XCircle, AlertCircle, 
  Clock, ArrowLeft, Filter, Calendar, Upload, ShieldCheck, 
  ArrowRight, Activity, ChevronRight, CreditCard, Landmark, RefreshCw
} from 'lucide-react';

export default function UnderwritingCases() {
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  
  const [viewingCaseId, setViewingCaseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');
  
  // Cases database states
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for billing remittance execution workflows
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('upi');

  const fetchCases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('agent_token');
      const res = await fetch('/api/underwriting', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-agent-role': localStorage.getItem('agent_role') || 'Sales Agent'
        }
      });
      const data = await res.json();
      if (data.success) {
        setCases(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const selectedCaseDetails = cases.find(c => c._id === viewingCaseId);

  // Update underwriting case status as underwriter
  const handleUpdateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('agent_token');
      const res = await fetch(`/api/underwriting/${selectedCaseDetails._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-agent-role': localStorage.getItem('agent_role') || 'Sales Agent'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Case status updated successfully to ${newStatus}`);
        fetchCases();
        closeCaseWorkspace();
      } else {
        alert(data.message || 'Status update failed.');
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to update status: ${err.message}`);
    }
  };


  // Refactored Payment Action to execute securely against the backend API
  const executePaymentRemittance = async () => {
    if (!selectedCaseDetails) return;

    try {
      const token = localStorage.getItem('agent_token');
      const res = await fetch('/api/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-agent-role': localStorage.getItem('agent_role') || 'Sales Agent'
        },
        body: JSON.stringify({
          caseId: selectedCaseDetails._id,
          paymentMode: selectedPaymentMode
        })
      });

      const data = await res.json();
      if (data.success) {
        setPaymentCompleted(true);
        setTimeout(() => {
          navigate(`/policies/${data.data.policyNumber}`);
        }, 1500);
      } else {
        alert(data.message || 'Remittance failed.');
      }
    } catch (err) {
      console.error(err);
      alert(`Fulfillment Error: ${err.message}`);
    }
  };

  const getStatusBadge = (status) => {
    const configurations = {
      'Approved': 'bg-emerald-50 border-emerald-200 text-emerald-700',
      'Pending Review': 'bg-amber-50 border-amber-200 text-amber-700',
      'Rejected': 'bg-rose-50 border-rose-200 text-rose-700',
      'Additional Docs Required': 'bg-purple-50 border-purple-200 text-purple-700',
      'Medical Required': 'bg-blue-50 border-blue-200 text-blue-700',
    };
    return configurations[status] || 'bg-slate-50 border-slate-200 text-slate-700';
  };

  const filteredCases = cases.filter(item => {
    const matchesSearch = item._id.toLowerCase().includes(searchTerm.toLowerCase()) || item.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesProduct = productFilter === 'All' || item.planName === productFilter;
    return matchesSearch && matchesStatus && matchesProduct;
  });

  const closeCaseWorkspace = () => {
    setViewingCaseId(null);
    setIsPaymentExpanded(false);
    setPaymentCompleted(false);
  };

  // KPI Computations from live backend dataset
  const kpis = {
    total: cases.length,
    pending: cases.filter(c => c.status === 'Pending Review').length,
    approved: cases.filter(c => c.status === 'Approved').length,
    rejected: cases.filter(c => c.status === 'Rejected').length,
    action: cases.filter(c => ['Medical Required', 'Additional Docs Required'].includes(c.status)).length
  };

  // --- MAIN TABLE VIEW ---
  if (!viewingCaseId) {
    return (
      <div className="flex-1 min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-12 w-full">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 lg:sticky lg:top-0 lg:z-10 relative z-0 w-full">
          <div className="flex flex-col items-start">
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[22px] leading-tight">Underwriting Cases Desk</h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[10px]">
              {activeRole === 'Underwriter' ? 'Audit and clear all submitted insurance application cases portal-wide.' : 'Track your submitted proposal applications status.'}
            </span>
          </div>
        </header>

        <main className="max-w-[1400px] w-full mx-auto px-6 py-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Cases', value: kpis.total, color: 'text-slate-900 border-slate-200' },
              { label: 'Pending Review', value: kpis.pending, color: 'text-amber-600 border-amber-200 bg-amber-50/10' },
              { label: 'Approved', value: kpis.approved, color: 'text-emerald-600 border-emerald-200 bg-emerald-50/10' },
              { label: 'Rejected', value: kpis.rejected, color: 'text-rose-600 border-rose-200 bg-rose-50/10' },
              { label: 'Action Needed', value: kpis.action, color: 'text-purple-600 border-purple-200 bg-purple-50/10' }
            ].map((kpi, idx) => (
              <div key={idx} className={`bg-white border rounded-2xl p-4 shadow-3xs flex flex-col items-start ${kpi.color}`}>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{kpi.label}</span>
                <span className="text-2xl font-black mt-1 block">{kpi.value}</span>
              </div>
            ))}
          </div>

          {/* Filtering Control Row */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end text-xs font-bold text-slate-700">
            <div className="flex flex-col items-start w-full">
              <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1"><Search className="w-3 h-3" /> Search Cases</label>
              <input type="text" placeholder="Case ID or Customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-semibold focus:border-[#0F478D]" />
            </div>
            <div className="flex flex-col items-start w-full">
              <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1"><Filter className="w-3 h-3" /> Status Matrix</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#0F478D]">
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Rejected">Rejected</option>
                <option value="Additional Docs Required">Additional Docs Required</option>
                <option value="Medical Required">Medical Required</option>
              </select>
            </div>
            <div className="flex flex-col items-start w-full">
              <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1"><Shield className="w-3 h-3" /> Product Type</label>
              <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#0F478D]">
                <option value="All">All Products</option>
                <option value="Term Life">Term Life</option>
                <option value="Whole Life">Whole Life</option>
                <option value="ULIP">ULIP</option>
              </select>
            </div>
            <div className="flex flex-col items-start w-full">
              <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> Time Horizon</label>
              <div className="w-full h-10 border border-slate-200 bg-slate-50 rounded-xl flex items-center px-3 text-slate-500 font-bold cursor-pointer"><span>All Submissions</span></div>
            </div>
          </div>

          {/* Core Table Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="hidden md:table w-full border-collapse text-left text-xs font-semibold">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Application ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Product Matrix</th>
                    <th className="py-3.5 px-4">Submitted</th>
                    <th className="py-3.5 px-4">Underwriting Status</th>
                    <th className="py-3.5 px-4">Sum Assured</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr><td colSpan="7" className="p-12 text-center"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#0B1F5B]" /></td></tr>
                  ) : filteredCases.length === 0 ? (
                    <tr><td colSpan="7" className="p-16 text-center text-slate-400 font-bold bg-slate-50/30">No underwriting cases found in this view.</td></tr>
                  ) : (
                    filteredCases.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-[#0B1F5B]">#{item._id.slice(-6).toUpperCase()}</td>
                        <td className="py-4 px-4 font-extrabold text-slate-900">{item.customerName}</td>
                        <td className="py-4 px-4">{item.planName}</td>
                        <td className="py-4 px-4 text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                         <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 border text-[10px] font-black uppercase tracking-wide rounded-full whitespace-nowrap inline-flex items-center justify-center gap-1 ${getStatusBadge(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-extrabold text-slate-900">₹{item.sumAssured.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-4 text-center">
                          <button onClick={() => setViewingCaseId(item._id)} className="h-8 px-3 border border-slate-200 rounded-lg font-bold bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-1 mx-auto">
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* MOBILE CARDS VIEW */}
              <div className="md:hidden divide-y divide-slate-100 bg-white">
                {loading ? (
                  <div className="p-8 text-center"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#0B1F5B]" /></div>
                ) : filteredCases.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 font-bold bg-slate-50/30">No underwriting cases found in this view.</div>
                ) : (
                  filteredCases.map((item) => (
                    <div key={item._id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#0B1F5B]">#{item._id.slice(-6).toUpperCase()}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <h4 className="font-extrabold text-sm text-slate-900">{item.customerName}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.planName}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 border text-[9px] font-black uppercase tracking-wide rounded-full inline-flex items-center justify-center gap-1 ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div className="text-left">
                          <span className="text-[9px] uppercase text-slate-400 block font-bold">Sum Assured</span>
                          <span className="text-slate-900 font-bold text-xs">₹{item.sumAssured.toLocaleString('en-IN')}</span>
                        </div>
                        
                        <button 
                          onClick={() => setViewingCaseId(item._id)} 
                          className="h-8 px-3 border border-slate-200 rounded-lg font-bold bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-1"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- WORKSPACE CASE VIEW DETAILS ---
  return (
    <div className="flex-1 min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-16 w-full animate-fade-in">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between lg:sticky lg:top-0 lg:z-10 relative z-0 w-full">
        <div className="flex items-center gap-4">
          <button type="button" onClick={closeCaseWorkspace} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col items-start">
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[22px] leading-tight">Case Underwriting Overview</h1>
            <span className="text-slate-400 font-bold block mt-0.5 uppercase tracking-wider text-[10px]">REVIEWING CASE ID: #{selectedCaseDetails._id.slice(-6).toUpperCase()}</span>
          </div>
        </div>
        <span className={`px-3 py-1 border text-xs font-black uppercase tracking-wider rounded-md whitespace-nowrap inline-flex items-center justify-center gap-1 ${getStatusBadge(paymentCompleted ? 'Approved' : selectedCaseDetails.status)}`}>
          {paymentCompleted ? 'Active Issued' : selectedCaseDetails.status}
        </span>
      </header>

      <main className="max-w-[1400px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Core Profile Ledger Forms Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Summary Information Grid Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0F478D]" />
              <h2 className="text-xs font-black text-[#0B1F5B] uppercase tracking-wider">Application Summary</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 text-xs font-semibold text-slate-600">
              <div className="sm:col-span-2 md:col-span-3 lg:col-span-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Case DB ID</span>
                <span className="text-mono font-bold text-slate-900 block mt-0.5 select-all break-all">{selectedCaseDetails._id}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Customer Name</span>
                <span className="text-slate-900 font-bold block mt-0.5 truncate">{selectedCaseDetails.customerName}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Plan Architecture</span>
                <span className="text-slate-900 font-bold block mt-0.5 truncate">{selectedCaseDetails.planName}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Face Valued Sum Assured</span>
                <span className="text-slate-900 font-bold block mt-0.5">₹{selectedCaseDetails.sumAssured.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Premium Rate Card</span>
                <span className="text-slate-900 font-bold block mt-0.5">₹{selectedCaseDetails.premium.toLocaleString('en-IN')}/yr</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Submission Timeline</span>
                <span className="text-slate-900 font-bold block mt-0.5 truncate">{new Date(selectedCaseDetails.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Underwriting Verification Status Frame */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-fade-in">
            <div className="border-b border-slate-100 pb-3 mb-5">
              <h2 className="text-xs font-black text-[#0B1F5B] uppercase tracking-wider">Underwriting Status Verification</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Central risk evaluations parameters.</p>
            </div>

            <div className={`p-5 border rounded-xl space-y-4 text-xs font-semibold ${
              selectedCaseDetails.status === 'Approved' ? 'border-emerald-200 bg-emerald-50/10' :
              selectedCaseDetails.status === 'Rejected' ? 'border-rose-200 bg-rose-50/10' :
              'border-amber-200 bg-amber-50/10'
            }`}>
              <div className={`flex items-center gap-2 text-sm font-bold ${
                selectedCaseDetails.status === 'Approved' ? 'text-emerald-800' :
                selectedCaseDetails.status === 'Rejected' ? 'text-rose-800' : 'text-amber-800'
              }`}>
                {selectedCaseDetails.status === 'Approved' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Clock className="w-5 h-5 text-amber-500" />}
                <span>Application Status: {selectedCaseDetails.status}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Risk Classification Matrix</span>
                  <span className="text-slate-900 font-extrabold block mt-0.5">Standard Risk Tier</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Clearance Status</span>
                  <span className="text-slate-900 font-bold block mt-0.5">{selectedCaseDetails.status}</span>
                </div>
                <div className="sm:col-span-2 border-t border-slate-100 pt-3">
                  <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Compliance Audit Notes</span>
                  <p className="text-slate-600 font-medium mt-1 leading-relaxed">
                    {selectedCaseDetails.status === 'Approved' 
                      ? 'Application meets all baseline liability requirements. All profile declarations pass risk thresholds cleanly.' 
                      : 'Underwriter action / evaluation queue active for this file.'
                    }
                  </p>
                </div>
              </div>
            </div>
                   {/* Proposal Form & Medical Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#0F478D]" />
              <h2 className="text-xs font-black text-[#0B1F5B] uppercase tracking-wider">Submitted Proposal & Medical Information</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div className="bg-slate-50 p-3 rounded-xl border">
                <span className="text-[10px] text-slate-400 block uppercase">Nominee Information</span>
                <span className="text-slate-900 block mt-1">Name: {selectedCaseDetails.proposalFormData?.nomineeName || 'Sneha Sharma'}</span>
                <span className="text-slate-550 block">Relationship: {selectedCaseDetails.proposalFormData?.nomineeRelationship || 'Spouse'} (Age: {selectedCaseDetails.proposalFormData?.nomineeAge || '32'})</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border">
                <span className="text-[10px] text-slate-400 block uppercase">Occupation & Income</span>
                <span className="text-slate-900 block mt-1">Profession: {selectedCaseDetails.proposalFormData?.profession || 'Salaried Software Engineer'}</span>
                <span className="text-slate-550 block">Inflow: ₹{(selectedCaseDetails.proposalFormData?.annualIncome || 1800000).toLocaleString('en-IN')} ({selectedCaseDetails.proposalFormData?.incomeSource || 'Salary'})</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-[10px] text-slate-400 block uppercase mb-2">Medical History Responses</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-bold">
                <div className="p-2.5 bg-slate-50 border rounded-xl">
                  <span className="text-slate-400 block text-[9px] uppercase">Pre-existing Illness</span>
                  <span className="text-slate-900 block mt-0.5">{selectedCaseDetails.proposalFormData?.hasPreExistingIllness || 'No'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border rounded-xl">
                  <span className="text-slate-400 block text-[9px] uppercase">Chronic Condition</span>
                  <span className="text-slate-900 block mt-0.5">{selectedCaseDetails.proposalFormData?.hasChronicAilments || 'No'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border rounded-xl">
                  <span className="text-slate-400 block text-[9px] uppercase">Prior Hospitalization</span>
                  <span className="text-slate-900 block mt-0.5">{selectedCaseDetails.proposalFormData?.hasHospitalizationHistory || 'No'}</span>
                </div>
              </div>
            </div>

            {/* Submitted KYC Files */}
            <div className="border-t border-slate-100 pt-3">
              <span className="text-[10px] text-slate-400 block uppercase mb-2">Verified Documents Matrix</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[11px] font-bold text-slate-700">
                {selectedCaseDetails.kycDocuments ? (
                  Object.entries(selectedCaseDetails.kycDocuments).filter(([_, val]) => !!val).map(([key, val]) => (
                    <div key={key} className="p-2 border border-slate-150 rounded-xl flex items-center justify-between bg-white">
                      <div className="min-w-0 flex-1">
                        <span className="text-slate-900 block truncate">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-[9px] text-slate-400 block font-mono truncate">{val}</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ml-1"></span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 text-xs font-semibold">No KYC files attached.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Flow Actions Menu Panel */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[112px]">
          
          {/* Underwriter Decision Options */}
          {/* Required Agent Next Step */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider border-b pb-2">Required Agent Next Step</h3>
            
            {selectedCaseDetails.status === 'Approved' && (
              <div className="space-y-2">
                <button 
                  onClick={() => navigate(`/policies/payment/${selectedCaseDetails._id}`)}
                  className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Premium Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedCaseDetails.status === 'Pending Review' && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-left text-blue-900 text-xs font-semibold leading-relaxed">
                  Underwriting review is active. Since portal auto-approval is enabled, you can execute the clearance immediately.
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleUpdateStatus('Approved')}
                    className="h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Approve Proposal</span>
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus('Rejected')}
                    className="h-11 bg-rose-700 hover:bg-rose-800 text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-rose-300" />
                    <span>Reject Proposal</span>
                  </button>
                </div>
                <div className="pt-1">
                  <button 
                    onClick={() => handleUpdateStatus('Additional Docs Required')}
                    className="w-full h-11 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-purple-300" />
                    <span>Request Additional Documents</span>
                  </button>
                </div>
              </div>
            )}

            {selectedCaseDetails.status === 'Rejected' && (
              <div className="space-y-3">
                <div className="p-3 bg-rose-50/40 border border-rose-100 rounded-xl text-left text-rose-900 text-xs font-semibold leading-relaxed">
                  This proposal has been rejected during underwriting review. Since auto-approval simulation is enabled, you can override and approve it below.
                </div>
                <button 
                  onClick={() => handleUpdateStatus('Approved')}
                  className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Override & Approve Case</span>
                </button>
              </div>
            )}
          </div>          </div>

          {/* Underwriting Process Audit */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider border-b pb-2">Underwriting Process Audit</h3>
            <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {[
                { step: 'Proposal Submitted', done: true },
                { step: 'KYC Verification Done', done: true },
                { step: 'Document Authentication Matrix', done: true },
                { step: 'Core Underwriting Review Run', done: ['Approved', 'Rejected'].includes(selectedCaseDetails.status) },
                { step: 'Final Policy Decision Issued', done: ['Approved', 'Rejected'].includes(selectedCaseDetails.status) },
                { step: 'Premium Collected & Policy Active', done: paymentCompleted }
              ].map((log, index) => (
                <div key={index} className="flex gap-4 items-start relative text-xs text-left font-semibold">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 z-10 ${
                    log.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {log.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <span className={log.done ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'}>{log.step}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}