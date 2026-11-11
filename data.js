/**
 * GALLERIA ONE - Franchise Score Management & Intelligence System
 * Real-Life Data Model based on Pizza Galleria (Shark Tank India Season 3 Case)
 * 
 * Case Context:
 * - Brand: Pizza Galleria (Pure Veg QSR, 100+ stores, Gohana origin)
 * - Corporate FY25 Revenue: ₹11.26 Cr | PAT: ₹13.35 L (~1.19% net margin)
 * - Pilot: 10 Stores testing ₹10.12L turnaround program
 * - 100-Point Health Score:
 *     - Economics: 35 pts (Contribution margin, rent burden, AOV)
 *     - Demand: 25 pts (90-day repeat rate, orders/day, catchment share)
 *     - Quality & Ops: 20 pts (Bill capture >=98%, Stock count >=90%, BOM variance)
 *     - Capacity/Compliance: 20 pts (Training, audits, cash runway)
 * 
 * Decision Rails:
 *     - 80-100: ACCELERATE (Co-investment, marketing match, 2nd store)
 *     - 60-79: REPAIR (Funded 90-day operating plan, BOM scoop fix)
 *     - <60: REVIEW (Validate location, cash runway; relocate/transfer/exit)
 */

const PILOT_SUMMARY = {
  totalStores: 100,
  pilotStoresCount: 10,
  pilotBudgetTotal: 1012000, // ₹10.12 Lakhs
  hqShare: 405000,          // 40% = ₹4.05 Lakhs
  franchiseShare: 607000,   // 60% = ₹6.07 Lakhs (₹60.7k per partner)
  baselineAvgContribution: 17440,
  targetAvgContribution: 57194,
  modeledAvgUplift: 39754,
  baselineOrdersPerDay: 55,
  targetOrdersPerDay: 58,
  baselineAOV: 320,
  targetAOV: 335,
  baselineFoodCostPct: 37.0,
  targetFoodCostPct: 35.0,
  baselineChannelCostPct: 12.0,
  targetChannelCostPct: 10.5,
  royaltyPct: 3.0
};

