// src/layouts/WorkspaceLayout.jsx
import React from 'react';
import { Search, Bell, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WorkspaceLayout({ 
  children, 
  pageTitle, 
  showBackButton = false, 
  backDestination = -1,
  showSearchBar = true,
  rightActions = null 
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex bg-[#F5F7FB] font-sans antialiased text-slate-900 selection:bg-blue-500/10">
      
      {/* 1. FIXED VIEWPORT SIDEBAR SPACER SHELL */}
      <div className="w-[260px] h-screen shrink-0 sticky top-0 bg-[#0B1F5B] z-30" />

      {/* 2. CORE VIEWPORT CONTENT TRACK EXPANSION ENGINE */}
      <div className="flex-1 min-h-screen flex flex-col min-w-0">
        
        {/* UNIFIED COMPACT TOP NAVBAR HEADER */}
        <header className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20 select-none gap-4">
          
          {/* Left Block: Navigation & Standardized Title Hierarchy */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {showBackButton && (
              <button 
                type="button" 
                onClick={() => navigate(backDestination)}
                className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 transition-colors shrink-0 focus:outline-none"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            
            {/* FIXED HEADING TARGET BLUE AND CLEAN COMPACT DENSITY */}
            <h1 className="text-2xl font-bold text-[#0B1F5B] tracking-tight leading-none whitespace-nowrap">
              {pageTitle}
            </h1>

            {showSearchBar && (
              <div className="w-full max-w-xs relative flex items-center min-w-[160px] ml-3 hidden sm:flex">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="Search operational files..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-1.5 text-xs outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 placeholder:text-slate-400"
                />
              </div>
            )}
          </div>

          {/* Right Block: Actions, Notifications, Profile Context */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Page-Specific Action Button Mount Point (e.g. + Create New Lead) */}
            {rightActions && <div className="flex items-center">{rightActions}</div>}

            <div className="h-5 w-px bg-slate-200 shrink-0"></div>

            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg relative shrink-0 focus:outline-none">
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span>
            </button>

            <div className="flex items-center gap-2.5 max-w-[180px] min-w-0 select-none">
              <div className="text-right hidden md:block min-w-0">
                <h4 className="text-xs font-bold text-slate-900 leading-none truncate">Agent John</h4>
                <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase block mt-0.5 truncate">PREMIUM BROKER</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#0F478D] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
                AJ
              </div>
            </div>
          </div>

        </header>

        {/* STANDARDIZED MAIN WORKSPACE CANVAS CONTAINER VIEWPORT */}
        <main className="flex-1 w-full px-6 py-6 overflow-y-auto space-y-5 relative">
          {children}
        </main>

      </div>
    </div>
  );
}