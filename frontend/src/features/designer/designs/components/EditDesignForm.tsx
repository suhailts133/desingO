import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { X, Plus, ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { editDesignValidation } from "../../../../validations/designValidation";
import { STYLE_OPTIONS, SERVICE_OPTIONS, PROPERTY_OPTIONS, SPACE_OPTIONS } from "../designData";
import { useGetDesignDetailQuery } from "../designEndpoints";
import { useEditDesign } from "../hooks/useEditDesign";
import type { EditDesignFields, SelectOption } from "../designInterface";

const animatedComponents = makeAnimated();



type ExistingGalleryItem = { type: "existing"; path: string; filename: string };
type NewGalleryItem = { type: "new"; file: File; preview: string };
type GalleryItem = ExistingGalleryItem | NewGalleryItem;

type ExistingCover = { type: "existing"; path: string; filename: string };
type NewCover = { type: "new"; file: File; preview: string };
type CoverState = ExistingCover | NewCover;



const labelToOption = (label: string, options: SelectOption[]): SelectOption =>
  options.find(opt => opt.label === label) ?? { value: label, label };

const labelsToOptions = (labels: string[], options: SelectOption[]): SelectOption[] =>
  labels.map(label => labelToOption(label, options));

export default function EditDesignForm() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: isFetching, error } = useGetDesignDetailQuery(id!, { skip: !id });
  const { handleUpdation, updateError, updateSuccess, isEditing } = useEditDesign();

  const [cover, setCover] = useState<CoverState | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);


  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<EditDesignFields>({
    resolver: joiResolver(editDesignValidation),
  });

  const defaultData = data?.data;

  useEffect(() => {
    if (!defaultData) return;
    reset({
      name: defaultData.designName,
      startingPrice: Number(defaultData.startingPrice),
      description: defaultData.description,
      designStyles: labelsToOptions(defaultData.designStyles, STYLE_OPTIONS),
      services: labelsToOptions(defaultData.services, SERVICE_OPTIONS),
      spaceType: labelToOption(defaultData.spaceType, SPACE_OPTIONS),
      propertyType: labelToOption(defaultData.propertyType, PROPERTY_OPTIONS),
    });
  }, [defaultData, reset]);



  useEffect(() => {
    if (!defaultData) return;
    setCover({
      type: "existing",
      path: defaultData.coverImage.path,
      filename: defaultData.coverImage.filename,
    });
    setGallery(
      defaultData.gallery.map(img => ({
        type: "existing" as const,
        path: img.path,
        filename: img.filename,
      }))
    );
  }, [defaultData]);


  useEffect(() => {
    return () => {
      gallery.forEach(item => { if (item.type === "new") URL.revokeObjectURL(item.preview); });
      if (cover?.type === "new") URL.revokeObjectURL(cover.preview);
    };
  }, []);

  const navigate = useNavigate()

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="size-8 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm">Loading design...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-500 flex items-center gap-2">
          <AlertCircle size={16} /> Failed to load design.
        </p>
      </div>
    );
  }



  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (cover?.type === "new") URL.revokeObjectURL(cover.preview);
    setCover({ type: "new", file, preview: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const slotsLeft = 10 - gallery.length;
    setGallery(prev => [
      ...prev,
      ...files.slice(0, slotsLeft).map(file => ({
        type: "new" as const,
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
    e.target.value = "";
  };

  const handleRemoveGalleryItem = (index: number) => {
    setGallery(prev => {
      const item = prev[index];
      if (item.type === "new") URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };



  const onSubmit = async (fields: EditDesignFields) => {
    if (!cover) return;

    const formData = new FormData();
    formData.append("name", fields.name);
    formData.append("spaceType", fields.spaceType.label);
    formData.append("propertyType", fields.propertyType.label);
    formData.append("startingPrice", String(fields.startingPrice));
    formData.append("description", fields.description);

    fields.designStyles.forEach(({ label }, i) => formData.append(`designStyles[${i}]`, label));
    fields.services.forEach(({ label }, i) => formData.append(`services[${i}]`, label));

    if (cover.type === "new") {
      formData.append("coverImage", cover.file);
    }

    const keptImages: { path: string; filename: string }[] = [];
    gallery.forEach(item => {
      if (item.type === "existing") {
        keptImages.push({ path: item.path, filename: item.filename })
      } else {
        formData.append("gallery", item.file);
      }
    });
    keptImages.forEach((item, i) => {
      formData.append(`keptGallery[${i}][path]`, item.path);
      formData.append(`keptGallery[${i}][filename]`, item.filename);
    });
    console.log([...formData.entries()]);
    await handleUpdation({ formdata: formData, id: id! });
  };


  const coverSrc = cover?.type === "new" ? cover.preview : cover?.path;
  const coverIsChanged = cover?.type === "new";


  return (
    <div className="min-h-screen w-full flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl shadow-blush/30 rounded-xl shadow-2xl p-8">

        <h2 className="text-4xl font-semibold text-center font-Dynalight-Regular mb-2 text-soft-black">designO</h2>
        <p className="text-center text-gray-400 font-Jost-Semibold mb-8 text-sm uppercase tracking-widest">Edit design</p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

          {/* Name + Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Design Name</label>
              <input {...register("name")} className="auth-input w-full" placeholder="e.g. Modern Japandi Living Room" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
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
              <Controller name="designStyles" control={control} render={({ field }) => (
                <Select {...field} isMulti options={STYLE_OPTIONS} components={animatedComponents} className="text-sm" />
              )} />
              {errors.designStyles && <p className="text-xs text-red-500 mt-1">{errors.designStyles.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Services</label>
              <Controller name="services" control={control} render={({ field }) => (
                <Select {...field} isMulti options={SERVICE_OPTIONS} components={animatedComponents} className="text-sm" />
              )} />
              {errors.services && <p className="text-xs text-red-500 mt-1">{errors.services.message}</p>}
            </div>
          </div>

          {/* Space & Property */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Space</label>
              <Controller name="spaceType" control={control} render={({ field }) => (
                <Select {...field} isMulti={false} options={SPACE_OPTIONS} components={animatedComponents} className="text-sm" />
              )} />
              {errors.spaceType && <p className="text-xs text-red-500 mt-1">{errors.spaceType.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Property</label>
              <Controller name="propertyType" control={control} render={({ field }) => (
                <Select {...field} isMulti={false} options={PROPERTY_OPTIONS} components={animatedComponents} className="text-sm" />
              )} />
              {errors.propertyType && <p className="text-xs text-red-500 mt-1">{errors.propertyType.message}</p>}
            </div>
          </div>

          <hr className="my-6 border-gray-100" />

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-2">Cover Image</label>
            {coverSrc && (
              <div className="mb-3">
                <span className="text-xs text-gray-400 font-bold mb-1 uppercase block">
                  {coverIsChanged ? "New Cover Preview" : "Current Cover"}
                </span>
                <Zoom>
                  <img
                    src={coverSrc}
                    alt="Cover"
                    className={`rounded-lg max-h-48 object-cover shadow-sm transition-all ${coverIsChanged ? "ring-2 ring-amber-400" : ""}`}
                  />
                </Zoom>
              </div>
            )}
            <label htmlFor="coverImageEdit" className="flex items-center gap-3 w-fit border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors">
              <div className="bg-gray-100 p-1.5 rounded-md">
                <ImageIcon className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {coverIsChanged ? "Change Again" : "Replace Cover Image"}
              </span>
            </label>
            <input type="file" id="coverImageEdit" hidden accept="image/*" onChange={handleCoverChange} />
          </div>

          {/* Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-Jost-Semibold text-gray-700">Gallery Portfolio</label>
              <span className="text-xs text-gray-400">{gallery.length} / 10</span>
            </div>

            {gallery.length < 10 && (
              <>
                <label htmlFor="galleryInputEdit" className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors">
                  <div className="bg-gray-100 p-1.5 rounded-md">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700 font-medium">Add Photos</span>
                    <span className="text-[11px] text-gray-400">
                      {gallery.length > 0 ? `${gallery.length} selected — up to ${10 - gallery.length} more` : "Select one or more images"}
                    </span>
                  </div>
                  <Plus className="h-5 w-5 text-gray-400 ml-auto shrink-0" />
                </label>
                <input type="file" id="galleryInputEdit" multiple hidden accept="image/*" onChange={handleGalleryUpload} />
              </>
            )}

            {gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                {gallery.map((item, index) => {
                  const src = item.type === "existing" ? item.path : item.preview;
                  const isNew = item.type === "new";
                  return (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm group">
                      <Zoom>
                        <img src={src} className="w-full h-full object-cover" alt={`Gallery ${index + 1}`} />
                      </Zoom>
                      <span className={`absolute top-1 left-1 z-10 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${isNew ? "bg-green-500" : "bg-gray-500/70"}`}>
                        {isNew ? "New" : "Old"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryItem(index)}
                        className="absolute top-1 right-1 z-10 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {gallery.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
                No gallery images. Add some above.
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            * If you delete all gallery images without uploading new ones, the old images will remain in use.
          </p>
          {!isEditing ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full py-2.5 rounded-lg border border-gray-300 text-gray-600 font-Jost-Semibold text-sm hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800 transition-all duration-200"
              >
                Cancel
              </button>
              <button type="submit" className="auth-button">
                Save Changes
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-300 font-Jost-Semibold text-sm cursor-not-allowed"
              >
                Cancel
              </button>
              <button type="button" disabled className="auth-disabled-button flex items-center justify-center gap-2">
                <svg className="size-5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </button>
            </div>
          )}

        </form>

        {updateError && <p className="flex items-center gap-1 text-sm text-error text-center mt-3"><AlertCircle size={14} /> {updateError}</p>}
        {updateSuccess && <p className="flex items-center gap-1 text-sm text-success text-center mt-3"><CheckCircle2 size={14} /> {updateSuccess}</p>}
      </div>
    </div>
  );
}