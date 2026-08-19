import { useFormContext } from "react-hook-form";
import { Users } from "lucide-react";
import { InputField } from "../../../../shared/form/InputField";
import type { IJobRequest } from "../jobInterface";

export default function HouseholdProfileSection() {
    const { register, watch, formState: { errors } } = useFormContext<IJobRequest>();
    const hasPets = watch("householdProfile.hasPets");

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-Jost-Semibold text-soft-black flex items-center gap-2">
                <Users className="w-5 h-5 text-blush-deep" /> 6. Household Profile
            </h3>

            <div className="grid grid-cols-3 gap-3">
                <InputField
                    type="number"
                    label="Adults"
                    registration={register("householdProfile.adultsCount", { valueAsNumber: true })}
                />
                <InputField
                    type="number"
                    label="Kids"
                    registration={register("householdProfile.kidsCount", { valueAsNumber: true })}
                />
                <InputField
                    type="number"
                    label="Seniors"
                    registration={register("householdProfile.seniorsCount", { valueAsNumber: true })}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="hasPets"
                        {...register("householdProfile.hasPets")}
                        className="h-4 w-4 accent-blush-deep rounded cursor-pointer"
                    />
                    <label htmlFor="hasPets" className="text-sm font-Jost-Semibold text-soft-black cursor-pointer">
                        We have pets in the house
                    </label>
                </div>

                {hasPets && (
                    <InputField
                        label="Pet Details"
                        placeholder="e.g. 2 Persian Cats (Need scratch-resistant fabrics)"
                        registration={register("householdProfile.petDetails")}
                        error={errors.householdProfile?.petDetails?.message}
                    />
                )}
            </div>
        </div>
    );
};