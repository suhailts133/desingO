import type { SelectOption } from "../features/designer/designs/designInterface";

export const fromOptions = (options: SelectOption[]): string[] =>
    options.map((opt) => opt.value);


export const toOption = (label: string): SelectOption => ({ value: label, label });
export const toOptions = (labels: string[] = []): SelectOption[] => labels.map(toOption);
