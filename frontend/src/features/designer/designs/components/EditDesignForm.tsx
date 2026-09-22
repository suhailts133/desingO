import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import makeAnimated from "react-select/animated";
import { X, Plus, ImageIcon, AlertCircle } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { editDesignValidation } from "../../../../validations/designValidation";
import { STYLE_OPTIONS, SERVICE_OPTIONS, PROPERTY_OPTIONS, SPACE_OPTIONS } from "../designData";
import { useGetDesignDetailQuery } from "../designEndpoints";
import { useEditDesign } from "../hooks/useEditDesign";
import type { CoverState, DesignDetailResponseDTO, EditDesignFields, GalleryItem, SelectOption } from "../designInterface";
import toast from "react-hot-toast";
import { selectStyles } from "../../../../shared/filter/selectStyle";
import type { OptionType } from "../../../common/baseData";

const animatedComponents = makeAnimated();


const labelToOption = (label: string, options: SelectOption[]): SelectOption =>
  options.find(opt => opt.label === label) ?? { value: label, label };

const labelsToOptions = (labels: string[], options: SelectOption[]): SelectOption[] =>
  labels.map(label => labelToOption(label, options));


export default function EditDesignForm() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: isFetching, error } = useGetDesignDetailQuery(id!, { skip: !id });

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-text-faint">
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
        <p className="text-sm text-error flex items-center gap-2">
          <AlertCircle size={16} /> Failed to load design.
        </p>
      </div>
    );
  }

  return <EditDesignFormInner key={id} id={id!} defaultData={data.data as DesignDetailResponseDTO} />;
}


