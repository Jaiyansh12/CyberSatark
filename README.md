# 🔐 CyberSatark – Phishing Awareness & Simulator Platform

<div align="center">

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Live-brightgreen?style=for-the-badge&logo=vercel)](https://cybersatark.vercel.app/)
[![Stars](https://img.shields.io/github/stars/OpenThreatLabs/CyberSatark?style=for-the-badge&color=green)](https://github.com/OpenThreatLabs/CyberSatark/stargazers)
[![Forks](https://img.shields.io/github/forks/OpenThreatLabs/CyberSatark?style=for-the-badge&color=green)](https://github.com/OpenThreatLabs/CyberSatark/network/members)
[![Issues](https://img.shields.io/github/issues/OpenThreatLabs/CyberSatark?style=for-the-badge&color=red)](https://github.com/OpenThreatLabs/CyberSatark/issues)
[![License](https://img.shields.io/github/license/OpenThreatLabs/CyberSatark?style=for-the-badge&color=blue)](LICENSE)

**CyberSatark** is a state-of-the-art cybersecurity awareness platform developed under the **WiCYS Club** as a hackathon initiative. It bridges the gap between complex technical threat concepts and everyday internet users through highly interactive, game-based learning experiences.

[**🌐 Explore Live Site**](https://cybersatark.vercel.app/) • [**📽️ View Walkthrough**](#-key-features) • [**⚙️ Local Setup**](#-installation-and-setup)

</div>

---

## 🎯 Project Motivation & Impact

Most security training software is either dry, theoretical, or aimed only at technical staff. **CyberSatark** democratizes security education by placing users directly in simulated real-world scenarios—such as dealing with fake SMS alerts, looking at suspicious login portals, and analyzing web addresses. 

By prioritizing **"Learn-by-Doing"**, CyberSatark helps everyday internet users build instinctive security habits, protecting them from financial fraud, identity theft, and data breaches.

---

## 🚀 Tech Stack

CyberSatark is built using a modern, fast, and highly interactive frontend architecture:

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js-16.x-000000?style=flat-square&logo=nextdotjs&logoColor=white) | Server-side rendering, routing, and modern App Router features. |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white) | Strict type safety for solid and bug-free state management. |
| **UI Library** | ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black) | Component-driven architecture. |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | Flexible and modern utilities for design systems. |
| **Animations** | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-Interactive-FF00C8?style=flat-square&logo=framer&logoColor=white) | Fluid UI transitions, canvas controls, and micro-interactions. |
| **Database & Auth** | ![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20DB-FFCA28?style=flat-square&logo=firebase&logoColor=black) | Real-time database storage and password-less user auth. |

---

## ✨ Key Features

### 🎭 Phishing Sandbox & Simulators
Interactive sandboxed screens that mimic popular services. Users must analyze elements (URL, sender domain, language urgency) and flag them:
*   **Social & Communication**: WhatsApp, Instagram, and Google login simulations.
*   **Media & Finance**: Netflix subscription alerts, Bank transfer alerts, and fake System popups.

### 🧠 Interactive Awareness Quiz
*   Over 400+ scenario-based quiz questions covering Phishing Fundamentals, Password Security, and Social Engineering.
*   Immediate interactive feedback with detailed explanations for correct and incorrect answers.
*   Track scores and leaderboard standing.

### 🔍 Cyber Threat Analysis Tools
*   **URL Checker**: Inspect URLs for suspicious keywords, misspellings, or unusual domains.
*   **Password Entropy Analyzer**: Computes real-time entropy scores to determine password complexity against brute-force attacks.
*   **Email Analyzer**: Explains headers and flags suspicious sender credentials.

### 📚 Bite-Sized Learning Modules
*   Interactive cybersecurity micro-courses covering various concepts (SMS Phishing, Spear Phishing, Social Engineering) designed for absolute beginners.
*   **Adaptive Viewport Navigation**: A scroll-dependent fixed navbar driving synchronized ease transitions that dynamically collapses screen margins to maximize readable real-estate on active learning HUD consoles.

---

## 📂 Project Architecture

```filepath
├── app/                      # Next.js App Router Pages
│   ├── about/                # Meet the Team and Platform Mission
│   ├── admin/                # Administrator Panel for Metrics
│   ├── auth/                 # Sign In / Sign Up Flow (Firebase Auth)
│   ├── dashboard/            # User Dashboard with Quiz Progress
│   ├── learn/                # Bite-sized educational courses
│   ├── quiz/                 # Quiz Engine and Category Selectors
│   ├── tools/                # Phishing & Security Analysis Tools
│   │   ├── email-checker/
│   │   ├── password-analyzer/
│   │   ├── phishing-analysis/
│   │   └── url-checker/
│   ├── globals.css           # Custom Scrollbars, Globals & Animations
│   └── layout.tsx            # Main root wrapper & providers
├── components/               # Shared Reusable UI Components
│   ├── simulation/           # Interactive Phishing Simulators
│   │   └── popups/           # Individual Brand/Platform Mock Popups
│   ├── BrandLogo.tsx         # Brand Identity SVGs
│   ├── cyberbackground.tsx   # Custom animated matrix-glow background
│   └── Navbar.tsx            # Navigation controls with dynamic active indicators
├── data/                     # Local Static Datasets (Quizzes, Examples)
└── lib/                      # Configuration Files (Firebase/Firestore Connection)
```

---

## ⚙️ Installation and Setup

### Prerequisites
*   Node.js (v18.x or above)
*   npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/OpenThreatLabs/CyberSatark.git
cd CyberSatark
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 👥 Contributors

Thanks to the following creators for building CyberSatark:

| Contributor | GitHub Profile | Role |
| :--- | :--- | :--- |
| **Abhinav Mishra** | [@NotSoAbhinav](https://github.com/NotSoAbhinav) | Full Stack & Systems Integration |
| **Jaiyansh Dhaulakhandi** | [@Jaiyansh-4n6](https://github.com/Jaiyansh-4n6) | Frontend Lead & UX Developer |
| **Piyush Kumar** | [@piyushkumar-git](https://github.com/piyushkumar-git) | Database & Auth Integration |
| **Ritambhar Advait** | [@RitambharAdvait](https://github.com/RitambharAdvait) | Tooling & Password Entropy Algorithmist |

---

## 🤝 Open Source & Community Health

We welcome contributions of all kinds! Please refer to the following documents for guidelines:

- **[Contributing Guidelines](CONTRIBUTING.md)** – Setup instructions, PR workflows, and architecture map.
- **[Code of Conduct](CODE_OF_CONDUCT.md)** – Standards for fostering an inclusive community.
- **[Security Policy](SECURITY.md)** – Disclosure policy for reporting vulnerabilities.
- **[License](LICENSE)** – Open-source MIT License details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

