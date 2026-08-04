import { useEffect, useState } from "react";
import { ChevronLeft, Tag, Wallet, Layers, Wrench, User, ChevronDown, Calendar, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetDesignDetailQuery } from "../designEndpoints";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css"
import HireDesignerForm from "./HireDesignerForm";
import type { DirectHireFormPayload, HireDesignerFields } from "../../../user/jobs/jobInterface";
import { useToggleSaveDesign } from "../../../common/hooks/useToggleSaveDesign";
import { useHireDesigner } from "../hooks/useHireDesigner";
import toast from "react-hot-toast";

export default function DesignDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()
    const { data, isLoading, error } = useGetDesignDetailQuery(id!, { skip: !id })
    const [servicesOpen, setServicesOpen] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [hireDesigner, setHireDesigner] = useState<boolean>(false)
    const [isSaved, setIsSaved] = useState<boolean>(false)
    const { isToggling, savedError, handleToggling } = useToggleSaveDesign()
    const { hireError, hireSuccess, isHiring, handleSubmission } = useHireDesigner()
    const design = data?.data;

    useEffect(() => {
        if (design) {
            setActiveImage(design.coverImage.path)
            setIsSaved(design.isSaved)
        }
    }, [design])
    useEffect(() => {
        if (hireSuccess) {
            setHireDesigner(false)
        }
    }, [hireSuccess])
    if (isLoading) {
        return <div className="p-10 text-center animate-pulse text-gray-400">Loading Design Details...</div>;
    }
    if (error || !design) {
        return <div className="p-10 text-center text-red-500 font-Jost-Semibold">Design not found.</div>;
    }

    const handleDirectHire = async (body: DirectHireFormPayload) => {
        const data: HireDesignerFields = {
            designId: design.id,
            length: body.length,
            width: body.width,
            notes: body.notes,
            unit: body.unit.label,
            ceilingHeight: body.ceilingHeight,
            timeLine: body.timeLine.label,
            services: body.services.map(e => e.label)
        }
        const result = await handleSubmission(data)

        if (result.success) {
            toast.success(result.message || "Design hired successfully!")
        } else {
            toast.error(result.message || "Something went wrong.")
        }
    }
    const toggleSave = async (e: React.MouseEvent) => {
        e.stopPropagation()
        const result = await handleToggling({ designId: design.id, isSaved: !isSaved })
        if (result !== undefined) {
            setIsSaved(result)
        }
    }
    const allImages = [design.coverImage.path, ...design.gallery.map(e => e.path)];

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">

            {/* Back */}
            <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-sm text-soft-black hover:underline">
                <ChevronLeft className="w-4 h-4" />
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-5">

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">


                        <div className="relative w-full overflow-hidden">
                            <Zoom>
                                <img
                                    src={activeImage || design.coverImage.path}
                                    alt={design.designName}
                                    className="w-full h-auto object-contain transition-all duration-500"
                                />
                            </Zoom>

                            {/* wishlist icon*/}
                            <button
                                onClick={toggleSave}
                                disabled={isToggling}
                                aria-label={isSaved ? "Unsave design" : "Save design"}
                                className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-snow-white border border-blush-light/40
                                    flex items-center justify-center transition-all duration-200 hover:bg-blush-pale shadow-sm
                                    ${isSaved ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                            >
                                <Heart
                                    size={16}
                                    className={`transition-colors duration-200 ${isSaved
                                        ? "fill-blush-deep text-blush-deep"
                                        : "text-blush-deep"
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
                            {allImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(img)}
                                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${activeImage === img
                                        ? "border-soft-black shadow-md"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
                        <h1 className="font-Jost-Semibold text-2xl text-soft-black leading-snug mb-3">
                            {design.designName}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                                <Tag className="w-3.5 h-3.5 text-slate-500" /> {design.propertyType}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                                <Layers className="w-3.5 h-3.5 text-slate-500" /> {design.spaceType}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                                <Wallet className="w-3.5 h-3.5 text-slate-500" /> Budget ₹{design.minPrice.toLocaleString("en-IN")} - {design.maxPrice.toLocaleString("es-IN")}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Posted On {design.createdAt}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-gray-400 mb-3">About this Design</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{design.description}</p>
                    </div>

                    {/* Design Styles */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-gray-400 mb-3">Design Styles</h2>
                        <div className="flex flex-wrap gap-2">
                            {design.designStyles.map((style) => (
                                <span key={style} className="text-xs font-medium px-3 py-1.5 rounded-full bg-soft-black text-white">
                                    {style}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-gray-400 mb-3">
                            Services Included
                        </h2>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setServicesOpen(!servicesOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700"
                            >
                                <div className="flex items-center gap-2">
                                    <Wrench className="w-3.5 h-3.5 text-slate-500" />
                                    <span>{servicesOpen ? "Hide services" : "View all services"}</span>
                                    <span className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-500">
                                        {design.services.length} services
                                    </span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${servicesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="flex flex-col divide-y divide-gray-100">
                                    {design.services.map((service) => (
                                        <div
                                            key={service}
                                            className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-600 bg-white"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                                            {service}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-5">

                    {/* Designer Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-gray-400 mb-4">Designer</h2>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                <User className="w-7 h-7 text-gray-400" />
                            </div>
                            <div>
                                <p className="font-Jost-Semibold text-gray-800">{design.designerName}</p>
                            </div>
                            <button className="auth-button w-full" onClick={() => setHireDesigner(true)}>
                                Hire this Designer
                            </button>
                        </div>
                    </div>

                    {/* Quick Summary */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-gray-400 mb-4">Quick Summary</h2>
                        <ul className="space-y-3">
                            {[
                                { label: "Property", value: design.propertyType },
                                { label: "Space", value: design.spaceType },
                                { label: "Starting Price", value: `₹${design.minPrice.toLocaleString("en-IN")} - ${design.maxPrice.toLocaleString("en-IN")}` },
                                { label: "Styles", value: design.designStyles.join(", ") },
                            ].map(({ label, value }) => (
                                <li key={label} className="flex items-start justify-between gap-2">
                                    <span className="text-gray-400 text-xs shrink-0">{label}</span>
                                    <span className="font-Jost-Semibold text-gray-700 text-xs text-right">{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

            <HireDesignerForm isLoading={isHiring} isOpen={hireDesigner} onClose={() => setHireDesigner(false)} hireDesigner={handleDirectHire} />
        </div>
    );
}