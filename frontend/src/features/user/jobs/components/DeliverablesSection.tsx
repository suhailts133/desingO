import { useFormContext } from "react-hook-form";
import { FileText, CheckCircle2 } from "lucide-react";
import { ReactSelectField } from "../../../../shared/form/ReactSelectField";
import type { IJobRequest } from "../jobInterface";
import { SERVICE_PRESETS } from "../jobData";
import { selectStyles } from "../../../../shared/filter/selectStyle";
import type { StylesConfig } from "react-select";
import type { OptionType } from "../../../common/baseData";



export default function DeliverablesSection() {
    const { control, setValue, watch, formState: { errors } } = useFormContext<IJobRequest>();
    const servicePackageType = watch("servicePackageType");

    const handlePackageChange = (type: "CONCEPT" | "CONTRACTOR_READY" | "CUSTOM") => {
        setValue("servicePackageType", type);
        if (type === "CONCEPT") setValue("services", SERVICE_PRESETS.CONCEPT);
        if (type === "CONTRACTOR_READY") setValue("services", SERVICE_PRESETS.CONTRACTOR_READY);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-Jost-Semibold text-text-primary flex items-center gap-2">
                <FileText className="w-5 h-5 text-text-faint" /> 4. Drawing Deliverables Needed
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                    type="button"
                    onClick={() => handlePackageChange("CONCEPT")}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${servicePackageType === "CONCEPT"
                            ? "border-accent bg-accent-tint"
                            : "border-surface-border bg-surface hover:border-accent"
                        }`}
                >
                    <div className="font-semibold text-text-primary text-sm">Visuals & 3D Only</div>
                    <div className="text-[11px] text-text-faint mt-1">2D layout + 3D realistic renders for styling.</div>
                </button>

                <button
                    type="button"
                    onClick={() => handlePackageChange("CONTRACTOR_READY")}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${servicePackageType === "CONTRACTOR_READY"
                            ? "border-accent bg-accent-tint"
                            : "border-surface-border bg-surface hover:border-accent"
                        }`}
                >
                    <div className="font-semibold text-text-primary text-sm flex items-center gap-1">
                        Contractor Ready <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    </div>
                    <div className="text-[11px] text-text-faint mt-1">Complete working drawings (MEP, Carpentry, BOQ).</div>
                </button>

                <button
                    type="button"
                    onClick={() => handlePackageChange("CUSTOM")}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${servicePackageType === "CUSTOM"
                            ? "border-accent bg-accent-tint"
                            : "border-surface-border bg-surface hover:border-accent"
                        }`}
                >
                    <div className="font-semibold text-text-primary text-sm">Custom Selection</div>
                    <div className="text-[11px] text-text-faint mt-1">Pick specific drawing sheets a la carte.</div>
                </button>
            </div>

            {servicePackageType === "CUSTOM" && (
                <ReactSelectField
                    label="Select Required Technical Drawings"
                    name="services"
                    isMulti={true}
                    control={control}
                    options={SERVICE_PRESETS.CONTRACTOR_READY}
                    error={errors.services?.message}
                    styles={selectStyles as StylesConfig<OptionType, true>}
                />
            )}
        </div>
    );
};