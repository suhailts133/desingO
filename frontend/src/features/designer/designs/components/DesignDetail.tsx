import { useState } from "react";
import { ChevronLeft, Tag, Wallet, Layers, Wrench, User, ChevronDown, Calendar, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetDesignDetailQuery } from "../designEndpoints";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useToggleSaveDesign } from "../../../common/hooks/useToggleSaveDesign";
import { useDecodeAccessToken } from "../../../../helpers/decodeAccessToken";

export default function DesignDetail() {
    const { id } = useParams<{ id: string }>();
    const { role } = useDecodeAccessToken();
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetDesignDetailQuery(id!, { skip: !id });

    const [servicesOpen, setServicesOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [savedOverride, setSavedOverride] = useState<boolean | null>(null);

    const { isToggling, handleToggling } = useToggleSaveDesign();
    const design = data?.data;

    if (isLoading) {
        return <div className="p-10 text-center animate-pulse text-text-faint font-Jost">Loading Design Details...</div>;
    }
    if (error || !design) {
        return <div className="p-10 text-center text-error font-Jost-Semibold">Design not found.</div>;
    }


    const activeImage = selectedImage ?? design.coverImage.path;
    const isSaved = savedOverride ?? design.isSaved ?? false;
    const allImages = [design.coverImage.path, ...design.gallery.map((e) => e.path)];

    const handleDirectHire = () => {
        const params = new URLSearchParams({
            designerId: design.designerId,
            designId: design.id,
            source: "DIRECT_HIRE",
        });

        navigate(`/customer/add-job?${params.toString()}`);
    };

    const toggleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const nextSaved = !isSaved;
        setSavedOverride(nextSaved);

        const result = await handleToggling({ designId: design.id, isSaved: nextSaved });
        if (result !== undefined) {
            setSavedOverride(result);
        } else {
            setSavedOverride(design.isSaved);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 font-Jost">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 mb-4 text-sm text-text-primary hover:underline cursor-pointer"
            >
                <ChevronLeft className="w-4 h-4" />
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* LEFT / MAIN COLUMN */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Media Display */}
                    <div className="bg-surface rounded-2xl border border-surface-border hover:border-accent overflow-hidden">
                        <div className="group relative w-full bg-surface-border flex items-center justify-center overflow-hidden">
                            <Zoom>
                                <img
                                    src={activeImage}
                                    alt={design.designName}
                                    className="w-full h-full object-cover transition-all duration-300"
                                />
                            </Zoom>

                            {/* Wishlist Button */}
                            <button
                                onClick={toggleSave}
                                disabled={isToggling}
                                aria-label={isSaved ? "Unsave design" : "Save design"}
                                className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-surface border border-surface-border 
               flex items-center justify-center transition-opacity duration-200 hover:bg-surface-hover
               ${isSaved ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                            >
                                <Heart
                                    size={14}
                                    className={`transition-colors duration-200 ${isSaved
                                        ? "fill-accent text-accent"
                                        : "text-accent"
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Thumbnail Strip */}
                        {allImages.length > 1 && (
                            <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-t border-surface-border-strong">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(img)}
                                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${activeImage === img
                                            ? "border-accent opacity-100"
                                            : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Title & Badges */}
                    <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                        <h1 className="font-Jost-Semibold text-2xl text-text-primary leading-snug mb-3">
                            {design.designName}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5">
                                <Tag className="w-3.5 h-3.5 text-text-faint" /> {design.propertyType}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5">
                                <Layers className="w-3.5 h-3.5 text-text-faint" /> {design.spaceType}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5">
                                <Wallet className="w-3.5 h-3.5 text-text-faint" /> Budget ₹{design.minPrice.toLocaleString("en-IN")} - ₹{design.maxPrice.toLocaleString("en-IN")}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5">
                                <Calendar className="w-3.5 h-3.5 text-text-faint" /> Posted on {new Date(design.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-3">About this Design</h2>
                        <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">{design.description}</p>
                    </div>

                    {/* Design Styles */}
                    <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-3">Design Styles</h2>
                        <div className="flex flex-wrap gap-2">
                            {design.designStyles.map((style) => (
                                <span key={style} className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent-tint text-accent-tint-text border border-surface-border">
                                    {style}
                                </span>
                            ))}
                        </div>
                    </div>

              
                </div>

                {/* RIGHT COLUMN (Sticky Sidebar) */}
                <div className="space-y-5 sticky top-6">
                    {/* Designer Card */}
                    <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-4">Designer</h2>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center">
                                <User className="w-7 h-7 text-text-faint" />
                            </div>
                            <div>
                                <p className="font-Jost-Semibold text-text-primary">{design.designerName}</p>
                            </div>

                            {role === "Customer" && (
                                <button className="auth-button w-full cursor-pointer" onClick={handleDirectHire}>
                                    Hire this Designer
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Summary */}
                    <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-4">Quick Summary</h2>
                        <ul className="space-y-3">
                            {[
                                { label: "Property", value: design.propertyType },
                                { label: "Space", value: design.spaceType },
                                {
                                    label: "Starting Price",
                                    value: `₹${design.minPrice.toLocaleString("en-IN")} - ₹${design.maxPrice.toLocaleString("en-IN")}`,
                                },
                                { label: "Styles", value: design.designStyles.join(", ") },
                            ].map(({ label, value }) => (
                                <li key={label} className="flex items-start justify-between gap-2">
                                    <span className="text-text-faint text-xs shrink-0">{label}</span>
                                    <span className="font-Jost-Semibold text-text-primary text-xs text-right">{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}