const STORES_DATA = [
  {
    id: "PG-101",
    name: "Gohana Flagship (Civil Lines)",
    city: "Gohana",
    state: "Haryana",
    tier: "Tier 3",
    openedYear: 2015,
    partnerName: "Sandeep Jangra / Local Op",
    monthlyRevenue: 685000,
    dailyOrders: 68,
    aov: 335,
    rentPerMonth: 35000,
    rentRatio: 5.1, // Rent as % of revenue
    foodPackagingPct: 34.2,
    cheeseVariancePct: 2.1, // BOM recipe variance
    billCaptureRate: 99.4, // PULSE KPI target >=98%
    dailyStockCompliance: 96.5, // PULSE KPI target >=90%
    repeatCustomerRate90d: 46.8, // Demand metric
    hygieneAuditScore: 94,
    cashRunwayMonths: 8.5,
    staffTrainingCompletion: 100,
    fssaiCompliance: "Passed A+",
    scoreBreakdown: {
      economics: 32.5, // out of 35
      demand: 23.0,    // out of 25
      qualityOps: 19.2,// out of 20
      capacityCompliance: 19.5 // out of 20
    },
    totalScore: 94.2,
    rail: "ACCELERATE",
    railColor: "#10b981",
    statusBadge: "Top Performer",
    actionPlan: "Eligible for 40:60 HQ co-investment. Allocate priority for 2nd catchment outlet in Panipat South.",
    financialBridge: {
      grossSales: 685000,
      foodCost: 234270,
      channelFees: 61650, // lower due to high direct pickup
      labourCost: 55000,
      rent: 35000,
      utilities: 28000,
      royalty: 20550, // 3%
      posData: 3000,
      marketing: 14000,
      netStoreContribution: 73530,
      contributionMargin: 10.7
    }
  },
  {
    id: "PG-102",
    name: "Rohtak Model Town",
    city: "Rohtak",
    state: "Haryana",
    tier: "Tier 2",
    openedYear: 2018,
    partnerName: "Amit Malik",
    monthlyRevenue: 612000,
    dailyOrders: 60,
    aov: 340,
    rentPerMonth: 48000,
    rentRatio: 7.8,
    foodPackagingPct: 35.1,
    cheeseVariancePct: 3.4,
    billCaptureRate: 98.6,
    dailyStockCompliance: 92.0,
    repeatCustomerRate90d: 41.2,
    hygieneAuditScore: 89,
    cashRunwayMonths: 6.2,
    staffTrainingCompletion: 92,
    fssaiCompliance: "Passed A",
    scoreBreakdown: {
      economics: 29.8,
      demand: 21.5,
      qualityOps: 17.8,
      capacityCompliance: 17.5
    },
    totalScore: 86.6,
    rail: "ACCELERATE",
    railColor: "#10b981",
    statusBadge: "Growth Driver",
    actionPlan: "Maintain standardized portion scoops. Deploy geofenced hero-SKU campaigns for nearby university campus.",
    financialBridge: {
      grossSales: 612000,
      foodCost: 214812,
      channelFees: 64260,
      labourCost: 52000,
      rent: 48000,
      utilities: 26000,
      royalty: 18360,
      posData: 3000,
      marketing: 15000,
      netStoreContribution: 60568,
      contributionMargin: 9.9
    }
  },
  {
    id: "PG-103",
    name: "Sonipat Subhash Chowk",
    city: "Sonipat",
    state: "Haryana",
    tier: "Tier 2",
    openedYear: 2019,
    partnerName: "Rajeev Goel",
    monthlyRevenue: 575000,
    dailyOrders: 57,
    aov: 336,
    rentPerMonth: 45000,
    rentRatio: 7.8,
    foodPackagingPct: 35.8,
    cheeseVariancePct: 4.2,
    billCaptureRate: 98.1,
    dailyStockCompliance: 91.5,
    repeatCustomerRate90d: 38.6,
    hygieneAuditScore: 85,
    cashRunwayMonths: 5.4,
    staffTrainingCompletion: 88,
    fssaiCompliance: "Passed A",
    scoreBreakdown: {
      economics: 27.4,
      demand: 19.8,
      qualityOps: 16.9,
      capacityCompliance: 16.8
    },
    totalScore: 80.9,
    rail: "ACCELERATE",
    railColor: "#10b981",
    statusBadge: "Consistent",
    actionPlan: "Standardize returnable portion trays for liquid cheese. Expand evening pizza-hour promotions.",
    financialBridge: {
      grossSales: 575000,
      foodCost: 205850,
      channelFees: 63250,
      labourCost: 50000,
      rent: 45000,
      utilities: 25000,
      royalty: 17250,
      posData: 3000,
      marketing: 14500,
      netStoreContribution: 51150,
      contributionMargin: 8.9
    }
  },
  {
    id: "PG-104",
    name: "Panipat Sector 11",
    city: "Panipat",
    state: "Haryana",
    tier: "Tier 2",
    openedYear: 2020,
    partnerName: "Vikram Sharma",
    monthlyRevenue: 538000,
    dailyOrders: 55,
    aov: 326,
    rentPerMonth: 52000,
    rentRatio: 9.7,
    foodPackagingPct: 36.9,
    cheeseVariancePct: 6.8, // waste leak
    billCaptureRate: 95.8, // below 98% target
    dailyStockCompliance: 86.0, // below 90%
    repeatCustomerRate90d: 34.0,
    hygieneAuditScore: 80,
    cashRunwayMonths: 4.1,
    staffTrainingCompletion: 76,
    fssaiCompliance: "Passed B+",
    scoreBreakdown: {
      economics: 23.2,
      demand: 17.5,
      qualityOps: 14.1,
      capacityCompliance: 14.8
    },
    totalScore: 69.6,
    rail: "REPAIR",
    railColor: "#f59e0b",
    statusBadge: "Repair Lane (W4)",
    actionPlan: "BOM variance leak of 6.8%. Replace uncalibrated cheese ladles with pre-portioned pouches. Institute nightly stock counts.",
    financialBridge: {
      grossSales: 538000,
      foodCost: 198522,
      channelFees: 64560,
      labourCost: 48000,
      rent: 52000,
      utilities: 24000,
      royalty: 16140,
      posData: 3000,
      marketing: 12000,
      netStoreContribution: 29778,
      contributionMargin: 5.5
    }
  },
  {
    id: "PG-105",
    name: "Karnal Kunjpura Road",
    city: "Karnal",
    state: "Haryana",
    tier: "Tier 2",
    openedYear: 2021,
    partnerName: "Pradeep Saini",
    monthlyRevenue: 524000,
    dailyOrders: 54,
    aov: 323,
    rentPerMonth: 48000,
    rentRatio: 9.2,
    foodPackagingPct: 37.4,
    cheeseVariancePct: 7.2,
    billCaptureRate: 96.2,
    dailyStockCompliance: 84.5,
    repeatCustomerRate90d: 32.5,
    hygieneAuditScore: 78,
    cashRunwayMonths: 3.8,
    staffTrainingCompletion: 72,
    fssaiCompliance: "Passed B+",
    scoreBreakdown: {
      economics: 22.0,
      demand: 16.8,
      qualityOps: 13.5,
      capacityCompliance: 14.2
    },
    totalScore: 66.5,
    rail: "REPAIR",
    railColor: "#f59e0b",
    statusBadge: "Repair Lane (W5)",
    actionPlan: "Train kitchen staff on 2-3 vegetarian hero SKUs (Tandoori Paneer & Makhni). Audit POS bill cancellation logs.",
    financialBridge: {
      grossSales: 524000,
      foodCost: 195976,
      channelFees: 65500,
      labourCost: 47000,
      rent: 48000,
      utilities: 23500,
      royalty: 15720,
      posData: 3000,
      marketing: 11500,
      netStoreContribution: 26304,
      contributionMargin: 5.0
    }
  },
  {
    id: "PG-106",
    name: "Hisar Red Square Market",
    city: "Hisar",
    state: "Haryana",
    tier: "Tier 2",
    openedYear: 2021,
    partnerName: "Nitin Bishnoi",
    monthlyRevenue: 512000,
    dailyOrders: 53,
    aov: 321,
    rentPerMonth: 50000,
    rentRatio: 9.8,
    foodPackagingPct: 38.0,
    cheeseVariancePct: 7.9,
    billCaptureRate: 94.5,
    dailyStockCompliance: 82.0,
    repeatCustomerRate90d: 31.0,
    hygieneAuditScore: 75,
    cashRunwayMonths: 3.2,
    staffTrainingCompletion: 68,
    fssaiCompliance: "Passed B",
    scoreBreakdown: {
      economics: 20.5,
      demand: 15.6,
      qualityOps: 12.8,
      capacityCompliance: 13.5
    },
    totalScore: 62.4,
    rail: "REPAIR",
    railColor: "#f59e0b",
    statusBadge: "Repair Lane (W3)",
    actionPlan: "High cheese discrepancy. Implement physical weigh-ins at kitchen closing. Launch direct customer app pickup incentives to curb aggregator commission.",
    financialBridge: {
      grossSales: 512000,
      foodCost: 194560,
      channelFees: 66560,
      labourCost: 46000,
      rent: 50000,
      utilities: 23000,
      royalty: 15360,
      posData: 3000,
      marketing: 11000,
      netStoreContribution: 20520,
      contributionMargin: 4.0
    }
  },
  {
    id: "PG-107",
    name: "Delhi Vikaspuri G-Block",
    city: "New Delhi",
    state: "Delhi NCR",
    tier: "Tier 1",
    openedYear: 2022,
    partnerName: "Harshdeep Singh",
    monthlyRevenue: 720000,
    dailyOrders: 65,
    aov: 369,
    rentPerMonth: 95000, // Very high rent burden
    rentRatio: 13.2,
    foodPackagingPct: 36.8,
    cheeseVariancePct: 5.5,
    billCaptureRate: 97.4,
    dailyStockCompliance: 88.0,
    repeatCustomerRate90d: 36.5,
    hygieneAuditScore: 86,
    cashRunwayMonths: 3.5,
    staffTrainingCompletion: 80,
    fssaiCompliance: "Passed A",
    scoreBreakdown: {
      economics: 23.8, // rent drag
      demand: 20.4,
      qualityOps: 15.8,
      capacityCompliance: 14.5
    },
    totalScore: 74.5,
    rail: "REPAIR",
    railColor: "#f59e0b",
    statusBadge: "Rent Burden Warning",
    actionPlan: "High sales (₹7.2L) masked by ₹95k rent. Renegotiate lease or increase AOV with 24-inch Baahubali combo upsells. Migrate 25% delivery to direct ordering.",
    financialBridge: {
      grossSales: 720000,
      foodCost: 264960,
      channelFees: 93600, // 13% high aggregator share
      labourCost: 65000,
      rent: 95000,
      utilities: 34000,
      royalty: 21600,
      posData: 3000,
      marketing: 18000,
      netStoreContribution: 25840,
      contributionMargin: 3.6
    }
  },
  {
    id: "PG-108",
    name: "Noida Sector 62",
    city: "Noida",
    state: "Uttar Pradesh",
    tier: "Tier 1",
    openedYear: 2023,
    partnerName: "Gaurav Bansal",
    monthlyRevenue: 495000,
    dailyOrders: 48,
    aov: 343,
    rentPerMonth: 65000,
    rentRatio: 13.1,
    foodPackagingPct: 39.2,
    cheeseVariancePct: 9.4,
    billCaptureRate: 91.2,
    dailyStockCompliance: 76.0,
    repeatCustomerRate90d: 26.2,
    hygieneAuditScore: 71,
    cashRunwayMonths: 2.1,
    staffTrainingCompletion: 58,
    fssaiCompliance: "Conditional B",
    scoreBreakdown: {
      economics: 16.4,
      demand: 13.8,
      qualityOps: 11.2,
      capacityCompliance: 11.0
    },
    totalScore: 52.4,
    rail: "REVIEW",
    railColor: "#ef4444",
    statusBadge: "Escalation Gate 1",
    actionPlan: "Critical Review: Bill capture 91.2% (unreported cash/POS leak). Food cost 39.2%. 30-day ultimatum for POS compliance & kitchen re-audit; else transfer or exit.",
    financialBridge: {
      grossSales: 495000,
      foodCost: 194040,
      channelFees: 69300,
      labourCost: 54000,
      rent: 65000,
      utilities: 26000,
      royalty: 14850,
      posData: 3000,
      marketing: 12000,
      netStoreContribution: 11810,
      contributionMargin: 2.4
    }
  },
  {
    id: "PG-109",
    name: "Gurugram Sector 14",
    city: "Gurugram",
    state: "Haryana",
    tier: "Tier 1",
    openedYear: 2022,
    partnerName: "Siddharth Verma",
    monthlyRevenue: 460000,
    dailyOrders: 45,
    aov: 340,
    rentPerMonth: 72000,
    rentRatio: 15.6,
    foodPackagingPct: 40.5,
    cheeseVariancePct: 10.8,
    billCaptureRate: 89.5,
    dailyStockCompliance: 71.0,
    repeatCustomerRate90d: 22.8,
    hygieneAuditScore: 68,
    cashRunwayMonths: 1.4,
    staffTrainingCompletion: 52,
    fssaiCompliance: "Deficiency Notice",
    scoreBreakdown: {
      economics: 13.2,
      demand: 12.0,
      qualityOps: 9.8,
      capacityCompliance: 9.5
    },
    totalScore: 44.5,
    rail: "REVIEW",
    railColor: "#ef4444",
    statusBadge: "High Risk Review",
    actionPlan: "Food safety notice received. Extreme rent burden (15.6%). Immediate site visit by HQ Operations Lead. Initiate relocation or negotiated franchise transfer.",
    financialBridge: {
      grossSales: 460000,
      foodCost: 186300,
      channelFees: 69000,
      labourCost: 52000,
      rent: 72000,
      utilities: 27000,
      royalty: 13800,
      posData: 3000,
      marketing: 10500,
      netStoreContribution: 2400,
      contributionMargin: 0.5
    }
  },
  {
    id: "PG-110",
    name: "Jaipur Mansarovar",
    city: "Jaipur",
    state: "Rajasthan",
    tier: "Tier 2",
    openedYear: 2023,
    partnerName: "Sunil Agarwal",
    monthlyRevenue: 588000,
    dailyOrders: 58,
    aov: 338,
    rentPerMonth: 44000,
    rentRatio: 7.5,
    foodPackagingPct: 35.4,
    cheeseVariancePct: 3.8,
    billCaptureRate: 98.4,
    dailyStockCompliance: 93.0,
    repeatCustomerRate90d: 39.5,
    hygieneAuditScore: 91,
    cashRunwayMonths: 6.8,
    staffTrainingCompletion: 94,
    fssaiCompliance: "Passed A",
    scoreBreakdown: {
      economics: 28.5,
      demand: 21.0,
      qualityOps: 18.2,
      capacityCompliance: 18.0
    },
    totalScore: 85.7,
    rail: "ACCELERATE",
    railColor: "#10b981",
    statusBadge: "Expansion Ready",
    actionPlan: "Strong operations in Rajasthan entry. Test direct pickup geofenced discounts. Prime candidate for multi-unit territory expansion.",
    financialBridge: {
      grossSales: 588000,
      foodCost: 208152,
      channelFees: 64680,
      labourCost: 49000,
      rent: 44000,
      utilities: 24500,
      royalty: 17640,
      posData: 3000,
      marketing: 14000,
      netStoreContribution: 58028,
      contributionMargin: 9.87
    }
  }
];

