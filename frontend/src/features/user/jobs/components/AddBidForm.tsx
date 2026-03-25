import { useForm, Controller } from 'react-hook-form'
import type { IBid } from '../jobInterface'
import { joiResolver } from '@hookform/resolvers/joi'
import { bidValidation } from '../../../../validations/customerValidation'
import { TIMELINE_OPTIONS } from "../jobData";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();


interface Props {
    onClose: () => void;
}


export default function AddBidForm({ onClose }: Props) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<IBid>({
        resolver: joiResolver(bidValidation),
        mode: "onBlur"
    })
    const onSubmit = (data: IBid) => {
        console.log(data)
        onClose()

    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>
                <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">Apply Bid on this Job Request</p>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Amount</label>
                            <input
                                type="number"
                                {...register("amount")}
                                 className="auth-input w-full"
                                placeholder="25000"
                            />
                            {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>}
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
                    </div>
                    <div>
                        <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Cover Note</label>
                        <textarea {...register("description")} rows={3} className="auth-input w-full" placeholder="Describe your approach, why you're a great fit for this project..." />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                    </div>
                    <div className="flex flex-col gap-3 pt-4">
                        {!isSubmitting ? (<button
                            type="submit"
                            className="auth-button">
                            Post Bid
                        </button>) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="auth-disabled-button">

                                <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>

                                Rejecting
                            </button>
                        )}
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 text-sm font-medium">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
