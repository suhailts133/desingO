import { useEffect, useState, type ChangeEvent } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { ImageIcon, Plus, X } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import type { IJobRequest } from "../jobInterface";

export default function ReferenceImagesSection() {
    const { control, watch, formState: { errors } } = useFormContext<IJobRequest>();

    const { fields: refrenceFields, append, remove: refrenceRemove } = useFieldArray({ control, name: "referenceImages" });

    const [refrenceImagesPreview, setRefrenceImagesPreview] = useState<string[]>([]);

    const watchImages = watch("referenceImages");

    
    useEffect(() => {
        if (!watchImages) return;
        
        const newPreviews = watchImages.map((item: any) => {
            if (item.url) return item.url; 
            if (item.file && item.file[0]) return URL.createObjectURL(item.file[0]); 
            return null;
        });

        setRefrenceImagesPreview(newPreviews);

       
        return () => {
            newPreviews.forEach((url: string | null) => {
                if (url && url.startsWith("blob:")) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [watchImages]);

    const handleRefrenceImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        selectedFiles.forEach(file => append({ file: [file] }));
        e.target.value = "";
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-Jost-Semibold text-gray-700">
                    Refrence images <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <span className="text-xs text-gray-400">{refrenceFields.length} / 10</span>
            </div>

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
                                {refrenceFields.length > 0 ? `${refrenceFields.length} selected — up to ${10 - refrenceFields.length} more` : "Select one or more images..."}
                            </span>
                        </div>
                        <Plus className="h-5 w-5 text-gray-400 ml-auto shrink-0" />
                    </label>

                    <input
                        type="file"
                        id="refrence"
                        multiple
                        hidden
                        accept="image/*"
                        onChange={handleRefrenceImageUpload}
                    />
                </>
            )}

            {refrenceFields.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    {refrenceFields.map((field, index) => {
                        const previewSrc = refrenceImagesPreview[index];
                        const isNew = previewSrc?.startsWith('blob:'); // Check if it's a newly uploaded file

                        return (
                            <div key={field.id} className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm group">
                                {previewSrc ? (
                                    <>
                                        <Zoom>
                                            <img
                                                src={previewSrc}
                                                className="w-full h-full object-cover" // Switched to object-cover for cleaner squares
                                                alt={`Gallery ${index}`}
                                            />
                                        </Zoom>
                                        
                                        {/* Badge to show if it's a Saved image or a New upload */}
                                        <span className={`absolute top-1 left-1 z-10 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${isNew ? 'bg-green-500' : 'bg-gray-500/70'}`}>
                                            {isNew ? 'New' : 'Saved'}
                                        </span>

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
                        );
                    })}
                </div>
            )}

            {errors.referenceImages && !Array.isArray(errors.referenceImages) && (
                <p className="text-xs text-red-500 mt-1">{errors.referenceImages.message as string}</p>
            )}
        </div>
    );
}