// 12-Week Pilot Timeline Milestones (Slide 4)
const PILOT_TIMELINE = [
  {
    weeks: "W1–W2",
    phase: "CONSENT & BASELINE",
    owner: "HQ + 10 Franchise Partners",
    focus: "Opt-in POS data sharing agreements, historical P&L verification, AOV and ticket distribution audit.",
    status: "Completed",
    deliverables: ["10/10 Legal Opt-ins Signed", "Historical 90d POS CSVs Ingested", "Rent & Capex Baseline Mapped"]
  },
  {
    weeks: "W3–W4",
    phase: "PULSE DATA & POS INTEGRATION",
    owner: "Tech & POS Partner",
    focus: "Connecting existing POS to standard Recipe BOM (Bill of Materials) and automated nightly stock counts.",
    status: "Completed",
    deliverables: ["Recipe BOM Mapping (24 SKUs)", "Live Aggregator API Settlement Hook", "Nightly Stock WhatsApp Prompt Bot"]
  },
  {
    weeks: "W5–W6",
    phase: "KITCHEN TEST & STANDARDIZATION",
    owner: "Operations & Culinary QA",
    focus: "A/B test calibrated scoops vs sealed portion packs vs returnable trays. Hands-on kitchen hygiene audit.",
    status: "Active (Current)",
    deliverables: ["Portion Scoops Distributed", "Liquid Cheese Variance Tracking", "Hygiene & FSSAI Audit Round 1"]
  },
  {
    weeks: "W7–W9",
    phase: "LOCAL GTM & DEMAND SURGE",
    owner: "Growth Marketing",
    focus: "Geofenced pizza hours, hero-SKU digital vouchers, direct pickup app reorder with holdout catchments.",
    status: "Upcoming",
    deliverables: ["2-3km Catchment Geofencing", "Direct App Exclusive Deals", "Holdout Catchment A/B Lift Measurement"]
  },
  {
    weeks: "W10–W11",
    phase: "STORE REPAIR & LEAK PLUGGING",
    owner: "Regional Field Ops",
    focus: "Targeted remediation for 60-79 stores: rent renegotiation, waste reduction, staff retraining.",
    status: "Upcoming",
    deliverables: ["Review Rent Burden for Delhi/Gurugram", "Closure of Stock Leaks", "Escalation Gate Review for <60 Stores"]
  },
  {
    weeks: "W12",
    phase: "SCALE GATE DECISION",
    owner: "Board & Steering Committee",
    focus: "Expand network only if pilot contribution uplift, data integrity, and hygiene gates pass.",
    status: "Upcoming",
    deliverables: ["Board Scale Gate Audit (4 Gates)", "Franchise Co-Investment Fund Release", "Network-wide 100+ Stores Rollout Plan"]
  }
];

