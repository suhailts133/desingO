import { useEffect, type ChangeEvent, useMemo } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import makeAnimated from "react-select/animated";
import { X, Plus, ImageIcon } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import type { IDesign } from "../designInterface";
import { designValidation } from "../../../../validations/designValidation";
import { STYLE_OPTIONS, SERVICE_OPTIONS, PROPERTY_OPTIONS, SPACE_OPTIONS } from "../designData";
import { useAddDesign } from "../hooks/useAddDesign";
import { UNIT_OPTIONS } from "../../../user/jobs/jobData";
import SubmitButton from "../../../../shared/common/SubmitButton";
import { selectStyles } from "../../../../shared/filter/selectStyle";
import type { OptionType } from "../../../common/baseData";

const animatedComponents = makeAnimated();

export default function DesignForm() {

    const { register, control, handleSubmit, formState: { errors } } = useForm<IDesign>({
        resolver: joiResolver(designValidation),
        defaultValues: { gallery: [] }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "gallery" });
    const { handleSubmission, designError, designSuccess, isLoading } = useAddDesign();
    const watchGallery = useWatch({ control, name: "gallery" });
    const watchedCover = useWatch({ control, name: "coverImage" });

    const galleryPreviews = useMemo(() => {
        if (!watchGallery) return [];
        return watchGallery
            .filter(item => item.file && item.file[0])
            .map(item => URL.createObjectURL(item.file[0]));
    }, [watchGallery]);

    useEffect(() => {
        return () => {
            galleryPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [galleryPreviews]);

    const getCoverName = () => {
        if (watchedCover && watchedCover.length > 0) {
            return watchedCover[0].name;
        }
        return "No file selected";
    };

    const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        selectedFiles.forEach(file => {
            append({
                file: [file]
            });
        });
        e.target.value = "";
    };

    const onSubmit = async (data: IDesign) => {

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("spaceType", data.spaceType.label)
        formData.append("propertyType", data.propertyType.label)
        formData.append("minPrice", String(data.minPrice))
        formData.append("maxPrice", String(data.maxPrice))
        formData.append("width", String(data.width))
        formData.append("length", String(data.length))
        formData.append("unit", String(data.unit.label))
        formData.append("description", data.description);
        data.designStyles.forEach(({ label }, i) => {
            formData.append(`designStyles[${i}]`, label)
        })
        data.services.forEach(({ label }, i) => {
            formData.append(`services[${i}]`, label)
        })
        const coverImage = data.coverImage?.[0]
        if (coverImage) {
            formData.append("coverImage", coverImage)
        }
        data.gallery.forEach((item) => {
            const file = item.file?.[0]
            if (file) {
                formData.append("gallery", file)
            }
        })

        await handleSubmission(formData)
    }

    return (
        <div className="min-h-screen w-full flex justify-center items-start py-10 px-4">
            <div className="w-full max-w-2xl bg-surface border border-surface-border rounded-xl p-8">

                <h2 className="text-4xl font-semibold text-center font-Dynalight-Regular mb-2 text-accent">designO</h2>
                <p className="text-center text-text-faint font-Jost-Semibold mb-8 text-sm uppercase tracking-widest">Create Portfolio</p>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                    {/* Design Name */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Design Name</label>
                        <input
                            {...register("name")}
                            className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                            placeholder="e.g. Modern Japandi Living Room"
                        />
                        {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Description</label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                            placeholder="Describe your design process..."
                        />
                        {errors.description && <p className="text-xs text-error mt-1">{errors.description.message}</p>}
                    </div>

                    {/* Styles & Services */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Styles</label>
                            <Controller
                                name="designStyles"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        isMulti
                                        options={STYLE_OPTIONS}
                                        components={animatedComponents}
                                        styles={selectStyles as StylesConfig<OptionType, true>}
                                    />
                                )}
                            />
                            {errors.designStyles && <p className="text-xs text-error mt-1">{errors.designStyles.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Services</label>
                            <Controller
                                name="services"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        isMulti
                                        options={SERVICE_OPTIONS}
                                        components={animatedComponents}
                                        styles={selectStyles as StylesConfig<OptionType, true>}
                                    />
                                )}
                            />
                            {errors.services && <p className="text-xs text-error mt-1">{errors.services.message}</p>}
                        </div>
                    </div>

                    {/* Space Type & Property Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Space</label>
                            <Controller
                                name="spaceType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        isMulti={false}
                                        options={SPACE_OPTIONS}
                                        components={animatedComponents}
                                        styles={selectStyles as StylesConfig<OptionType, false>}
                                    />
                                )}
                            />
                            {errors.spaceType && <p className="text-xs text-error mt-1">{errors.spaceType.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Property</label>
                            <Controller
                                name="propertyType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        isMulti={false}
                                        options={PROPERTY_OPTIONS}
                                        components={animatedComponents}
                                        styles={selectStyles as StylesConfig<OptionType, false>}
                                    />
                                )}
                            />
                            {errors.propertyType && <p className="text-xs text-error mt-1">{errors.propertyType.message}</p>}
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-Jost-Semibold text-text-primary mb-1">Length</label>
                            <input
                                type="number"
                                {...register("length")}
                                className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                                placeholder="0"
                            />
                            {errors.length && (
                                <p className="text-xs text-error mt-1">{errors.length.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-Jost-Semibold text-text-primary mb-1">Width</label>
                            <input
                                type="number"
                                {...register("width")}
                                className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                                placeholder="0"
                            />
                            {errors.width && (
                                <p className="text-xs text-error mt-1">{errors.width.message}</p>
                            )}
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-Jost-Semibold text-text-primary mb-1">Unit</label>
                            <Controller
                                name={"unit"}
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        isMulti={false}
                                        options={UNIT_OPTIONS}
                                        components={animatedComponents}
                                        styles={selectStyles as StylesConfig<OptionType, false>}
                                    />
                                )}
                            />
                            {errors.unit && (
                                <p className="text-xs text-error mt-1">{errors.unit.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Minimum Budget (₹)</label>
                            <input
                                type="number"
                                {...register("minPrice", { valueAsNumber: true })}
                                className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                                placeholder="e.g. 50000"
                            />
                            {errors.minPrice && <p className="text-xs text-error mt-1">{errors.minPrice.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Maximum Budget (₹)</label>
                            <input
                                type="number"
                                {...register("maxPrice", { valueAsNumber: true })}
                                className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                                placeholder="e.g. 50000"
                            />
                            {errors.maxPrice && <p className="text-xs text-error mt-1">{errors.maxPrice.message}</p>}
                        </div>
                    </div>

                    <hr className="my-6 border-surface-border" />

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Cover Image</label>
                        <label
                            htmlFor="coverImage"
                            className="flex items-center gap-3 w-full bg-surface-hover border border-surface-border rounded-lg px-4 py-2 cursor-pointer hover:border-accent transition-colors"
                        >
                            <div className="bg-surface p-1.5 rounded-md border border-surface-border">
                                <ImageIcon className="h-4 w-4 text-text-faint" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm text-text-primary font-medium">
                                    {watchedCover?.length > 0 ? "Change Cover Image" : "Upload Cover Image"}
                                </span>
                                <span className="text-xs text-text-muted truncate italic">
                                    {getCoverName()}
                                </span>
                            </div>
                        </label>
                        <input
                            type="file"
                            id="coverImage"
                            hidden
                            {...register("coverImage")}
                            className="hidden"
                        />
                        {watchedCover && watchedCover[0] && (
                            <div className="mt-3">
                                <span className="text-xs text-text-faint font-bold mb-2 uppercase block">Cover Preview</span>
                                <Zoom>
                                    <img src={URL.createObjectURL(watchedCover[0])} className="rounded-lg max-h-40 border border-surface-border" alt="Cover" />
                                </Zoom>
                            </div>
                        )}
                        {errors.coverImage && <p className="text-xs text-error mt-1">{errors.coverImage.message}</p>}
                    </div>

                    {/* Gallery */}
                    <div className="space-y-4">
                        <label className="block text-sm font-Jost-Semibold text-text-primary">Gallery Portfolio</label>

                        {fields.length < 10 && (
                            <>
                                <label
                                    htmlFor="galleryInput"
                                    className="flex items-center gap-3 w-full bg-surface-hover border border-surface-border rounded-lg px-4 py-2 cursor-pointer hover:border-accent transition-colors"
                                >
                                    <div className="bg-surface p-1.5 rounded-md border border-surface-border">
                                        <ImageIcon className="h-4 w-4 text-text-faint" />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm text-text-primary font-medium">Upload Project Photos</span>
                                        <span className="text-[11px] text-text-muted truncate">
                                            {fields.length > 0 ? `${fields.length} images selected` : "Select one or more images..."}
                                        </span>
                                    </div>
                                    <Plus className="h-5 w-5 text-text-faint ml-auto shrink-0" />
                                </label>

                                <input
                                    type="file"
                                    id="galleryInput"
                                    multiple
                                    hidden
                                    onChange={handleGalleryUpload}
                                />
                            </>
                        )}

                        {/* Gallery Grid Preview */}
                        {fields.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface rounded-xl border border-dashed border-surface-border">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="relative aspect-square rounded-lg overflow-hidden bg-surface-hover border border-surface-border group">
                                        {galleryPreviews[index] ? (
                                            <>
                                                <Zoom>
                                                    <img
                                                        src={galleryPreviews[index]}
                                                        className="w-full h-full object-cover"
                                                        alt={`Gallery ${index}`}
                                                    />
                                                </Zoom>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="absolute top-1 right-1 z-10 bg-error-tint hover:bg-error text-error hover:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.gallery && <p className="text-xs text-error mt-1">{errors.gallery.message}</p>}
                    </div>

                    <SubmitButton isLoading={isLoading} label="Submit" loadingLabel="Submitting" type="submit" />

                </form>
                {designError && <p className="text-sm text-error text-center mt-4">{designError}</p>}
                {designSuccess && <p className="text-sm text-success text-center mt-4">{designSuccess}</p>}
            </div>
        </div>
    );
}