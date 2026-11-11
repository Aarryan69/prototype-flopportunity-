/**
 * Pizza Galleria - Franchise Score Management & Operations Portal
 * Internal System Application Logic
 */

let selectedStoreId = "PG-101";
let currentFilter = "ALL";
let currentSearch = "";
let currentDirSearch = "";
let integratedRadarChartInstance = null;

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  renderHomeAlerts();
  renderStoreList();
  selectStore(selectedStoreId);
  renderPulseTable();
  renderDirectory();
  computeLiveAudit();

  if (window.lucide) {
    lucide.createIcons();
  }
});

// TAB SWITCHING
function switchTab(tabId) {
  // Hide all tab views
  document.querySelectorAll(".tab-view").forEach(view => {
    view.classList.add("hidden");
    view.classList.remove("block");
  });

  // Show active view
  const targetView = document.getElementById(`view-${tabId}`);
  if (targetView) {
    targetView.classList.remove("hidden");
    targetView.classList.add("block");
  }

  // Update nav buttons
  document.querySelectorAll(".portal-tab-btn").forEach(btn => {
    btn.classList.remove("portal-tab-active", "text-brand-red");
    btn.classList.add("text-slate-500");
  });

  const activeBtn = document.getElementById(`tab-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add("portal-tab-active", "text-brand-red");
    activeBtn.classList.remove("text-slate-500");
  }

  // Resize charts if tab is score-management
  if (tabId === "score-management" && integratedRadarChartInstance) {
    setTimeout(() => integratedRadarChartInstance.resize(), 50);
  }

  // Scroll to top of main view smoothly
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (window.lucide) {
    lucide.createIcons();
  }
}

// RENDER HOME BULLETINS / ALERTS
function renderHomeAlerts() {
  const container = document.getElementById("homeAlertsContainer");
  if (!container) return;
  container.innerHTML = "";

  NETWORK_ALERTS.forEach(alert => {
    let tagBadge = "bg-amber-50 text-amber-800 border-amber-200";
    if (alert.color === "emerald") tagBadge = "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (alert.color === "blue") tagBadge = "bg-blue-50 text-blue-800 border-blue-200";

    const div = document.createElement("div");
    div.className = "p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-2";
    div.innerHTML = `
      <div>
        <div class="flex items-center space-x-2 mb-1">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded border ${tagBadge}">${alert.tag}</span>
          <span class="text-[11px] text-slate-400">&bull; ${alert.date}</span>
        </div>
        <h4 class="text-xs font-bold text-slate-900">${alert.title}</h4>
        <p class="text-xs text-slate-600 mt-1 leading-relaxed">${alert.desc}</p>
      </div>
      <span class="text-[10px] text-slate-400 font-medium shrink-0">${alert.level}</span>
    `;
    container.appendChild(div);
  });
}

// RENDER STORE LIST (LEFT COLUMN)
function renderStoreList() {
  const container = document.getElementById("storeListContainer");
  if (!container) return;

  const q = currentSearch.toLowerCase().trim();
  const filtered = STORES_DATA.filter(store => {
    const matchesFilter = (currentFilter === "ALL") || (store.rail === currentFilter);
    const matchesSearch = !q || 
      store.name.toLowerCase().includes(q) || 
      store.city.toLowerCase().includes(q) || 
      store.partnerName.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // Update summary counts
  const accelerateCount = STORES_DATA.filter(s => s.rail === "ACCELERATE").length;
  const repairCount = STORES_DATA.filter(s => s.rail === "REPAIR").length;
  const reviewCount = STORES_DATA.filter(s => s.rail === "REVIEW").length;

  const elAcc = document.getElementById("summary-count-accelerate");
  const elRep = document.getElementById("summary-count-repair");
  const elRev = document.getElementById("summary-count-review");
  if (elAcc) elAcc.innerText = accelerateCount;
  if (elRep) elRep.innerText = repairCount;
  if (elRev) elRev.innerText = reviewCount;

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `<div class="p-6 text-center text-xs text-slate-400">No stores found matching your query.</div>`;
    return;
  }

  filtered.forEach(store => {
    const item = document.createElement("div");
    const isSelected = store.id === selectedStoreId;
    let railBadgeClass = "badge-repair";
    if (store.rail === "ACCELERATE") railBadgeClass = "badge-accelerate";
    if (store.rail === "REVIEW") railBadgeClass = "badge-review";

    item.className = `p-3.5 cursor-pointer transition hover:bg-slate-50 border-l-4 ${isSelected ? "store-item-active" : "border-l-transparent"}`;
    item.onclick = () => selectStore(store.id);

    item.innerHTML = `
      <div class="flex items-start justify-between">
        <div>
          <h4 class="text-xs font-bold text-slate-900">${store.name}</h4>
          <span class="text-[11px] text-slate-500">${store.city}, ${store.state} &bull; ${store.tier}</span>
        </div>
        <div class="text-right">
          <span class="text-xs font-black px-2 py-0.5 rounded-full ${store.totalScore >= 80 ? 'bg-emerald-100 text-emerald-800' : (store.totalScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800')}">
            ${store.totalScore.toFixed(1)}
          </span>
        </div>
      </div>

      <div class="mt-2 flex items-center justify-between text-[11px]">
        <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold ${railBadgeClass}">
          ${store.rail}
        </span>
        <span class="text-slate-500">
          Contrib: <strong class="${store.financialBridge.netStoreContribution > 40000 ? 'text-emerald-600' : (store.financialBridge.netStoreContribution > 15000 ? 'text-amber-600' : 'text-red-600')}">₹${(store.financialBridge.netStoreContribution).toLocaleString('en-IN')}</strong> (${store.financialBridge.contributionMargin.toFixed(1)}%)
        </span>
      </div>
    `;

    container.appendChild(item);
  });
}

// SELECT STORE & POPULATE SCORECARD (RIGHT COLUMN)
function selectStore(storeId) {
  selectedStoreId = storeId;
  renderStoreList();

  const store = STORES_DATA.find(s => s.id === storeId);
  if (!store) return;

  // Header Elements
  document.getElementById("cardStoreName").innerText = store.name;
  document.getElementById("cardStatusBadge").innerText = store.statusBadge;
  document.getElementById("cardStoreMeta").innerText = `${store.city}, ${store.state} (${store.tier}) • Est. ${store.openedYear} • Partner: ${store.partnerName} (${store.id})`;

  // Total Score
  const scoreEl = document.getElementById("cardTotalScore");
  scoreEl.innerText = `${store.totalScore.toFixed(1)} / 100`;

  let railBadgeClass = "badge-repair";
  if (store.rail === "ACCELERATE") railBadgeClass = "badge-accelerate";
  if (store.rail === "REVIEW") railBadgeClass = "badge-review";

  document.getElementById("cardRailBadge").innerHTML = `
    <span class="text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider ${railBadgeClass}">
      ${store.rail} RAIL
    </span>
  `;

  // 4 Pillar Bars & Text
  const b = store.scoreBreakdown;
  document.getElementById("cardEcoScore").innerText = `${b.economics.toFixed(1)} / 35`;
  document.getElementById("cardEcoBar").style.width = `${(b.economics / 35) * 100}%`;

  document.getElementById("cardDemandScore").innerText = `${b.demand.toFixed(1)} / 25`;
  document.getElementById("cardDemandBar").style.width = `${(b.demand / 25) * 100}%`;

  document.getElementById("cardQualityScore").innerText = `${b.qualityOps.toFixed(1)} / 20`;
  document.getElementById("cardQualityBar").style.width = `${(b.qualityOps / 20) * 100}%`;

  document.getElementById("cardComplianceScore").innerText = `${b.capacityCompliance.toFixed(1)} / 20`;
  document.getElementById("cardComplianceBar").style.width = `${(b.capacityCompliance / 20) * 100}%`;

  // 6 KPI Tiles
  document.getElementById("kpiRevenue").innerText = `₹${(store.monthlyRevenue).toLocaleString("en-IN")}`;
  document.getElementById("kpiMargin").innerText = `${store.financialBridge.contributionMargin.toFixed(1)}%`;
  document.getElementById("kpiCheeseVar").innerText = `${store.cheeseVariancePct.toFixed(1)}%`;
  document.getElementById("kpiBillCapture").innerText = `${store.billCaptureRate.toFixed(1)}%`;
  document.getElementById("kpiRentRatio").innerText = `${store.rentRatio.toFixed(1)}% of rev`;
  document.getElementById("kpiRepeatRate").innerText = `${store.repeatCustomerRate90d.toFixed(1)}%`;

  // Action Plan
  document.getElementById("cardActionPlan").innerText = store.actionPlan;

  // Monthly P&L Table
  const fb = store.financialBridge;
  const plTable = document.getElementById("cardPlTable");
  plTable.innerHTML = `
    <tr class="bg-slate-50 font-semibold text-slate-800">
      <td class="py-2 px-3">Gross Monthly Store Revenue</td>
      <td class="py-2 px-3 text-right">₹${fb.grossSales.toLocaleString("en-IN")}</td>
    </tr>
    <tr>
      <td class="py-1.5 px-3 text-slate-600">− Food & Packaging Materials (${store.foodPackagingPct}%)</td>
      <td class="py-1.5 px-3 text-right text-red-500 font-medium">−₹${fb.foodCost.toLocaleString("en-IN")}</td>
    </tr>
    <tr>
      <td class="py-1.5 px-3 text-slate-600">− Aggregator Commission & Delivery Fees</td>
      <td class="py-1.5 px-3 text-right text-red-500 font-medium">−₹${fb.channelFees.toLocaleString("en-IN")}</td>
    </tr>
    <tr>
      <td class="py-1.5 px-3 text-slate-600">− Store Labour & Staff Salaries</td>
      <td class="py-1.5 px-3 text-right text-red-500 font-medium">−₹${fb.labourCost.toLocaleString("en-IN")}</td>
    </tr>
    <tr>
      <td class="py-1.5 px-3 text-slate-600">− Store Rent (${store.rentRatio}% rent-to-sales)</td>
      <td class="py-1.5 px-3 text-right text-red-500 font-medium">−₹${fb.rent.toLocaleString("en-IN")}</td>
    </tr>
    <tr>
      <td class="py-1.5 px-3 text-slate-600">− Utilities, Electricity & Power Backup</td>
      <td class="py-1.5 px-3 text-right text-red-500 font-medium">−₹${fb.utilities.toLocaleString("en-IN")}</td>
    </tr>
    <tr>
      <td class="py-1.5 px-3 text-slate-600">− Company Franchise Royalty (3%)</td>
      <td class="py-1.5 px-3 text-right text-red-500 font-medium">−₹${fb.royalty.toLocaleString("en-IN")}</td>
    </tr>
    <tr>
      <td class="py-1.5 px-3 text-slate-600">− Cloud POS & Local Catchment Marketing</td>
      <td class="py-1.5 px-3 text-right text-red-500 font-medium">−₹${(fb.posData + fb.marketing).toLocaleString("en-IN")}</td>
    </tr>
    <tr class="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
      <td class="py-2.5 px-3 text-xs">Net Audited Store Contribution</td>
      <td class="py-2.5 px-3 text-right text-sm ${fb.netStoreContribution > 40000 ? 'text-emerald-600' : (fb.netStoreContribution > 15000 ? 'text-amber-600' : 'text-red-600')}">
        ₹${fb.netStoreContribution.toLocaleString("en-IN")}
      </td>
    </tr>
  `;

  // Update Radar Chart
  updateRadarChart(store);
}

// RADAR CHART
function updateRadarChart(store) {
  const ctx = document.getElementById("integratedRadarChart");
  if (!ctx) return;

  const dataValues = [
    (store.scoreBreakdown.economics / 35) * 100,
    (store.scoreBreakdown.demand / 25) * 100,
    (store.scoreBreakdown.qualityOps / 20) * 100,
    (store.scoreBreakdown.capacityCompliance / 20) * 100
  ];

  if (integratedRadarChartInstance) {
    integratedRadarChartInstance.data.datasets[0].data = dataValues;
    integratedRadarChartInstance.data.datasets[0].label = store.city;
    integratedRadarChartInstance.update();
    return;
  }

  integratedRadarChartInstance = new Chart(ctx, {
    type: "radar",
    data: {
      labels: [
        "Economics (35)",
        "Demand (25)",
        "Kitchen Ops (20)",
        "Compliance (20)"
      ],
      datasets: [{
        label: store.city,
        data: dataValues,
        backgroundColor: "rgba(200, 16, 46, 0.2)",
        borderColor: "#c8102e",
        borderWidth: 2,
        pointBackgroundColor: "#c8102e",
        pointBorderColor: "#ffffff",
        pointRadius: 3
      }, {
        label: "Benchmark (80%)",
        data: [80, 80, 80, 80],
        borderColor: "rgba(22, 163, 74, 0.4)",
        borderWidth: 1.5,
        borderDash: [3, 3],
        pointRadius: 0,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false, stepSize: 25 },
          grid: { color: "rgba(0, 0, 0, 0.06)" },
          angleLines: { color: "rgba(0, 0, 0, 0.08)" },
          pointLabels: {
            font: { size: 10, weight: "600" },
            color: "#64748b"
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: { boxWidth: 10, font: { size: 9 } }
        }
      }
    }
  });
}

// FILTER & SEARCH HANDLERS
function filterStores(railType) {
  currentFilter = railType;
  document.querySelectorAll(".store-filter-btn").forEach(btn => {
    if (btn.getAttribute("data-filter") === railType) {
      btn.className = "store-filter-btn px-2.5 py-1 rounded-full font-semibold bg-slate-900 text-white text-[11px] transition";
    } else {
      btn.className = "store-filter-btn px-2.5 py-1 rounded-full font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] transition";
    }
  });
  renderStoreList();
}

function searchStores() {
  currentSearch = document.getElementById("storeSearchInput").value;
  renderStoreList();
}

// PULSE AUDIT TABLE
function renderPulseTable() {
  const tbody = document.getElementById("pulseAuditTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const trialTypes = [
    "Pre-Sealed Pouches",
    "Calibrated Scoops",
    "Returnable Trays",
    "Calibrated Scoops",
    "Pre-Sealed Pouches",
    "Calibrated Scoops",
    "Pre-Sealed Pouches",
    "Unstandardized",
    "Unstandardized",
    "Pre-Sealed Pouches"
  ];

  STORES_DATA.forEach((store, index) => {
    const tr = document.createElement("tr");
    const trial = trialTypes[index] || "Calibrated Scoops";
    const passedBOM = store.cheeseVariancePct <= 4.0;
    const passedPOS = store.billCaptureRate >= 98.0;

    tr.innerHTML = `
      <td class="py-2.5 px-4 font-semibold text-slate-800">
        <div>${store.name}</div>
        <div class="text-[10px] text-slate-400">Partner: ${store.partnerName}</div>
      </td>
      <td class="py-2.5 px-3">
        <span class="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Active (Cloud POS)</span>
        </span>
      </td>
      <td class="py-2.5 px-3 text-right font-medium ${store.billCaptureRate >= 98 ? 'text-emerald-600' : 'text-red-500 font-bold'}">
        ${store.billCaptureRate.toFixed(1)}%
      </td>
      <td class="py-2.5 px-3 text-right font-medium ${store.dailyStockCompliance >= 90 ? 'text-emerald-600' : 'text-amber-500 font-bold'}">
        ${store.dailyStockCompliance.toFixed(1)}%
      </td>
      <td class="py-2.5 px-3 text-right font-medium ${passedBOM ? 'text-emerald-600' : 'text-red-500 font-bold'}">
        ${store.cheeseVariancePct.toFixed(1)}%
      </td>
      <td class="py-2.5 px-3">
        <span class="text-[11px] font-medium text-slate-700">${store.fssaiCompliance}</span>
      </td>
      <td class="py-2.5 px-3">
        <span class="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">${trial}</span>
      </td>
      <td class="py-2.5 px-4 text-center">
        <span class="text-[11px] font-bold px-2 py-0.5 rounded ${passedPOS && passedBOM ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}">
          ${passedPOS && passedBOM ? 'Verified Compliant' : 'Requires Remediation'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 100-POINT LIVE AUDIT CALCULATOR
function computeLiveAudit() {
  const rev = parseFloat(document.getElementById("calcRevenue").value) || 575000;
  const rent = parseFloat(document.getElementById("calcRent").value) || 45000;
  const orders = parseFloat(document.getElementById("calcDailyOrders").value) || 57;
  const aov = parseFloat(document.getElementById("calcAOV").value) || 336;
  const repeat = parseFloat(document.getElementById("calcRepeatRate").value) || 38;

  const billCapture = parseFloat(document.getElementById("calcBillCapture").value) || 98.1;
  const stockComp = parseFloat(document.getElementById("calcStockCompliance").value) || 91.5;
  const cheeseVar = parseFloat(document.getElementById("calcCheeseVar").value) || 4.2;
  const training = parseFloat(document.getElementById("calcTraining").value) || 88;
  const runway = parseFloat(document.getElementById("calcRunway").value) || 5.4;

  // 1. Economics (Max 35 pts)
  const rentRatio = (rent / rev) * 100;
  let ecoScore = 20;
  if (rentRatio <= 8) ecoScore += 8;
  else if (rentRatio <= 12) ecoScore += 4;
  else ecoScore -= 4;

  if (aov >= 335) ecoScore += 7;
  else if (aov >= 310) ecoScore += 4;
  ecoScore = Math.max(5, Math.min(35, ecoScore));

  // 2. Demand (Max 25 pts)
  let demandScore = 15;
  if (repeat >= 40) demandScore += 6;
  else if (repeat >= 30) demandScore += 3;
  if (orders >= 60) demandScore += 4;
  else if (orders >= 50) demandScore += 2;
  demandScore = Math.max(5, Math.min(25, demandScore));

  // 3. Kitchen & POS Operations (Max 20 pts)
  let qualityScore = 10;
  if (billCapture >= 98.0) qualityScore += 4;
  if (stockComp >= 90.0) qualityScore += 3;
  if (cheeseVar <= 3.5) qualityScore += 3;
  else if (cheeseVar > 7) qualityScore -= 3;
  qualityScore = Math.max(3, Math.min(20, qualityScore));

  // 4. Partner Compliance (Max 20 pts)
  let compScore = 10;
  if (training >= 90) compScore += 5;
  else if (training >= 75) compScore += 3;
  if (runway >= 5) compScore += 5;
  else if (runway >= 3) compScore += 2;
  else compScore -= 3;
  compScore = Math.max(3, Math.min(20, compScore));

  const total = ecoScore + demandScore + qualityScore + compScore;

  // Update DOM displays
  document.getElementById("calcResultScore").innerText = total.toFixed(1);
  document.getElementById("calcSubEco").innerText = `${ecoScore.toFixed(1)} / 35`;
  document.getElementById("calcSubDemand").innerText = `${demandScore.toFixed(1)} / 25`;
  document.getElementById("calcSubQuality").innerText = `${qualityScore.toFixed(1)} / 20`;
  document.getElementById("calcSubCompliance").innerText = `${compScore.toFixed(1)} / 20`;

  const badgeEl = document.getElementById("calcResultRailBadge");
  const actionEl = document.getElementById("calcActionRecommendation");

  if (total >= 80) {
    badgeEl.className = "mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow";
    badgeEl.innerText = "ACCELERATE (80–100)";
    actionEl.innerText = "Store qualifies for territory expansion and priority support. Unit economics and operations meet corporate benchmark.";
  } else if (total >= 60) {
    badgeEl.className = "mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-900 shadow";
    badgeEl.innerText = "REPAIR (60–79)";
    actionEl.innerText = "Enrolled in 90-day Operating Plan. Implement calibrated portion scoops to arrest dairy variance and audit POS bill cancellations.";
  } else {
    badgeEl.className = "mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow";
    badgeEl.innerText = "REVIEW (<60)";
    actionEl.innerText = "High-risk store. Conduct on-site operations and hygiene inspection. If unit contribution remains negative after 30 days, initiate relocation or exit.";
  }
}

// RENDER NETWORK OUTLETS DIRECTORY
function renderDirectory() {
  const tbody = document.getElementById("directoryTableBody");
  if (!tbody) return;

  const q = currentDirSearch.toLowerCase().trim();
  const filtered = NETWORK_OUTLETS_DIRECTORY.filter(item => {
    return !q || 
      item.name.toLowerCase().includes(q) || 
      item.city.toLowerCase().includes(q) || 
      item.state.toLowerCase().includes(q) || 
      item.partner.toLowerCase().includes(q) || 
      item.rm.toLowerCase().includes(q);
  });

  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-xs text-slate-400">No outlets match your search.</td></tr>`;
    return;
  }

  filtered.forEach(out => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-50 transition";

    let statusBadge = "bg-slate-100 text-slate-700";
    if (out.status.includes("Accelerate")) statusBadge = "bg-emerald-50 text-emerald-800 border border-emerald-200";
    if (out.status.includes("Repair")) statusBadge = "bg-amber-50 text-amber-800 border border-amber-200";
    if (out.status.includes("Review")) statusBadge = "bg-red-50 text-red-800 border border-red-200";

    tr.innerHTML = `
      <td class="py-3 px-4">
        <strong class="text-slate-900 block font-bold">${out.name}</strong>
        <span class="text-[10px] text-slate-400 font-mono">${out.id}</span>
      </td>
      <td class="py-3 px-3">
        <span class="text-slate-800 font-medium">${out.city}, ${out.state}</span>
        <span class="text-[10px] text-slate-400 block">${out.tier}</span>
      </td>
      <td class="py-3 px-3 font-medium text-slate-800">${out.partner}</td>
      <td class="py-3 px-3 text-slate-600">${out.rm}</td>
      <td class="py-3 px-3 font-mono text-slate-700">${out.phone}</td>
      <td class="py-3 px-3 text-center">
        <span class="font-extrabold text-xs px-2 py-0.5 rounded-full ${out.score >= 80 ? 'bg-emerald-100 text-emerald-800' : (out.score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800')}">
          ${out.score.toFixed(1)}
        </span>
      </td>
      <td class="py-3 px-4 text-center">
        <span class="text-[11px] font-bold px-2 py-0.5 rounded ${statusBadge}">
          ${out.status}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function searchDirectory() {
  currentDirSearch = document.getElementById("dirSearchInput").value;
  renderDirectory();
}

// EXPORT TO CSV
function exportDataCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,Store Name,City,State,Tier,Monthly Revenue,Contribution,Margin %,Cheese Var %,Bill Capture %,Health Score,Decision Rail\n";

  STORES_DATA.forEach(s => {
    csvContent += `"${s.id}","${s.name}","${s.city}","${s.state}","${s.tier}",${s.monthlyRevenue},${s.financialBridge.netStoreContribution},${s.financialBridge.contributionMargin.toFixed(1)},${s.cheeseVariancePct.toFixed(1)},${s.billCaptureRate.toFixed(1)},${s.totalScore.toFixed(1)},"${s.rail}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "pizza_galleria_franchise_scores.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
