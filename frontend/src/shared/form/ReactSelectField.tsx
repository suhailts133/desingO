import Select, { type Props as SelectProps, type GroupBase } from "react-select";
import makeAnimated from "react-select/animated";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

const animatedComponents = makeAnimated();

interface ReactSelectFieldProps<
    TFieldValues extends FieldValues,
    Option = unknown,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
> extends Omit<SelectProps<Option, IsMulti, Group>, "name"> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    label: string;
    error?: string;
}

export function ReactSelectField<
    TFieldValues extends FieldValues,
    Option = unknown,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
>({ name, control, label, error, options, placeholder = "Select...", isMulti = false as IsMulti, className = "", ...props }: ReactSelectFieldProps<TFieldValues, Option, IsMulti, Group>) {
    return (
        <div className="w-full">
       
                <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">
                    {label}
                </label>
         

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        isMulti={isMulti}
                        options={options}
                        components={animatedComponents}
                        placeholder={placeholder}
                        className={`text-sm ${className}`}
                        {...props}
                    />
                )}
            />

            {error && <p className="text-xs text-error mt-1">{error}</p>}
        </div>
    );
}