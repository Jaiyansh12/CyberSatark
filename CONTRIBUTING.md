# Contributing to CyberSatark 🛡️

First off, thank you for considering contributing to **CyberSatark**! Projects like this thrive because of open-source contributors like you.

CyberSatark is a modern, interactive cybersecurity awareness and diagnostics platform built by **OpenThreatLabs**. Whether you are fixing a bug, adding new threat intelligence features, improving accessibility, or refining the UI/UX, all contributions are welcome!

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm** / **yarn** / **pnpm**
- **Git**

### 1. Fork & Clone the Repository
Click the **Fork** button at the top right of the GitHub repository page, then clone your fork locally:
```bash
git clone https://github.com/YOUR-USERNAME/CyberSatark.git
cd CyberSatark
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Firebase configuration parameters:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see CyberSatark in action.

---

## 🛠️ Stack & Architecture Overview

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS Design System
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Authentication & Database**: Firebase Auth & Firestore

### Directory Structure
- `app/`: Next.js App Router pages and API endpoints
  - `app/learn/page.tsx`: Interactive Training Academy & Incident Simulator
  - `app/tools/`: Cybersecurity diagnostic sub-tools (URL Scanner, Email Checker, Password Analyzer, Threat Intelligence, Phishing Analyzer)
  - `app/dashboard/page.tsx`: User Dashboard & metrics
  - `app/about/page.tsx`: OpenThreatLabs information & team
- `components/`: Reusable UI components (Navbar, Backgrounds, Popups)
- `lib/`: Firebase initialization and database helper routines

---

## 💡 Ways to Contribute

1. **Good First Issues**: Check out issues tagged with `good-first-issue` for accessible tasks.
2. **New Security Tools**: Build a new client-side security diagnostic tool (e.g., QR Code Phishing Checker, Domain WHOIS Inspector).
3. **UI/UX Refinements**: Improve accessibility (a11y), responsive mobile views, or micro-interactions.
4. **Documentation**: Improve code comments, fix typos, or update the README.

---

## 📋 Pull Request (PR) Guidelines

1. **Branch Naming**: Use descriptive branch names:
   - `feature/add-qr-scanner`
   - `fix/learn-page-mobile-padding`
   - `docs/update-readme`
2. **Build Verification**: Before submitting a PR, make sure the production build compiles with zero errors:
   ```bash
   npm run build
   ```
3. **Submit Your PR**: Push your branch to your fork and create a Pull Request detailing:
   - What changes were made.
   - Screenshots/GIFs of UI changes (if applicable).
   - The issue number your PR resolves (e.g., `Fixes #12`).

---

## 💬 Community & Support

Have questions or ideas? Feel free to open a [GitHub Issue](https://github.com/OpenThreatLabs/CyberSatark/issues) or reach out via OpenThreatLabs discussions.

Thank you for helping build a safer internet! 🌐
