import { Palette, Home, Pencil } from "lucide-react";
import type { IDesignerPreference } from "../designerProfileInterface";

interface Props {
    preferences?: IDesignerPreference;
    onOpen: () => void;
}

export default function DesignerPreferences({ preferences, onOpen }: Props) {

    const designStyle = preferences?.designStyle ?? [];
    const propertyType = preferences?.propertyType ?? [];

    return (
        <div className="bg-off-white w-full rounded-xl border border-blush-light/40 overflow-hidden shadow-lg">

            <div className="px-5 pt-6 pb-5 flex flex-col items-center gap-2 text-center">
                <h2 className="text-lg font-semibold text-soft-black leading-snug">
                    Preferences
                </h2>
            </div>

            <div className="h-px bg-blush-light/40" />

            <div className="flex flex-col divide-y divide-blush-light/40">
                <div className="flex items-start gap-3 px-5 py-3.5">
                    <Palette size={13} strokeWidth={2} className="text-blush-deep/70 shrink-0 mt-0.5" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-soft-black/40 w-20 shrink-0 mt-0.5">
                        Style
                    </span>
                    {designStyle.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {designStyle.map((style) => (
                                <span key={style} className="text-xs font-medium text-blush-deep bg-blush-pale border border-blush-light/70 rounded-full px-2.5 py-1">
                                    {style}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="text-sm font-semibold text-soft-black">Not given</span>
                    )}
                </div>

                <div className="flex items-start gap-3 px-5 py-3.5">
                    <Home size={13} strokeWidth={2} className="text-blush-deep/70 shrink-0 mt-0.5" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-soft-black/40 w-20 shrink-0 mt-0.5">
                        Property
                    </span>
                    {propertyType.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {propertyType.map((type) => (
                                <span key={type} className="text-xs font-medium text-blush-deep bg-blush-pale border border-blush-light/70 rounded-full px-2.5 py-1">
                                    {type}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="text-sm font-semibold text-soft-black">Not given</span>
                    )}
                </div>
            </div>

            <div className="h-px bg-blush-light/40" />
            <div className="px-5 py-4">
                <button
                    onClick={onOpen}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-blush-light/70 bg-blush-pale text-blush-deep text-xxs font-semibold tracking-widest uppercase hover:bg-blush-light/40 transition-colors duration-200"
                >
                    <Pencil size={12} strokeWidth={2.5} />
                    Edit Preferences
                </button>
            </div>


        </div>
    );
}