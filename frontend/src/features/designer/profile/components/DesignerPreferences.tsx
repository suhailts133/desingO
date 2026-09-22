import { Palette, Home, Pencil } from "lucide-react";
import type { IDesignerPreference } from "../designerProfileInterface";

interface Props {
    preferences?: IDesignerPreference;
    onOpen?: () => void;
}

export default function DesignerPreferences({ preferences, onOpen }: Props) {

    const designStyle = preferences?.designStyle ?? [];
    const propertyType = preferences?.propertyType ?? [];

    return (
        <div className="bg-surface w-full rounded-xl border border-surface-border flex flex-col h-full">

            <div className="px-5 pt-6 pb-5 flex flex-col items-center gap-2 text-center shrink-0">
                <h2 className="text-lg font-semibold text-text-primary leading-snug">
                    Preferences
                </h2>
            </div>

            <div className="h-px bg-surface-border shrink-0" />

            <div className="flex flex-col divide-y divide-surface-border">
                <div className="flex items-start gap-3 px-5 py-3.5">
                    <Palette size={13} strokeWidth={2} className="text-text-faint shrink-0 mt-0.5" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-text-faint w-20 shrink-0 mt-0.5">
                        Style
                    </span>
                    {designStyle.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {designStyle.map((style) => (
                                <span key={style} className="text-xs font-medium text-text-primary bg-surface-hover border border-surface-border rounded-full px-2.5 py-1">
                                    {style}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="text-sm font-semibold text-text-muted">Not given</span>
                    )}
                </div>

                <div className="flex items-start gap-3 px-5 py-3.5">
                    <Home size={13} strokeWidth={2} className="text-text-faint shrink-0 mt-0.5" />
                    <span className="text-xxs font-semibold tracking-widest uppercase text-text-faint w-20 shrink-0 mt-0.5">
                        Property
                    </span>
                    {propertyType.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {propertyType.map((type) => (
                                <span key={type} className="text-xs font-medium text-text-primary bg-surface-hover border border-surface-border rounded-full px-2.5 py-1">
                                    {type}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="text-sm font-semibold text-text-muted">Not given</span>
                    )}
                </div>
            </div>

            {/* Edit Preferences button */}
            {onOpen && (
                <div className="px-5 py-4 border-t border-surface-border mt-auto shrink-0">
                    <button
                        onClick={onOpen}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-text-on-accent hover:bg-accent-hover active:bg-accent-active text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
                    >
                        <Pencil size={14} strokeWidth={2} />
                        Edit Preferences
                    </button>
                </div>
            )}
        </div>
    );
}