function EditDesignFormInner({ id, defaultData }: { id: string; defaultData: DesignDetailResponseDTO }) {
  const { handleUpdation, updateError, isEditing } = useEditDesign();
  const navigate = useNavigate();

  const [cover, setCover] = useState<CoverState>({
    type: "existing",
    path: defaultData.coverImage.path,
    filename: defaultData.coverImage.filename,
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(
    defaultData.gallery.map(img => ({
      type: "existing" as const,
      path: img.path,
      filename: img.filename,
    }))
  );

  const { register, control, handleSubmit, formState: { errors } } = useForm<EditDesignFields>({
    resolver: joiResolver(editDesignValidation),
    defaultValues: {
      name: defaultData.designName,
      minPrice: defaultData.minPrice,
      maxPrice: defaultData.maxPrice,
      description: defaultData.description,
      designStyles: labelsToOptions(defaultData.designStyles, STYLE_OPTIONS),
      services: labelsToOptions(defaultData.services, SERVICE_OPTIONS),
      spaceType: labelToOption(defaultData.spaceType, SPACE_OPTIONS),
      propertyType: labelToOption(defaultData.propertyType, PROPERTY_OPTIONS),
    },
  });

  useEffect(() => {
    return () => {
      gallery.forEach(item => { if (item.type === "new") URL.revokeObjectURL(item.preview); });
      if (cover.type === "new") URL.revokeObjectURL(cover.preview);
    };
  }, [gallery, cover]);

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (cover.type === "new") URL.revokeObjectURL(cover.preview);
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
    const formData = new FormData();
    formData.append("name", fields.name);
    formData.append("spaceType", fields.spaceType.label);
    formData.append("propertyType", fields.propertyType.label);
    formData.append("minPrice", String(fields.minPrice));
    formData.append("maxPrice", String(fields.maxPrice));
    formData.append("description", fields.description);

    fields.designStyles.forEach(({ label }, i) => formData.append(`designStyles[${i}]`, label));
    fields.services.forEach(({ label }, i) => formData.append(`services[${i}]`, label));

    if (cover.type === "new") {
      formData.append("coverImage", cover.file);
    }

    const keptImages: { path: string; filename: string }[] = [];
    gallery.forEach(item => {
      if (item.type === "existing") {
        keptImages.push({ path: item.path, filename: item.filename });
      } else {
        formData.append("gallery", item.file);
      }
    });

    keptImages.forEach((item, i) => {
      formData.append(`keptGallery[${i}][path]`, item.path);
      formData.append(`keptGallery[${i}][filename]`, item.filename);
    });

    const result = await handleUpdation({ formdata: formData, id });
    if (result) {
      toast.success("Design updated successfully!");
      navigate("/designer/designs");
    } else {
      toast.error(updateError || "Something Went Wrong.");
    }
  };

  const coverSrc = cover.type === "new" ? cover.preview : cover.path;
  const coverIsChanged = cover.type === "new";
  const coverFileName = cover.type === "new" ? cover.file.name : cover.filename || "No file selected";

  return (
    <div className="min-h-screen w-full flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-2xl bg-surface border border-surface-border rounded-xl p-8">

        <h2 className="text-4xl font-semibold text-center font-Dynalight-Regular mb-2 text-accent">designO</h2>
        <p className="text-center text-text-faint font-Jost-Semibold mb-8 text-sm uppercase tracking-widest">Edit design</p>

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
              <Controller name="designStyles" control={control} render={({ field }) => (
                <Select {...field} isMulti options={STYLE_OPTIONS} components={animatedComponents} styles={selectStyles as StylesConfig<OptionType, true>} />
              )} />
              {errors.designStyles && <p className="text-xs text-error mt-1">{errors.designStyles.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Services</label>
              <Controller name="services" control={control} render={({ field }) => (
                <Select {...field} isMulti options={SERVICE_OPTIONS} components={animatedComponents} styles={selectStyles as StylesConfig<OptionType, true>} />
              )} />
              {errors.services && <p className="text-xs text-error mt-1">{errors.services.message}</p>}
            </div>
          </div>

          {/* Space & Property */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Space</label>
              <Controller name="spaceType" control={control} render={({ field }) => (
                <Select {...field} isMulti={false} options={SPACE_OPTIONS} components={animatedComponents} styles={selectStyles as StylesConfig<OptionType, false>} />
              )} />
              {errors.spaceType && <p className="text-xs text-error mt-1">{errors.spaceType.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Property</label>
              <Controller name="propertyType" control={control} render={({ field }) => (
                <Select {...field} isMulti={false} options={PROPERTY_OPTIONS} components={animatedComponents} styles={selectStyles as StylesConfig<OptionType, false>} />
              )} />
              {errors.propertyType && <p className="text-xs text-error mt-1">{errors.propertyType.message}</p>}
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
            <label htmlFor="coverImageEdit" className="flex items-center gap-3 w-full bg-surface-hover border border-surface-border rounded-lg px-4 py-2 cursor-pointer hover:border-accent transition-colors mb-2">
              <div className="bg-surface p-1.5 rounded-md border border-surface-border">
                <ImageIcon className="h-4 w-4 text-text-faint" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm text-text-primary font-medium">
                  {coverIsChanged ? "Change Cover Image" : "Replace Cover Image"}
                </span>
                <span className="text-xs text-text-faint truncate italic">
                  {coverFileName}
                </span>
              </div>
            </label>
            <input type="file" id="coverImageEdit" hidden accept="image/*" onChange={handleCoverChange} />

            {coverSrc && (
              <div className="mt-2 flex flex-col">
                <span className="text-xs text-text-faint font-bold mb-2 uppercase">
                  {coverIsChanged ? "Cover Preview" : "Current Cover Image"}
                </span>
                <Zoom>
                  <img
                    src={coverSrc}
                    alt="Cover"
                    className={`rounded-lg max-h-40 object-cover border border-surface-border transition-all ${coverIsChanged ? "ring-2 ring-accent" : ""}`}
                  />
                </Zoom>
              </div>
            )}
          </div>

          {/* Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-Jost-Semibold text-text-primary">Gallery Portfolio</label>
              <span className="text-xs text-text-faint">{gallery.length} / 10</span>
            </div>

            {gallery.length < 10 && (
              <>
                <label htmlFor="galleryInputEdit" className="flex items-center gap-3 w-full bg-surface-hover border border-surface-border rounded-lg px-4 py-2 cursor-pointer hover:border-accent transition-colors">
                  <div className="bg-surface p-1.5 rounded-md border border-surface-border">
                    <ImageIcon className="h-4 w-4 text-text-faint" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm text-text-primary font-medium">Upload Project Photos</span>
                    <span className="text-[11px] text-text-muted truncate">
                      {gallery.length > 0 ? `${gallery.length} images selected — up to ${10 - gallery.length} more` : "Select one or more images..."}
                    </span>
                  </div>
                  <Plus className="h-5 w-5 text-text-faint ml-auto shrink-0" />
                </label>
                <input type="file" id="galleryInputEdit" multiple hidden accept="image/*" onChange={handleGalleryUpload} />
              </>
            )}

            {gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface rounded-xl border border-dashed border-surface-border">
                {gallery.map((item, index) => {
                  const src = item.type === "existing" ? item.path : item.preview;
                  const isNew = item.type === "new";
                  return (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-surface-hover border border-surface-border group">
                      <Zoom>
                        <img src={src} className="w-full h-full object-cover" alt={`Gallery ${index + 1}`} />
                      </Zoom>
                      {isNew ? (
                        <span className="absolute top-1 left-1 z-10 text-success text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase bg-success-tint border border-success/30">
                          New
                        </span>
                      ) : (
                        <span className="absolute top-1 left-1 z-10 text-text-faint text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase bg-surface-hover border border-surface-border">
                          Old
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryItem(index)}
                        className="absolute top-1 right-1 z-10 bg-error-tint hover:bg-error text-error hover:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {gallery.length === 0 && (
              <div className="text-center py-8 text-text-faint text-sm border border-dashed border-surface-border rounded-xl">
                No gallery images. Add some above.
              </div>
            )}
          </div>

          <p className="text-xs text-text-muted italic mt-1">
            * Note: If you delete all gallery images without uploading new ones, your old gallery images will remain saved on the server.
          </p>

          {/* Action Buttons */}
          {!isEditing ? (
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-2.5 rounded-lg border border-surface-border bg-surface text-text-muted text-sm font-medium hover:bg-surface-hover hover:border-surface-border-strong hover:text-text-primary transition-colors duration-200"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 bg-accent text-text-on-accent rounded-lg text-sm font-medium hover:bg-accent-hover active:bg-accent-active transition-colors duration-200">
                Save Changes
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled
                className="flex-1 py-2.5 rounded-lg border border-surface-border bg-surface text-text-faint text-sm font-medium cursor-not-allowed opacity-50"
              >
                Cancel
              </button>
              <button type="button" disabled className="flex-1 py-2.5 bg-surface-hover text-text-faint rounded-lg text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed opacity-50 transition-colors">
                <svg className="size-5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}