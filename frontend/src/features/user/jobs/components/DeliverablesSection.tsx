import { useFormContext } from "react-hook-form";
import { FileText, CheckCircle2 } from "lucide-react";
import { ReactSelectField } from "../../../../shared/form/ReactSelectField";
import type { IJobRequest } from "../jobInterface";
import { SERVICE_PRESETS } from "../jobData";



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
            <h3 className="text-lg font-Jost-Semibold text-soft-black flex items-center gap-2">
                <FileText className="w-5 h-5 text-blush-deep" /> 4. Drawing Deliverables Needed
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                    type="button"
                    onClick={() => handlePackageChange("CONCEPT")}
                    className={`p-3 rounded-xl border text-left transition-all ${servicePackageType === "CONCEPT"
                            ? "border-blush-deep bg-blush-pale/50 ring-2 ring-blush-deep"
                            : "border-gray-200 bg-white"
                        }`}
                >
                    <div className="font-semibold text-soft-black text-sm">Visuals & 3D Only</div>
                    <div className="text-[11px] text-gray-500 mt-1">2D layout + 3D realistic renders for styling.</div>
                </button>

                <button
                    type="button"
                    onClick={() => handlePackageChange("CONTRACTOR_READY")}
                    className={`p-3 rounded-xl border text-left transition-all ${servicePackageType === "CONTRACTOR_READY"
                            ? "border-blush-deep bg-blush-pale/50 ring-2 ring-blush-deep"
                            : "border-gray-200 bg-white"
                        }`}
                >
                    <div className="font-semibold text-soft-black text-sm flex items-center gap-1">
                        Contractor Ready <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">Complete working drawings (MEP, Carpentry, BOQ).</div>
                </button>

                <button
                    type="button"
                    onClick={() => handlePackageChange("CUSTOM")}
                    className={`p-3 rounded-xl border text-left transition-all ${servicePackageType === "CUSTOM"
                            ? "border-blush-deep bg-blush-pale/50 ring-2 ring-blush-deep"
                            : "border-gray-200 bg-white"
                        }`}
                >
                    <div className="font-semibold text-soft-black text-sm">Custom Selection</div>
                    <div className="text-[11px] text-gray-500 mt-1">Pick specific drawing sheets a la carte.</div>
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
                />
            )}
        </div>
    );
};