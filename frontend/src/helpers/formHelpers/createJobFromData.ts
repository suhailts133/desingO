import type { IJobRequest } from "../../features/user/jobs/jobInterface";


export const createJobFormData = (data: IJobRequest): FormData => {
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

    data.designStyles.forEach(({ label }, i) => formData.append(`designStyles[${i}]`, label));
    data.services.forEach(({ label }, i) => formData.append(`services[${i}]`, label));

    data.rooms.forEach((room, i) => {
        formData.append(`rooms[${i}][spaceType]`, room.spaceType.label);
        formData.append(`rooms[${i}][length]`, String(room.length));
        formData.append(`rooms[${i}][width]`, String(room.width));
        formData.append(`rooms[${i}][unit]`, room.unit.label);
        if (room.ceilingHeight) formData.append(`rooms[${i}][ceilingHeight]`, String(room.ceilingHeight));
        if (room.notes) formData.append(`rooms[${i}][notes]`, room.notes);
    });

    data.refrenceImages?.forEach((item) => {
        const file = item.file?.[0];
        if (file) formData.append("refrenceImages", file);
    });

    return formData;
};