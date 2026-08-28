import React from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Layers, Upload, Trash2, FileText } from "lucide-react";
import { InputField } from "../../../../shared/form/InputField";
import { ReactSelectField } from "../../../../shared/form/ReactSelectField";
import type { IJobRequest } from "../jobInterface";
import { SPACE_OPTIONS } from "../../../designer/designs/designData";


interface SpaceScopeSectionProps {
    hideFloorPlanUpload?: boolean;
}


export default function SpaceScopeSection({ hideFloorPlanUpload = false }: SpaceScopeSectionProps) {
    const { control, register, setValue, formState: { errors } } = useFormContext<IJobRequest>();
    const requiresSiteVisit = useWatch({ control, name: "requiresSiteVisitMeasurement" });
    const areaUnit = useWatch({ control, name: "areaUnit" });
    const { fields: planFields, append: appendPlan, remove: removePlan } = useFieldArray({
        control,
        name: "floorPlans",
    });

    const handlePlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => appendPlan({ file: [file] }));
        e.target.value = "";
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-Jost-Semibold text-soft-black flex items-center gap-2">
                <Layers className="w-5 h-5 text-blush-deep" /> 3. Space Scope & Dimensions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                    <InputField
                        type="number"
                        label="Total Carpet Area"
                        placeholder="e.g. 1200"
                        registration={register("totalCarpetArea", { valueAsNumber: true })}
                        error={errors.totalCarpetArea?.message}
                    />
                </div>
                <div>
                    <label className="block text-sm font-Jost-Semibold text-soft-black mb-1">Unit</label>
                    <div className="flex gap-2">
                        {(["ft", "m"] as const).map((unit) => (
                            <button
                                type="button"
                                key={unit}
                                onClick={() => setValue("areaUnit", unit)}
                                className={`flex-1 py-2 rounded-lg border text-sm font-Jost-Semibold ${areaUnit === unit
                                    ? "bg-blush-deep text-white border-blush-deep"
                                    : "bg-white border-gray-300 text-gray-600"
                                    }`}
                            >
                                {unit === "ft" ? "Sq. Ft" : "Sq. M"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <ReactSelectField
                label="Rooms Included in Project"
                name="selectedRooms"
                isMulti={true}
                control={control}
                options={SPACE_OPTIONS}
                error={errors.selectedRooms?.message}
            />

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="siteVisit"
                        {...register("requiresSiteVisitMeasurement")}
                        className="h-4 w-4 accent-blush-deep rounded cursor-pointer"
                    />
                    <label htmlFor="siteVisit" className="text-sm font-Jost-Semibold text-soft-black cursor-pointer">
                        I don't have a floor plan — I need the designer to visit for on-site measurement
                    </label>
                </div>

                {!requiresSiteVisit && !hideFloorPlanUpload && (
                    <div className="pt-2">
                        <label className="block text-xs font-Jost-Semibold text-gray-500 mb-1">
                            Upload Blueprint / Builder Layout PDF up to 25MB
                        </label>
                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-blush-light rounded-xl p-4 cursor-pointer hover:border-blush-deep bg-white transition-colors">
                            <Upload className="w-5 h-5 text-blush-deep" />
                            <span className="text-sm text-soft-black font-medium">Click to upload Floor Plan(s)</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={handlePlanUpload}
                            />
                        </label>

                        {planFields.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {planFields.map((field, idx) => {
                                    const fileName = field.file?.[0]?.name;

                                    return (
                                        <div key={field.id} className="flex items-center justify-between p-2 bg-white rounded-lg border text-xs">
                                            <span className="flex items-center gap-2 truncate text-soft-black font-medium">
                                                <FileText className="w-4 h-4 text-blush-deep shrink-0" />
                                                {fileName || `Plan File ${idx + 1}`}
                                                <span className="shrink-0 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase bg-green-500">
                                                    New
                                                </span>
                                            </span>
                                            <button type="button" onClick={() => removePlan(idx)} className="text-error hover:text-red-700">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};