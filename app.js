/**
 * GALLERIA ONE - Application Logic & Interactivity
 * Built for Pizza Galleria Franchise Turnaround Management
 */

// Global Chart Instances
let scoreRadarChartInstance = null;
let waterfallChartInstance = null;
let currentFilter = 'ALL';
let currentSearch = '';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderStoresTable();
  populateDeepDiveSelect();
  renderPulseTable();
  renderTimeline();
  renderScaleGates();
  initWaterfallChart();
  runSimulation();
  computeLiveAudit();

  // Load first store in deep dive
  if (STORES_DATA.length > 0) {
    loadStoreDeepDive(STORES_DATA[0].id);
  }

  // Refresh Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
});

// TAB SWITCHING
function switchTab(tabId) {
  // Hide all tab views
  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.add('hidden');
    view.classList.remove('block');
  });

  // Show active view
  const targetView = document.getElementById(`view-${tabId}`);
  if (targetView) {
    targetView.classList.remove('hidden');
    targetView.classList.add('block');
  }

  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('tab-active', 'text-white');
    btn.classList.add('text-slate-300');
  });

  const activeBtn = document.getElementById(`tab-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add('tab-active', 'text-white');
    activeBtn.classList.remove('text-slate-300');
  }

  // Resize charts if needed
  if (tabId === 'store-deepdive' && scoreRadarChartInstance) {
    setTimeout(() => scoreRadarChartInstance.resize(), 50);
  }
  if (tabId === 'financial-bridge' && waterfallChartInstance) {
    setTimeout(() => waterfallChartInstance.resize(), 50);
  }

  // Refresh icons
  if (window.lucide) {
    lucide.createIcons();
  }
}

// TOGGLE WEBSITE MOCKUP OVERLAY
function toggleWebsiteMockup() {
  const mockupBar = document.getElementById('websiteMockupBar');
  const toggleBtnText = document.getElementById('mockupToggleText');
  if (mockupBar.classList.contains('hidden')) {
    mockupBar.classList.remove('hidden');
    toggleBtnText.innerText = "Exit Website Preview";
  } else {
    mockupBar.classList.add('hidden');
    toggleBtnText.innerText = "Website Overlay Preview";
  }
}

// RENDER STORES TABLE
function renderStoresTable() {
  const tbody = document.getElementById('storesTableBody');
  if (!tbody) return;

  let filtered = STORES_DATA.filter(store => {
    const matchesFilter = (currentFilter === 'ALL') || (store.rail === currentFilter);
    const q = currentSearch.toLowerCase();
    const matchesSearch = !q || 
      store.name.toLowerCase().includes(q) || 
      store.city.toLowerCase().includes(q) || 
      store.partnerName.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // Update summary counts
  const accelerateCount = STORES_DATA.filter(s => s.rail === 'ACCELERATE').length;
  const repairCount = STORES_DATA.filter(s => s.rail === 'REPAIR').length;
  const reviewCount = STORES_DATA.filter(s => s.rail === 'REVIEW').length;

  document.getElementById('count-accelerate').innerText = accelerateCount;
  document.getElementById('count-repair').innerText = repairCount;
  document.getElementById('count-review').innerText = reviewCount;

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="py-8 text-center text-slate-400">No stores found matching your criteria.</td></tr>`;
    return;
  }

  filtered.forEach(store => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50/80 cursor-pointer transition";
    tr.onclick = (e) => {
      // Don't switch if clicking a direct button
      if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
        viewStoreDetails(store.id);
      }
    };

    let railBadgeClass = "badge-repair";
    if (store.rail === 'ACCELERATE') railBadgeClass = "badge-accelerate";
    if (store.rail === 'REVIEW') railBadgeClass = "badge-review";

    tr.innerHTML = `
      <td class="py-3 px-4">
        <div class="font-bold text-slate-900">${store.name}</div>
        <div class="text-[11px] text-slate-400">Partner: ${store.partnerName} &bull; ${store.id}</div>
      </td>
      <td class="py-3 px-3">
        <span class="font-medium text-slate-700">${store.city}, ${store.state}</span>
        <div class="text-[10px] text-slate-400">${store.tier} &bull; Est. ${store.openedYear}</div>
      </td>
      <td class="py-3 px-3 text-right font-semibold text-slate-900">
        ₹${(store.monthlyRevenue).toLocaleString('en-IN')}
      </td>
      <td class="py-3 px-3 text-right font-bold ${store.financialBridge.netStoreContribution > 40000 ? 'text-emerald-600' : (store.financialBridge.netStoreContribution > 15000 ? 'text-amber-600' : 'text-red-600')}">
        ₹${(store.financialBridge.netStoreContribution).toLocaleString('en-IN')}
      </td>
      <td class="py-3 px-3 text-right font-semibold text-slate-700">
        ${store.financialBridge.contributionMargin.toFixed(1)}%
      </td>
      <td class="py-3 px-3 text-right font-medium ${store.cheeseVariancePct > 6 ? 'text-red-500 font-bold' : (store.cheeseVariancePct > 4 ? 'text-amber-500' : 'text-emerald-600')}">
        ${store.cheeseVariancePct.toFixed(1)}%
      </td>
      <td class="py-3 px-3 text-right font-medium ${store.billCaptureRate >= 98 ? 'text-emerald-600' : 'text-red-500 font-bold'}">
        ${store.billCaptureRate.toFixed(1)}%
      </td>
      <td class="py-3 px-3 text-center">
        <span class="inline-block px-2.5 py-1 rounded-full text-xs font-black ${store.totalScore >= 80 ? 'bg-emerald-100 text-emerald-800' : (store.totalScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800')}">
          ${store.totalScore.toFixed(1)}
        </span>
      </td>
      <td class="py-3 px-3 text-center">
        <span class="inline-block px-2 py-0.5 rounded text-[11px] font-bold ${railBadgeClass}">
          ${store.rail}
        </span>
      </td>
      <td class="py-3 px-4 text-center">
        <button onclick="viewStoreDetails('${store.id}')" class="text-xs bg-slate-100 hover:bg-amber-500 hover:text-white px-2.5 py-1 rounded text-slate-700 font-semibold transition">
          Audit
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterStores(category) {
  currentFilter = category;
  document.querySelectorAll('.filter-chip').forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.className = "filter-chip px-3 py-1 text-xs rounded-full font-medium bg-slate-900 text-white transition";
    } else {
      btn.className = "filter-chip px-3 py-1 text-xs rounded-full font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition";
    }
  });
  renderStoresTable();
}

function searchStores() {
  currentSearch = document.getElementById('storeSearchInput').value;
  renderStoresTable();
}

function viewStoreDetails(storeId) {
  switchTab('store-deepdive');
  const select = document.getElementById('deepdiveStoreSelect');
  if (select) {
    select.value = storeId;
  }
  loadStoreDeepDive(storeId);
}

// POPULATE STORE SELECTOR
function populateDeepDiveSelect() {
  const select = document.getElementById('deepdiveStoreSelect');
  if (!select) return;
  select.innerHTML = '';
  STORES_DATA.forEach(store => {
    const opt = document.createElement('option');
    opt.value = store.id;
    opt.innerText = `${store.name} (${store.city}) — Score: ${store.totalScore.toFixed(1)}`;
    select.appendChild(opt);
  });
}

// LOAD STORE DEEP DIVE
function loadStoreDeepDive(storeId) {
  const store = STORES_DATA.find(s => s.id === storeId);
  if (!store) return;

  // Rail Badge Container
  const railContainer = document.getElementById('deepdiveRailBadgeContainer');
  let badgeStyle = "badge-repair";
  if (store.rail === 'ACCELERATE') badgeStyle = "badge-accelerate";
  if (store.rail === 'REVIEW') badgeStyle = "badge-review";

  railContainer.innerHTML = `
    <span class="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${badgeStyle}">
      ${store.rail} RAIL
    </span>
    <span class="text-xs text-slate-500 font-medium hidden sm:inline">Partner: ${store.partnerName}</span>
  `;

  // Score Badge
  const scoreBadge = document.getElementById('deepdiveOverallScoreBadge');
  scoreBadge.innerText = `${store.totalScore.toFixed(1)} / 100`;
  if (store.totalScore >= 80) {
    scoreBadge.className = "text-2xl font-black px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200";
  } else if (store.totalScore >= 60) {
    scoreBadge.className = "text-2xl font-black px-3 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200";
  } else {
    scoreBadge.className = "text-2xl font-black px-3 py-1 rounded-lg bg-red-50 text-red-600 border border-red-200";
  }

  // Category Progress bars & text
  const b = store.scoreBreakdown;
  document.getElementById('scoreEcoText').innerText = `${b.economics.toFixed(1)} / 35`;
  document.getElementById('scoreEcoBar').style.width = `${(b.economics / 35) * 100}%`;

  document.getElementById('scoreDemandText').innerText = `${b.demand.toFixed(1)} / 25`;
  document.getElementById('scoreDemandBar').style.width = `${(b.demand / 25) * 100}%`;

  document.getElementById('scoreQualityText').innerText = `${b.qualityOps.toFixed(1)} / 20`;
  document.getElementById('scoreQualityBar').style.width = `${(b.qualityOps / 20) * 100}%`;

  document.getElementById('scoreComplianceText').innerText = `${b.capacityCompliance.toFixed(1)} / 20`;
  document.getElementById('scoreComplianceBar').style.width = `${(b.capacityCompliance / 20) * 100}%`;

  // Operational Diagnostic Grid
  document.getElementById('diagCheeseVar').innerText = `${store.cheeseVariancePct.toFixed(1)}%`;
  document.getElementById('diagBillCapture').innerText = `${store.billCaptureRate.toFixed(1)}%`;
  document.getElementById('diagRentRatio').innerText = `${store.rentRatio.toFixed(1)}%`;
  document.getElementById('diagRepeatRate').innerText = `${store.repeatCustomerRate90d.toFixed(1)}%`;
  document.getElementById('diagCashRunway').innerText = `Runway: ${store.cashRunwayMonths} mos`;
  document.getElementById('deepdiveActionPlan').innerText = store.actionPlan;

  // Margin label
  document.getElementById('deepdiveMarginLabel').innerText = `${store.financialBridge.contributionMargin.toFixed(1)}% Margin`;

  // P&L Waterfall List
  const fb = store.financialBridge;
  const plContainer = document.getElementById('deepdivePlBreakdown');
  plContainer.innerHTML = `
    <div class="flex justify-between py-1.5 font-bold text-slate-900">
      <span>Gross Monthly Sales:</span>
      <span>₹${fb.grossSales.toLocaleString('en-IN')}</span>
    </div>
    <div class="flex justify-between py-1 text-slate-600">
      <span>− Food & Packaging (${store.foodPackagingPct}%):</span>
      <span class="text-red-500 font-medium">−₹${fb.foodCost.toLocaleString('en-IN')}</span>
    </div>
    <div class="flex justify-between py-1 text-slate-600">
      <span>− Aggregator Channel Fees:</span>
      <span class="text-red-500 font-medium">−₹${fb.channelFees.toLocaleString('en-IN')}</span>
    </div>
    <div class="flex justify-between py-1 text-slate-600">
      <span>− Store Labour Cost:</span>
      <span class="text-red-500 font-medium">−₹${fb.labourCost.toLocaleString('en-IN')}</span>
    </div>
    <div class="flex justify-between py-1 text-slate-600">
      <span>− Store Rent (${store.rentRatio}% of rev):</span>
      <span class="text-red-500 font-medium">−₹${fb.rent.toLocaleString('en-IN')}</span>
    </div>
    <div class="flex justify-between py-1 text-slate-600">
      <span>− Store Utilities / Power:</span>
      <span class="text-red-500 font-medium">−₹${fb.utilities.toLocaleString('en-IN')}</span>
    </div>
    <div class="flex justify-between py-1 text-slate-600">
      <span>− HQ Royalty (3%):</span>
      <span class="text-red-500 font-medium">−₹${fb.royalty.toLocaleString('en-IN')}</span>
    </div>
    <div class="flex justify-between py-1 text-slate-600">
      <span>− PULSE POS & Cloud Subscription:</span>
      <span class="text-red-500 font-medium">−₹${fb.posData.toLocaleString('en-IN')}</span>
    </div>
    <div class="flex justify-between py-1 text-slate-600">
      <span>− Hyperlocal Marketing Fund:</span>
      <span class="text-red-500 font-medium">−₹${fb.marketing.toLocaleString('en-IN')}</span>
    </div>
    <div class="flex justify-between py-2 font-black text-sm border-t-2 border-slate-200 mt-2 ${fb.netStoreContribution > 40000 ? 'text-emerald-600' : (fb.netStoreContribution > 15000 ? 'text-amber-600' : 'text-red-600')}">
      <span>Net Monthly Store Contribution:</span>
      <span>₹${fb.netStoreContribution.toLocaleString('en-IN')}</span>
    </div>
  `;

  // Update Radar Chart
  updateRadarChart(store);
}

// RADAR CHART
function updateRadarChart(store) {
  const ctx = document.getElementById('scoreRadarChart');
  if (!ctx) return;

  const dataValues = [
    (store.scoreBreakdown.economics / 35) * 100,
    (store.scoreBreakdown.demand / 25) * 100,
    (store.scoreBreakdown.qualityOps / 20) * 100,
    (store.scoreBreakdown.capacityCompliance / 20) * 100
  ];

  if (scoreRadarChartInstance) {
    scoreRadarChartInstance.data.datasets[0].data = dataValues;
    scoreRadarChartInstance.data.datasets[0].label = store.name;
    scoreRadarChartInstance.update();
    return;
  }

  scoreRadarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        'Economics (35)',
        'Demand (25)',
        'Quality & Ops (20)',
        'Compliance (20)'
      ],
      datasets: [{
        label: store.name,
        data: dataValues,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        borderWidth: 2,
        pointBackgroundColor: '#6b1d2f',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#6b1d2f',
        pointRadius: 4
      }, {
        label: 'Accelerate Benchmark (80%)',
        data: [80, 80, 80, 80],
        borderColor: 'rgba(16, 185, 129, 0.4)',
        borderWidth: 1.5,
        borderDash: [4, 4],
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
          ticks: {
            display: false,
            stepSize: 20
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.06)'
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.08)'
          },
          pointLabels: {
            font: {
              size: 11,
              weight: '600'
            },
            color: '#475569'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 10,
            font: { size: 10 }
          }
        }
      }
    }
  });
}

// SLIDE 4 WATERFALL CHART (Baseline to Target Bridge)
function initWaterfallChart() {
  const ctx = document.getElementById('waterfallChart');
  if (!ctx) return;

  // Slide 4 Financial Bridge figures:
  // Baseline: ₹17,440
  // +₹54,900 Sales impact
  // -₹8,655 Net Food / Packaging
  // +₹2,156 Channel fee savings
  // -₹2,000 Labour
  // -₹2,000 Marketing
  // -₹1,647 Royalty
  // -₹3,000 POS / Data
  // = ₹57,194 Target (+₹39,754 Uplift)

  const labels = [
    'Baseline (3.3%)',
    'Sales Impact',
    'Food/Pkg Cost',
    'Channel Savings',
    'Labour',
    'Marketing',
    'HQ Royalty',
    'POS/Data',
    'Target (9.8%)'
  ];

  const values = [
    17440,
    54900,
    -8655,
    2156,
    -2000,
    -2000,
    -1647,
    -3000,
    57194
  ];

  const colors = [
    '#64748b', // Baseline gray
    '#10b981', // Sales +
    '#ef4444', // Food -
    '#10b981', // Channel savings +
    '#ef4444', // Labour -
    '#ef4444', // Marketing -
    '#ef4444', // Royalty -
    '#ef4444', // POS -
    '#f59e0b'  // Target gold
  ];

  waterfallChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Financial Bridge Impact (₹/month)',
        data: values,
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const val = context.raw;
              const sign = val > 0 ? '+' : '';
              return ` ${sign}₹${val.toLocaleString('en-IN')} / month`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            callback: function(value) {
              return '₹' + (value / 1000) + 'k';
            }
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 10, weight: '500' }
          }
        }
      }
    }
  });
}

// WHAT-IF SIMULATOR ENGINE
function runSimulation() {
  const dailyOrders = parseFloat(document.getElementById('simOrders').value);
  const aov = parseFloat(document.getElementById('simAov').value);
  const foodCostPct = parseFloat(document.getElementById('simFoodCost').value);
  const channelFeePct = parseFloat(document.getElementById('simChannel').value);

  // Update slider label displays
  document.getElementById('simOrdersVal').innerText = `${dailyOrders} orders`;
  document.getElementById('simAovVal').innerText = `₹${aov}`;
  document.getElementById('simFoodCostVal').innerText = `${foodCostPct.toFixed(1)}%`;
  document.getElementById('simChannelVal').innerText = `${channelFeePct.toFixed(1)}%`;

  // Compute 30-day performance
  const days = 30;
  const grossMonthlySales = dailyOrders * aov * days;
  const foodCost = grossMonthlySales * (foodCostPct / 100);
  const channelFees = grossMonthlySales * (channelFeePct / 100);
  const labourCost = 50000;
  const rent = 45000;
  const utilities = 25000;
  const royalty = grossMonthlySales * 0.03; // 3%
  const posData = 3000;
  const marketing = 14000;

  const totalOpex = foodCost + channelFees + labourCost + rent + utilities + royalty + posData + marketing;
  const netContribution = grossMonthlySales - totalOpex;
  const contributionMargin = (netContribution / grossMonthlySales) * 100;
  const upliftDiff = netContribution - 17440; // baseline ₹17,440

  // Simulated Health Score estimation
  let simulatedScore = 50;
  simulatedScore += (contributionMargin / 10) * 20; // economics factor
  simulatedScore += (dailyOrders / 60) * 15;        // volume factor
  simulatedScore += (1 - (foodCostPct / 40)) * 15;   // waste control
  simulatedScore = Math.min(98, Math.max(35, simulatedScore));

  // Determine rail
  let railTag = "ACCELERATE";
  let railClass = "text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
  if (simulatedScore < 60) {
    railTag = "REVIEW";
    railClass = "text-xs font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30";
  } else if (simulatedScore < 80) {
    railTag = "REPAIR";
    railClass = "text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30";
  }

  // Update DOM
  document.getElementById('simGrossSales').innerText = `₹${Math.round(grossMonthlySales).toLocaleString('en-IN')}`;
  document.getElementById('simNetContrib').innerText = `₹${Math.round(netContribution).toLocaleString('en-IN')}`;
  document.getElementById('simMargin').innerText = `${contributionMargin.toFixed(2)}%`;
  document.getElementById('simHealthScore').innerText = `${simulatedScore.toFixed(1)} / 100`;

  document.getElementById('simFoodOutflow').innerText = `₹${Math.round(foodCost).toLocaleString('en-IN')}`;
  document.getElementById('simChannelOutflow').innerText = `₹${Math.round(channelFees).toLocaleString('en-IN')}`;
  document.getElementById('simRoyaltyOutflow').innerText = `₹${Math.round(royalty).toLocaleString('en-IN')}`;

  const diffSign = upliftDiff >= 0 ? '+' : '';
  const upliftEl = document.getElementById('simUpliftDiff');
  upliftEl.innerText = `${diffSign}₹${Math.round(upliftDiff).toLocaleString('en-IN')} / mo`;
  upliftEl.className = upliftDiff >= 0 ? "font-extrabold text-emerald-400 text-sm" : "font-extrabold text-red-400 text-sm";

  const railTagEl = document.getElementById('simDecisionRailTag');
  railTagEl.innerText = railTag;
  railTagEl.className = railClass;
}

// PULSE AUDIT TABLE
function renderPulseTable() {
  const tbody = document.getElementById('pulseAuditTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const trialTypes = [
    "Pre-Sealed Pouches",
    "Calibrated Scoops",
    "Returnable Trays",
    "Calibrated Scoops",
    "Pre-Sealed Pouches",
    "Calibrated Scoops",
    "Pre-Sealed Pouches",
    "None (Unstandardized)",
    "None (Unstandardized)",
    "Pre-Sealed Pouches"
  ];

  STORES_DATA.forEach((store, index) => {
    const tr = document.createElement('tr');
    const trial = trialTypes[index] || "Calibrated Scoops";
    const passedBOM = store.cheeseVariancePct <= 4.0;
    const passedPOS = store.billCaptureRate >= 98.0;

    tr.innerHTML = `
      <td class="py-2.5 px-3 font-semibold text-slate-800">${store.name}</td>
      <td class="py-2.5 px-3">
        <span class="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>API Connected</span>
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
      <td class="py-2.5 px-3 font-semibold ${store.rail === 'ACCELERATE' ? 'text-emerald-600' : (store.rail === 'REPAIR' ? 'text-amber-600' : 'text-red-600')}">
        ${passedPOS && passedBOM ? 'Compliant' : 'Audit Action Required'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 12-WEEK GANTT TIMELINE
function renderTimeline() {
  const container = document.getElementById('ganttTimelineContainer');
  if (!container) return;
  container.innerHTML = '';

  PILOT_TIMELINE.forEach((phase, index) => {
    let statusClass = "bg-slate-100 text-slate-600";
    let icon = "circle";
    if (phase.status === 'Completed') {
      statusClass = "bg-emerald-100 text-emerald-800 border border-emerald-300";
      icon = "check-circle-2";
    } else if (phase.status.includes('Active')) {
      statusClass = "bg-amber-100 text-amber-800 border border-amber-300 font-bold";
      icon = "clock";
    }

    const card = document.createElement('div');
    card.className = "p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition flex flex-col md:flex-row md:items-center justify-between gap-4";
    card.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="px-2.5 py-1.5 rounded-lg text-xs font-black bg-brand-maroon text-white tracking-wider">
          ${phase.weeks}
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h4 class="text-sm font-bold text-slate-900">${phase.phase}</h4>
            <span class="text-[10px] px-2 py-0.5 rounded-full ${statusClass}">${phase.status}</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">${phase.focus}</p>
          <div class="flex flex-wrap gap-1.5 mt-2">
            ${phase.deliverables.map(d => `<span class="bg-white border border-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded">✓ ${d}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="text-left md:text-right text-xs">
        <span class="text-slate-400 block text-[10px]">Lead Owner</span>
        <span class="font-semibold text-slate-700">${phase.owner}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// 4 BOARD SCALE GATES
function renderScaleGates() {
  const container = document.getElementById('scaleGatesContainer');
  if (!container) return;
  container.innerHTML = '';

  BOARD_SCALE_GATES.forEach(gate => {
    let ragBadge = "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (gate.rag === 'amber') ragBadge = "bg-amber-50 text-amber-800 border-amber-200";
    if (gate.rag === 'blue') ragBadge = "bg-blue-50 text-blue-800 border-blue-200";

    const div = document.createElement('div');
    div.className = "p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between";
    div.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-400">SCALE GATE ${gate.id}</span>
          <span class="text-[11px] font-bold px-2 py-0.5 rounded border ${ragBadge}">${gate.status}</span>
        </div>
        <h4 class="text-sm font-bold text-slate-900">${gate.title}</h4>
        <p class="text-xs text-slate-600 mt-1">${gate.criteria}</p>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-200 text-xs flex justify-between">
        <span class="text-slate-500">Current Status:</span>
        <span class="font-bold text-slate-800">${gate.currentValue}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

// 100-POINT LIVE AUDIT CALCULATOR
function computeLiveAudit() {
  const rev = parseFloat(document.getElementById('calcRevenue').value) || 500000;
  const rent = parseFloat(document.getElementById('calcRent').value) || 45000;
  const orders = parseFloat(document.getElementById('calcDailyOrders').value) || 50;
  const aov = parseFloat(document.getElementById('calcAOV').value) || 320;
  const repeat = parseFloat(document.getElementById('calcRepeatRate').value) || 30;

  const billCapture = parseFloat(document.getElementById('calcBillCapture').value) || 95;
  const stockComp = parseFloat(document.getElementById('calcStockCompliance').value) || 85;
  const cheeseVar = parseFloat(document.getElementById('calcCheeseVar').value) || 5;
  const training = parseFloat(document.getElementById('calcTraining').value) || 80;
  const runway = parseFloat(document.getElementById('calcRunway').value) || 3;

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

  // 3. Quality & Kitchen Ops (Max 20 pts)
  let qualityScore = 10;
  if (billCapture >= 98.0) qualityScore += 4;
  if (stockComp >= 90.0) qualityScore += 3;
  if (cheeseVar <= 3.5) qualityScore += 3;
  else if (cheeseVar > 7) qualityScore -= 3;
  qualityScore = Math.max(3, Math.min(20, qualityScore));

  // 4. Compliance & Capacity (Max 20 pts)
  let compScore = 10;
  if (training >= 90) compScore += 5;
  else if (training >= 75) compScore += 3;
  if (runway >= 5) compScore += 5;
  else if (runway >= 3) compScore += 2;
  else compScore -= 3;
  compScore = Math.max(3, Math.min(20, compScore));

  const total = ecoScore + demandScore + qualityScore + compScore;

  // Update DOM displays
  document.getElementById('calcResultScore').innerText = total.toFixed(1);
  document.getElementById('calcSubEco').innerText = `${ecoScore.toFixed(1)} / 35`;
  document.getElementById('calcSubDemand').innerText = `${demandScore.toFixed(1)} / 25`;
  document.getElementById('calcSubQuality').innerText = `${qualityScore.toFixed(1)} / 20`;
  document.getElementById('calcSubCompliance').innerText = `${compScore.toFixed(1)} / 20`;

  const badgeEl = document.getElementById('calcResultRailBadge');
  const actionEl = document.getElementById('calcActionRecommendation');

  if (total >= 80) {
    badgeEl.className = "mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow";
    badgeEl.innerText = "ACCELERATE (80–100)";
    actionEl.innerText = "Store approved for 40:60 HQ co-investment and priority territory allocation. Target incremental marketing match to compound local store volume.";
  } else if (total >= 60) {
    badgeEl.className = "mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-900 shadow";
    badgeEl.innerText = "REPAIR (60–79)";
    actionEl.innerText = "Enrolled in 90-day Repair Lane. Mandate calibrated portion scoops to eliminate cheese variance, enforce nightly closing stock counts, and review high rent leak.";
  } else {
    badgeEl.className = "mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow";
    badgeEl.innerText = "REVIEW (<60)";
    actionEl.innerText = "Critical Escalation Gate triggered. Conduct physical site inspection for FSSAI / food safety breaches. If unit contribution cannot reach positive baseline in 30 days, trigger relocation or exit.";
  }
}

// EXPORT TO CSV
function exportDataCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,Store Name,City,State,Tier,Revenue,Contribution,Margin %,Cheese Var %,Bill Capture %,Health Score,Decision Rail\n";

  STORES_DATA.forEach(s => {
    csvContent += `"${s.id}","${s.name}","${s.city}","${s.state}","${s.tier}",${s.monthlyRevenue},${s.financialBridge.netStoreContribution},${s.financialBridge.contributionMargin.toFixed(1)},${s.cheeseVariancePct.toFixed(1)},${s.billCaptureRate.toFixed(1)},${s.totalScore.toFixed(1)},"${s.rail}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "galleria_one_franchise_scores.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
