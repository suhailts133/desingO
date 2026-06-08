import { useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { useGetProposalPrefillDataQuery } from "../proposalEndpoints"
import { useLocation, useNavigate } from "react-router-dom"
import { Plus, Trash2, GripVertical, ChevronDown, ChevronLeft, Info } from "lucide-react"

import type { CreateProposalDTO } from "../proposalInterface"
import { proposalValidation } from "../../../validations/proposalValidation"
import { useCreateProposal } from "../hooks/useCreateProposal"

export default function ProposalForm() {
    const location = useLocation()
    const navigate = useNavigate()
    const sourceType = location.state?.sourceType as "jobRequest" | "direct_hire" | undefined
    const sourceId = location.state?.sourceId as string | undefined

    const [dropdownOpen, setDropdownOpen] = useState(false)

    const { data, isLoading, error } = useGetProposalPrefillDataQuery(
        { sourceType: sourceType!, jobId: sourceId! },
        { skip: !sourceType || !sourceId }
    )
    const { isProposalCreating, proposalError, proposalSuccess, handleSubmission } = useCreateProposal()


    const prefill = data?.data

    const { register, control, handleSubmit, watch, formState: { errors }, } = useForm<CreateProposalDTO>({
        resolver: joiResolver(proposalValidation),
        defaultValues: {
            sourceId: sourceId,
            sourceType: sourceType,
            drawingFeePerSqFt: 0,
            advanceFee: 0,
            services: [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "services",
    })


    const addedServiceNames = fields.map((f) => f.serviceName)


    const availableServices = (prefill?.services ?? []).filter((s) => !addedServiceNames.includes(s))

    const handleAddService = (serviceName: string) => {
        append({
            serviceName,
            order: fields.length + 1,
            price: 0,
            executionPrice: 0,
            expectedDeliveryDate: new Date(),
        })
        setDropdownOpen(false)
    }

    const handleRemoveService = (index: number) => {
        remove(index)
    }

    const onSubmit = async (formData: CreateProposalDTO) => {
        const success = await handleSubmission(formData)

        if (success) {
            setTimeout(() => navigate(-1), 2000)
        }
    }


    if (!sourceType || !sourceId) {
        return (
            <div className="w-full flex flex-col gap-6">
                <div className="p-10 text-center text-red-500 font-Jost-Semibold">
                    Invalid proposal source.
                </div>
            </div>
        )
    }
    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-6">
                <div className="p-10 text-center animate-pulse text-soft-black/40">
                    Loading...
                </div>
            </div>
        )
    }


    if (error || !prefill) {
        return (
            <div className="w-full flex flex-col gap-6">
                <div className="p-10 text-center text-red-500 font-Jost-Semibold">
                    Something went wrong. Please try again.
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-soft-black/50 hover:text-soft-black transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="font-Jost-Semibold text-xl text-soft-black">Create proposal</h1>
                    <p className="text-xs text-soft-black mt-0.5">
                        Budget range: ₹{prefill.minPrice.toLocaleString("en-IN")} – ₹{prefill.maxPrice.toLocaleString("en-IN")}
                        &nbsp;·&nbsp; {prefill.sqft} sqft  &nbsp;·&nbsp;{prefill.timeLine} time line
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

                {/* Hidden fields */}
                <input type="hidden" {...register("sourceId")} />
                <input type="hidden" {...register("sourceType")} />

                {/* Contract details */}
                <div className="bg-white rounded-2xl border border-blush-light/40 shadow-sm px-6 py-5">
                    <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black/40 mb-4">
                        Contract details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        {/* Drawing fee per sqft */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-soft-black/60">
                                Drawing fee per sqft (₹)
                            </label>
                            <input
                                type="number"
                                {...register("drawingFeePerSqFt", { valueAsNumber: true })}
                                placeholder="e.g. 10"
                                className="w-full px-3 py-2.5 rounded-xl border border-blush-light/50 bg-off-white text-sm text-soft-black placeholder:text-soft-black/30 focus:outline-none focus:border-blush-deep transition-colors"
                            />
                            {errors.drawingFeePerSqFt && (
                                <p className="text-xs text-red-500">{errors.drawingFeePerSqFt.message}</p>
                            )}
                            {/* calculated total */}
                            <p className="text-xs text-soft-black/40">
                                Total: ₹{((watch("drawingFeePerSqFt") || 0) * prefill.sqft).toLocaleString("en-IN")}
                            </p>
                        </div>


                        {/* Expected completion date */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-soft-black/60">
                                Expected completion date
                            </label>
                            <Controller
                                control={control}
                                name="expectedCompletionDate"
                                render={({ field }) => (
                                    <input
                                        type="date"
                                        value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                        className="w-full px-3 py-2.5 rounded-xl border border-blush-light/50 bg-off-white text-sm text-soft-black focus:outline-none focus:border-blush-deep transition-colors"
                                    />
                                )}
                            />
                            {errors.expectedCompletionDate && (
                                <p className="text-xs text-red-500">{errors.expectedCompletionDate.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Services */}
                <div className="bg-white rounded-2xl border border-blush-light/40 shadow-sm px-6 py-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black/40">
                            Services
                        </h2>

                        {/* Dropdown to add service */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setDropdownOpen((v) => !v)}
                                disabled={availableServices.length === 0}
                                className="inline-flex items-center gap-2 pWx-4 py-2 rounded-xl bg-soft-black text-off-white text-xs font-medium hover:bg-blush-deep transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add service
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {dropdownOpen && availableServices.length > 0 && (
                                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-blush-light/40 rounded-xl shadow-lg z-10 overflow-hidden">
                                    {availableServices.map((service) => (
                                        <button
                                            key={service}
                                            type="button"
                                            onClick={() => handleAddService(service)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-soft-black hover:bg-blush-pale hover:text-blush-deep transition-colors"
                                        >
                                            {service}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service error */}
                    {errors.services?.root && (
                        <p className="text-xs text-red-500 mb-3">{errors.services.root.message}</p>
                    )}

                    {fields.length === 0 && (
                        <div className="flex items-center gap-2 px-4 py-8 rounded-xl border border-dashed border-blush-light/60 text-center justify-center">
                            <Info className="w-4 h-4 text-soft-black/30" />
                            <p className="text-sm text-soft-black/30">Add services from the dropdown above</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="rounded-xl border border-blush-light/40 bg-blush-pale/10 overflow-hidden"
                            >
                                {/* Service header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-blush-pale/30 border-b border-blush-light/30">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-4 h-4 text-soft-black/20" />
                                        <span className="text-xs font-medium text-soft-black/50">#{index + 1}</span>
                                        <span className="text-sm font-Jost-Semibold text-soft-black">
                                            {field.serviceName}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveService(index)}
                                        className="text-soft-black/30 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Hidden fields */}
                                <input type="hidden" {...register(`services.${index}.serviceName`)} />
                                <input type="hidden" {...register(`services.${index}.order`)} value={index + 1} />

                                {/* Service fields */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-soft-black/50">Price (₹)</label>
                                        <input
                                            type="number"
                                            {...register(`services.${index}.price`, { valueAsNumber: true })}
                                            placeholder="e.g. 5000"
                                            className="w-full px-3 py-2 rounded-lg border border-blush-light/50 bg-white text-sm text-soft-black placeholder:text-soft-black/30 focus:outline-none focus:border-blush-deep transition-colors"
                                        />
                                        {errors.services?.[index]?.price && (
                                            <p className="text-xs text-red-500">{errors.services[index]?.price?.message}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-soft-black/50">Execution price (₹)</label>
                                        <input
                                            type="number"
                                            {...register(`services.${index}.executionPrice`, { valueAsNumber: true })}
                                            placeholder="e.g. 2000"
                                            className="w-full px-3 py-2 rounded-lg border border-blush-light/50 bg-white text-sm text-soft-black placeholder:text-soft-black/30 focus:outline-none focus:border-blush-deep transition-colors"
                                        />
                                        {errors.services?.[index]?.executionPrice && (
                                            <p className="text-xs text-red-500">{errors.services[index]?.executionPrice?.message}</p>
                                        )}
                                    </div>


                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-soft-black/50">Expected delivery</label>
                                        <Controller
                                            control={control}
                                            name={`services.${index}.expectedDeliveryDate`}
                                            render={({ field }) => (
                                                <input
                                                    type="date"
                                                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                    className="w-full px-3 py-2 rounded-lg border border-blush-light/50 bg-white text-sm text-soft-black focus:outline-none focus:border-blush-deep transition-colors"
                                                />
                                            )}
                                        />
                                        {errors.services?.[index]?.expectedDeliveryDate && (
                                            <p className="text-xs text-red-500">{errors.services[index]?.expectedDeliveryDate?.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                {fields.length > 0 && (
                    <div className="bg-white rounded-2xl border border-blush-light/40 shadow-sm px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black/40 mb-4">
                            Summary
                        </h2>
                        <div className="flex flex-col gap-2 text-sm">
                            {[
                                {
                                    label: "Drawing fee",
                                    value: `₹${((watch("drawingFeePerSqFt") || 0) * prefill.sqft).toLocaleString("en-IN")}`
                                },
                                {
                                    label: "Total service price",
                                    value: `₹${watch("services").reduce((acc, s) => acc + (s.price || 0), 0).toLocaleString("en-IN")}`
                                },
                                {
                                    label: "Total execution price",
                                    value: `₹${watch("services").reduce((acc, s) => acc + (s.executionPrice || 0), 0).toLocaleString("en-IN")}`
                                },
                                {
                                    label: "Advance fee",
                                    value: `₹${(watch("advanceFee") || 0).toLocaleString("en-IN")}`
                                },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between">
                                    <span className="text-soft-black/50">{label}</span>
                                    <span className="font-medium text-soft-black">{value}</span>
                                </div>
                            ))}
                            <div className="h-px bg-blush-light/40 my-1" />
                            <div className="flex items-center justify-between">
                                <span className="font-Jost-Semibold text-soft-black">Total contract value</span>
                                <span className="font-Jost-Semibold text-soft-black">
                                    ₹{(
                                        ((watch("drawingFeePerSqFt") || 0) * prefill.sqft) +
                                        watch("services").reduce((acc, s) => acc + (s.price || 0) + (s.executionPrice || 0), 0)
                                    ).toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>
                    </div>
                )}


              

                <div className="flex flex-col gap-3">

                    {proposalError && (
                        <p className="text-sm text-red-500 text-center">{proposalError}</p>
                    )}
                    {proposalSuccess && (
                        <p className="text-sm text-green-600 text-center">{proposalSuccess}</p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 rounded-xl border border-blush-light/50 bg-off-white text-soft-black text-sm font-medium hover:bg-blush-pale transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isProposalCreating || fields.length === 0}
                            className="px-6 py-2.5 rounded-xl bg-soft-black text-off-white text-sm font-medium hover:bg-blush-deep transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isProposalCreating ? "Submitting..." : "Submit proposal"}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    )
}
