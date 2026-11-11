# GALLERIA ONE: Franchise Score Management & Intelligence Portal
> **A Brand Reinvention & Franchise Turnaround Strategy for Pizza Galleria**  
> *Flop-ortunity 2026: Pitch It Before U Ditch It*  
> **Team CASE!PLEASE**: Aarryan Kumar Khatri &bull; Kunal &bull; Aditya Kumar &bull; Vibhu Vedant Goel

[![Pure Veg](https://img.shields.io/badge/100%25-Pure%20Veg-16a34a.svg)](#)
[![Brand](https://img.shields.io/badge/Original%20Brand-Pizza%20Galleria-c8102e.svg)](https://pizzagalleria.in)
[![Shark Tank India](https://img.shields.io/badge/Shark%20Tank%20India-Season%203-f59e0b.svg)](#)
[![Platform](https://img.shields.io/badge/Galleria%20One-OS%20v2.6-6b1d2f.svg)](#)

---

## 📌 Executive Summary & Context

Pizza Galleria scaled rapidly from its origin in Gohana (2015) to **100+ outlets across India**, championing an authentic 100% pure vegetarian menu (with crowd favorites like Tandoori Paneer, Makhni Pizza, and the 24-inch Baahubali Pizza). However, during **Shark Tank India Season 3**, the brand walked away without a deal at a ₹50 Cr valuation due to:
* **FY25 Corporate Revenue:** ₹11.26 Cr
* **FY25 Corporate PAT:** ₹13.35 Lakhs (~1.19% net margin)
* **Core Management Question:** *Which locations actually earn the right to grow?*

### The Core Obstacles
1. **Visibility Gap:** No unified, audited store-by-store unit P&L dataset.
2. **Inconsistent Store Economics:** Wide disparity in local rent-to-sales burden (5% in Tier 3 vs 15%+ in prime Tier 1 malls), recipe cheese wastage, and third-party delivery commission drag.
3. **Capital Misallocation:** Rewarding gross sales volume instead of net contribution margin.

---

## 🎯 The Solution: GALLERIA ONE & The Decision Rail

GALLERIA ONE replaces pure store-count growth with a **selective franchise operating system** built on 3 Pillars:

### 1. The 100-Point Store Health Score
Every franchise outlet is dynamically scored across 4 core dimensions:
* **Economics (35 Points):** Verified unit contribution margin, rent-to-revenue ratio, net profit per month, Average Order Value (AOV).
* **Demand & Catchment (25 Points):** 90-day repeat customer rate, 2–3 km catchment penetration, daily order velocity.
* **Quality & Kitchen Operations (20 Points):** Paid bill POS capture (target &ge;98%), daily stock count compliance (&ge;90%), recipe BOM cheese/sauce variance (&le;4%).
* **Franchisee Capacity & Compliance (20 Points):** Staff training completion, owner cash runway buffer, FSSAI hygiene audit rating.

```
       100-POINT STORE HEALTH SCORE
   Economics: 35 | Demand: 25 | Quality: 20 | Compliance: 20
                         │
     ┌───────────────────┼───────────────────┐
     ▼                   ▼                   ▼
80–100 ACCELERATE     60–79 REPAIR        <60 REVIEW
Positive contribution  Funded 90-day       Validate location, cash
+ quality passed       operating plan      runway & food safety
[HQ Co-Investment]     [BOM Scoop Fix]     [Relocate / Exit]
```

### 2. The 3 Turnaround Pillars
* **Pillar 1: SELECT (“Capital follows contribution”):** Rank like-for-like franchisees on verified store contribution and audit scores. Fund high-performing stores and establish a structured 90-day repair lane.
* **Pillar 2: PULSE (“One data contract, not a forced POS replacement”):** Connect existing POS to recipe Bill of Materials (BOM) and daily closing stock counts. Standardize portions (Calibrated Scoops vs Pre-Sealed Pouches vs Returnable Trays).
* **Pillar 3: LOCAL (“Only promote incremental profitable demand”):** Geofenced 2–3 km catchment marketing focusing on 2–3 vegetarian hero SKUs and direct customer reorder pickup incentives.

---

## 💰 The ₹10.12 Lakh Pilot & Financial Bridge

Tested across a volunteer cohort of **10 franchise outlets**:
* **Capital Split:** HQ ₹4.05L (40%) : 10 Franchise Partners ₹6.07L (60%) = **₹10.12 Lakhs total**.
* **Baseline Contribution:** ₹17,440 / store / month (3.3% margin on 55 orders/day @ ₹320 AOV).
* **Turnaround Target:** ₹57,194 / store / month (9.8% margin on 58 orders/day @ ₹335 AOV).
* **Net Uplift:** **+₹39,754 / store / month** (+228% monthly contribution lift; ~2.5 month capital payback).

---

## 🚀 Interactive Prototype Features

1. **Franchise Decision Rail Dashboard:** Live overview of 10 pilot stores filtered by **Accelerate (4 stores)**, **Repair (4 stores)**, and **Review (2 stores)** with real unit metrics.
2. **Store Scorecard & Deep Dive:** Radar chart visualizing the 100-point breakdown, full monthly P&L waterfall (Sales &rarr; Food &rarr; Channel Fees &rarr; Labour &rarr; Rent &rarr; Royalty &rarr; Net Contribution), and operational diagnostics.
3. **Financial Bridge & What-If Simulator:** Interactive sliders for Daily Orders, AOV, Food Cost %, and Aggregator Fee % with instant recalculation of contribution and health scores.
4. **PULSE Kitchen & POS Audit Module:** Tracking POS bill capture (&ge;98%), cheese BOM variance (scoops vs pouches), and FSSAI hygiene status.
5. **12-Week Pilot Gantt & 4 Board Scale Gates:** Milestone roadmap from W1 Consent to W12 Scale Gate verification.
6. **100-Point Live Store Auditor:** Input tool for operators/auditors to evaluate new or existing stores.
7. **Website Integration Mode:** Demonstrates how this portal integrates seamlessly into `pizzagalleria.in` as an embedded operator dashboard.

---

## 🛠️ How to Run Locally

You can run this prototype directly in any browser:

### Option 1: Direct File Opening
Double-click `index.html` or open it in your browser of choice.

### Option 2: Local HTTP Server (Python)
```bash
# In the repository root:
python -m http.server 8080
```
Then visit: `http://localhost:8080` in your web browser.

---

## 🌐 Website Integration Guide (`pizzagalleria.in`)

This portal is architected to fit directly into Pizza Galleria's existing digital infrastructure:

### Method A: Micro-Frontend / Iframe Embed
Add the dashboard inside the authenticated Franchise Partner Portal:
```html
<iframe 
  src="https://partners.pizzagalleria.in/galleria-one" 
  width="100%" 
  height="900px" 
  frameborder="0"
  allow="clipboard-write">
</iframe>
```

### Method B: REST / GraphQL API Data Contract
The data models in `data.js` match standard POS JSON payloads from Petpooja, Posist, or UrbanPiper:
```json
{
  "storeId": "PG-101",
  "period": "2026-M03",
  "grossSales": 685000,
  "paidBillCaptureRate": 99.4,
  "dailyStockCountCompliance": 96.5,
  "cheeseVariancePct": 2.1,
  "healthScore": 94.2,
  "rail": "ACCELERATE"
}
```

---

## 👥 Authors & Acknowledgements

* **Team CASE!PLEASE** (Flop-ortunity 2026)
  * Aarryan Kumar Khatri
  * Kunal
  * Aditya Kumar
  * Vibhu Vedant Goel
* Original Brand Reference: **Pizza Galleria** (Shark Tank India Season 3, Gohana origin)
