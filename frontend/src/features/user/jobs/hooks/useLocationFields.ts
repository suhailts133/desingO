import { useFormContext, useWatch } from "react-hook-form";
import type { IJobRequest } from "../jobInterface";
import type { MapSelectedLocation } from "../components/LocationMapModal";

export function useLocationFields() {
    const { control, setValue, formState: { errors } } = useFormContext<IJobRequest>();

    const latitude = useWatch({ control, name: "latitude" });
    const longitude = useWatch({ control, name: "longitude" });

    const applyResolvedLocation = (loc: MapSelectedLocation) => {
        setValue("latitude", loc.latitude, { shouldValidate: true });
        setValue("longitude", loc.longitude, { shouldValidate: true });
        if (loc.city) setValue("city", loc.city, { shouldValidate: true });
        if (loc.district) setValue("district", loc.district, { shouldValidate: true });
        if (loc.state) setValue("state", loc.state, { shouldValidate: true });
        if (loc.pincode) setValue("pincode", loc.pincode, { shouldValidate: true });
    };

    return { latitude, longitude, applyResolvedLocation, latitudeError: errors.latitude?.message };
}