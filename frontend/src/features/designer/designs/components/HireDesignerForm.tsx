import { joiResolver } from "@hookform/resolvers/joi"

import { Controller, useForm } from "react-hook-form"
import { directHireValidation } from "../../../../validations/customerValidation"
import type { DirectHireFields, DirectHireFormPayload } from "../../../user/jobs/jobInterface"
import Select from "react-select"
import { TIMELINE_OPTIONS, UNIT_OPTIONS } from "../../../user/jobs/jobData"
import makeAnimated from "react-select/animated";
import SubmitButton from "../../../../shared/common/SubmitButton"
import { SERVICE_OPTIONS } from "../designData"
const animatedComponents = makeAnimated();

type Props = {
    isOpen: boolean
    onClose: () => void
    hireDesigner: (data: DirectHireFormPayload) => void,
    isLoading: boolean
}

export default function HireDesignerForm({ isOpen, onClose, hireDesigner ,isLoading}: Props) {

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<DirectHireFields>({
        resolver: joiResolver(directHireValidation, { abortEarly: false, allowUnknown: true }),
        mode: "onBlur",
    })


    const handleClose = () => {
        reset()
        onClose()
    }

    const onSubmit = async (data: DirectHireFormPayload) => {
        try {
            hireDesigner(data)
          
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
            <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">Hire Designer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      Form</p>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                        <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Length</label>
                        <input
                            type="number"
                            {...register("length")}
                            className="auth-input w-full"
                            placeholder="0"
                        />
                        {errors.length && (
                            <p className="text-xs text-red-500 mt-1">{errors.length.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Width</label>
                        <input
                            type="number"
                            {...register("width")}
                            className="auth-input w-full"
                            placeholder="0"
                        />
                        {errors.width && (
                            <p className="text-xs text-red-500 mt-1">{errors.width.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Ceiling Height</label>
                        <input
                            type="number"
                            {...register("ceilingHeight")}
                            className="auth-input w-full"
                            placeholder="0"
                        />
                        {errors.ceilingHeight && (
                            <p className="text-xs text-red-500 mt-1">{errors.ceilingHeight.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Unit</label>
                        <Controller
                            name={"unit"}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isMulti={false}
                                    options={UNIT_OPTIONS}
                                    components={animatedComponents}
                                    className="text-sm"
                                />
                            )}
                        />         {errors.unit && (
                            <p className="text-xs text-red-500 mt-1">{errors.unit.message}</p>
                        )}

                    </div>
                </div>
                <div>
                    <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                        {...register(`notes`)}
                        className="auth-input w-full"
                        placeholder="e.g. Has a bay window on the north wall"
                    />
                    {errors.notes && (
                        <p className="text-xs text-red-500 mt-1">{errors.notes.message}</p>
                    )}

                </div>
                <div>
                    <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Services</label>
                    <Controller
                        name="services"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} isMulti options={SERVICE_OPTIONS} components={animatedComponents} className="text-sm" />
                        )}
                    />
                    {errors.services && <p className="text-xs text-red-500 mt-1">{errors.services.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Project Timeline</label>
                    <Controller
                        name="timeLine"
                        control={control}

                        render={({ field }) => (
                            <Select
                                {...field}
                                isMulti={false}
                                options={TIMELINE_OPTIONS}
                                components={animatedComponents}
                                className="text-sm"
                                placeholder="Select a timeline..."
                            />
                        )}
                    />
                    {errors.timeLine && <p className="text-xs text-red-500 mt-1">{errors.timeLine.message}</p>}
                </div>
                <div className="flex flex-col gap-3 pt-4">

                    <SubmitButton isLoading={isLoading} label="Hire Designer" loadingLabel="Submitting" type="submit" />
                    <button type="button" onClick={handleClose} className="text-gray-500 hover:text-gray-800 text-sm font-medium cursor-pointer">Cancel</button>
                </div>
          
            </form>

        </div>
    </div>


}



