import type {  DesignerProfileResponseDTO, DesignerUpdateResponseDTO } from "../designerProfileInterface";
import { MapPin, Phone, Pencil, Link } from "lucide-react";

interface Props {
    profile: DesignerProfileResponseDTO;
    onUpdate?: () => void;
    newData?: DesignerUpdateResponseDTO
}

export default function DesignerInfo({ profile, onUpdate, newData }: Props) {
    const { full_name, bio, phone, state, city, district, portfolioUrl } = newData ?? profile;


    return (
        <div className="bg-off-white w-full rounded-xl border border-blush-light/40 overflow-hidden shadow-lg">

            {/* Name + bio */}
            <div className="px-5 pt-6 pb-5 flex flex-col items-center gap-2 text-center">
                <h2 className="text-lg font-semibold text-soft-black leading-snug">
                    {full_name}
                </h2>

                <p className="text-sm font-dm-sans-light text-soft-black/60 leading-relaxed">
                    {bio}
                </p>

            </div>

            <div className="h-px bg-blush-light/40" />

            {/* Rows */}
            <div className="flex flex-col divide-y divide-blush-light/40">

                <div className="flex items-center gap-3 px-5 py-3.5">
                    <Phone size={13} strokeWidth={2} className="text-blush-deep/70 shrink-0" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-soft-black/40 w-20 shrink-0">Phone</span>
                    <span className="text-sm font-semibold text-soft-black">{phone ?? "Not given"}</span>
                </div>

                <div className="flex items-center gap-3 px-5 py-3.5">
                    <MapPin size={13} strokeWidth={2} className="text-blush-deep/70 shrink-0" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-soft-black/40 w-20 shrink-0">State</span>
                    <span className="text-sm font-semibold text-soft-black">{state}</span>
                </div>

                <div className="flex items-center gap-3 px-5 py-3.5">
                    <MapPin size={13} strokeWidth={2} className="text-blush-deep/70 shrink-0" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-soft-black/40 w-20 shrink-0">City</span>
                    <span className="text-sm font-semibold text-soft-black">{city}</span>
                </div>

                <div className="flex items-center gap-3 px-5 py-3.5">
                    <MapPin size={13} strokeWidth={2} className="text-blush-deep/70 shrink-0" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-soft-black/40 w-20 shrink-0">District</span>
                    <span className="text-sm font-semibold text-soft-black">{district}</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-3.5">
                    <Link size={13} strokeWidth={2} className="text-blush-deep/70 shrink-0" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-soft-black/40 w-20 shrink-0">Portfolio</span>
                    <span className="text-sm font-semibold text-soft-black">{portfolioUrl}</span>
                </div>

            </div>

            {/* Update button */}
            <div className="h-px bg-blush-light/40" />
            <div className="px-5 py-4">
                <button
                    onClick={onUpdate}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-blush-light/70 bg-blush-pale text-blush-deep text-xxs font-semibold tracking-widest uppercase hover:bg-blush-light/40 transition-colors duration-200"
                >
                    <Pencil size={12} strokeWidth={2.5} />
                    Update Profile
                </button>
            </div>

        </div>
    );
}