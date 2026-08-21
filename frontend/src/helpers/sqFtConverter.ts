const SQ_METER_TO_SQ_FT = 10.7639;

export const convertToSqFt = (area: number, unit: "ft" | "m"): number => {
    if (unit === "m") {
        return Math.round(area * SQ_METER_TO_SQ_FT * 100) / 100;
    }
    return area;
};