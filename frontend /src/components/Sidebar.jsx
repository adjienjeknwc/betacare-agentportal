// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, UserCheck, FolderKanban, ShieldAlert, 
  FileCheck, CalendarClock, Users, BarChart3, Settings, 
  ChevronDown, ChevronRight, Shield
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Manage open/close states for nested sub-menus
  const [isNewBusinessOpen, setIsNewBusinessOpen] = useState(true);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(true);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-[260px] h-screen bg-[#0B1F5B] text-white flex flex-col fixed left-0 top-0 z-50 border-r border-blue-950 font-sans select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-blue-900/50 shrink-0">
        <Shield className="w-5 h-5 text-blue-400 fill-current" />
        <span className="font-black text-xs tracking-wider uppercase text-white">
          ABCD Life Insurance
        </span>
      </div>

      {/* Navigation Matrix Link Groupings */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 text-xs font-bold text-blue-100/80">
        
        {/* Dashboard Link */}
        <button
          onClick={() => navigate('/dashboard')}
          className={`w-full h-9 flex items-center gap-3 px-3 rounded-xl transition-all ${
            isActive('/dashboard') ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-blue-900/40 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Dashboard</span>
        </button>

        {/* Lead Management Link */}
        <button
          onClick={() => navigate('/lead-management')}
          className={`w-full h-9 flex items-center gap-3 px-3 rounded-xl transition-all ${
            isActive('/lead-management') ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-blue-900/40 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4 shrink-0" />
          <span>Lead Management</span>
        </button>

        {/* --- CATEGORY 1: NEW BUSINESS DROPDOWN DECK --- */}
        <div className="space-y-0.5">
          <button
            onClick={() => setIsNewBusinessOpen(!isNewBusinessOpen)}
            className="w-full h-9 flex items-center justify-between px-3 rounded-xl hover:bg-blue-900/30 text-blue-300 font-black uppercase text-[10px] tracking-wider mt-2"
          >
            <span>New Business</span>
            {isNewBusinessOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>

          {isNewBusinessOpen && (
            <div className="pl-3 space-y-0.5 border-l border-blue-900/40 ml-4 mt-0.5">
              <button
                onClick={() => navigate('/quotations')}
                className={`w-full h-8 flex items-center gap-2.5 px-3 rounded-lg text-left transition-all ${
                  isActive('/quotations') ? 'bg-blue-600/60 text-white font-extrabold' : 'hover:text-white'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Quotations</span>
              </button>

              

              <button
                onClick={() => navigate('/policies/underwriting')}
                className={`w-full h-8 flex items-center gap-2.5 px-3 rounded-lg text-left transition-all ${
                  isActive('/policies/underwriting') ? 'bg-blue-600/60 text-white font-extrabold' : 'hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Underwriting Cases</span>
              </button>
            </div>
          )}
        </div>

        {/* --- CATEGORY 2: POLICIES DROPDOWN DECK --- */}
        <div className="space-y-0.5">
          <button
            onClick={() => setIsPoliciesOpen(!isPoliciesOpen)}
            className="w-full h-9 flex items-center justify-between px-3 rounded-xl hover:bg-blue-900/30 text-blue-300 font-black uppercase text-[10px] tracking-wider mt-2"
          >
            <span>Policies</span>
            {isPoliciesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>

          {isPoliciesOpen && (
            <div className="pl-3 space-y-0.5 border-l border-blue-900/40 ml-4 mt-0.5">
              <button
                onClick={() => navigate('/policies')}
                className={`w-full h-8 flex items-center gap-2.5 px-3 rounded-lg text-left transition-all ${
                  isActive('/policies') ? 'bg-blue-600/60 text-white font-extrabold' : 'hover:text-white'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Active Policies</span>
              </button>

              
            </div>
          )}
        </div>

        {/* Global Standalone Link Rows */}
        <div className="pt-2 border-t border-blue-900/40 mt-2 space-y-1">
          

          

          <button onClick={() => navigate('/settings')} className={`w-full h-9 flex items-center gap-3 px-3 rounded-xl transition-all ${
            isActive('/settings') ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-blue-900/40 hover:text-white'
          }`}>
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* User Profile Footer Section */}
      <div className="p-4 border-t border-blue-900/50 bg-blue-950/40 flex items-center gap-3 shrink-0 text-left">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs text-white shrink-0 border border-blue-400/30">
          RM
        </div>
        <div className="min-w-0 flex-1">
          <span className="block text-xs font-black text-white truncate">Rohan Mishra</span>
          <span className="block text-[10px] font-bold text-blue-400 truncate">Premier Advisor</span>
        </div>
      </div>
    </div>
  );
}