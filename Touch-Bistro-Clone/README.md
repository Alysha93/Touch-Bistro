# TouchBistro Clone • Premium Glassmorphism POS

[**🚀 LAUNCH LIVE DEMO (Localhost Port 3000)**](http://localhost:3000)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Glassmorphism](https://img.shields.io/badge/Design-Glassmorphism-FF69B4?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)

**TouchBistro Clone** is a high-performance, enterprise-grade restaurant management system. This project features a state-of-the-art **Glassmorphism Design System**, combining vibrant mesh gradients with sophisticated frosted glass interfaces to deliver a premium, tablet-first hospitality experience.

---

## 📺 Workflow Demonstration
![TouchBistro Workflow Demo](./public/touch_bistro_workflow.webp)
*Interactive walkthrough showcasing the Glassmorphism transition and real-time synchronization.*

---

## 📸 Premium Glassmorphism UI

### 1. Interactive Floorplan
A translucent, high-contrast floorplan using vibrant status indicators and background blur for maximum legibility.
![Floorplan](./public/assets/screenshots/floorplan_glass.png)

### 2. Artisanal Order Interface
Features studio-lit food photography integrated into a multi-pane frosted glass layout with intelligent seat-based tracking.
![Order Interface](./public/assets/screenshots/order_interface_glass.png)

### 3. Kitchen Display System (KDS)
Mission-critical display with translucent ticket cards and priority-glow notification system.
![KDS](./public/assets/screenshots/kds_glass.png)

### 4. Admin Intelligence Dashboard
Frosted glass widgets and charts provide real-time business analytics and staff management.
![Settings Dashboard](./public/assets/screenshots/dashboard.png)

### 5. Customer Facing Display (CFD)
A retail-grade Guest experience using premium mesh gradients and glass interaction panels for checkout.
![CFD](./public/assets/screenshots/cfd_glass.png)

---

## 📜 The Build: Technical Narrative & Demo Script

This clone was engineered to exceed the visual and functional standards of modern POS systems. Below is the narrative of the architectural journey:

1.  **Phase 1: Foundation & Relational Schema**: Initialized with Next.js 15 and Drizzle ORM. We designed a robust relational schema supporting real-time state sync across `staff`, `tables`, `orders`, and `menuItems`.
2.  **Phase 2: Artisanal Asset Initiative**: Curated and custom-generated a library of 30+ artisanal menu images using **Studio Lighting** photography styles to ensure every menu item looks mouth-watering and professional.
3.  **Phase 3: Real-Time Sync Strategy**: Implemented server-side synchronization for the three core pillars:
    -   **POS Terminal**: Table management and ticket logic.
    -   **KDS (Kitchen)**: Priority-based ticket queues with color-coded "Bump" timers.
    -   **CFD (Customer)**: Transparent checkout experience for guest verification and gratuity.
4.  **Phase 4: Analytics & Resilience**: Built an Admin suite with PIN-based authentication and real-time sales/labor tracking widgets.
5.  **Phase 5: Glassmorphism Rebranding**: Overhauled the entire UI/UX from a standard flat theme to a premium **Glassmorphism Design System**. This involved implementing a global mesh gradient engine, sophisticated `backdrop-filter` blurs, and translucent component tokens.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router) with Custom Glassmorphism CSS Framework.
- **Database**: Drizzle ORM + SQLite for local performance and persistence.
- **Styling**: Vanilla CSS with HSL-tailored vibrant gradients and frosted glass effects.
- **Animations**: CSS keyframes for fluid, high-end transitions.

---

## 🚀 Installation & Setup

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Alysha93/Touch-Bistro.git
   cd Touch-Bistro
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
This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for the full text.

---

## 👨‍💻 Developed by Antigravity
*Pushing the boundaries of agentic coding and premium design.*
