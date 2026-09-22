import { useForm, FormProvider, type SubmitErrorHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useSearchParams } from "react-router-dom";
import { UserCheck } from "lucide-react";

import { usePostJob } from "../hooks/usePostJob";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";
import SubmitButton from "../../../../shared/common/SubmitButton";
import ReferenceImagesSection from "../components/ReferenceImagesSection";
import { jobRequestValidation } from "../../../../validations/customerValidation";
import type { IJobRequest, Source_type } from "../jobInterface";
import { createJobFormData } from "../../../../helpers/formHelpers/createJobFromData";
import ProjectOverviewSection from "../components/ProjectOverviewSection";
import AestheticsAndItemsSection from "../components/AestheticsAndItemsSection";
import DeliverablesSection from "../components/DeliverablesSection";
import HouseholdProfileSection from "../components/HouseholdProfileSection";
import LocationBudgetSection from "../components/LocationBudgetSection";
import SpaceScopeSection from "../components/SpaceScopeSection";
import SpaceStatusSection from "../components/SpaceStatusSection";
import { SERVICE_PRESETS } from "../jobData";

export default function JobRequestForm() {
    const [searchParams] = useSearchParams();

    const designerId = searchParams.get("designerId") ?? undefined;
    const designId = searchParams.get("designId") ?? undefined;
    const sourceType: Source_type = searchParams.get("source") === "DIRECT_HIRE" || Boolean(designerId) ? "DIRECT_HIRE" : "JOB_REQUEST";
    const isDirectHire = sourceType === "DIRECT_HIRE";
    const methods = useForm<IJobRequest>({
        resolver: joiResolver(jobRequestValidation),
        defaultValues: {
            sourceType,
            designerId,
            designId,
            projectType: "Renovation",
            areaUnit: "ft",
            requiresSiteVisitMeasurement: false,
            servicePackageType: "CONTRACTOR_READY",
            services: SERVICE_PRESETS.CONTRACTOR_READY,
            selectedRooms: [],
            designStyles: [],
            preferredMaterials: [],
            householdProfile: {
                adultsCount: 2,
                kidsCount: 0,
                seniorsCount: 0,
                hasPets: false,
            },
            renovationDetails: {
                level: "ROOMS_UPGRADE",
                propertyAgeYears: "5",
                livingInDuringRenovation: false,
            },
            newbuildDetails: {
                stage: "BARE_SHELL_READY",
                vastuCompliantRequired: false,
            },
            referenceImages: [],
            floorPlans: [],
        },
    });

    const { handleSubmit } = methods;
    const { handleSubmission, isLoading } = usePostJob();
    const handleResponse = useHandleResponse();

    const onSubmit = async (data: IJobRequest) => {
        const formData = createJobFormData(data);
        console.log([...formData.entries()])
        const result = await handleSubmission(formData);
        handleResponse(result.success, isDirectHire ? "Direct Hire Request Sent" : "Job Posted Successfully", result.message, -1);
    };
    const onInvalid: SubmitErrorHandler<IJobRequest> = (errors) => {
        console.log('Form is invalid! Joi Errors:', errors);


    };
    return (
        <div className="min-h-screen w-full flex justify-center items-start py-10 px-4">
            <div className="w-full max-w-3xl bg-surface rounded-2xl p-6 sm:p-10 border border-surface-border">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-semibold font-Dynalight-Regular text-accent">
                        designO
                    </h2>
                    <p className="text-text-muted font-Jost-Semibold text-xs tracking-widest uppercase mt-1">
                        {isDirectHire
                            ? "Send a Direct Hire Proposal"
                            : "Post an Interior Drawing Job Request"}
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

                        <SpaceScopeSection />
                        <hr className="border-surface-border" />

                        <DeliverablesSection />
                        <hr className="border-surface-border" />

                        <AestheticsAndItemsSection />
                        <hr className="border-surface-border" />

                        <HouseholdProfileSection />
                        <hr className="border-surface-border" />

                        <LocationBudgetSection />

                        <ReferenceImagesSection />

                        <div className="pt-4">
                            <SubmitButton
                                isLoading={isLoading}
                                label={
                                    isDirectHire
                                        ? "Send Direct Hire Proposal"
                                        : "Post Interior Job Request"
                                }
                                loadingLabel={
                                    isDirectHire
                                        ? "Sending Proposal..."
                                        : "Submitting Request..."
                                }
                                type="submit"
                            />
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}