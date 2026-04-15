# TouchBistro Clone • Premium Glassmorphism POS

[**🚀 LAUNCH LIVE DEMO (Localhost Port 3000)**](http://localhost:3000)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Glassmorphism](https://img.shields.io/badge/Design-Glassmorphism-FF69B4?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)

**TouchBistro Clone** is a high-performance, enterprise-grade restaurant management system. This repository features a state-of-the-art **Glassmorphism Design System**, combining vibrant mesh gradients with sophisticated frosted glass interfaces to deliver a premium, tablet-first hospitality experience.

---

## 📺 Workflow Demonstration
![TouchBistro Workflow Demo](./Touch-Bistro-Clone/public/touch_bistro_final_demo.webp)
*Interactive walkthrough showcasing the Glassmorphism transition and real-time synchronization.*

---

## 📸 Premium Glassmorphism UI Showcase
A curated visual summary of the core ProServe POS modules featuring high-definition captures of the Glassmorphism design system in action.

| Component | Description | Visual Interface |
| :--- | :--- | :--- |
| **🔐 Login Terminal** | Sophisticated entry point featuring frosted glass panels and vibrant Teal/Pink branding. | ![Login](./Touch-Bistro-Clone/public/screenshots/login.png) |
| **🗺️ Floorplan** | Translucent, high-contrast dining room layout with real-time status indicators and background blur. | ![Floorplan](./Touch-Bistro-Clone/public/screenshots/floorplan.png) |
| **🍽️ Order Interface** | Multi-pane frosted glass layout with seat-based tracking and artisanal menu photography. | ![Order](./Touch-Bistro-Clone/public/screenshots/order_interface.png) |
| **⚠️ Safety Alerts** | Integrated high-visibility allergy warnings and menu constraint notifications. | ![Allergy](./Touch-Bistro-Clone/public/screenshots/allergy_alert.png) |
| **👨‍🍳 Kitchen (KDS)** | Mission-critical KDS displaying translucent ticket cards and real-time bump timer tracking. | ![KDS](./Touch-Bistro-Clone/public/screenshots/kds.png) |
| **📈 Intelligence** | Management dashboard featuring real-time HSL-tailored sales and labor analytics. | ![Dashboard](./Touch-Bistro-Clone/public/screenshots/settings_dashboard.png) |
| **👥 Staff Config** | Enterprise-grade staff management suite for role-based permissions and access security. | ![Staff](./Touch-Bistro-Clone/public/screenshots/settings_staff.png) |
| **💳 Checkout** | Retail-grade guest checkout using premium mesh gradients for perfect readability. | ![Checkout](./Touch-Bistro-Clone/public/screenshots/checkout.png) |

---

## 📂 Project Structure
This repository stores its core logic within the [**Touch-Bistro-Clone**](./Touch-Bistro-Clone) directory.

### Core Modules
- **Main Register (`/pos`)**: Staff Login via PIN keypad, interactive Floorplan, complex Table Ordering features, and receipt Checkout with Loyalty integration.
- **Kitchen Display System (`/kds`)**: Back-of-house ticketing interface with specialized station filtering, ticket bumping, and elapsed-time visualization.
- **Customer Facing Display (`/cfd`)**: Tablet interface that syncs to active Register checkouts, prompting for on-screen Tips and Signatures.
- **Online Takeout Web App (`/online`)**: Customer-facing menu portal supporting shopping carts and Loyalty point retrieval.

---

## 🛠️ Technology Stack & Setup

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Alysha93/Touch-Bistro.git
   cd Touch-Bistro/Touch-Bistro-Clone
   npm install
   ```

2. **Initialize Database**:
   ```bash
   npm run db:push
   npm run seed
   ```

3. **Launch Terminal**:
   ```bash
   npm run dev
   ```

---

## 📄 License
This project is licensed under the **MIT License**.

---

## 👨‍💻 Developed by Antigravity
*Pushing the boundaries of agentic coding and premium design.*
