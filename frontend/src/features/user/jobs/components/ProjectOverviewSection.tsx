import { useFormContext } from "react-hook-form";
import { Home, Building2, Layers } from "lucide-react";
import { InputField } from "../../../../shared/form/InputField";
import { TextAreaField } from "../../../../shared/form/TextAreaField";
import { ReactSelectField } from "../../../../shared/form/ReactSelectField";
import { PROPERTY_OPTIONS } from "../../../designer/designs/designData";
import type { IJobRequest } from "../jobInterface";




export default function ProjectOverviewSection() {
    const { control, register, watch, setValue, formState: { errors } } = useFormContext<IJobRequest>();
    const projectType = watch("projectType");

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-Jost-Semibold text-soft-black flex items-center gap-2">
                <Home className="w-5 h-5 text-blush-deep" /> 1. Project Overview
            </h3>

            <div>
                <label className="block text-sm font-Jost-Semibold text-soft-black mb-2">Project Category</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setValue("projectType", "Renovation")}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-1 transition-all ${projectType === "Renovation"
                            ? "border-blush-deep bg-blush-pale/50 text-soft-black font-semibold ring-2 ring-blush-deep"
                            : "border-gray-200 bg-white hover:border-blush text-gray-600"
                            }`}
                    >
                        <Building2 className="w-6 h-6 text-blush-deep" />
                        <span>Renovation</span>
                        <span className="text-xs text-gray-400 font-normal">Remodeling existing space</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setValue("projectType", "New_Build")}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-1 transition-all ${projectType === "New_Build"
                            ? "border-blush-deep bg-blush-pale/50 text-soft-black font-semibold ring-2 ring-blush-deep"
                            : "border-gray-200 bg-white hover:border-blush text-gray-600"
                            }`}
                    >
                        <Layers className="w-6 h-6 text-blush-deep" />
                        <span>New Build Interior</span>
                        <span className="text-xs text-gray-400 font-normal">Bare-shell / Fresh structure</span>
                    </button>
                </div>
            </div>

            <InputField
                label="Project Title"
                placeholder="e.g. Modern Japandi 3BHK Transformation"
                registration={register("projectTitle")}
                error={errors.projectTitle?.message}
            />
            <ReactSelectField
                label="Property Type"
                name="propertyType"
                control={control}
                placeholder="Select property type (Apartment, Villa, Cafe...)"
                options={PROPERTY_OPTIONS}
                error={errors.propertyType?.message}
            />
            <TextAreaField
                label="Project Vision & Requirements"
                placeholder="Describe what you want to achieve, specific storage needs, or design challenges..."
                registration={register("description")}
                error={errors.description?.message}
            />
        </div>
    );
};