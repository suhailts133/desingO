import { PLATFORM_FEE_RULES } from "../enums/platformfee.js";

export function calculatePlatformFee(totalDrawingFee: number): number {
    if (totalDrawingFee >= PLATFORM_FEE_RULES.PREMIUM.MIN_AMOUNT) {
        return PLATFORM_FEE_RULES.PREMIUM.PLATFORM_FEE;
    }

    if (totalDrawingFee >= PLATFORM_FEE_RULES.STANDARD.MIN_AMOUNT) {
        return PLATFORM_FEE_RULES.STANDARD.PLATFORM_FEE;
    }

    if (totalDrawingFee >= PLATFORM_FEE_RULES.BASIC.MIN_AMOUNT) {
        return PLATFORM_FEE_RULES.BASIC.PLATFORM_FEE;
    }

    return PLATFORM_FEE_RULES.FREE.PLATFORM_FEE;
}


