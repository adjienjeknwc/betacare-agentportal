import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLead } from '../../context/LeadContext';
import { CheckCircle2, User, FileText, Calendar, ArrowLeft } from 'lucide-react';

export default function LeadSuccessState() {
  const navigate = useNavigate();
  const { resetLeadFlow } = useLead();

  const handleReturnAction = () => {
    resetLeadFlow();
    navigate('/lead-management');
  };

  return (
    // FULL MODAL COVER OVERLAY AREA: Matches production confirmation states perfectly
    <div className="w-full h-full bg-slate-50 flex items-center justify-center p-6 overflow-y-auto select-none">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-lg space-y-5 animate-scaleUp">
        
        {/* Verification Success Graphic Banner Indicator */}
        <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-xl flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 fill-current text-white" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-black text-[#0B1E46] tracking-tight">Lead Created Successfully!</h2>
          <span className="inline-block text-xs font-mono font-bold bg-slate-100 border border-slate-200 text-slate-800 px-2 py-0.5 rounded">
            Lead ID: LD-20455
          </span>
        </div>

        <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
          The profile for <strong className="text-slate-800 font-bold">Sarah Jenkins</strong> has been added to your primary directory. You can now proceed with policy analysis or schedule a discovery call.
        </p>

        {/* Action Trigger Anchors List Navigation Block */}
        <div className="flex flex-col gap-2 pt-2">
          <button type="button" className="w-full bg-[#0F478D] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs hover:bg-blue-700 flex items-center justify-center gap-2">
            <User className="w-3.5 h-3.5" /> <span>View Lead Profile</span>
          </button>
          <button type="button" className="w-full bg-white text-slate-700 border border-slate-200 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50">
            <FileText className="w-3.5 h-3.5 text-slate-400" /> <span>Generate Proposal</span>
          </button>
          <button type="button" className="w-full bg-white text-slate-700 border border-slate-200 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> <span>Schedule Follow-up</span>
          </button>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <button type="button" onClick={handleReturnAction} className="text-xs font-bold text-[#0F478D] hover:underline flex items-center gap-1.5 mx-auto">
            <ArrowLeft className="w-3.5 h-3.5" /> <span>Return to Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
}