// Board Scale Gates Criteria (Slide 4)
const BOARD_SCALE_GATES = [
  {
    id: 1,
    title: "Data Integrity Gate",
    criteria: "≥98% paid-bill capture and ≥90% daily stock-count compliance across pilot stores.",
    currentValue: "96.4% bill capture | 88.0% stock compliance",
    target: "≥98.0% / ≥90.0%",
    status: "In Progress (On Track)",
    rag: "amber"
  },
  {
    id: 2,
    title: "Contribution Uplift Gate",
    criteria: "Median ≥₹15,000 incremental monthly store contribution after recurring costs.",
    currentValue: "+₹22,314 median uplift modeled (+₹39,754 full pilot target)",
    target: "≥₹15,000 / month / store",
    status: "Passed Scenario Threshold",
    rag: "green"
  },
  {
    id: 3,
    title: "Local Marketing ROI Gate",
    criteria: "Positive incremental return on local campaign spend; verified repeat customers, not redemptions alone.",
    currentValue: "Pilot GTM setup underway; baseline repeat rate tracked at 34.8%",
    target: "ROI > 1.25x & 2nd-order lift > 15%",
    status: "Scheduled for W7-W9",
    rag: "blue"
  },
  {
    id: 4,
    title: "Quality & Hygiene Gate",
    criteria: "No material hygiene/QA deterioration; independent audits & legal owner opt-in compliance.",
    currentValue: "Zero Critical FSSAI escalations; 8/10 stores rated Grade A",
    target: "100% Grade A/B+ and zero food safety breaches",
    status: "Passed Initial Gate",
    rag: "green"
  }
];
