// src/pages/ProposalTracking.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldAlert, FileText, CheckCircle2, XCircle, Clock, ArrowLeft, RefreshCw, CreditCard } from 'lucide-react';
import { fetchFromPortal } from './api';

export default function ProposalTracking() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchProposalsData = async () => {
    try {
      setLoading(true);
      // Fetch underwriting cases
      const res = await fetchFromPortal('/underwriting');
      // If some leads have status Draft Proposal or Quote Accepted but aren't in underwriting yet,
      // we can fetch leads as well to show complete pipeline visibility!
      const leadsRes = await fetchFromPortal('/leads');
      
      let combined = [];

      // Add leads that are in draft stages
      if (leadsRes && Array.isArray(leadsRes.data)) {
        leadsRes.data.forEach(lead => {
          const s = lead.status;
          if (['Quote Accepted', 'Draft Proposal', 'Proposal Intake', 'Documents Uploaded', 'Additional Docs Required'].includes(s)) {
            combined.push({
              _id: lead._id,
              customerName: lead.customerName,
              planName: lead.productInterest || 'Term Life Plan',
              sumAssured: lead.coverageAmount || 28500000,
              premium: 23840,
              status: s === 'Quote Accepted' ? 'Draft' : (s === 'Additional Docs Required' ? 'Additional Docs Required' : 'Documents Pending'),
              createdAt: lead.createdAt,
              isUnderwritingCase: false
            });
          }
        });
      }

      // Add actual underwriting cases
      if (res && res.data) {
        res.data.forEach(c => {
          combined.push({
            _id: c._id,
            leadId: c.leadId,
            customerName: c.customerName,
            planName: c.planName,
            sumAssured: c.sumAssured,
            premium: c.premium,
            status: c.status === 'Pending Review' ? 'Submitted' : c.status,
            createdAt: c.createdAt,
            isUnderwritingCase: true
          });
        });
      }

      // Sort by date
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProposals(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposalsData();
  }, []);

  const getStatusBadge = (status) => {
    const cfgs = {
      'Approved': 'bg-emerald-50 border-emerald-250 text-emerald-700',
      'Submitted': 'bg-blue-50 border-blue-200 text-blue-700',
      'Pending Review': 'bg-blue-50 border-blue-200 text-blue-700',
      'Rejected': 'bg-rose-50 border-rose-200 text-rose-700',
      'Medical Required': 'bg-amber-50 border-amber-200 text-amber-700',
      'Additional Docs Required': 'bg-purple-50 border-purple-200 text-purple-700',
      'Draft': 'bg-slate-50 border-slate-200 text-slate-700',
      'Documents Pending': 'bg-indigo-50 border-indigo-200 text-indigo-700'
    };
    return cfgs[status] || 'bg-slate-50 border-slate-200 text-slate-700';
  };

  const filtered = proposals.filter(p => {
    const matchesSearch = p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || p._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 min-h-screen bg-[#F5F7FB] text-left font-sans pb-12 w-full">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-3xs w-full">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/dashboard')} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[20px] leading-none">Proposal Tracking Desk</h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[9px]">Monitor stages of your customer pipeline</span>
          </div>
        </div>
        <button onClick={fetchProposalsData} className="p-2 border rounded-xl hover:bg-slate-50 text-slate-500">
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      <main className="max-w-[1200px] w-full mx-auto px-6 py-6 space-y-6">
        
        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs font-bold text-slate-700">
          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1"><Search className="w-3 h-3" /> Search</label>
            <input type="text" placeholder="Proposal ID or Customer Name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-semibold" />
          </div>
          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Filter Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold">
              <option value="All">All Stages</option>
              <option value="Draft">Draft</option>
              <option value="Documents Pending">Documents Pending</option>
              <option value="Submitted">Submitted</option>
              <option value="Medical Required">Medical Required</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left text-xs font-semibold">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 w-[20%]">ID Reference</th>
                  <th className="py-3.5 px-4 w-[25%]">Customer</th>
                  <th className="py-3.5 px-4 w-[20%]">Plan details</th>
                  <th className="py-3.5 px-4 w-[15%]">Status Stage</th>
                  <th className="py-3.5 px-4 text-center w-[20%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr><td colSpan="5" className="p-12 text-center"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#0B1F5B]" /></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" className="p-16 text-center text-slate-400 font-bold bg-slate-50/30">No proposals in tracking.</td></tr>
                ) : (
                  filtered.map(p => (
                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-[#0B1F5B]">#{p._id.slice(-6).toUpperCase()}</td>
                      <td className="py-4 px-4 font-extrabold text-slate-900">{p.customerName}</td>
                      <td className="py-4 px-4">{p.planName} • ₹{p.sumAssured.toLocaleString('en-IN')}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 border text-[9px] font-black uppercase tracking-wide rounded-full ${getStatusBadge(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {p.status === 'Approved' ? (
                          <button 
                            onClick={() => navigate(`/policies/payment/${p._id}`)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[10px] uppercase px-3 py-1.5 rounded-lg flex items-center gap-1 mx-auto"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Collect Premium</span>
                          </button>
                        ) : p.status === 'Additional Docs Required' ? (
                          <button 
                            onClick={() => navigate(`/lead-management/document-upload/${p.leadId || p._id}`, { state: { reuploadContext: true, caseId: p._id } })}
                            className="bg-purple-700 hover:bg-purple-800 text-white font-black text-[10px] uppercase px-3 py-1.5 rounded-lg mx-auto"
                          >
                            <span>Re-upload Docs</span>
                          </button>
                        ) : p.status === 'Draft' ? (
                          <button 
                            onClick={() => navigate(`/lead-management/proposal-form/${p._id}`)}
                            className="bg-[#0B1F5B] hover:bg-black text-white font-black text-[10px] uppercase px-3 py-1.5 rounded-lg mx-auto"
                          >
                            <span>Resume Form</span>
                          </button>
                        ) : p.status === 'Documents Pending' ? (
                          <button 
                            onClick={() => navigate(`/lead-management/document-upload/${p._id}`)}
                            className="bg-indigo-700 hover:bg-indigo-800 text-white font-black text-[10px] uppercase px-3 py-1.5 rounded-lg mx-auto"
                          >
                            <span>Upload Docs</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 font-medium">Awaiting audit review</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
