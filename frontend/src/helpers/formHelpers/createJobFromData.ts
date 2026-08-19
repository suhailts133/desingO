import type { IJobRequest } from "../../features/user/jobs/jobInterface";

export const createJobFormData = (data: IJobRequest): FormData => {
    const formData = new FormData();
    formData.append("sourceType", data.sourceType || "JOB_REQUEST");
    if (data.designerId) {
        formData.append("designerId", data.designerId);
    }
    if (data.designId) {
        formData.append("designId", data.designId);
    }

    formData.append("projectType", data.projectType);
    formData.append("projectTitle", data.projectTitle);
    formData.append("propertyType", data.propertyType?.label || (data.propertyType as unknown as string));
    formData.append("description", data.description || "");


    if (data.projectType === "Renovation" && data.renovationDetails) {
        formData.append("renovationDetails[level]", data.renovationDetails.level);
        formData.append("renovationDetails[propertyAgeYears]", String(data.renovationDetails.propertyAgeYears || ""));
        formData.append("renovationDetails[livingInDuringRenovation]", String(Boolean(data.renovationDetails.livingInDuringRenovation)));
    } else if (data.projectType === "New_Build" && data.newbuildDetails) {
        formData.append("newbuildDetails[stage]", data.newbuildDetails.stage);
        formData.append("newbuildDetails[vastuCompliantRequired]", String(Boolean(data.newbuildDetails.vastuCompliantRequired)));
    }


    if (data.totalCarpetArea !== undefined) {
        formData.append("totalCarpetArea", String(data.totalCarpetArea));
    }
    formData.append("areaUnit", data.areaUnit);
    formData.append("requiresSiteVisitMeasurement", String(Boolean(data.requiresSiteVisitMeasurement)));


    data.selectedRooms?.forEach((room, i) => { formData.append(`selectedRooms[${i}]`, room.label || room.value); });


    data.floorPlans?.forEach((plan) => {
        const file = plan.file?.[0];
        if (file) formData.append("floorPlans", file);
    });

    data.services?.forEach((service, i) => {
        formData.append(`services[${i}]`, service.label || service.value);
    });

    data.designStyles?.forEach((style, i) => {
        formData.append(`designStyles[${i}]`, style.label || style.value);
    });

    data.preferredMaterials?.forEach((material, i) => {
        formData.append(`preferredMaterials[${i}]`, material.label || material.value);
    });


    if (data.householdProfile) {
        formData.append("householdProfile[adultsCount]", String(data.householdProfile.adultsCount ?? 0));
        formData.append("householdProfile[kidsCount]", String(data.householdProfile.kidsCount ?? 0));
        formData.append("householdProfile[seniorsCount]", String(data.householdProfile.seniorsCount ?? 0));
        formData.append("householdProfile[hasPets]", String(Boolean(data.householdProfile.hasPets)));
        if (data.householdProfile.petDetails) {
            formData.append("householdProfile[petDetails]", data.householdProfile.petDetails);
        }
    }


    formData.append("state", data.state);
    formData.append("district", data.district);
    formData.append("city", data.city);
    formData.append("pincode", data.pincode);
    formData.append("phone", data.phone);
    formData.append("timeline", data.timeline?.label || (data.timeline as unknown as string));
    formData.append("minBudget", String(data.minBudget ?? 0));
    formData.append("maxBudget", String(data.maxBudget ?? 0));

    // Reference Images
    data.referenceImages?.forEach((item) => {
        const file = item.file?.[0];
        if (file) formData.append("referenceImages", file);
    });

    return formData;
};