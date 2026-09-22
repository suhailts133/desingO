import { useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { useForm, FormProvider, type SubmitErrorHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { AlertCircle, UserCheck, ImageIcon, FileText, Plus, X, Trash2, Upload } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { useGetAJobRequestDetailQuery } from "../jobEndpoints";
import { useEditJobRequest } from "../hooks/useEditJobRequest";
import { editJobRequestValidation } from "../../../../validations/customerValidation";
import type { IJobRequest } from "../jobInterface";

import SubmitButton from "../../../../shared/common/SubmitButton";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";

import ProjectOverviewSection from "../components/ProjectOverviewSection";
import SpaceStatusSection from "../components/SpaceStatusSection";
import SpaceScopeSection from "../components/SpaceScopeSection";
import DeliverablesSection from "../components/DeliverablesSection";
import AestheticsAndItemsSection from "../components/AestheticsAndItemsSection";
import HouseholdProfileSection from "../components/HouseholdProfileSection";
import LocationBudgetSection from "../components/LocationBudgetSection";
import type { ImageUploadResult } from "../../../designer/profile/designerProfileInterface";
import { toOption, toOptions } from "../../../../helpers/optionHelper";


type ExistingFileItem = { type: "existing"; path: string; filename: string };
type NewFileItem = { type: "new"; file: File; preview: string };
type FileItem = ExistingFileItem | NewFileItem;


type JobRequestDetail = NonNullable<ReturnType<typeof useGetAJobRequestDetailQuery>["data"]>["data"];


export default function EditJobRequestForm() {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading: isFetching, error } = useGetAJobRequestDetailQuery(id ?? "", { skip: !id });

    const job = data?.data;

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-text-faint">
                    <svg className="size-8 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-sm">Loading job request...</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-error flex items-center gap-2">
                    <AlertCircle size={16} /> Failed to load job request.
                </p>
            </div>
        );
    }

    return <EditJobRequestFormFields key={job.id} job={job} jobId={id!} />;
}

