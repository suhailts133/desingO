import { useState, useEffect, type ChangeEvent } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { X, Plus, ImageIcon } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import type { IDesign } from "../designInterface";
import { designValidation } from "../../../../validations/designValidation";
import { STYLE_OPTIONS, SERVICE_OPTIONS, PROPERTY_OPTIONS, SPACE_OPTIONS } from "../designData";
import { useAddDesign } from "../hooks/useAddDesign";
const animatedComponents = makeAnimated();

export default function DesignForm() {

    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const { register, control, handleSubmit, watch, formState: { errors } } = useForm<IDesign>({
        resolver: joiResolver(designValidation),
        defaultValues: { gallery: [] }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "gallery" });
    const { handleSubmission, designError, designSuccess, isLoading } = useAddDesign()
    const watchGallery = watch("gallery");
    const watchedCover = watch("coverImage");
    useEffect(() => {
        if (!watchGallery) return;

        const previews = watchGallery
            .filter(item => item.file && item.file[0])
            .map(item => URL.createObjectURL(item.file[0]));

        setGalleryPreviews(previews);

        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [watchGallery]);



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
        formData.append("startingPrice", String(data.startingPrice))
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

        console.log([...formData.entries()])
        await handleSubmission(formData)
    }

    return (

        <div className="min-h-screen w-full flex justify-center items-start py-10 px-4 ">
            <div className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl shadow-blush/30 rounded-xl shadow-2xl p-8">

                <h2 className="text-4xl font-semibold text-center font-Dynalight-Regular mb-2 text-soft-black">designO</h2>
                <p className="text-center text-gray-400 font-Jost-Semibold mb-8 text-sm uppercase tracking-widest">Create Portfolio</p>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                    {/* design name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Design Name</label>
                            <input {...register("name")} className="auth-input w-full" placeholder="e.g. Modern Japandi Living Room" />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>

                        {/* room type */}


                        {/* starting price */}
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Starting Price</label>
                            <input type="number" {...register("startingPrice")} className="auth-input w-full" placeholder="0.00" />
                            {errors.startingPrice && <p className="text-xs text-red-500 mt-1">{errors.startingPrice.message}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Description</label>
                        <textarea {...register("description")} rows={3} className="auth-input w-full" placeholder="Describe your design process..." />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                    </div>

                    {/* Styles & Services */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Styles</label>
                            <Controller
                                name="designStyles"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} isMulti options={STYLE_OPTIONS} components={animatedComponents} className="text-sm" />
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
                    {/* roomtype and properytype */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">space</label>
                            <Controller
                                name="spaceType"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} isMulti={false} options={SPACE_OPTIONS} components={animatedComponents} className="text-sm" />
                                )}
                            />
                            {errors.spaceType && <p className="text-xs text-red-500 mt-1">{errors.spaceType.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">property</label>
                            <Controller
                                name="propertyType"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} isMulti={false} options={PROPERTY_OPTIONS} components={animatedComponents} className="text-sm" />
                                )}
                            />
                            {errors.propertyType && <p className="text-xs text-red-500 mt-1">{errors.propertyType.message}</p>}
                        </div>
                    </div>

                    <hr className="my-6 border-gray-100" />


                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Cover Image</label>
                        <label
                            htmlFor="coverImage"
                            className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors"
                        >
                            <div className="bg-gray-100 p-1.5 rounded-md">
                                <ImageIcon className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm text-gray-700 font-medium">
                                    {watchedCover?.length > 0 ? "Change Cover Image" : "Upload Cover Image"}
                                </span>
                                <span className="text-xs text-primary truncate italic">
                                    {getCoverName()}
                                </span>
                            </div>
                        </label>
                        <input
                            type="file"
                            id="coverImage"
                            hidden
                            {...register("coverImage")}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"

                        />
                        {watchedCover && watchedCover[0] && (
                            <>
                                <span className="text-xs text-gray-400 font-bold mb-2 uppercase">Cover Preview</span>
                                <Zoom>
                                    <img src={URL.createObjectURL(watchedCover[0])} className="rounded-lg max-h-40 shadow-sm" alt="Cover" />
                                </Zoom>

                            </>

                        )}
                        {errors.coverImage && <p className="text-xs text-red-500 mt-1">{errors.coverImage.message}</p>}
                    </div>


                    <div className="space-y-4">
                        <label className="block text-sm font-Jost-Semibold text-gray-700">Gallery Portfolio</label>


                        <label
                            htmlFor="galleryInput"
                            className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors "
                        >
                            <div className="bg-gray-100 p-1.5 rounded-md">
                                <ImageIcon className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm text-gray-700 font-medium">Upload Project Photos</span>
                                <span className="text-[11px] text-gray-400 truncate">
                                    {fields.length > 0 ? `${fields.length} images selected` : "Select one or more images..."}
                                </span>
                            </div>
                            <Plus className="h-5 w-5 text-gray-400 ml-auto shrink-0" />
                        </label>

                        <input
                            type="file"
                            id="galleryInput"
                            multiple
                            hidden
                            onChange={handleGalleryUpload}
                        />

                        {/* Gallery Grid Preview */}
                        {fields.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm group">
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
                        {errors.gallery && <p className="text-xs text-red-500 mt-1">{errors.gallery.message}</p>}

                    </div>

                    {!isLoading ? (
                        <button type="submit" className="auth-button">Submit</button>
                    ) : (
                        <button type="submit" disabled={isLoading} className="auth-disabled-button">
                            <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Verifying
                        </button>
                    )}
                </form>
                {designError && <p className="text-sm text-error text-center">{designError}</p>}
                {designSuccess && <p className="text-sm text-success text-center">{designSuccess}</p>}
            </div>
        </div>
    );
}