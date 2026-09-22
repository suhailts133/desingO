import type { DesignerProfileResponseDTO, DesignerUpdateResponseDTO } from "../designerProfileInterface";
import { MapPin, Phone, Pencil, Link } from "lucide-react";

interface Props {
    profile: DesignerProfileResponseDTO;
    onUpdate?: () => void;
    newData?: DesignerUpdateResponseDTO
}

export default function DesignerInfo({ profile, onUpdate, newData }: Props) {
    const { full_name, bio, phone, state, city, district, portfolioUrl } = newData ?? profile;

    return (
        <div className="bg-surface w-full rounded-xl border border-surface-border flex flex-col">

            {/* Name + bio */}
            <div className="px-5 pt-6 pb-5 flex flex-col items-center gap-2 text-center">
                <h2 className="text-lg font-semibold text-text-primary leading-snug">
                    {full_name}
                </h2>

                <p className="text-sm font-dm-sans-light text-text-muted leading-relaxed">
                    {bio}
                </p>
            </div>

            <div className="h-px w-full bg-surface-border" />

            {/* Rows */}
            <div className="flex flex-col divide-y divide-surface-border w-full">
                <div className="flex items-center gap-3 px-5 py-3.5 w-full">
                    <Phone size={13} strokeWidth={2} className="text-text-faint shrink-0" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-text-faint w-20 shrink-0">Phone</span>
                    <span className="text-sm font-semibold text-text-primary truncate">{phone ?? "Not given"}</span>
                </div>

                <div className="flex items-center gap-3 px-5 py-3.5 w-full">
                    <MapPin size={13} strokeWidth={2} className="text-text-faint shrink-0" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-text-faint w-20 shrink-0">State</span>
                    <span className="text-sm font-semibold text-text-primary truncate">{state}</span>
                </div>

                <div className="flex items-center gap-3 px-5 py-3.5 w-full">
                    <MapPin size={13} strokeWidth={2} className="text-text-faint shrink-0" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-text-faint w-20 shrink-0">City</span>
                    <span className="text-sm font-semibold text-text-primary truncate">{city}</span>
                </div>

                <div className="flex items-center gap-3 px-5 py-3.5 w-full">
                    <MapPin size={13} strokeWidth={2} className="text-text-faint shrink-0" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-text-faint w-20 shrink-0">District</span>
                    <span className="text-sm font-semibold text-text-primary truncate">{district}</span>
                </div>
                
                <div className="flex items-center gap-3 px-5 py-3.5 w-full">
                    <Link size={13} strokeWidth={2} className="text-text-faint shrink-0" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-text-faint w-20 shrink-0">Portfolio</span>
                    <span className="text-sm font-semibold text-text-primary truncate">{portfolioUrl}</span>
                </div>
            </div>

            {/* Update button */}
            {onUpdate && (
                <div className="px-5 py-4 border-t border-surface-border mt-auto w-full">
                    <button
                        onClick={onUpdate}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-text-on-accent hover:bg-accent-hover active:bg-accent-active text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
                    >
                        <Pencil size={14} strokeWidth={2} />
                        Update Profile
                    </button>
                </div>
            )}
        </div>
    );
}