function EditJobRequestFormFields({ job, jobId }: { job: JobRequestDetail; jobId: string }) {
    console.log(job)
    const { handleUpdation, isEditing } = useEditJobRequest();
    const handleResponse = useHandleResponse();

    const [referenceImages, setReferenceImages] = useState<FileItem[]>(() =>
        (job.referenceImages ?? []).map((img: ImageUploadResult) => ({
            type: "existing" as const,
            path: img.path,
            filename: img.filename,
        }))
    );
    const [floorPlans, setFloorPlans] = useState<FileItem[]>(() =>
        (job.floorPlans ?? []).map((plan: ImageUploadResult) => ({
            type: "existing" as const,
            path: plan.path,
            filename: plan.filename,
        }))
    );

    const methods = useForm<IJobRequest>({
        resolver: joiResolver(editJobRequestValidation),
        defaultValues: {
            sourceType: job.sourceType,
            designerId: job.designerId,
            designId: job.designId,

            projectType: job.projectType,
            projectTitle: job.projectTitle,
            propertyType: toOption(job.propertyType),
            description: job.description,

            renovationDetails: job.renovationDetails ?? {
                level: "ROOMS_UPGRADE",
                propertyAgeYears: "5",
                livingInDuringRenovation: false,
            },
            newbuildDetails: job.newbuildDetails ?? {
                stage: "BARE_SHELL_READY",
                vastuCompliantRequired: false,
            },

            totalCarpetArea: job.totalCarpetArea,
            areaUnit: job.areaUnit,
            selectedRooms: toOptions(job.selectedRooms),
            requiresSiteVisitMeasurement: job.requiresSiteVisitMeasurement,

            servicePackageType: "CUSTOM",
            services: toOptions(job.services),
            designStyles: toOptions(job.designStyles),
            preferredMaterials: toOptions(job.preferredMaterials),

            householdProfile: job.householdProfile,

            state: job.state,
            district: job.district,
            city: job.city,
            pincode: job.pincode,
            phone: job.phone,

            timeline: toOption(job.timeline),
            minBudget: job.minBudget,
            maxBudget: job.maxBudget,
        },
    });

    const { handleSubmit } = methods;


    useEffect(() => {
        return () => {
            referenceImages.forEach((item) => {
                if (item.type === "new") URL.revokeObjectURL(item.preview);
            });
        };
    }, [referenceImages]);

    useEffect(() => {
        return () => {
            floorPlans.forEach((item) => {
                if (item.type === "new") URL.revokeObjectURL(item.preview);
            });
        };
    }, [floorPlans]);

    const handleReferenceUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const slotsLeft = 10 - referenceImages.length;
        setReferenceImages((prev) => [
            ...prev,
            ...files.slice(0, slotsLeft).map((file) => ({
                type: "new" as const,
                file,
                preview: URL.createObjectURL(file),
            })),
        ]);
        e.target.value = "";
    };

    const handleRemoveReference = (index: number) => {
        setReferenceImages((prev) => {
            const item = prev[index];
            if (item.type === "new") URL.revokeObjectURL(item.preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleFloorPlanUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const slotsLeft = 10 - floorPlans.length;
        setFloorPlans((prev) => [
            ...prev,
            ...files.slice(0, slotsLeft).map((file) => ({
                type: "new" as const,
                file,
                preview: URL.createObjectURL(file),
            })),
        ]);
        e.target.value = "";
    };

    const handleRemoveFloorPlan = (index: number) => {
        setFloorPlans((prev) => {
            const item = prev[index];
            if (item.type === "new") URL.revokeObjectURL(item.preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const onSubmit = async (fields: IJobRequest) => {
        console.log(fields, "lol")
        const formData = new FormData();

        formData.append("latitude",String(fields.latitude))
        formData.append("longitude",String(fields.longitude))

        formData.append("projectTitle", fields.projectTitle);
        formData.append("projectType", fields.projectType);
        formData.append("description", fields.description);
        formData.append("propertyType", fields.propertyType.label);

        formData.append("totalCarpetArea", String(fields.totalCarpetArea));
        formData.append("areaUnit", fields.areaUnit);
        formData.append("requiresSiteVisitMeasurement", String(fields.requiresSiteVisitMeasurement));
        fields.selectedRooms.forEach(({ label }, i) => formData.append(`selectedRooms[${i}]`, label));

        fields.designStyles.forEach(({ label }, i) => formData.append(`designStyles[${i}]`, label));
        fields.preferredMaterials.forEach(({ label }, i) => formData.append(`preferredMaterials[${i}]`, label));
        fields.services.forEach(({ label }, i) => formData.append(`services[${i}]`, label));

        formData.append("householdProfile[adultsCount]", String(fields.householdProfile.adultsCount));
        formData.append("householdProfile[kidsCount]", String(fields.householdProfile.kidsCount));
        formData.append("householdProfile[seniorsCount]", String(fields.householdProfile.seniorsCount));
        formData.append("householdProfile[hasPets]", String(fields.householdProfile.hasPets));
        if (fields.householdProfile.petDetails) {
            formData.append("householdProfile[petDetails]", fields.householdProfile.petDetails);
        }

        if (fields.projectType === "Renovation" && fields.renovationDetails) {
            formData.append("renovationDetails[level]", fields.renovationDetails.level);
            formData.append("renovationDetails[propertyAgeYears]", fields.renovationDetails.propertyAgeYears);
            formData.append(
                "renovationDetails[livingInDuringRenovation]",
                String(fields.renovationDetails.livingInDuringRenovation)
            );
        }
        if (fields.projectType === "New_Build" && fields.newbuildDetails) {
            formData.append("newbuildDetails[stage]", fields.newbuildDetails.stage);
            formData.append(
                "newbuildDetails[vastuCompliantRequired]",
                String(fields.newbuildDetails.vastuCompliantRequired)
            );
        }

        formData.append("state", fields.state);
        formData.append("district", fields.district);
        formData.append("city", fields.city);
        formData.append("pincode", fields.pincode);
        formData.append("phone", fields.phone);
        formData.append("timeline", fields.timeline.label);
        formData.append("minBudget", String(fields.minBudget));
        formData.append("maxBudget", String(fields.maxBudget));

        const keptReferenceImages: { path: string; filename: string }[] = [];
        referenceImages.forEach((item) => {
            if (item.type === "existing") {
                keptReferenceImages.push({ path: item.path, filename: item.filename });
            } else {
                formData.append("referenceImages", item.file);
            }
        });
        keptReferenceImages.forEach((img, i) => {
            formData.append(`oldReferences[${i}][path]`, img.path);
            formData.append(`oldReferences[${i}][filename]`, img.filename);
        });

        const keptFloorPlans: { path: string; filename: string }[] = [];
        floorPlans.forEach((item) => {
            if (item.type === "existing") {
                keptFloorPlans.push({ path: item.path, filename: item.filename });
            } else {
                formData.append("floorPlans", item.file);
            }
        });
        keptFloorPlans.forEach((img, i) => {
            formData.append(`oldFloorPlans[${i}][path]`, img.path);
            formData.append(`oldFloorPlans[${i}][filename]`, img.filename);
        });
        console.log([...formData.entries()])
        const result = await handleUpdation({ formdata: formData, id: jobId });
        handleResponse(result.success, "Update successful", result.message, -1);
    };
    const onInvalid: SubmitErrorHandler<IJobRequest> = (errors) => {
        console.log('Form is invalid! Joi Errors:', errors);


    };
    const isDirectHire = job.sourceType === "DIRECT_HIRE";

    return (
        <div className="min-h-screen w-full flex justify-center items-start py-10 px-4">
            <div className="w-full max-w-3xl bg-surface rounded-2xl p-6 sm:p-10 border border-surface-border">
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-semibold font-Dynalight-Regular text-accent">designO</h2>
                    <p className="text-text-muted font-Jost-Semibold text-xs tracking-widest uppercase mt-1">
                        Edit Job Request
                    </p>

                    {isDirectHire && (
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-accent-tint border border-surface-border rounded-full text-xs font-Jost-Semibold text-accent-tint-text">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Direct Designer Inquiry</span>
                        </div>
                    )}
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                        <ProjectOverviewSection />
                        <hr className="border-surface-border" />

                        <SpaceStatusSection />
                        <hr className="border-surface-border" />

                        <SpaceScopeSection hideFloorPlanUpload />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-Jost-Semibold text-text-primary">
                                    Floor Plans <span className="text-text-faint font-normal">(Optional)</span>
                                </label>
                                <span className="text-xs text-text-faint">{floorPlans.length} / 10</span>
                            </div>

                            {floorPlans.length < 10 && (
                                <>
                                    <label
                                        htmlFor="floorPlanEdit"
                                        className="flex items-center justify-center gap-2 border-2 border-dashed border-surface-border rounded-xl p-4 cursor-pointer hover:border-accent bg-surface transition-colors"
                                    >
                                        <Upload className="w-5 h-5 text-text-faint" />
                                        <span className="text-sm text-text-primary font-medium">Click to upload Floor Plan(s)</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="floorPlanEdit"
                                        multiple
                                        hidden
                                        accept="application/pdf"
                                        onChange={handleFloorPlanUpload}
                                    />
                                </>
                            )}

                            {floorPlans.length > 0 && (
                                <div className="space-y-1">
                                    {floorPlans.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-surface rounded-lg border border-surface-border text-xs">
                                            <span className="flex items-center gap-2 truncate text-text-primary font-medium">
                                                <FileText className="w-4 h-4 text-text-faint shrink-0" />
                                                {item.type === "existing" ? (
                                                    <a href={item.path} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                                                        {item.filename}
                                                    </a>
                                                ) : (
                                                    item.file.name
                                                )}
                                                <span
                                                    className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${item.type === "new"
                                                        ? "bg-success-tint text-success-text"
                                                        : "bg-surface-hover text-text-faint"
                                                        }`}
                                                >
                                                    {item.type === "new" ? "New" : "Saved"}
                                                </span>
                                            </span>
                                            <button type="button" onClick={() => handleRemoveFloorPlan(index)} className="text-error hover:text-error-text">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <hr className="border-surface-border" />

                        <DeliverablesSection />
                        <hr className="border-surface-border" />

                        <AestheticsAndItemsSection />
                        <hr className="border-surface-border" />

                        <HouseholdProfileSection />
                        <hr className="border-surface-border" />

                        <LocationBudgetSection />


                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-Jost-Semibold text-text-primary">
                                    Reference Images <span className="text-text-faint font-normal">(Optional)</span>
                                </label>
                                <span className="text-xs text-text-faint">{referenceImages.length} / 10</span>
                            </div>

                            {referenceImages.length < 10 && (
                                <>
                                    <label
                                        htmlFor="referenceEdit"
                                        className="flex items-center gap-3 w-full border border-surface-border rounded-lg px-4 py-2 cursor-pointer hover:border-accent transition-colors"
                                    >
                                        <div className="bg-surface-hover p-1.5 rounded-md">
                                            <ImageIcon className="h-4 w-4 text-text-faint" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm text-text-primary font-medium">Add Reference Photos</span>
                                            <span className="text-[11px] text-text-faint truncate">
                                                {referenceImages.length > 0
                                                    ? `${referenceImages.length} selected — up to ${10 - referenceImages.length} more`
                                                    : "Select one or more images..."}
                                            </span>
                                        </div>
                                        <Plus className="h-5 w-5 text-text-faint ml-auto shrink-0" />
                                    </label>
                                    <input type="file" id="referenceEdit" multiple hidden accept="image/*" onChange={handleReferenceUpload} />
                                </>
                            )}

                            {referenceImages.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface-hover rounded-xl border border-dashed border-surface-border">
                                    {referenceImages.map((item, index) => {
                                        const src = item.type === "existing" ? item.path : item.preview;
                                        const isNew = item.type === "new";
                                        return (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-surface border border-surface-border hover:border-accent transition-colors group">
                                                <Zoom>
                                                    <img src={src} className="w-full h-full object-cover" alt={`Reference ${index + 1}`} />
                                                </Zoom>
                                                <span
                                                    className={`absolute top-1 left-1 z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${isNew
                                                        ? "bg-success-tint text-success-text"
                                                        : "bg-surface-hover text-text-faint"
                                                        }`}
                                                >
                                                    {isNew ? "New" : "Saved"}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveReference(index)}
                                                    className="absolute top-1 right-1 z-10 bg-error-tint text-error-text border border-error hover:bg-error hover:text-text-primary p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <SubmitButton isLoading={isEditing} label="Update Job Request" loadingLabel="Updating..." type="submit" />
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}