import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"

import { CustomerprofileUpdationValidations } from "../../../../validations/profileValidation"
import { useEffect } from "react"
import type { UserProfileResponseDTO, UserProfileUpdateDTO } from "../customerProfileInterfaces"
import { InputField } from "../../../../shared/form/InputField"
import SubmitButton from "../../../../shared/common/SubmitButton"


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
    return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/60 backdrop-blur-sm">
        <div className="relative w-full max-w-xl bg-surface border border-surface-border rounded-2xl p-8 animate-in zoom-in duration-200">
            <h2 className="text-4xl font-semibold text-accent mb-6 text-center font-Dynalight-Regular">designO</h2>
            <p className="text-center text-lg font-Jost-Semibold text-text-muted mb-6">Profile Update Form</p>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                <InputField label="Fullname" type="text" placeholder="John doe" registration={register("full_name")} error={errors.full_name?.message} />

                <div className="flex flex-col gap-3 pt-4">
                    <SubmitButton type="submit" label="Confirm & Update" loadingLabel="Updating" isLoading={isLoading} />
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full py-2.5 rounded-lg border border-surface-border bg-surface text-text-muted text-sm font-medium
                            hover:border-surface-border-strong hover:text-text-primary hover:bg-surface-hover
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-surface-border disabled:hover:text-text-muted disabled:hover:bg-surface
                            transition-colors duration-200"
                    >
                        Cancel
                    </button>
                </div>
                {dataError && <p className="text-sm text-error text-center">{dataError}</p>}
                {dataSuccess && <p className="text-sm text-success text-center">{dataSuccess}</p>}
            </form>

        </div>
    </div>


}