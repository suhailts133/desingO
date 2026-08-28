import type { SetURLSearchParams } from "react-router-dom";

export const createFilterChangeHandler = (setSearchParams: SetURLSearchParams) => (key: string, value: string | string[] | null) => {
    setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (!value || (Array.isArray(value) && value.length === 0)) {
            next.delete(key);
        } else if (Array.isArray(value)) {
            next.set(key, value.join(","));
        } else {
            next.set(key, value);
        }
        next.set("page", "1");
        return next;
    });
};