# Pizza Galleria — Franchise Operations & Score Intelligence Portal (Galleria One)

> **Internal Corporate Operations & Franchise Score Management System**  
> Designed for Pizza Galleria HQ Operations, Regional Managers, and Franchise Partners.  
> Official Brand: [Pizza Galleria (`pizzagalleria.in`)](https://pizzagalleria.in) &bull; 100% Pure Vegetarian Pizza Chain &bull; 100+ Outlets Nationwide.

[![100% Pure Veg](https://img.shields.io/badge/100%25-Pure%20Veg-16a34a.svg)](#)
[![Brand](https://img.shields.io/badge/Brand-Pizza%20Galleria-c8102e.svg)](https://pizzagalleria.in)
[![System](https://img.shields.io/badge/System-Galleria%20One%20OS-0f172a.svg)](#)

---

## 📌 System Overview

The **Galleria One Franchise Score Management System** is a company-internal operations dashboard built directly for **Pizza Galleria**. It replaces unstandardized store tracking with a centralized, data-driven framework to monitor store-level contribution margins, kitchen portion consistency, POS billing integrity, and local customer repeat rates across all franchise locations.

### Key Objectives
* **Unit Profitability First:** Prioritize verified store contribution and healthy unit economics over raw outlet count.
* **Integrated Decision Rail & Store Scorecard:** Group outlets into actionable management tiers (*Accelerate*, *Repair*, *Review*) with instant drill-down into store P&L and operational metrics.
* **POS & Kitchen Waste Control (PULSE):** Connect cloud POS feeds with recipe Bill of Materials (BOM) to track cheese/sauce variance and daily closing inventory compliance.
* **Interactive Store Health Calculator:** Real-time field scoring engine with one-click demo profiles for regional managers.

---

## 🎯 The 100-Point Store Health Scoring Model

Every franchise outlet is evaluated against a 100-point composite health score:

| Dimension | Points | Core Evaluated Metrics |
| :--- | :---: | :--- |
| **1. Store Economics** | **35** | Net monthly store contribution (₹), contribution margin %, rent-to-sales burden ratio, and Average Order Value (AOV). |
| **2. Local Demand & Repeat** | **25** | 90-day repeat customer rate, 2–3 km catchment order velocity, and direct app order share. |
| **3. Kitchen & POS Operations** | **20** | Paid bill POS capture rate (target &ge;98%), recipe BOM cheese/sauce variance (target &le;4%), and daily closing stock count compliance (&ge;90%). |
| **4. Partner Compliance & Capacity** | **20** | FSSAI hygiene audit ratings, mandatory kitchen staff training completion, and franchisee working capital runway buffer. |

```
                       100-POINT STORE HEALTH SCORE
         Economics: 35 | Demand: 25 | Kitchen: 20 | Compliance: 20
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
   80–100 ACCELERATE           60–79 REPAIR              <60 REVIEW
Positive unit contribution     Funded 90-day operating   Underperforming unit:
+ passed quality audits.       plan to eliminate waste   Validate cash runway &
Eligible for territory         (portion scoops & rent    hygiene. Formulate
expansion & co-investment.     renegotiation).           relocation or exit.
```

---

## 🖥️ Portal Modules & Features

### 1. Integrated Franchise Score Management (Rail + Scorecard)
* **Unified Master-Detail Layout:** The store directory and detailed scorecard live in a single cohesive view.
* **Instant Filtering & Search:** Filter outlets by decision rail (`Accelerate`, `Repair`, `Review`) or search by store name, city, or partner.
* **Store Scorecard:** Displays the overall health score, dynamic radar chart, operational KPI tiles (Revenue, Margin, Cheese Variance, Bill Capture, Rent Ratio, Repeat Rate), prescribed action plan, and audited monthly P&L statement.

### 2. Kitchen & POS Audit Monitor (PULSE Data Contract)
* **Real-time Ingestion Tracking:** Automated compliance tracking for POS paid bill reconciliation and closing stock counts.
* **Kitchen Portion Standardization Trials:** Comparative analysis of Calibrated Scoops, Commissary Pre-Sealed Pouches, and Returnable Trays.

### 3. Store Health Calculator & Field Audit Tool
* An interactive tool for Regional Operations Managers to assess prospective franchise sites or run on-site audits, with 3 one-click scenario profiles (*Accelerate*, *Repair*, *Review*) and real-time metric indicators.

---

## 🛠️ Running Locally

1. **Direct Browser Execution:**
   * Double-click `index.html` to run in any browser without needing build tools or external servers.
2. **Local HTTP Server (Python):**
   ```bash
   cd C:\Users\aarry\.gemini\antigravity\scratch\prototype-flopportunity-
   python -m http.server 8080
   ```
   Open `http://localhost:8080` in your web browser.

---

## 📂 Repository Contents

* `index.html` — The primary single-page corporate operations dashboard.
* `style.css` — Pizza Galleria brand styling, pure veg badges, custom scrollbars, and decision rail theme.
* `data.js` — Real-world operational data model for 10 franchise stores.
* `app.js` — Core application logic: master-detail interactivity, radar charts, search/filter, and scoring engine.
* `README.md` — System documentation and deployment guide.
