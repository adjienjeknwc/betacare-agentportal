import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ClosedLeadsDetail() {
  const navigate = useNavigate();
  const closedLeads = [
    { date: '2026-06-08', customer: 'Arjun Mehta', product: 'Term Life', premium: '₹45,000', agent: 'Agent John', region: 'Mumbai' },
    { date: '2026-06-05', customer: 'Rohan Joshi', product: 'Term Life', premium: '₹92,000', agent: 'Agent John', region: 'Mumbai' }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F5F7FB] p-6 space-y-4">
      <header className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="p-1.5 bg-white border rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-semibold text-[#0B1F5B]">Converted Pipeline Roster (140 Total)</h1>
        </div>
        <button className="bg-[#0B1E46] hover:bg-[#07132e] text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors">
          <Download className="w-3.5 h-3.5" /> Export Ledger CSV
        </button>
      </header>

      <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase">
            <tr>
              <th className="py-3 px-5">ISSUED DATE</th>
              <th className="py-3 px-5">CUSTOMER PROFILE</th>
              <th className="py-3 px-5">POLICY TYPE</th>
              <th className="py-3 px-5 text-right">PREMIUM VALUE</th>
              <th className="py-3 px-5">ASSIGNED BROKER</th>
              <th className="py-3 px-5">TERRITORY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {closedLeads.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-5 text-slate-400 font-mono font-bold">{item.date}</td>
                <td className="py-3 px-5 font-bold text-slate-900">{item.customer}</td>
                <td className="py-3 px-5 text-slate-600">{item.product}</td>
                <td className="py-3 px-5 text-right font-bold text-emerald-600">{item.premium}</td>
                <td className="py-3 px-5 text-slate-500">{item.agent}</td>
                <td className="py-3 px-5">
                  <span className="px-2 py-0.5 bg-slate-100 border rounded-md text-[10px] font-bold text-slate-600">
                    {item.region}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}