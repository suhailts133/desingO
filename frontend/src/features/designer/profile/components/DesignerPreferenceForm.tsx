import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import type { IDesignerPreference, IDesignerPreferencePayload } from "../designerProfileInterface";
import { designerPreferenceValidation } from "../../../../validations/designerPrefernce";
import { ReactSelectField } from "../../../../shared/form/ReactSelectField";
import { PROPERTY_OPTIONS, STYLE_OPTIONS } from "../../designs/designData";
import { toOptions } from "../../../../helpers/optionHelper";
import type { StylesConfig } from "react-select";
import { selectStyles } from "../../../../shared/filter/selectStyle";
import type { OptionType } from "../../../common/baseData";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    data?: IDesignerPreference
    isLoading: boolean;
    updatePreferences: (data: IDesignerPreferencePayload) => void;
}

export default function DesignerPreferenceForm({ data, isOpen, onClose, isLoading, updatePreferences, }: Props) {
    const { control, handleSubmit, formState: { errors } } = useForm<IDesignerPreferencePayload>({
        resolver: joiResolver(designerPreferenceValidation),
        mode: "onBlur",
        defaultValues: data ? {
            designStyle: toOptions(data.designStyle),
            propertyType: toOptions(data.propertyType),
        } : undefined,
    });

    if (!isOpen) return null;

    const onSubmit = (payload: IDesignerPreferencePayload) => {
        updatePreferences(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-xl bg-surface border border-surface-border rounded-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-text-primary mb-6 text-center font-Dynalight-Regular">
                    designO
                </h2>

                <p className="text-center text-xs font-semibold tracking-widest uppercase text-text-faint mb-6">
                    Edit Preferences
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <ReactSelectField
                        label="Property Type"
                        name="propertyType"
                        control={control}
                        isMulti={true}
                        placeholder="Select property type (Apartment, Villa, Cafe...)"
                        options={PROPERTY_OPTIONS}
                        error={errors.propertyType?.message}
                        styles={selectStyles as StylesConfig<OptionType, true>}
                    />

                    <ReactSelectField
                        label="Design Styles"
                        name="designStyle"
                        isMulti={true}
                        control={control}
                        options={STYLE_OPTIONS}
                        error={errors.designStyle?.message}
                        styles={selectStyles as StylesConfig<OptionType, true>}
                    />

                    <div className="flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg border border-transparent text-text-muted text-xxs bg-surface-border font-semibold tracking-widest uppercase hover:bg-surface-hover hover:text-text-primary transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 rounded-lg bg-accent text-text-on-accent text-xxs font-semibold tracking-widest uppercase hover:bg-accent-hover active:bg-accent-active transition-colors duration-200 disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Save Preferences"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}