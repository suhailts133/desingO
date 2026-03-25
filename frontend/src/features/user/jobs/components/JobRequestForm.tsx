import { useForm, Controller, useFieldArray } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Plus, Ruler, Trash } from "lucide-react";
import { STYLE_OPTIONS, PROPERTY_OPTIONS, SPACE_OPTIONS } from "../../../designer/designs/designData";
import { TIMELINE_OPTIONS, UNIT_OPTIONS } from "../jobData";
import type { IJobRequest, IJobRequestPayload } from "../jobInterface";
import { joiResolver } from "@hookform/resolvers/joi";
import { jobRequestValidation } from "../../../../validations/customerValidation";
import { INDIAN_STATES } from "../../../designer/designerVerification/indianStates";
import { usePostJob } from "../hooks/usePostJob";

const animatedComponents = makeAnimated();


export default function JobRequestForm() {
    const {
        register, control, handleSubmit, formState: { errors } } = useForm<IJobRequest>({
            defaultValues: {
                rooms: [],
            },
            resolver: joiResolver(jobRequestValidation)
        });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rooms",
    });

    const { handleSubmission, isLoading, jobError, jobSuccess } = usePostJob()
    const onSubmit = async (data: IJobRequest) => {
        const payload: IJobRequestPayload = {
            projectTitle: data.projectTitle,
            propertyType: data.propertyType.label,
            city: data.city,
            district: data.district,
            phone: data.phone,
            state: data.state,
            timeline: data.timeline.label,
            budget: data.budget,
            description: data.description,
            designStyles: data.designStyles.map(({ label }) => label),
            rooms: data.rooms.map((room) => ({
                spaceType: room.spaceType.label,
                length: room.length,
                width: room.width,
                unit: room.unit.label,
                ceilingHeight: room.ceilingHeight || undefined,
                notes: room.notes || undefined
            })),
        }
        // console.log(payload)
        await handleSubmission(payload)
    }
    const addRoom = () => {
        append({
            spaceType: SPACE_OPTIONS[0],
            length: "",
            width: "",
            ceilingHeight: "",
            unit: { value: "ft", label: "ft" },
            notes: "",
        });
    };

    return (
        <div className="min-h-screen w-full flex justify-center items-start py-10 px-4">
            <div className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl shadow-blush/30 rounded-xl shadow-2xl p-8">

                <h2 className="text-4xl font-semibold text-center font-Dynalight-Regular mb-2 text-soft-black">designO</h2>
                <p className="text-center text-gray-400 font-Jost-Semibold mb-8 text-sm uppercase tracking-widest">Post a Job Request</p>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                    {/* Project Title & Property Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Project Title</label>
                            <input
                                {...register("projectTitle")}
                                className="auth-input w-full"
                                placeholder="e.g. Modern Living Room Redesign"
                            />
                            {errors.projectTitle && <p className="text-xs text-red-500 mt-1">{errors.projectTitle.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Property Type</label>
                            <Controller
                                name="propertyType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        isMulti={false}
                                        options={PROPERTY_OPTIONS}
                                        components={animatedComponents}
                                        className="text-sm"
                                        placeholder="Select property type..."
                                    />
                                )}
                            />
                            {errors.propertyType && <p className="text-xs text-red-500 mt-1">{errors.propertyType.message}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Description</label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            className="auth-input w-full"
                            placeholder="Describe your vision, requirements, or anything the designer should know..."
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                    </div>

                    {/* Design Styles */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Design Styles</label>
                        <Controller
                            name="designStyles"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isMulti
                                    options={STYLE_OPTIONS}
                                    components={animatedComponents}
                                    className="text-sm"
                                    placeholder="Select preferred styles..."
                                />
                            )}
                        />
                        {errors.designStyles && <p className="text-xs text-red-500 mt-1">{errors.designStyles.message}</p>}
                    </div>

                    {/* City, District, Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">City</label>
                            <input
                                {...register("city")}
                                className="auth-input w-full"
                                placeholder="e.g. Kochi"
                            />
                            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">District</label>
                            <input
                                {...register("district")}
                                className="auth-input w-full"
                                placeholder="e.g. Ernakulam"
                            />
                            {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Phone</label>
                            <input
                                {...register("phone")}
                                className="auth-input w-full"
                                placeholder="+91 XXXXX XXXXX"
                            />
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                        </div>
                    </div>

                    {/* Timeline & Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Project Timeline</label>
                            <Controller
                                name="timeline"
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
                            {errors.timeline && <p className="text-xs text-red-500 mt-1">{errors.timeline.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Budget (₹)</label>
                            <input
                                type="number"
                                {...register("budget")}
                                className="auth-input w-full"
                                placeholder="e.g. 50000"
                            />
                            {errors.budget && <p className="text-xs text-red-500 mt-1">{errors.budget.message}</p>}
                        </div>
                    </div>

                    <hr className="my-6 border-gray-100" />

                    {/* Rooms / Measurements */}
                    <div className="space-y-4">
                        <label className="block text-sm font-Jost-Semibold text-gray-700">Room Measurements</label>

                        {/* Add Room Button */}
                        <button
                            type="button"
                            onClick={addRoom}
                            className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors"
                        >
                            <div className="bg-gray-100 p-1.5 rounded-md">
                                <Ruler className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="flex flex-col overflow-hidden text-left">
                                <span className="text-sm text-gray-700 font-medium">Add a Room</span>
                                <span className="text-[11px] text-gray-400">
                                    {fields.length > 0 ? `${fields.length} room${fields.length > 1 ? "s" : ""} added` : "Select a space and enter measurements..."}
                                </span>
                            </div>
                            <Plus className="h-5 w-5 text-gray-400 ml-auto shrink-0" />
                        </button>
                        {errors.rooms && (
                            <p className="text-xs text-red-500 mt-1">{errors.rooms.message}</p>
                        )}
                        {/* Room Cards */}
                        {fields.length > 0 && (
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="relative p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-3"
                                    >
                                        {/* Remove button */}
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="absolute top-3 right-3  text-white p-1"
                                        >
                                            <Trash size={12} className="text-error" />
                                        </button>

                                        {/* Space type selector */}
                                        <div>
                                            <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Space Type</label>
                                            <Controller
                                                name={`rooms.${index}.spaceType`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        isMulti={false}
                                                        options={SPACE_OPTIONS}
                                                        components={animatedComponents}
                                                        className="text-sm"
                                                        placeholder="e.g. Living Room"
                                                    />
                                                )}
                                            />
                                            {errors.rooms?.[index]?.spaceType && (
                                                <p className="text-xs text-red-500 mt-1">{errors.rooms[index].spaceType?.message}</p>
                                            )}
                                        </div>

                                        {/* Dimensions row */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Length</label>
                                                <input
                                                    type="number"
                                                    {...register(`rooms.${index}.length`)}
                                                    className="auth-input w-full"
                                                    placeholder="0"
                                                />
                                                {errors.rooms?.[index]?.length && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.rooms[index].length?.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Width</label>
                                                <input
                                                    type="number"
                                                    {...register(`rooms.${index}.width`)}
                                                    className="auth-input w-full"
                                                    placeholder="0"
                                                />
                                                {errors.rooms?.[index]?.width && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.rooms[index].width?.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Ceiling Height</label>
                                                <input
                                                    type="number"
                                                    {...register(`rooms.${index}.ceilingHeight`)}
                                                    className="auth-input w-full"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Unit</label>
                                                <Controller
                                                    name={`rooms.${index}.unit`}
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
                                                />
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                                            <input
                                                {...register(`rooms.${index}.notes`)}
                                                className="auth-input w-full"
                                                placeholder="e.g. Has a bay window on the north wall"
                                            />
                                            {errors.rooms?.[index]?.notes && (
                                                <p className="text-xs text-red-500 mt-1">{errors.rooms[index].notes?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}
                    </div>

                    {!isLoading ? (
                        <button type="submit" className="auth-button">Post Job Request</button>
                    ) : (
                        <button type="submit" disabled={isLoading} className="auth-disabled-button">
                            <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Posting
                        </button>
                    )}
                </form>
                 {jobError && <p className="text-sm text-error text-center">{jobError}</p>}
      {jobSuccess && <p className="text-sm text-success text-center">{jobSuccess}</p>}
            </div>
        </div>
    );
}