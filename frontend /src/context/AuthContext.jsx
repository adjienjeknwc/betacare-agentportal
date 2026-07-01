// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AuthContext = createContext(null);

function SplashLoader() {
  return (
    <div className="fixed inset-0 bg-[#0b132b] flex flex-col items-center justify-center z-[9999] overflow-hidden select-none font-sans antialiased">
      {/* Background glowing gradients */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_60%)] pointer-events-none"
      />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Glowing logo card container */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotate: -45 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            duration: 0.8 
          }}
          className="w-32 h-32 rounded-[28px] bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.15)] relative p-5 border border-white/10"
        >
          <motion.img 
            src="/logo.png" 
            alt="Betacare Life Logo" 
            className="w-full h-full object-contain"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>

        {/* Text layout */}
        <div className="text-center space-y-1 mt-2">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white text-xl font-black tracking-[0.2em] uppercase"
          >
            BETACARE LIFE
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.6 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-blue-100 text-[10px] font-black uppercase tracking-widest"
          >
            Agent Workspace Portal
          </motion.p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-48 h-1 bg-[#1e293b] rounded-full overflow-hidden relative mt-2 border border-slate-800">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 bottom-0 w-2/3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full"
          />
        </div>
        
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-slate-500 text-[8px] font-bold uppercase tracking-[0.15em] mt-1"
        >
          Securing Connection Tunnel...
        </motion.span>
      </div>
    </div>
  );
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [activeRole, setActiveRole] = useState('Sales Agent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate state parameters from local storage layers on initial DOM load
    const token = localStorage.getItem('agent_token');
    const profile = localStorage.getItem('agent_profile');
    const role = localStorage.getItem('agent_role');

    if (token && profile) {
      setIsAuthenticated(true);
      setCurrentAgent(JSON.parse(profile));
    }
    if (role) {
      setActiveRole(role);
    }
    
    // Artificial delay to let the premium loader display
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const login = (token, agentData) => {
    localStorage.setItem('agent_token', token);
    localStorage.setItem('agent_profile', JSON.stringify(agentData));
    const userRole = agentData.role || 'Sales Agent';
    localStorage.setItem('agent_role', userRole);
    localStorage.setItem('agentName', `${agentData.firstName} ${agentData.lastName}`);
    setIsAuthenticated(true);
    setCurrentAgent(agentData);
    setActiveRole(userRole);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setCurrentAgent(null);
    setActiveRole('Sales Agent');
  };

  const switchRole = (role) => {
    localStorage.setItem('agent_role', role);
    setActiveRole(role);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentAgent, activeRole, switchRole, login, logout, loading }}>
      {loading ? <SplashLoader /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}