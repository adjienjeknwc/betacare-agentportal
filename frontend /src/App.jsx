// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RegistrationProvider } from './context/RegistrationContext';
import { LeadProvider } from './context/LeadContext';
import { PolicyProvider } from './context/PolicyContext';

// Import Pages
import LoginPage from './pages/Login';
import AgentDashboard from './pages/AgentDashboard';
import LeadManagement from './pages/LeadManagement';
import RegisterFlow from "./pages/registerflow"; // Mapped to your clean lowercase filename
import LeadFunnelAnalytics from './pages/LeadFunnelAnalytics';
import DashboardLayout from './layouts/DashboardLayout';
import PremiumCalculator from './pages/analytics/PremiumCalculator';
import Quotations from './pages/Quotations';
import PolicyComparison from './pages/analytics/PolicyComparison';
import Settings from './pages/Settings';
import LeadDetails from './pages/LeadDetails';
import PolicyIssuanceCenter from './pages/PolicyIssuanceCenter';
import QuoteManagement from './pages/QuoteManagement'; 
import KYCDocumentVerification from './pages/KYCDocumentVerification';
import PoliciesDashboard from './pages/PoliciesDashboard';
import NewPolicyWorkflowFixed from './pages/NewPolicyWorkflowFixed';
import PolicyDetailsWorkspace from './pages/PolicyDetailsWorkspace';
import ProposalSubmissionConfirmation from './pages/ProposalSubmissionConfirmation';
import UnderwritingCases from './pages/UnderwritingCases';
import CustomerDashboard from './pages/CustomerDashboard';

// Import Consolidated Lead Form Component
import LeadIntakeForm from './components/registration/LeadIntakeForm';

// ==========================================================================
// BYPASS GUARD: Keeps already logged-in agents inside the workspace
// ==========================================================================
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

// PROTECTED WORKSPACE ROUTE GUARD
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme-mode');
    } else {
      document.documentElement.classList.remove('dark-theme-mode');
    }
  }, []);

  return (
    <AuthProvider>
      <RegistrationProvider>
        <LeadProvider>
          <PolicyProvider>
            <Router>
              <Routes>
                {/* PUBLIC ENTRY PORTALS */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterFlow /></PublicRoute>} />
                <Route path="/customer-dashboard/:policyId" element={<CustomerDashboard />} />
                
                {/* PROTECTED CONSOLIDATED CLIENT/LEAD INTAKE PATHS */}
                <Route path="/register/personal-details" element={<ProtectedRoute><LeadIntakeForm /></ProtectedRoute>} />
                <Route path="/policies/issued/:policyId" element={<ProtectedRoute><PolicyIssuanceCenter /></ProtectedRoute>} />
        
                {/* CORE AGENT DASHBOARD WORKSPACE INSIDE NESTED SIDEBAR WRAPPER */}
                <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<AgentDashboard />} />
                  <Route path="lead-management" element={<LeadManagement />} />
                  <Route path="lead-management/details/:leadId" element={<LeadDetails />} />
                  <Route path="lead-management/proposal-confirmation" element={<ProposalSubmissionConfirmation />} />
                  <Route path="lead-management/kyc-documents" element={<KYCDocumentVerification />} />
                  
                  {/* CLEANED UP QUOTE INTERFACE ROUTE */}
                  <Route path="lead-management/generate-quote/:leadId" element={<QuoteManagement />} />
                  
                  <Route path="lead-management/analytics" element={<LeadFunnelAnalytics />} />
                  <Route path="policies/underwriting" element={<UnderwritingCases />} />
                  
                  <Route path="quotations" element={<Quotations />} />
                  <Route path="quotations/policy-comparison" element={<PolicyComparison />} />
                  <Route path="analytics/premium-calculator" element={<PremiumCalculator />} />
                  
                  <Route path="policies" element={<PoliciesDashboard />} />
                  <Route path="policies/active" element={<PoliciesDashboard />} />
                  <Route path="policies/new" element={<NewPolicyWorkflowFixed />} />
                  <Route path="policies/:policyId" element={<PolicyDetailsWorkspace />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* GLOBAL FALLBACK CATCH ALL ROUTE */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </PolicyProvider>
        </LeadProvider>
      </RegistrationProvider>
    </AuthProvider>
  );
}