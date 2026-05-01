import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"

import { CustomerprofileUpdationValidations } from "../../../../validations/profileValidation"
import { useEffect } from "react"
import type { UserProfileResponseDTO, UserProfileUpdateDTO } from "../customerProfileInterfaces"


type Props = {
    data: UserProfileResponseDTO
    isOpen: boolean
    dataError?: string
    dataSuccess?: string
    onClose: () => void
    updateProfileData: (data: UserProfileUpdateDTO) => void,
    isLoading: boolean

}

export default function CustomerUpdationForm({ data, isOpen, onClose, dataError, dataSuccess, updateProfileData, isLoading }: Props) {

    const { register, handleSubmit, formState: { errors } } = useForm<UserProfileUpdateDTO>({
        resolver: joiResolver(CustomerprofileUpdationValidations, { abortEarly: false, allowUnknown: true }),
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


    const onSubmit = async (data: UserProfileUpdateDTO) => {
        try {
       
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
            <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">Profile Update Form</p>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

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

                <div className="flex flex-col gap-3 pt-4">
                    {!isLoading ? (<button
                        type="submit"

                        className="auth-button">
                        Confirm & Update
                    </button>) : (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="auth-disabled-button">

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



