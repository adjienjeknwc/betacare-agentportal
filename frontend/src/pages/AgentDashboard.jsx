// src/pages/AgentDashboard.jsx
import React, { useState, useEffect } from "react";
import { fetchFromPortal } from "./api.js"; 
import { 
  UserPlus, FileCheck, Shield, ClipboardList, Loader2, Plus, 
  TrendingUp, Activity, AlertCircle, CheckCircle2, ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({ leads: 0, quotes: 0, underwriting: 0, policies: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const loadIsolatedMetricsAndActivities = async () => {
      try {
        setLoading(true);
        // Fetch metrics
        const resMetrics = await fetchFromPortal('/dashboard/metrics');
        if (resMetrics.success) {
          setMetrics(resMetrics.metrics);
        } else {
          setError('Failed to resolve context pipeline profiles.');
        }

        const token = localStorage.getItem('agent_token');
        
        // Fetch recent leads
        const resLeads = await fetch('/api/leads', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataLeads = await resLeads.json();
        
        // Fetch recent underwriting cases
        const resUnderwriting = await fetch('/api/underwriting', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataUnderwriting = await resUnderwriting.json();

        // Fetch recent policies
        const resPolicies = await fetch('/api/policies', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataPolicies = await resPolicies.json();

        // Merge and build timeline
        const timeline = [];

        if (dataLeads.success && dataLeads.data) {
          dataLeads.data.slice(0, 3).forEach(ld => {
            timeline.push({
              id: ld._id,
              type: 'lead',
              title: `New Lead Registered`,
              description: `Lead created for ${ld.customerName || ld.fullName || 'Unnamed Client'}`,
              time: new Date(ld.createdAt),
              badge: 'LEAD',
              badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
            });
          });
        }

        if (dataUnderwriting.success && dataUnderwriting.data) {
          dataUnderwriting.data.slice(0, 3).forEach(c => {
            timeline.push({
              id: c._id,
              type: 'underwriting',
              title: `Underwriting Case Created`,
              description: `Case #${c._id.slice(-6).toUpperCase()} for ${c.customerName} set to ${c.status}`,
              time: new Date(c.createdAt),
              badge: 'UNDERWRITING',
              badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
            });
          });
        }

        if (dataPolicies.success && dataPolicies.data) {
          dataPolicies.data.slice(0, 3).forEach(p => {
            timeline.push({
              id: p._id,
              type: 'policy',
              title: `Policy Issued & Active`,
              description: `Policy #${p.policyNumber} issued for ${p.customerName}`,
              time: new Date(p.createdAt),
              badge: 'POLICY',
              badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
            });
          });
        }

        // Sort by time descending
        timeline.sort((a, b) => b.time - a.time);
        setRecentActivities(timeline.slice(0, 5));

      } catch (err) {
        console.error("Dashboard hydration error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadIsolatedMetricsAndActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-slate-500 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B1F5B]" />
        <span className="text-xs font-bold uppercase tracking-wider">Hydrating Workspace Logs...</span>
      </div>
    );
  }

  const isBrandNewAccount = metrics.leads === 0 && metrics.quotes === 0 && metrics.policies === 0;

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#F5F7FB] min-h-screen text-left w-full font-sans antialiased pb-12">
      {/* Title Header row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F5B] tracking-tight">Agent Workspace Hub</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Context isolated production database console</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => navigate('/register/personal-details')} 
            className="h-10 px-4 bg-[#0B1F5B] hover:bg-black text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Register New Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'Leads', val: metrics.leads, icon: UserPlus, color: 'text-blue-600 bg-blue-50 border-blue-100', route: '/lead-management' },
          { key: 'Quotes', val: metrics.quotes, icon: ClipboardList, color: 'text-amber-600 bg-amber-50 border-amber-100', route: '/quotations' },
          { key: 'Underwriting', val: metrics.underwriting, icon: Shield, color: 'text-purple-600 bg-purple-50 border-purple-100', route: '/policies/underwriting' },
          { key: 'Active Policies', val: metrics.policies, icon: FileCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', route: '/active-policies' }
        ].map(card => {
          const IconComponent = card.icon;
          return (
            <div 
              key={card.key} 
              onClick={() => navigate(card.route)}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs flex items-center justify-between cursor-pointer hover:border-[#0B1F5B] hover:shadow-xs transition-all select-none"
            >
              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">{card.key}</span>
                <span className="text-3xl font-black text-slate-900 tracking-tight block">{card.val}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${card.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {isBrandNewAccount ? (
        <div className="w-full bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-5 my-8">
          <div className="w-16 h-16 bg-slate-50 border rounded-2xl flex items-center justify-center mx-auto text-slate-400 shadow-3xs">
            <UserPlus className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">No leads found.</h3>
            <p className="text-xs text-slate-400 font-medium">Your account parameters are initialized successfully. Create your first lead to deploy insurance pipeline funnels.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/lead-management')}
            className="h-10 px-5 bg-[#0B1F5B] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer focus:outline-none"
          >
            Create First Lead Prospect Record
          </button>
        </div>
      ) : (
        /* Rich Dashboards Columns */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Main Segment (Commission Goals Tracker + Visual SVG Collections Graph) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Target achievement commission pulse removed */}

            {/* Premium Analytics SVG Bar Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-black text-[#0B1F5B] uppercase tracking-wider">Premium Collections Dashboard</h3>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase select-none">Quarterly Matrix</span>
              </div>
              
              <div className="h-48 flex items-end justify-between gap-6 pt-6 px-4 select-none relative">
                {/* Grid Lines */}
                <div className="absolute inset-x-0 bottom-6 border-b border-slate-100 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-20 border-b border-slate-100 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-34 border-b border-slate-100 pointer-events-none" />

                {[
                  { label: 'Q1 Analytics', val: 120000, height: 'h-[25%]', color: 'bg-blue-500/20 hover:bg-blue-500 text-blue-600 border border-blue-500/30' },
                  { label: 'Q2 Fulfillment', val: 240000, height: 'h-[50%]', color: 'bg-indigo-500/20 hover:bg-indigo-500 text-indigo-600 border border-indigo-500/30' },
                  { label: 'Q3 Underwriting', val: 380000, height: 'h-[75%]', color: 'bg-purple-500/20 hover:bg-purple-500 text-purple-600 border border-purple-500/30' },
                  { label: 'Q4 Projection', val: 520000, height: 'h-[95%]', color: 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-600 border border-emerald-500/30' },
                ].map(bar => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group z-10 cursor-pointer">
                    <div className={`w-full ${bar.height} ${bar.color} rounded-t-lg transition-all duration-300 flex items-center justify-center relative`}>
                      <span className="absolute -top-6 text-[9px] font-black text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-1.5 py-0.5 rounded shadow">₹{bar.val.toLocaleString('en-IN')}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase text-slate-400">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column Segment (Action Checklists + Live Database Activities Feed) */}
          <div className="space-y-6">
            
            {/* Action Tasks checklist removed */}

            {/* Recent Live Activity Logs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="text-xs font-black text-[#0B1F5B] uppercase tracking-wider">Real-time Activity Feed</h3>
                <Activity className="w-4 h-4 text-slate-300" />
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {recentActivities.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 font-medium space-y-2 select-none">
                    <AlertCircle className="w-6 h-6 mx-auto text-slate-300" />
                    <p className="text-[11px]">No recent database activities logged.</p>
                  </div>
                ) : (
                  recentActivities.map((act, index) => (
                    <div key={index} className="flex items-start gap-3 text-xs font-semibold relative">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        act.type === 'lead' ? 'bg-blue-500' : act.type === 'underwriting' ? 'bg-purple-500' : 'bg-emerald-500'
                      }`} />
                      <div className="min-w-0 flex-1 text-left">
                        <h4 className="font-bold text-slate-900 leading-snug">{act.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-normal">{act.description}</p>
                        <span className="text-[9px] text-slate-400 block mt-1">{act.time.toLocaleTimeString()} | {act.time.toLocaleDateString()}</span>
                      </div>
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