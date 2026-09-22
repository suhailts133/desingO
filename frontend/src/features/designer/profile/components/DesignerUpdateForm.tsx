import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"
import { INDIAN_STATES } from "../../designerVerification/indianStates"
import { DesignerprofileUpdationValidations } from "../../../../validations/profileValidation"
import type { DesignerProfileDTO, DesignerUpdateResponseDTO } from "../designerProfileInterface"
import { useEffect } from "react"

type Props = {
    data: DesignerProfileDTO
    isOpen: boolean
    dataError?: string
    dataSuccess?: string
    onClose: () => void
    updateProfileData: (data: DesignerUpdateResponseDTO) => void,
    isLoading: boolean
}

export default function DesignerUpdationForm({ data, isOpen, onClose, dataError, dataSuccess, updateProfileData, isLoading }: Props) {

    const { register, handleSubmit, formState: { errors } } = useForm<DesignerUpdateResponseDTO>({
        resolver: joiResolver(DesignerprofileUpdationValidations, { abortEarly: false, allowUnknown: true }),
        mode: "onBlur",
        defaultValues: data
    })

    useEffect(() => {
        if (dataSuccess) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [dataSuccess, onClose]);

    const onSubmit = async (data: DesignerUpdateResponseDTO) => {
        try {
            console.log(data)
            updateProfileData(data)
        } catch (err) {
            console.error("update failed", err);
        }
    };
    if (!isOpen) {
        return null
    }
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-xl bg-surface border border-surface-border rounded-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-text-primary mb-6 text-center font-Dynalight-Regular">designO</h2>
                <p className="text-center text-lg font-Jost-Semibold text-text-muted mb-6">Update Profile</p>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Name</label>
                            <input
                                {...register("full_name")}
                                type="text"
                                className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                                placeholder="Enter Your name"
                            />
                            <p className="text-sm text-error mt-1">{errors.full_name?.message}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Phone</label>
                            <input
                                {...register("phone")}
                                type="text"
                                className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                                placeholder="Enter Your Phone Number"
                            />
                            <p className="text-sm text-error mt-1">{errors.phone?.message}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">State</label>
                            <select 
                                {...register("state")} 
                                className="w-full bg-surface-hover border border-surface-border text-text-primary focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors cursor-pointer" 
                                defaultValue=""
                            >
                                <option value="" disabled className="text-text-faint">Select your state</option>
                                {INDIAN_STATES.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            <p className="text-sm text-error mt-1">{errors.state?.message}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">District</label>
                            <input
                                {...register("district")}
                                type="text"
                                className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                                placeholder="Enter Your District"
                            />
                            <p className="text-sm text-error mt-1">{errors.district?.message}</p>
                        </div>
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">City</label>
                            <input
                                {...register("city")}
                                type="text"
                                className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                                placeholder="Enter Your City"
                            />
                            <p className="text-sm text-error mt-1">{errors.city?.message}</p>
                        </div>

                        {/* portfolio url */}
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Portfolio URL</label>
                            <input
                                {...register("portfolioUrl")}
                                type="text"
                                className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                                placeholder="https://yourportfolio.com"
                            />
                            <p className="text-sm text-error mt-1">{errors.portfolioUrl?.message}</p>
                        </div>
                    </div>

                    {/* bio */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Bio</label>
                        <textarea
                            {...register("bio")}
                            className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                            placeholder="Enter your bio"
                            rows={4}
                        />
                        <p className="text-sm text-error mt-1">{errors.bio?.message}</p>
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-4">
                        {!isLoading ? (
                            <button
                                type="submit"
                                className="w-full py-2.5 bg-accent text-text-on-accent rounded-lg font-medium hover:bg-accent-hover active:bg-accent-active transition-colors"
                            >
                                Confirm & Update
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2.5 bg-surface-hover text-text-faint rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Updating
                            </button>
                        )}
                        <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors">Cancel</button>
                    </div>
                    {dataError && <p className="text-sm text-error text-center">{dataError}</p>}
                    {dataSuccess && <p className="text-sm text-success text-center">{dataSuccess}</p>}
                </form>

            </div>
        </div>
    );
}