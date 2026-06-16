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
// Import Components
import LeadPersonalDetails from './components/lead/LeadPersonalDetails';
import LeadContactInfo from './components/lead/LeadContactInfo';
import LeadFinancialDetails from './components/lead/LeadFinancialDetails';
import LeadInsuranceInfo from './components/lead/LeadInsuranceInfo';
import LeadDocumentsUpload from './components/lead/LeadDocumentsUpload';
import LeadReviewSubmit from './components/lead/LeadReviewSubmit';

export default function App() {
  return (
    <AuthProvider>
      <RegistrationProvider>
        <LeadProvider>
        <PolicyProvider>
          <Router>
            <Routes>
              {/* PUBLIC ENTRY PORTAL */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* PROTECTED WIZARD PATHWAY */}
              <Route path="/register/personal-details" element={<ProtectedRoute><LeadPersonalDetails /></ProtectedRoute>} />
              <Route path="/register/contact-info" element={<ProtectedRoute><LeadContactInfo /></ProtectedRoute>} />
              <Route path="/register/financial" element={<ProtectedRoute><LeadFinancialDetails /></ProtectedRoute>} />
              <Route path="/register/insurance" element={<ProtectedRoute><LeadInsuranceInfo /></ProtectedRoute>} />
              <Route path="/register/documents" element={<ProtectedRoute><LeadDocumentsUpload /></ProtectedRoute>} />
              <Route path="/register/review" element={<ProtectedRoute><LeadReviewSubmit /></ProtectedRoute>} />
              <Route path="policies/issued/:policyId" element={<PolicyIssuanceCenter />} />

              {/* CORE AGENT DASHBOARD */}
              <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<AgentDashboard />} />
                <Route path="lead-management" element={<LeadManagement />} />
                <Route path="lead-management/details/:leadId" element={<LeadDetails />} />
                <Route path="lead-management/proposal-confirmation" element={<ProposalSubmissionConfirmation />} />
                <Route path="lead-management/kyc-documents" element={<KYCDocumentVerification />} />
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

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
          </PolicyProvider>
        </LeadProvider>
      </RegistrationProvider>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}