# Betacare Life Insurance Agent Portal
### 📊 A Business Analyst Case Study & Operational Dashboard System

A modern, high-fidelity agent operational workspace hub and customer registration ecosystem designed to optimize insurance sales cycles, automate underwriting bottlenecks, and deliver real-time pipeline visibility for **Betacare Life Insurance**.

---

## 💼 Business Analyst Case Study

### 1. **Background & Context**
Betacare Life Insurance, a premium provider of Term, Whole Life, and ULIP (Unit Linked Insurance Plan) policies, faced severe operational bottlenecks in their agent sales channels. Agents relied on disconnected systems, manual spreadsheets, and physical paperwork to move prospects through the conversion funnel:
`Prospect Lead Intake` ➡️ `Manual Quote Calculation` ➡️ `Underwriting Risk Evaluation` ➡️ `Manual Policy Generation`.

### 2. **The Problem Statement**
- **Long Turnaround Times (TAT)**: The average cycle time from initial prospect contact to policy activation exceeded **14 business days** due to manual handoffs between sales and underwriting divisions.
- **High Lead Drop-off Rates**: Disjointed quotation sharing tools allowed prospects to seek competitor options before a final quote proposal was delivered.
- **Underwriting Bottlenecks**: 70% of low-risk applications (e.g., term policies for young applicants with no medical complications) were queued for manual assessment, causing backlogs.
- **Zero Real-Time Visibility**: Agents had no visual metrics tracking their performance, pipeline values, or active collections.

### 3. **The Solution Design (Consolidated Agent Portal)**
This portal was designed as a **digital transformation initiative** to unify agent actions into a single workflow, automate low-risk underwriting, and provide real-time metrics dashboards.

#### **Business Process Flow (As-Is vs. To-Be)**
```
[AS-IS FLOW]  
Prospect Contact -> Paper Form -> Data Entry -> Underwriting Queue (7 Days) -> Review -> Approved -> Manual Payment -> Policy Active (14 Days)

[TO-BE FLOW (Automated Portal)]  
Portal Lead Intake -> Instant Validation -> Auto-Quote Gen -> Instant Underwriting (Auto-Approved) -> Digital Payment -> Instant Active Policy (<15 Mins)
```

---

## 📝 Business Requirements Document (BRD) Highlights

### 📋 Functional Requirements (FR)
- **FR-1: Standardized Lead Acquisition Wizard**: The system must enforce a 6-stage validation funnel mapping customer profiles, contact credentials, financial parameters, and uploaded identity proofs (Aadhaar/PAN) to ensure 100% data integrity before database insertion.
- **FR-2: Automated Rules-Engine Underwriting**: The platform must automatically evaluate risk factors (e.g., Age, Income-to-Sum-Assured ratio) to route cases to **"Auto-Approved"**, **"Pending KYC Verification"**, or **"Underwriter Manual Review"** within milliseconds of form submission.
- **FR-3: Fast Quote Engine**: The agent must be able to generate and compare Term, Whole Life, and ULIP options instantly from a prospect's dashboard, outputting premium calculations on-screen.
- **FR-4: Live Pipeline Analytics**: The home workspace must display interactive KPI modules (active leads, pending cases, active policies) and aggregate premium collections trend analytics directly from the MongoDB registry.

### 🔒 Non-Functional Requirements (NFR)
- **NFR-1: Regulatory Compliance**: The interface must integrate explicit IRDAI statutory compliance checkboxes and enforce secure, encrypted storage protocols for PAN and Aadhaar records.
- **NFR-2: User Experience (UX) Accessibility**: The system must provide custom theme toggling (Light/Dark Mode) to reduce eye strain during extended portal usage.
- **NFR-3: Viewport Integrity**: The agent login terminal must adapt to diverse monitor resolutions without vertical overflow scrolling, maximizing focus.

---

## 📈 Business Value Delivered

| Metric | Pre-Implementation (As-Is) | Post-Implementation (To-Be) | Target Impact |
|---|---|---|---|
| **Turnaround Time (TAT)** | 14 Days | **< 15 Minutes** | 98.9% Reduction in Cycle Time |
| **Manual Underwriting Overhead** | 100% of cases | **30% of cases** (Manual Review) | 70% Automation of Standard Risks |
| **Form Submission Error Rate** | 24% (Missing data/invalid attachments) | **0%** (Enforced front-end validation) | 100% Data Quality Improvement |
| **Sales Conversion Rate** | 12.4% | **18.6% (Projected)** | 50% Higher Lead-to-Policy Conversion |

---

## 🌟 Key Functional Features Built

### 1. **Consolidated Lead Intake Wizard**
- A **6-step registration flow** for client profiling:
  1. Personal Details (Full name, DOB, demographics)
  2. Contact Information (Email, Phone, address alignment)
  3. Financial Details (Annual income, employment, ID checks)
  4. Insurance Parameters (Plan type, Sum Assured, payment frequency)
  5. Document Uploads (PAN Card, Aadhaar Card, Income Proof)
  6. Final Review & Compliance declaration
- Fully validated client-side and server-side model constraints.

### 2. **Interactive Agent Workspace Hub**
- **KPI Counters**: Live analytics mapping Leads, Quotes, Underwriting cases, and Active Policies.
- **Premium Collections Trend Chart**: Proportional, interactive SVG vertical bar chart displaying monthly collections from active database records with hover tooltips.
- **Real-time Live Activity Feed**: Dynamically aggregates registered leads, underwriting approvals, and policy issuance timelines directly from MongoDB.

### 3. **Underwriting & Policy Issuance Center**
- Auto-generates underwriting cases upon lead submission.
- Underwriter action panels to approve/reject cases with custom notes.
- One-click policy issuance generating active policy numbers and digital customer dashboards.

### 4. **Modern UI Design System**
- **Splash Loader**: Immersive loading screen featuring spring-animated logo cards, sequential text reveals, and gradient progress sweeps built using `framer-motion`.
- **Native Dark Mode**: Custom dark theme overrides mapped to a dark slate (`#0B0F19`) color palette with glowing translucent badges.
- **Responsive Layout**: Sidebar navigation system with collapse support.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Libraries |
|---|---|---|
| **Frontend** | React 18 (Vite) | Tailwind CSS, Framer Motion, Lucide Icons, React Router DOM |
| **Backend** | Node.js (Express) | Mongoose (MongoDB), JSON Web Tokens (JWT), CORS |
| **Database** | MongoDB | Mongoose Schemas (User, Lead, Quote, Underwriting, Policy) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (Local or Atlas)

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/adjienjeknwc/betacare-agentportal.git
   cd betacare-agentportal
   ```

2. **Configure Environment Parameters**
   - In `/backend`, create a `.env` file:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/betacare
     JWT_SECRET=your_secure_jwt_token_secret
     ```

3. **Install Dependencies & Start Backend**
   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Install Dependencies & Start Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
