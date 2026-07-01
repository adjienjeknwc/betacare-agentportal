# Betacare Life Insurance Agent Portal

A modern, high-fidelity agent operational workspace hub and customer registration ecosystem designed for **Betacare Life Insurance**.

---

## 🌟 Key Features

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

## ⚙️ Project Structure

```bash
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB Connection setup
│   │   ├── controllers/     # Controller handlers (Auth, Leads, Policies, Quotes)
│   │   ├── middleware/      # JWT Authentication guards
│   │   ├── models/          # Mongoose collection schemas
│   │   └── routes/          # Express REST endpoint maps
│   └── server.js            # Node API entrypoint
└── frontend/
    ├── public/              # Logo and static public assets
    ├── src/
    │   ├── components/      # Shared layout components (Sidebar, Lead Wizard)
    │   ├── context/         # React Context stores (Auth, Lead, Policy)
    │   ├── pages/           # View screens (Dashboard, Login, Underwriting)
    │   ├── App.jsx          # Route tree definitions
    │   └── index.css        # Tailwind styling & dark mode sheets
```

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

---

## 🔒 Security & Compliance
- **Authentication**: JWT-protected API layers requiring authorization header checks.
- **SSL Encryption**: Configured for HTTPS connection tunnels.
- **Regulatory Mapping**: Features IRDAI member tags and compliance sign-offs for advisor operations.
