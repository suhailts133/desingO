import { useEffect, useMemo, type ChangeEvent } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { ImageIcon, Plus, X } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import type { IJobRequest } from "../jobInterface";

export default function ReferenceImagesSection() {
    const { control, formState: { errors } } = useFormContext<IJobRequest>();

    const { fields: refrenceFields, append, remove: refrenceRemove } = useFieldArray({ control, name: "referenceImages" });

    const watchImages = useWatch({ control, name: "referenceImages" });


    const refrenceImagesPreview = useMemo<(string | null)[]>(() => {
        if (!watchImages) return [];

        return watchImages.map((item) => {
            if (item.url) return item.url;
            if (item.file && item.file[0]) return URL.createObjectURL(item.file[0]);
            return null;
        });
    }, [watchImages]);

    useEffect(() => {
        return () => {
            refrenceImagesPreview.forEach((url) => {
                if (url && url.startsWith("blob:")) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [refrenceImagesPreview]);

    const handleRefrenceImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        selectedFiles.forEach(file => append({ file: [file] }));
        e.target.value = "";
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-Jost-Semibold text-text-primary">
                    Refrence images <span className="text-text-faint font-normal">(Optional)</span>
                </label>
                <span className="text-xs text-text-faint">{refrenceFields.length} / 10</span>
            </div>

            {refrenceFields.length < 10 && (
                <>
                    <label
                        htmlFor="refrence"
                        className="flex items-center gap-3 w-full border border-surface-border rounded-lg px-4 py-2 cursor-pointer hover:border-accent transition-colors"
                    >
                        <div className="bg-surface-hover p-1.5 rounded-md">
                            <ImageIcon className="h-4 w-4 text-text-faint" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm text-text-primary font-medium">Upload refrence Photos</span>
                            <span className="text-[11px] text-text-faint truncate">
                                {refrenceFields.length > 0 ? `${refrenceFields.length} selected — up to ${10 - refrenceFields.length} more` : "Select one or more images..."}
                            </span>
                        </div>
                        <Plus className="h-5 w-5 text-text-faint ml-auto shrink-0" />
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface-hover rounded-xl border border-dashed border-surface-border">
                    {refrenceFields.map((field, index) => {
                        const previewSrc = refrenceImagesPreview[index];
                        const isNew = previewSrc?.startsWith('blob:');

                        return (
                            <div key={field.id} className="relative aspect-square rounded-lg overflow-hidden bg-surface border border-surface-border hover:border-accent transition-colors group">
                                {previewSrc ? (
                                    <>
                                        <Zoom>
                                            <img
                                                src={previewSrc}
                                                className="w-full h-full object-cover"
                                                alt={`Gallery ${index}`}
                                            />
                                        </Zoom>

                                        <span className={`absolute top-1 left-1 z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${isNew ? 'bg-success-tint text-success-text' : 'bg-surface-hover text-text-faint'}`}>
                                            {isNew ? 'New' : 'Saved'}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => refrenceRemove(index)}
                                            className="absolute top-1 right-1 z-10 bg-error-tint text-error-text border border-error hover:bg-error hover:text-text-primary p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                <p className="text-xs text-error mt-1">{errors.referenceImages.message as string}</p>
            )}
        </div>
    );
}