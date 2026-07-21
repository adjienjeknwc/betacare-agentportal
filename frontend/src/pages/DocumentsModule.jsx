// src/pages/DocumentsModule.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShieldAlert, FileText, CheckCircle2, XCircle, AlertCircle, 
  Clock, ArrowLeft, Filter, Calendar, Upload, ShieldCheck, 
  ArrowRight, Activity, CreditCard, Landmark, RefreshCw, Send, 
  Mail, MessageSquare, PhoneCall, Check, ExternalLink, Trash2, X
} from 'lucide-react';
import { fetchFromPortal } from './api';

export default function DocumentsModule() {
  const navigate = useNavigate();

  // State Management
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [missingFilter, setMissingFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Modal and toast states
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifyMethod, setNotifyMethod] = useState('whatsapp');
  const [notifyMsg, setNotifyMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Initial mockup dataset paired with live DB lookups
  const mockProposals = [
    {
      _id: 'PR-982451-2026',
      customerName: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      phone: '+91 98234 56789',
      policyType: 'Term Life',
      totalDocuments: 10,
      uploadedCount: 8,
      missingDocs: ['Income Proof', 'Cancelled Cheque'],
      status: 'Underwriter Requested',
      lastUpdated: '2026-07-21T18:00:00Z',
      underwriterRemarks: {
        missing: 'Income Proof (Form 16/Payslips), Cancelled Cheque',
        corrections: 'Income payslip must show June/July corporate seal stamp.',
        priority: 'High',
        deadline: '2026-07-28'
      },
      timeline: [
        { title: 'Proposal Initialized', time: '2026-07-19T10:00:00Z', desc: 'Proposal draft setup completed.' },
        { title: 'Documents Uploaded', time: '2026-07-19T14:30:00Z', desc: 'Initial 8 documents uploaded.' },
        { title: 'Sent to Underwriting', time: '2026-07-20T09:00:00Z', desc: 'Case routed to risk committee.' },
        { title: 'Underwriter Requested Corrections', time: '2026-07-21T18:00:00Z', desc: 'Income verification payslips requested.' }
      ],
      documents: {
        panCard: 'PAN_MOCK_RAHUL.pdf',
        aadhaarCard: 'AADHAAR_MOCK_RAHUL.pdf',
        addressProof: 'UTILITY_BILL_RAHUL.pdf',
        incomeProof: null,
        photograph: 'PHOTO_MOCK_RAHUL.png',
        cancelledCheque: null
      }
    },
    {
      _id: 'PR-982452-2026',
      customerName: 'Priya Patel',
      email: 'priya.patel@yahoo.com',
      phone: '+91 98765 43210',
      policyType: 'Whole Life',
      totalDocuments: 8,
      uploadedCount: 5,
      missingDocs: ['Aadhaar Card', 'Address Proof', 'Photograph'],
      status: 'Awaiting Customer',
      lastUpdated: '2026-07-20T12:00:00Z',
      underwriterRemarks: {
        missing: 'Aadhaar Card, Utility Bill Proof, Applicant Photograph',
        corrections: 'Aadhaar verification verification scans must have clear visibility.',
        priority: 'Medium',
        deadline: '2026-07-30'
      },
      timeline: [
        { title: 'Proposal Initialized', time: '2026-07-20T11:00:00Z', desc: 'Proposal setup complete.' },
        { title: 'Customer Notified', time: '2026-07-20T12:00:00Z', desc: 'Awaiting customer document upload.' }
      ],
      documents: {
        panCard: 'PAN_MOCK_PRIYA.pdf',
        aadhaarCard: null,
        addressProof: null,
        incomeProof: 'ITR_PRIYA.pdf',
        photograph: null,
        cancelledCheque: 'CHEQUE_MOCK_PRIYA.pdf'
      }
    },
    {
      _id: 'PR-982453-2026',
      customerName: 'Amit Verma',
      email: 'amit.verma@outlook.com',
      phone: '+91 91234 56780',
      policyType: 'Micro-Insurance',
      totalDocuments: 5,
      uploadedCount: 5,
      missingDocs: [],
      status: 'Ready to Submit',
      lastUpdated: '2026-07-22T01:30:00Z',
      underwriterRemarks: null,
      timeline: [
        { title: 'Proposal Initialized', time: '2026-07-21T15:00:00Z', desc: 'Proposal drafted.' },
        { title: 'Documents Collected', time: '2026-07-22T01:30:00Z', desc: 'All 5 mandatory documents verified.' }
      ],
      documents: {
        panCard: 'PAN_MOCK_AMIT.pdf',
        aadhaarCard: 'AADHAAR_MOCK_AMIT.pdf',
        addressProof: 'RENT_AMIT.pdf',
        incomeProof: 'SALARY_AMIT.pdf',
        photograph: 'PHOTO_AMIT.jpg',
        cancelledCheque: 'CHEQUE_AMIT.pdf'
      }
    },
    {
      _id: 'PR-982454-2026',
      customerName: 'Sneha Deshmukh',
      email: 'sneha.d@gmail.com',
      phone: '+91 95432 10987',
      policyType: 'Term Life',
      totalDocuments: 10,
      uploadedCount: 10,
      missingDocs: [],
      status: 'Submitted',
      lastUpdated: '2026-07-22T02:00:00Z',
      underwriterRemarks: null,
      timeline: [
        { title: 'Proposal Initialized', time: '2026-07-21T09:00:00Z', desc: 'Proposal setup complete.' },
        { title: 'Documents Completed', time: '2026-07-21T14:00:00Z', desc: 'Files checked successfully.' },
        { title: 'Submitted to Underwriting', time: '2026-07-22T02:00:00Z', desc: 'Case queued under review.' }
      ],
      documents: {
        panCard: 'PAN_MOCK_SNEHA.pdf',
        aadhaarCard: 'AADHAAR_MOCK_SNEHA.pdf',
        addressProof: 'BILL_SNEHA.pdf',
        incomeProof: 'SALARY_SNEHA.pdf',
        photograph: 'PHOTO_SNEHA.jpg',
        cancelledCheque: 'CHEQUE_SNEHA.pdf'
      }
    }
  ];

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const leadsRes = await fetchFromPortal('/leads');
      const underwritingRes = await fetchFromPortal('/underwriting');

      let combinedList = [...mockProposals];

      // Parse live database inputs to merge seamlessly into Document Desk tracking list
      if (leadsRes && Array.isArray(leadsRes.data)) {
        leadsRes.data.forEach(lead => {
          // If the lead is already in mock, don't duplicate
          if (combinedList.some(p => p._id === lead._id || p._id === `PR-${lead._id.slice(-6).toUpperCase()}`)) return;

          const s = lead.status;
          if (['Quote Accepted', 'Draft Proposal', 'Proposal Intake', 'Documents Uploaded', 'Additional Docs Required', 'Proposal Submitted'].includes(s)) {
            
            // Resolve case status if it has an underwriting case
            let resolvedStatus = 'Awaiting Customer';
            if (s === 'Quote Accepted' || s === 'Draft Proposal') resolvedStatus = 'Awaiting Customer';
            if (s === 'Documents Uploaded') resolvedStatus = 'Ready to Submit';
            if (s === 'Proposal Submitted') resolvedStatus = 'Submitted';
            if (s === 'Additional Docs Required') resolvedStatus = 'Underwriter Requested';

            let matchingCase = null;
            if (underwritingRes && Array.isArray(underwritingRes.data)) {
              matchingCase = underwritingRes.data.find(c => c.leadId === lead._id);
              if (matchingCase) {
                if (matchingCase.status === 'Approved') resolvedStatus = 'Complete';
                if (matchingCase.status === 'Rejected') resolvedStatus = 'Complete';
                if (matchingCase.status === 'Additional Docs Required') resolvedStatus = 'Underwriter Requested';
                if (matchingCase.status === 'Pending Review') resolvedStatus = 'Submitted';
              }
            }

            combinedList.push({
              _id: lead._id,
              customerName: lead.customerName,
              email: lead.email || `${lead.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
              phone: lead.phone || '+91 99999 88888',
              policyType: lead.productInterest || 'Term Life',
              totalDocuments: 5,
              uploadedCount: lead.proposalDocuments ? Object.values(lead.proposalDocuments).filter(Boolean).length : 0,
              missingDocs: lead.proposalDocuments ? Object.keys(lead.proposalDocuments).filter(k => !lead.proposalDocuments[k]) : ['PAN Card', 'Aadhaar Card', 'Income Proof', 'Photograph'],
              status: resolvedStatus,
              lastUpdated: lead.updatedAt || lead.createdAt,
              underwriterRemarks: resolvedStatus === 'Underwriter Requested' ? {
                missing: 'PAN Card or Aadhaar Verification scan check mismatch.',
                corrections: 'Please upload clean readable photo scans of PAN Card.',
                priority: 'High',
                deadline: '2026-07-29'
              } : null,
              timeline: [
                { title: 'Proposal Started', time: lead.createdAt, desc: 'Proposal draft initialized.' },
                ...(lead.proposalDocuments ? [{ title: 'Documents Staged', time: lead.updatedAt, desc: 'Documents uploaded to agent portal.' }] : [])
              ],
              documents: lead.proposalDocuments || {
                panCard: null,
                aadhaarCard: null,
                addressProof: null,
                incomeProof: null,
                photograph: null
              }
            });
          }
        });
      }

      setProposals(combinedList);
    } catch (err) {
      console.error(err);
      setProposals(mockProposals); // Fallback to mockup data if backend is offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  // Summary Metrics Computations
  const metrics = useMemo(() => {
    return {
      total: proposals.length,
      pending: proposals.filter(p => ['Awaiting Customer', 'Underwriter Requested'].includes(p.status)).length,
      awaitingCustomer: proposals.filter(p => p.status === 'Awaiting Customer').length,
      readyForUnderwriting: proposals.filter(p => p.status === 'Ready to Submit').length
    };
  }, [proposals]);

  const selectedProposal = useMemo(() => {
    return proposals.find(p => p._id === selectedProposalId);
  }, [proposals, selectedProposalId]);

  // Filters logic
  const filtered = useMemo(() => {
    return proposals.filter(p => {
      const matchesSearch = p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || p._id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesType = typeFilter === 'All' || p.policyType === typeFilter;
      const matchesMissing = missingFilter === 'All' || (missingFilter === 'Yes' ? p.missingDocs.length > 0 : p.missingDocs.length === 0);
      return matchesSearch && matchesStatus && matchesType && matchesMissing;
    });
  }, [proposals, searchTerm, statusFilter, typeFilter, missingFilter]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Action: Open Notification Modal with template
  const handleOpenNotify = () => {
    if (!selectedProposal) return;
    const missingDocsText = selectedProposal.missingDocs.join(', ');
    const body = `Dear ${selectedProposal.customerName},\n\nWe require the following documents to process your ${selectedProposal.policyType} insurance proposal (${selectedProposal._id}):\n* ${missingDocsText}\n\nPlease click the secure upload link to upload verified copies immediately: https://betacare-life.in/upload?ref=${selectedProposal._id}\n\nRegards,\nBetacare Life Operations`;
    setNotifyMsg(body);
    setIsNotifyOpen(true);
  };

  // Action: Dispatch message simulation
  const handleSendNotification = () => {
    setIsNotifyOpen(false);
    showToast(`Notification sent successfully to ${selectedProposal.customerName} via ${notifyMethod.toUpperCase()}!`);
    // Add event to timeline
    setProposals(prev => prev.map(p => {
      if (p._id === selectedProposalId) {
        return {
          ...p,
          timeline: [
            { title: 'Customer Notified', time: new Date().toISOString(), desc: `Notified via ${notifyMethod.toUpperCase()} regarding missing documents.` },
            ...p.timeline
          ]
        };
      }
      return p;
    }));
  };

  // Action: Mock upload missing document in drawer
  const handleDocMockUpload = (docKey) => {
    setProposals(prev => prev.map(p => {
      if (p._id === selectedProposalId) {
        const updatedDocs = { ...p.documents, [docKey]: `DOC_MOCK_${docKey.toUpperCase()}_REV.pdf` };
        const missing = Object.keys(updatedDocs).filter(k => !updatedDocs[k]);
        let nextStatus = p.status;
        if (missing.length === 0) nextStatus = 'Ready to Submit';
        
        return {
          ...p,
          uploadedCount: Object.values(updatedDocs).filter(Boolean).length,
          missingDocs: missing.map(m => m.replace(/([A-Z])/g, ' $1')),
          status: nextStatus,
          documents: updatedDocs,
          timeline: [
            { title: 'Document Uploaded', time: new Date().toISOString(), desc: `Replaced / Uploaded ${docKey.replace(/([A-Z])/g, ' $1')} successfully.` },
            ...p.timeline
          ]
        };
      }
      return p;
    }));
    showToast(`Document uploaded successfully!`);
  };

  const getStatusBadge = (status) => {
    const cfgs = {
      'Complete': 'bg-emerald-50 border-emerald-250 text-emerald-700',
      'Awaiting Customer': 'bg-indigo-50 border-indigo-200 text-indigo-700',
      'Underwriter Requested': 'bg-rose-50 border-rose-200 text-rose-700',
      'Ready to Submit': 'bg-amber-50 border-amber-200 text-amber-700',
      'Submitted': 'bg-blue-50 border-blue-200 text-blue-750'
    };
    return cfgs[status] || 'bg-slate-50 border-slate-200 text-slate-700';
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F5F7FB] text-left font-sans pb-12 w-full relative">
      
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-[#0B1F5B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 border border-blue-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Primary Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-3xs w-full">
        <div>
          <h1 className="font-black text-[#0B1F5B] tracking-tight text-[22px] leading-none">Documents Manager</h1>
          <span className="text-slate-400 font-bold block mt-1.5 uppercase tracking-wider text-[10px]">
            Manage proposal documents and underwriting requests.
          </span>
        </div>
        <button onClick={fetchProposals} className="p-2 border rounded-xl hover:bg-slate-50 text-slate-500">
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      <main className="max-w-[1400px] w-full mx-auto px-6 py-6 space-y-6">
        
        {/* Summary metrics cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
          {[
            { label: 'Total Proposals', value: metrics.total, color: 'text-slate-900 border-slate-200' },
            { label: 'Documents Pending', value: metrics.pending, color: 'text-rose-600 border-rose-200 bg-rose-50/10' },
            { label: 'Awaiting Customer', value: metrics.awaitingCustomer, color: 'text-indigo-600 border-indigo-200 bg-indigo-50/10' },
            { label: 'Ready for Underwriting', value: metrics.readyForUnderwriting, color: 'text-emerald-600 border-emerald-200 bg-emerald-50/10' }
          ].map((kpi, idx) => (
            <div key={idx} className={`bg-white border rounded-2xl p-4 shadow-3xs flex flex-col items-start ${kpi.color}`}>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{kpi.label}</span>
              <span className="text-2xl font-black mt-1 block">{kpi.value}</span>
            </div>
          ))}
        </div>

        {/* Filters control block */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end text-xs font-bold text-slate-700">
          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1">
              <Search className="w-3 h-3" /> Search Customer / ID
            </label>
            <input 
              type="text" 
              placeholder="Search by name, proposal ID..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-semibold" 
            />
          </div>
          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Filter Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold">
              <option value="All">All Statuses</option>
              <option value="Complete">Complete</option>
              <option value="Awaiting Customer">Awaiting Customer</option>
              <option value="Underwriter Requested">Underwriter Requested</option>
              <option value="Ready to Submit">Ready to Submit</option>
              <option value="Submitted">Submitted</option>
            </select>
          </div>
          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Policy Scheme Type</label>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold">
              <option value="All">All Types</option>
              <option value="Term Life">Term Life</option>
              <option value="Whole Life">Whole Life</option>
              <option value="Micro-Insurance">Micro-Insurance</option>
            </select>
          </div>
          <div className="flex flex-col items-start w-full">
            <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Missing Documents</label>
            <select value={missingFilter} onChange={e => setMissingFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold">
              <option value="All">All</option>
              <option value="Yes">Yes (Has Missing)</option>
              <option value="No">No (Complete)</option>
            </select>
          </div>
        </div>

        {/* Proposals Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Table view */}
          <div className={`bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden transition-all duration-300 ${
            selectedProposalId ? 'lg:col-span-7' : 'lg:col-span-12'
          }`}>
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-left text-xs font-semibold">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider text-[10px] select-none">
                    <th className="py-3.5 px-4 w-[25%]">Lead Name</th>
                    <th className="py-3.5 px-4 w-[15%]">Proposal ID</th>
                    <th className="py-3.5 px-4 w-[15%]">Policy Type</th>
                    <th className="py-3.5 px-4 w-[15%]">Doc Progress</th>
                    <th className="py-3.5 px-4 w-[15%]">Current Status</th>
                    <th className="py-3.5 px-4 text-center w-[15%]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr><td colSpan="6" className="p-12 text-center"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#0B1F5B]" /></td></tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-16 text-center text-slate-400 font-bold bg-slate-50/30">
                        <AlertCircle className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                        <span>No pending document requests. All submitted proposals are up to date.</span>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(p => (
                      <tr 
                        key={p._id} 
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                          selectedProposalId === p._id ? 'bg-[#0B1F5B]/5 hover:bg-[#0B1F5B]/5' : ''
                        }`}
                        onClick={() => setSelectedProposalId(p._id)}
                      >
                        <td className="py-4 px-4 font-extrabold text-slate-900">{p.customerName}</td>
                        <td className="py-4 px-4 font-mono font-bold text-[#0B1F5B]">#{p._id.slice(-6).toUpperCase()}</td>
                        <td className="py-4 px-4">{p.policyType}</td>
                        <td className="py-4 px-4">
                          <span className="font-bold block text-slate-900">{p.uploadedCount} / {p.totalDocuments}</span>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">uploaded</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 border text-[9px] font-black uppercase tracking-wide rounded-full ${getStatusBadge(p.status)}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => setSelectedProposalId(p._id)}
                            className="bg-[#0B1F5B] hover:bg-black text-white font-black text-[10px] uppercase px-3 py-1.5 rounded-lg mx-auto"
                          >
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Slide-over / Details Panel inside main layout */}
          {selectedProposalId && selectedProposal && (
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-md p-5 space-y-6 relative animate-slide-up">
              
              {/* Close panel cross */}
              <button 
                onClick={() => setSelectedProposalId(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl border hover:bg-slate-50 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 border-b pb-4 text-left">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Proposal Workspace File</span>
                <h3 className="text-base font-black text-[#0B1F5B] tracking-tight">{selectedProposal.customerName}</h3>
                <span className="text-slate-400 font-mono block text-[9px] tracking-widest font-black uppercase mt-0.5">Ref: #{selectedProposal._id}</span>
              </div>

              {/* Customer Information & Proposal Info */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-650 text-left border-b pb-4">
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Email Address</span>
                  <span className="text-slate-900 font-bold block mt-0.5 truncate">{selectedProposal.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Phone Number</span>
                  <span className="text-slate-900 font-bold block mt-0.5">{selectedProposal.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Product Scheme</span>
                  <span className="text-slate-900 font-bold block mt-0.5">{selectedProposal.policyType}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Fulfillment Stage</span>
                  <span className="text-slate-900 font-bold block mt-0.5">{selectedProposal.status}</span>
                </div>
              </div>

              {/* Dedicated Underwriter Remarks Card */}
              {selectedProposal.underwriterRemarks && (
                <div className="bg-rose-50/20 border border-rose-150 rounded-xl p-4 space-y-3 text-left">
                  <div className="flex justify-between items-center select-none text-[10px] font-black uppercase tracking-wider text-rose-800">
                    <span className="flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Underwriter Remarks</span>
                    <span className="px-2 py-0.5 bg-rose-100 rounded text-[9px]">Priority: {selectedProposal.underwriterRemarks.priority}</span>
                  </div>
                  <div className="text-xs space-y-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase block">Requested Corrections</span>
                      <p className="font-bold text-slate-900 mt-0.5 leading-relaxed">{selectedProposal.underwriterRemarks.corrections}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase block">Missing / Flagged Docs</span>
                      <span className="font-semibold text-rose-700 mt-0.5 block">{selectedProposal.underwriterRemarks.missing}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-rose-100 text-[10px] font-black uppercase text-slate-400">
                      <span>Deadline to Resubmit</span>
                      <span className="text-rose-800">{selectedProposal.underwriterRemarks.deadline}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Required Checklist */}
              <div className="space-y-3 text-left">
                <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider block border-b pb-1.5 select-none">Required Documents Checklist</span>
                <div className="space-y-2.5">
                  {[
                    { key: 'panCard', label: 'PAN Card Proof', req: true },
                    { key: 'aadhaarCard', label: 'Aadhaar Card Proof', req: true },
                    { key: 'addressProof', label: 'Utility Bill Address Proof', req: false },
                    { key: 'incomeProof', label: 'Income Verification Proof', req: true },
                    { key: 'photograph', label: 'Photograph (Applicant)', req: true }
                  ].map(doc => (
                    <div key={doc.key} className="p-3 border border-slate-100 bg-slate-50/40 rounded-xl flex items-center justify-between text-xs font-semibold">
                      <div className="min-w-0 flex-1">
                        <span className="text-slate-900 font-extrabold block truncate">
                          {doc.label} {doc.req && <span className="text-rose-500 font-black">*</span>}
                        </span>
                        <span className="text-[9px] font-mono block truncate mt-0.5 select-all text-slate-450">
                          {selectedProposal.documents[doc.key] || 'Awaiting file upload'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {selectedProposal.documents[doc.key] ? (
                          <button 
                            onClick={() => handleDocMockUpload(doc.key)}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
                            title="Replace File"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleDocMockUpload(doc.key)}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-2 py-1 rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notify Customer Block */}
              <div className="pt-4 border-t border-slate-100 flex gap-3 text-xs font-bold select-none">
                <button
                  type="button"
                  onClick={handleOpenNotify}
                  className="flex-1 h-11 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-slate-450 animate-pulse" />
                  <span>Notify Customer</span>
                </button>

                {selectedProposal.status === 'Ready to Submit' && (
                  <button
                    onClick={() => {
                      showToast('Proposal resubmitted to Underwriter Case queue!');
                      setProposals(prev => prev.map(p => {
                        if (p._id === selectedProposalId) {
                          return {
                            ...p,
                            status: 'Submitted',
                            underwriterRemarks: null,
                            timeline: [
                              { title: 'Proposal Resubmitted', time: new Date().toISOString(), desc: 'Resubmitted for final clearance review.' },
                              ...p.timeline
                            ]
                          };
                        }
                        return p;
                      }));
                    }}
                    className="flex-1 h-11 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-100" />
                    <span>Resubmit Proposal</span>
                  </button>
                )}
              </div>

              {/* Activity Timeline */}
              <div className="border-t border-slate-100 pt-4 text-left space-y-4">
                <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider block select-none">Activity Timeline</span>
                <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 pl-4">
                  {selectedProposal.timeline.map((event, idx) => (
                    <div key={idx} className="relative text-xs text-left font-semibold">
                      <span className="absolute -left-[20px] top-1 w-2 h-2 rounded-full bg-slate-400 border border-white"></span>
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-extrabold">{event.title}</span>
                        <span className="text-[9px] text-slate-400 font-semibold mt-0.5">{new Date(event.time).toLocaleString()}</span>
                        <p className="text-[10px] text-slate-450 mt-1 leading-normal font-medium">{event.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Notify Customer Modal */}
      {isNotifyOpen && selectedProposal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-slide-up text-left text-xs font-semibold text-slate-650">
            <div className="flex justify-between items-center border-b pb-2 select-none">
              <h3 className="text-sm font-black text-[#0B1F5B] uppercase tracking-wider">Notify Customer</h3>
              <button onClick={() => setIsNotifyOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3.5">
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Customer Details</span>
                <span className="text-slate-900 font-bold block mt-0.5 text-sm">{selectedProposal.customerName}</span>
                <span className="text-slate-400 block mt-0.5">{selectedProposal.phone} • {selectedProposal.email}</span>
              </div>

              {/* Method Selector */}
              <div className="flex flex-col gap-1.5 select-none">
                <label className="text-slate-400 text-[9px] uppercase tracking-wider">Communication Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                    { id: 'sms', label: 'SMS Gateway', icon: PhoneCall },
                    { id: 'email', label: 'Email', icon: Mail }
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setNotifyMethod(method.id)}
                      className={`h-9 border rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        notifyMethod === method.id ? 'border-[#0B1F5B] bg-blue-50/10 text-[#0B1F5B]' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <method.icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Area */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-[9px] uppercase tracking-wider">Editable message template</label>
                <textarea 
                  value={notifyMsg} 
                  onChange={e => setNotifyMsg(e.target.value)} 
                  className="w-full h-36 p-3 bg-slate-50 border rounded-2xl outline-none font-sans font-semibold text-slate-900 leading-relaxed resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleSendNotification}
              className="w-full h-11 bg-[#0B1F5B] hover:bg-black text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 select-none"
            >
              <Send className="w-3.5 h-3.5 text-blue-200" />
              <span>Send Notification</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
