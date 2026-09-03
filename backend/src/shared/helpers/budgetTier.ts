enum BUDGET_TIER {
    BUDGET_FRIENDLY = "budget-friendly",
    MID_RANGE = "mid-range budget",
    UPSCALE = "upscale budget",
    PREMIUM = "premium high-end budget",
    LUXURY = "luxury ultra high-end budget",
}


const BUDGET_THRESHOLDS = {
    BUDGET_FRIENDLY_MAX: 50_000,
    MID_RANGE_MAX: 150_000,
    UPSCALE_MAX: 400_000,
    PREMIUM_MAX: 1_000_000,
};

export function getBudgetTier(minBudget: number, maxBudget: number): BUDGET_TIER {
    const avg = (minBudget + maxBudget) / 2;

    if (avg < BUDGET_THRESHOLDS.BUDGET_FRIENDLY_MAX) return BUDGET_TIER.BUDGET_FRIENDLY;
    if (avg < BUDGET_THRESHOLDS.MID_RANGE_MAX) return BUDGET_TIER.MID_RANGE;
    if (avg < BUDGET_THRESHOLDS.UPSCALE_MAX) return BUDGET_TIER.UPSCALE;
    if (avg < BUDGET_THRESHOLDS.PREMIUM_MAX) return BUDGET_TIER.PREMIUM;
    return BUDGET_TIER.LUXURY;
}