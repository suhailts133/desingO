import { useFormContext } from "react-hook-form";
import { InputField } from "../../../../shared/form/InputField";
import { SelectField } from "../../../../shared/form/SelectField";
import { ReactSelectField } from "../../../../shared/form/ReactSelectField";
import { INDIAN_STATES } from "../../../designer/designerVerification/indianStates";
import { TIMELINE_OPTIONS } from "../jobData";
import type { IJobRequest } from "../jobInterface";



export default function LocationBudgetSection() {
    const { control, register, formState: { errors } } = useFormContext<IJobRequest>();

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-Jost-Semibold text-soft-black">7. Location, Budget & Timeline</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectField
                    label="State"
                    registration={register("state")}
                    options={INDIAN_STATES}
                    error={errors.state?.message}
                />
                <InputField label="District" registration={register("district")} error={errors.district?.message} />
                <InputField label="City" registration={register("city")} error={errors.city?.message} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                    label="PIN Code"
                    placeholder="6-digit PIN"
                    registration={register("pincode")}
                    error={errors.pincode?.message}
                />
                <InputField
                    label="Phone Number"
                    placeholder="+91 XXXXXXXXXX"
                    registration={register("phone")}
                    error={errors.phone?.message}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ReactSelectField
                    label="Project Timeline"
                    name="timeline"
                    control={control}
                    options={TIMELINE_OPTIONS}
                    error={errors.timeline?.message}
                />
                <InputField
                    type="number"
                    label="Min Design Budget (₹)"
                    placeholder="10000"
                    registration={register("minBudget", { valueAsNumber: true })}
                    error={errors.minBudget?.message}
                />
                <InputField
                    type="number"
                    label="Max Design Budget (₹)"
                    placeholder="30000"
                    registration={register("maxBudget", { valueAsNumber: true })}
                    error={errors.maxBudget?.message}
                />
            </div>
        </div>
    );
};