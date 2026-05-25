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
    return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
            <h2 className="text-4xl font-semibold text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>
            <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">Rejection Reason</p>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">name</label>
                        <input
                            {...register("full_name")}
                            type="text"
                            className="auth-input"
                            placeholder="Enter Your name"
                        />
                        <p className="text-sm text-error">{errors.full_name?.message}</p>
                    </div>


                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Phone</label>
                        <input
                            {...register("phone")}
                            type="text"
                            className="auth-input"
                            placeholder="Enter Your Phone Number"
                        />
                        <p className="text-sm text-error">{errors.phone?.message}</p>
                    </div>

                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">State</label>
                        <select {...register("state")} className="auth-input" defaultValue="">
                            <option value="" disabled>Select your state</option>
                            {INDIAN_STATES.map((state) => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                        <p className="text-sm text-error">{errors.state?.message}</p>
                    </div>


                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">District</label>
                        <input
                            {...register("district")}
                            type="text"
                            className="auth-input"
                            placeholder="Enter Your District"
                        />
                        <p className="text-sm text-error">{errors.district?.message}</p>
                    </div>

                </div>


                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">City</label>
                        <input
                            {...register("city")}
                            type="text"
                            className="auth-input"
                            placeholder="Enter Your City"
                        />
                        <p className="text-sm text-error">{errors.city?.message}</p>
                    </div>

                    {/* portfolio url */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Portfolio URL</label>
                        <input
                            {...register("portfolioUrl")}
                            type="text"
                            className="auth-input"
                            placeholder="https://yourportfolio.com"
                        />
                        <p className="text-sm text-error">{errors.portfolioUrl?.message}</p>
                    </div>
                </div>


                {/* bio */}
                <div>
                    <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Bio</label>
                    <textarea
                        {...register("bio")}
                        className="auth-input"
                        placeholder="Enter your bio"
                        rows={4}
                    />
                    <p className="text-sm text-error">{errors.bio?.message}</p>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                    {!isLoading ? (<button
                        type="submit"

                        className="auth-button">
                        Confirm & Update
                    </button>) : (
                        <button
                            type="submit"
                            disabled={isLoading}
                          className="auth-disabled-button flex items-center justify-center gap-2">

                            <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>

                            Updating
                        </button>
                    )}
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 text-sm font-medium">Cancel</button>
                </div>
                {dataError && <p className="text-sm text-error text-center">{dataError}</p>}
                {dataSuccess && <p className="text-sm text-success text-center">{dataSuccess}</p>}
            </form>

        </div>
    </div>


}



