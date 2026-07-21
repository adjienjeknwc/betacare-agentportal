// src/pages/LeadManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFromPortal } from './api.js';
import { UserPlus, Search, Flame, Thermometer, Snowflake, RefreshCw } from 'lucide-react';

export default function LeadManagement() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, hot: 0, warm: 0, quotes: 0 });
  const [loading, setLoading] = useState(true);

  const syncIsolatedData = async () => {
    try {
      const [leadsRes, metricsRes] = await Promise.all([
        fetchFromPortal('/leads'),
        fetchFromPortal('/leads/dashboard/metrics')
      ]);
      if (leadsRes.success) setLeads(leadsRes.data || []);
      if (metricsRes.success) setMetrics(metricsRes.metrics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { syncIsolatedData(); }, []);

  return (
    <div className="flex-1 min-h-screen bg-[#F8FAFC] p-8 text-left text-xs text-slate-700 select-none">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lead Management</h1>
          <p className="text-slate-400 font-medium mt-1">Live Tenant Database Console Grid Profile Scope Context</p>
        </div>
        <button onClick={() => navigate('/register/personal-details')} className="h-11 px-6 bg-[#0B1F5B] text-white font-bold rounded-xl flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Create New Lead
        </button>
      </div>

      {/* DYNAMIC KPI GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
        {[
          { title: 'Total Leads', value: metrics.total || 0, color: 'border-l-blue-600' },
          { title: 'Hot Leads', value: metrics.hot || 0, color: 'border-l-orange-500' },
          { title: 'Warm Leads', value: metrics.warm || 0, color: 'border-l-amber-500' },
          { title: 'Cold Leads', value: metrics.cold || 0, color: 'border-l-blue-300' },
          { title: 'Quotations', value: metrics.quotes || 0, color: 'border-l-purple-600' }
        ].map((kpi, i) => (
          <div key={i} className={`bg-white border border-l-4 ${kpi.color} rounded-2xl p-4 shadow-3xs flex flex-col justify-between`}>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">{kpi.title}</span>
            <span className="text-2xl font-black text-slate-950 block mt-1.5 leading-none">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* LEAD TEMPERATURE EXPLANATION BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-3xs text-left">
        <h3 className="text-xs font-black text-[#0B1F5B] uppercase tracking-wider mb-3">Understanding Lead Temperature</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
          <div className="p-3.5 rounded-xl border border-orange-100 bg-orange-50/5">
            <span className="text-orange-600 font-extrabold flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" /> Hot Leads</span>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-semibold">
              High purchase intent. Customer is actively looking for immediate coverage, has higher premium budget suitability, and is primed for conversion.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/5">
            <span className="text-amber-600 font-extrabold flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-amber-500" /> Warm Leads</span>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-semibold">
              Moderate engagement. Prospect is interested, has interacted with illustrations, but needs follow-up, product comparisons, or additional consultation.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/5">
            <span className="text-blue-500 font-extrabold flex items-center gap-1.5"><Snowflake className="w-3.5 h-3.5 text-blue-500" /> Cold Leads</span>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-semibold">
              Low immediate intent. Prospect is unresponsive, has minor interest, or has not engaged with communications. Needs nurturing.
            </p>
          </div>
        </div>
      </div>

      {/* DATA DATA ROWS MAIN REGISTER */}
      <div className="bg-white border rounded-2xl shadow-xs overflow-hidden w-full">
        <table className="hidden md:table w-full border-collapse text-left table-fixed">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-400 font-black uppercase text-[11px]">
              <th className="p-4 w-[20%]">Lead Tracking ID</th>
              <th className="p-4 w-[25%]">Customer Name</th>
              <th className="p-4 w-[20%]">Product Plan Interest</th>
              <th className="p-4 w-[15%]">Lead Temp</th>
              <th className="p-4 w-[20%]">Pipeline Status</th>
            </tr>
          </thead>
          <tbody className="font-semibold text-slate-700 divide-y">
            {loading ? (
              <tr><td colSpan="5" className="p-12 text-center"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#0B1F5B]" /></td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan="5" className="p-16 text-center text-slate-400 font-bold bg-slate-50/30">No leads found in this isolated account.</td></tr>
            ) : (
              leads.map(lead => (
                <tr key={lead._id} onClick={() => navigate(`/lead-management/details/${lead._id}`)} className="hover:bg-slate-50/40 transition-colors cursor-pointer">
                  <td className="p-4 font-mono text-blue-600 font-bold truncate">#{lead._id.slice(-6).toUpperCase()}</td>
                  <td className="p-4 font-black text-slate-900">{lead.customerName}</td>
                  <td className="p-4 text-slate-500">{lead.productInterest}</td>
                  <td className="p-4">
                    <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                      lead.temperature === 'Hot' ? 'text-orange-600 bg-orange-50 border-orange-100' :
                      lead.temperature === 'Warm' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                      'text-blue-500 bg-blue-50 border-blue-100'
                    }`}>
                      {lead.temperature || 'Warm'}
                    </span>
                  </td>
                  <td className="p-4"><span className="bg-slate-100 border px-2.5 py-0.5 rounded-md text-[10px] uppercase">{lead.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* MOBILE STACKED CARDS VIEW */}
        <div className="md:hidden divide-y divide-slate-100 bg-white">
          {loading ? (
            <div className="p-8 text-center"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#0B1F5B]" /></div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-bold bg-slate-50/30">No leads found in this isolated account.</div>
          ) : (
            leads.map(lead => (
              <div key={lead._id} onClick={() => navigate(`/lead-management/details/${lead._id}`)} className="p-4 space-y-2 hover:bg-slate-50/40 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-blue-600 font-bold">#{lead._id.slice(-6).toUpperCase()}</span>
                  <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                    lead.temperature === 'Hot' ? 'text-orange-600 bg-orange-50 border-orange-100' :
                    lead.temperature === 'Warm' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                    'text-blue-500 bg-blue-50 border-blue-100'
                  }`}>
                    {lead.temperature || 'Warm'}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">{lead.customerName}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{lead.productInterest}</p>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-400 font-bold">Pipeline Status</span>
                  <span className="bg-slate-100 border px-2 py-0.5 rounded text-[9px] uppercase font-bold text-slate-600">{lead.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}