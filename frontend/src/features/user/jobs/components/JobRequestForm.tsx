import { useForm, Controller, useFieldArray } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { ImageIcon, Plus, Ruler, Trash, X } from "lucide-react";
import { STYLE_OPTIONS, PROPERTY_OPTIONS, SPACE_OPTIONS, SERVICE_OPTIONS } from "../../../designer/designs/designData";
import { TIMELINE_OPTIONS, UNIT_OPTIONS } from "../jobData";
import type { IJobRequest } from "../jobInterface";
import { joiResolver } from "@hookform/resolvers/joi";
import { jobRequestValidation } from "../../../../validations/customerValidation";
import { INDIAN_STATES } from "../../../designer/designerVerification/indianStates";
import { usePostJob } from "../hooks/usePostJob";
import { useEffect, useState, type ChangeEvent } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import SubmitButton from "../../../../shared/common/SubmitButton";
const animatedComponents = makeAnimated();


export default function JobRequestForm() {

    const [refrenceImagesPreview, setRefrenceImagesPreview] = useState<string[]>([]);
    const {
        register, control, handleSubmit, watch, formState: { errors } } = useForm<IJobRequest>({
            defaultValues: {
                rooms: [],
                refrenceImages: []
            },
            resolver: joiResolver(jobRequestValidation),

        });

    const watchRefrenceImages = watch("refrenceImages")
    useEffect(() => {
        if (!watchRefrenceImages) return;

        const previews = watchRefrenceImages
            .filter(item => item.file && item.file[0])
            .map(item => URL.createObjectURL(item.file[0]));

        setRefrenceImagesPreview(previews);

        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [watchRefrenceImages]);


    const {
        fields: roomFields,
        append: roomAppend,
        remove: roomRemove
    } = useFieldArray({ control, name: "rooms" })

    const {
        fields: refrenceFields,
        append: refrenceAppend,
        remove: refrenceRemove
    } = useFieldArray({ control, name: "refrenceImages" })


    const { handleSubmission, isLoading, jobError, jobSuccess } = usePostJob()
    const onSubmit = async (data: IJobRequest) => {
        const formData = new FormData();

        formData.append("projectTitle", data.projectTitle);
        formData.append("propertyType", data.propertyType.label);
        formData.append("city", data.city);
        formData.append("district", data.district);
        formData.append("phone", data.phone);
        formData.append("state", data.state);
        formData.append("timeline", data.timeline.label);
        formData.append("minBudget", String(data.minBudget));
        formData.append("maxBudget", String(data.maxBudget));
        formData.append("description", data.description);

        data.designStyles.forEach(({ label }, i) => {
            formData.append(`designStyles[${i}]`, label);
        });
        data.services.forEach(({ label }, i) => {
            formData.append(`services[${i}]`, label);
        });

        data.rooms.forEach((room, i) => {
            formData.append(`rooms[${i}][spaceType]`, room.spaceType.label);
            formData.append(`rooms[${i}][length]`, String(room.length));
            formData.append(`rooms[${i}][width]`, String(room.width));
            formData.append(`rooms[${i}][unit]`, room.unit.label);
            if (room.ceilingHeight) formData.append(`rooms[${i}][ceilingHeight]`, String(room.ceilingHeight));
            if (room.notes) formData.append(`rooms[${i}][notes]`, room.notes);
        });

        data.refrenceImages?.forEach((item) => {
            const file = item.file?.[0]
            if (file) {
                formData.append("refrenceImages", file)

            }
        });

        console.log([...formData.entries()])
        await handleSubmission(formData);
    };
    const addRoom = () => {
        roomAppend({
            spaceType: SPACE_OPTIONS[0],
            length: "",
            width: "",
            ceilingHeight: "",
            unit: { value: "ft", label: "ft" },
            notes: "",
        });
    };

    const handleRefrenceImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        selectedFiles.forEach(file => {
            refrenceAppend({
                file: [file]
            });
        });
        e.target.value = "";
    };

    return (
        <div className="min-h-screen w-full flex justify-center items-start py-10 px-4">
            <div className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl shadow-blush/30 rounded-xl shadow-2xl p-8">

                <h2 className="text-4xl font-semibold text-center font-Dynalight-Regular mb-2 text-soft-black">designO</h2>
                <p className="text-center text-gray-400 font-Jost-Semibold mb-8 text-sm uppercase tracking-widest">Post a Job Request</p>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                    {/* Project Title */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Project Title</label>
                        <input
                            {...register("projectTitle")}
                            className="auth-input w-full"
                            placeholder="e.g. Modern Living Room Redesign"
                        />
                        {errors.projectTitle && <p className="text-xs text-red-500 mt-1">{errors.projectTitle.message}</p>}
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

                    {/* Property Type */}
                    <div>
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

                    {/* Design Styles & Services */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    {/* Location */}
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
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">District</label>
                            <input
                                {...register("district")}
                                className="auth-input w-full"
                                placeholder="e.g. Ernakulam"
                            />
                            {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district.message}</p>}
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
                    </div>

                    {/* Phone & Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Phone</label>
                            <input
                                {...register("phone")}
                                className="auth-input w-full"
                                placeholder="+91 XXXXX XXXXX"
                            />
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                        </div>
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
                    </div>

                    {/* Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Minimum Budget (₹)</label>
                            <input
                                type="number"
                                {...register("minBudget", { valueAsNumber: true })}
                                className="auth-input w-full"
                                placeholder="e.g. 50000"
                            />
                            {errors.minBudget && <p className="text-xs text-red-500 mt-1">{errors.minBudget.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Maximum Budget (₹)</label>
                            <input
                                type="number"
                                {...register("maxBudget", { valueAsNumber: true })}
                                className="auth-input w-full"
                                placeholder="e.g. 50000"
                            />
                            {errors.maxBudget && <p className="text-xs text-red-500 mt-1">{errors.maxBudget.message}</p>}
                        </div>
                    </div>

                    <hr className="my-6 border-gray-100" />

                    {/* Rooms / Measurements */}
                    <div className="space-y-4">
                        <label className="block text-sm font-Jost-Semibold text-gray-700">Room Measurements</label>

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
                                    {roomFields.length > 0 ? `${roomFields.length} room${roomFields.length > 1 ? "s" : ""} added` : "Select a space and enter measurements..."}
                                </span>
                            </div>
                            <Plus className="h-5 w-5 text-gray-400 ml-auto shrink-0" />
                        </button>
                        {errors.rooms && (
                            <p className="text-xs text-red-500 mt-1">{errors.rooms.message}</p>
                        )}

                        {roomFields.length > 0 && (
                            <div className="space-y-4">
                                {roomFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="relative p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-3"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => roomRemove(index)}
                                            className="absolute top-3 right-3  text-white p-1"
                                        >
                                            <Trash size={12} className="text-error" />
                                        </button>

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

                    {/* Reference Images */}
                    <div className="space-y-4">
                        <label className="block text-sm font-Jost-Semibold text-gray-700">Refrence images (Optional)</label>

                        {refrenceFields.length < 10 && (
                            <>
                                <label
                                    htmlFor="refrence"
                                    className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors "
                                >
                                    <div className="bg-gray-100 p-1.5 rounded-md">
                                        <ImageIcon className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm text-gray-700 font-medium">Upload refrence Photos</span>
                                        <span className="text-[11px] text-gray-400 truncate">
                                            {refrenceFields.length > 0 ? `${refrenceFields.length} images selected` : "Select one or more images..."}
                                        </span>
                                    </div>
                                    <Plus className="h-5 w-5 text-gray-400 ml-auto shrink-0" />
                                </label>

                                <input
                                    type="file"
                                    id="refrence"
                                    multiple
                                    hidden
                                    onChange={handleRefrenceImageUpload}
                                />
                            </>
                        )}

                        {refrenceFields.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                {refrenceFields.map((field, index) => (
                                    <div key={field.id} className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm group">
                                        {refrenceImagesPreview[index] ? (
                                            <>
                                                <Zoom>
                                                    <img
                                                        src={refrenceImagesPreview[index]}
                                                        className="w-full h-full object-fill"
                                                        alt={`Gallery ${index}`}
                                                    />
                                                </Zoom>
                                                <button
                                                    type="button"
                                                    onClick={() => refrenceRemove(index)}
                                                    className="absolute top-1 right-1 z-10 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.refrenceImages && <p className="text-xs text-red-500 mt-1">{errors.refrenceImages.message}</p>}
                    </div>

                    <SubmitButton isLoading={isLoading} label="Post Job Request" loadingLabel="Posting" type="submit" />
                </form>
                {jobError && <p className="text-sm text-error text-center">{jobError}</p>}
                {jobSuccess && <p className="text-sm text-success text-center">{jobSuccess}</p>}
            </div>
        </div>
    );
}