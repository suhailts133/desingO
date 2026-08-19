import { useFormContext } from "react-hook-form";
import { Compass } from "lucide-react";
import { InputField } from "../../../../shared/form/InputField";
import type { IJobRequest } from "../jobInterface";

const RENOVATION_LEVELS = [
    { id: "DECOR_ONLY", title: "Cosmetic Refresh", desc: "Paint, styling, loose furniture" },
    { id: "ROOMS_UPGRADE", title: "Partial Upgrade", desc: "Modular kitchen, wardrobes, tiles" },
    { id: "COMPLETE_MAKEOVER", title: "Full Redesign", desc: "Civil, rewiring, full overhaul" },
] as const;

const NEW_BUILD_STAGES = [
    { id: "PLANNING", title: "Off-Plan / Architectural", desc: "Not yet built" },
    { id: "UNDER_CONSTRUCTION", title: "Under Construction", desc: "Brickwork / Plastering" },
    { id: "BARE_SHELL_READY", title: "Bare Shell Handed Over", desc: "Keys received" },
] as const;

export default function SpaceStatusSection() {
    const { register, watch, setValue, formState: { errors } } = useFormContext<IJobRequest>();
    const projectType = watch("projectType");
    const renovationLevel = watch("renovationDetails.level");
    const newbuildStage = watch("newbuildDetails.stage");

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-Jost-Semibold text-soft-black flex items-center gap-2">
                <Compass className="w-5 h-5 text-blush-deep" /> 2. Space Status & Constraints
            </h3>

            {projectType === "Renovation" ? (
                <div className="p-4 bg-linen-rose rounded-xl border border-blush-light space-y-4">
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-soft-black mb-1">Renovation Level</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {RENOVATION_LEVELS.map((lvl) => (
                                <button
                                    type="button"
                                    key={lvl.id}
                                    onClick={() => setValue("renovationDetails.level", lvl.id as any)}
                                    className={`p-3 text-left rounded-lg border text-xs ${renovationLevel === lvl.id
                                            ? "bg-blush-pale border-blush-deep text-soft-black font-semibold"
                                            : "bg-white border-gray-200 text-gray-600"
                                        }`}
                                >
                                    <div className="font-semibold text-sm">{lvl.title}</div>
                                    <div className="text-gray-400 mt-0.5">{lvl.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <InputField
                            label="Property Age (Years)"
                            type="number"
                            placeholder="e.g. 5"
                            registration={register("renovationDetails.propertyAgeYears")}
                            error={errors.renovationDetails?.propertyAgeYears?.message}
                        />

                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="livingIn"
                                {...register("renovationDetails.livingInDuringRenovation")}
                                className="h-4 w-4 accent-blush-deep rounded cursor-pointer"
                            />
                            <label htmlFor="livingIn" className="text-sm font-Jost-Semibold text-soft-black cursor-pointer">
                                Will you be living in the house during renovation?
                            </label>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-linen-rose rounded-xl border border-blush-light space-y-4">
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-soft-black mb-1">Construction Stage</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {NEW_BUILD_STAGES.map((stg) => (
                                <button
                                    type="button"
                                    key={stg.id}
                                    onClick={() => setValue("newbuildDetails.stage", stg.id as any)}
                                    className={`p-3 text-left rounded-lg border text-xs ${newbuildStage === stg.id
                                            ? "bg-blush-pale border-blush-deep text-soft-black font-semibold"
                                            : "bg-white border-gray-200 text-gray-600"
                                        }`}
                                >
                                    <div className="font-semibold text-sm">{stg.title}</div>
                                    <div className="text-gray-400 mt-0.5">{stg.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="vastu"
                            {...register("newbuildDetails.vastuCompliantRequired")}
                            className="h-4 w-4 accent-blush-deep rounded cursor-pointer"
                        />
                        <label htmlFor="vastu" className="text-sm font-Jost-Semibold text-soft-black cursor-pointer">
                            Design must follow Vastu / Directional guidelines
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};