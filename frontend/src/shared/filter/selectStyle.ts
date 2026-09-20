import type { StylesConfig, GroupBase } from "react-select";

// Shared dark-theme styling for every react-select instance in the app.
// react-select renders its own inline styles rather than reading Tailwind
// classes, so the theme tokens have to be passed in explicitly here.
//
// Usage:
//   import { selectStyles } from "../../shared/selectStyles";
//   <Select styles={selectStyles as StylesConfig<OptionType, true>} ... />   // multi-select
//   <Select styles={selectStyles as StylesConfig<OptionType, false>} ... />  // single-select
//
// The generic <OptionType> below is a placeholder shape — cast to your own
// option type at the call site the same way you'd cast IsMulti.
export const selectStyles: StylesConfig<{ label: string; value: string }, boolean, GroupBase<{ label: string; value: string }>> = {
    control: (base, state) => ({
        ...base,
        backgroundColor: "var(--color-surface)",
        borderColor: state.isFocused ? "var(--color-accent)" : "var(--color-surface-border)",
        boxShadow: "none",
        borderRadius: "0.5rem",
        minHeight: "38px",
        "&:hover": {
            borderColor: "var(--color-accent)",
        },
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-surface-border)",
        borderRadius: "0.5rem",
        overflow: "hidden",
        zIndex: 20,
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? "var(--color-accent-tint)"
            : state.isFocused
                ? "var(--color-surface-hover)"
                : "transparent",
        color: state.isSelected ? "var(--color-accent-tint-text)" : "var(--color-text-primary)",
        cursor: "pointer",
    }),
    singleValue: (base) => ({
        ...base,
        color: "var(--color-text-primary)",
    }),
    input: (base) => ({
        ...base,
        color: "var(--color-text-primary)",
    }),
    placeholder: (base) => ({
        ...base,
        color: "var(--color-text-faint)",
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: "var(--color-accent-tint)",
        borderRadius: "9999px",
        overflow: "hidden",
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: "var(--color-accent-tint-text)",
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: "var(--color-accent-tint-text)",
        "&:hover": {
            backgroundColor: "var(--color-accent)",
            color: "var(--color-text-on-accent)",
        },
    }),
    indicatorSeparator: (base) => ({
        ...base,
        backgroundColor: "var(--color-surface-border)",
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: "var(--color-text-faint)",
        "&:hover": {
            color: "var(--color-text-muted)",
        },
    }),
    clearIndicator: (base) => ({
        ...base,
        color: "var(--color-text-faint)",
        "&:hover": {
            color: "var(--color-error)",
        },
    }),
};