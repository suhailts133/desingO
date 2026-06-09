export const PLATFORM_FEE_RULES = {
    FREE: {
        MIN_AMOUNT: 0,
        PLATFORM_FEE: 0,
    },
    BASIC: {
        MIN_AMOUNT: 10000,
        PLATFORM_FEE: 1000,
    },
    STANDARD: {
        MIN_AMOUNT: 50000,
        PLATFORM_FEE: 5000,
    },
    PREMIUM: {
        MIN_AMOUNT: 100000,
        PLATFORM_FEE: 10000,
    },
} as const;