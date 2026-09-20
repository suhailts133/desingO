import { MapPin, Clock, Wallet, Ruler, Phone, Tag, ChevronLeft, User, Calendar, FileText, Layers, Sparkles, Wrench, Users, PawPrint, Package, Home, Compass, ExternalLink, } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAJobRequestDetailQuery } from "../jobEndpoints";
import ApplyForJob from "./applyForJob";

export default function JobRequestDetail() {
    const [modalType, setModalType] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetAJobRequestDetailQuery(id!, { skip: !id });
    const job = data?.data;

    if (isLoading) {
        return <div className="p-10 text-center animate-pulse text-text-faint">Loading Job Request Details...</div>;
    }
    if (error || !job) {
        return <div className="p-10 text-center text-error font-Jost-Semibold">Job Request not found.</div>;
    }

    const isDirectHire = job.sourceType === "DIRECT_HIRE";
    const isRenovation = job.projectType === "Renovation";

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-sm text-text-primary hover:underline">
                <ChevronLeft className="w-4 h-4" />
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                    {/* Header */}
                    <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
                        <div className="px-6 py-5">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <h1 className="font-Jost-Semibold text-2xl text-text-primary leading-snug">
                                    {job.projectTitle}
                                </h1>
                                <span
                                    className={`shrink-0 text-xs font-Jost-Semibold px-3 py-1 rounded-full ${job.status === "Ongoing"
                                            ? "bg-success-tint text-success-text"
                                            : job.status === "Closed"
                                                ? "bg-surface-hover text-text-faint"
                                                : "bg-warning-tint text-warning-text"
                                        }`}
                                >
                                    {job.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-text-faint mb-5">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-text-faint" />
                                    {job.city}, {job.district}, {job.state}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5 text-text-faint" />
                                    {job.phone}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-text-faint" />
                                    {job.createdAt}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5">
                                    <Tag className="w-3.5 h-3.5 text-text-faint" /> {job.propertyType}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5">
                                    <Layers className="w-3.5 h-3.5 text-text-faint" /> {job.projectType.replace("_", " ")}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5">
                                    <Clock className="w-3.5 h-3.5 text-text-faint" /> {job.timeline}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5">
                                    <Wallet className="w-3.5 h-3.5 text-text-faint" /> ₹{job.minBudget.toLocaleString("en-IN")} - ₹{job.maxBudget.toLocaleString("en-IN")}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5">
                                    <Ruler className="w-3.5 h-3.5 text-text-faint" /> {job.totalCarpetArea} {job.areaUnit}²
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Direct hire banner */}
                    {isDirectHire && (
                        <div className="bg-success-tint border border-success rounded-2xl px-6 py-4 flex items-center gap-3">
                            <div className="bg-surface p-2 rounded-lg border border-success">
                                <User className="w-4 h-4 text-success" />
                            </div>
                            <p className="text-sm text-success-text">
                                Directly hired <span className="font-Jost-Semibold">{job.designerName}</span>
                                {job.designId && " for a saved design"}
                            </p>
                        </div>
                    )}

                    {/* Description */}
                    <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-3">Description</h2>
                        <p className="text-sm text-text-muted leading-relaxed">{job.description}</p>
                    </div>

                    {/* Renovation / New build details */}
                    {isRenovation && job.renovationDetails && (
                        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-3">Renovation Details</h2>
                            <ul className="space-y-2 text-sm text-text-muted">
                                <li className="flex justify-between gap-2">
                                    <span className="text-text-faint text-xs">Scope</span>
                                    <span className="font-Jost-Semibold text-text-primary text-xs">{job.renovationDetails.level.replace(/_/g, " ")}</span>
                                </li>
                                <li className="flex justify-between gap-2">
                                    <span className="text-text-faint text-xs">Property age</span>
                                    <span className="font-Jost-Semibold text-text-primary text-xs">{job.renovationDetails.propertyAgeYears} years</span>
                                </li>
                                <li className="flex justify-between gap-2">
                                    <span className="text-text-faint text-xs">Living in during renovation</span>
                                    <span className="font-Jost-Semibold text-text-primary text-xs">{job.renovationDetails.livingInDuringRenovation ? "Yes" : "No"}</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {!isRenovation && job.newbuildDetails && (
                        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-3">New Build Details</h2>
                            <ul className="space-y-2 text-sm text-text-muted">
                                <li className="flex justify-between gap-2">
                                    <span className="text-text-faint text-xs">Stage</span>
                                    <span className="font-Jost-Semibold text-text-primary text-xs">{job.newbuildDetails.stage.replace(/_/g, " ")}</span>
                                </li>
                                <li className="flex justify-between gap-2">
                                    <span className="text-text-faint text-xs flex items-center gap-1">
                                        <Compass className="w-3 h-3" /> Vastu compliant required
                                    </span>
                                    <span className="font-Jost-Semibold text-text-primary text-xs">{job.newbuildDetails.vastuCompliantRequired ? "Yes" : "No"}</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Reference images */}
                    {job.referenceImages.length > 0 && (
                        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-3">Reference Images</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {job.referenceImages.map((image, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-surface-hover group">
                                        <Zoom>
                                            <img src={image.path} className="w-full h-full object-fill" alt={`reference image ${index}`} />
                                        </Zoom>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Floor plans (PDFs) */}
                    {job.floorPlans.length > 0 && (
                        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-3">Floor Plans</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {job.floorPlans.map((url, index) => (
                                    <a
                                        key={index}
                                        href={url.path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-surface-border hover:border-surface-border-strong hover:bg-surface-hover transition-colors"
                                    >
                                        <div className="bg-surface-hover p-1.5 rounded-lg border border-surface-border">
                                            <FileText className="w-3.5 h-3.5 text-text-faint" />
                                        </div>
                                        <span className="text-sm text-text-primary flex-1 truncate">Floor Plan {index + 1}.pdf</span>
                                        <ExternalLink className="w-3.5 h-3.5 text-text-faint" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Design styles */}
                    <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-3">Design Styles</h2>
                        <div className="flex flex-wrap gap-2">
                            {job.designStyles.map((style) => (
                                <span key={style} className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent-tint text-accent-tint-text">
                                    {style}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Preferred materials */}
                    {job.preferredMaterials.length > 0 && (
                        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-3">Preferred Materials</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.preferredMaterials.map((material) => (
                                    <span key={material} className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent-tint text-accent-tint-text">
                                        {material}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Services */}
                    {job.services.length > 0 && (
                        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-3 flex items-center gap-1.5">
                                <Wrench className="w-3.5 h-3.5" /> Services Requested
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {job.services.map((service) => (
                                    <span key={service} className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent-tint text-accent-tint-text">
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Selected rooms + area */}
                    <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-4">Rooms & Area</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {job.selectedRooms.map((room) => (
                                <span key={room} className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5">
                                    <Home className="w-3.5 h-3.5 text-text-faint" /> {room}
                                </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-text-muted">
                            <span>Total carpet area: <strong className="text-text-primary">{job.totalCarpetArea} {job.areaUnit}²</strong></span>
                            <span>Site visit measurement: <strong className="text-text-primary">{job.requiresSiteVisitMeasurement ? "Required" : "Not required"}</strong></span>
                        </div>
                    </div>

                    {/* Reusable items */}
                    {job.reusableItems && job.reusableItems.length > 0 && (
                        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-4 flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5" /> Reusable Items
                            </h2>
                            <div className="space-y-3">
                                {job.reusableItems.map((item, i) => (
                                    <div key={i} className="flex gap-3 p-3 rounded-xl border border-surface-border">
                                        {item.photoUrl && (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-hover shrink-0">
                                                <Zoom>
                                                    <img src={item.photoUrl} className="w-full h-full object-cover" alt={item.name} />
                                                </Zoom>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-sm font-Jost-Semibold text-text-primary">{item.name}</span>
                                                <span className="text-[11px] text-text-faint uppercase tracking-wide">{item.category}</span>
                                            </div>
                                            <p className="text-xs text-text-muted mt-1">
                                                {item.dimensions.length} × {item.dimensions.width}
                                                {item.dimensions.height ? ` × ${item.dimensions.height}` : ""} {item.dimensions.unit}
                                            </p>
                                            {item.notes && <p className="text-xs text-text-muted mt-1">{item.notes}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Household profile */}
                    <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-4 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" /> Household Profile
                        </h2>
                        <div className="flex flex-wrap gap-3 text-xs text-text-muted">
                            <span>Adults: <strong className="text-text-primary">{job.householdProfile.adultsCount}</strong></span>
                            <span>Kids: <strong className="text-text-primary">{job.householdProfile.kidsCount}</strong></span>
                            <span>Seniors: <strong className="text-text-primary">{job.householdProfile.seniorsCount}</strong></span>
                            <span className="flex items-center gap-1">
                                <PawPrint className="w-3.5 h-3.5 text-text-faint" />
                                {job.householdProfile.hasPets ? job.householdProfile.petDetails || "Has pets" : "No pets"}
                            </span>
                        </div>
                    </div>

                    {modalType && <ApplyForJob onClose={() => setModalType(false)} jobId={job.id} />}

                    {job.sourceType === "JOB_REQUEST" && job.status === "Pending" && (
                        <button onClick={() => setModalType(true)} className="auth-button w-full">
                            Apply for job
                        </button>
                    )}
                </div>

                <div className="space-y-5">
                    {/* Customer card */}
                    <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-4">Posted By</h2>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center">
                                <User className="w-7 h-7 text-text-faint" />
                            </div>
                            <p className="font-Jost-Semibold text-text-primary">{job.userName}</p>
                        </div>
                    </div>

                    {/* Designer card (direct hire only) */}
                    {isDirectHire && job.designerName && (
                        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-4">Assigned Designer</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-success-tint border-2 border-success flex items-center justify-center shrink-0">
                                    <Sparkles className="w-5 h-5 text-success" />
                                </div>
                                <p className="font-Jost-Semibold text-text-primary text-sm">{job.designerName}</p>
                            </div>
                        </div>
                    )}

                    {/* Quick summary */}
                    <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-4">Quick Summary</h2>
                        <ul className="space-y-3 text-sm">
                            {[
                                { label: "Property", value: job.propertyType },
                                { label: "Project type", value: job.projectType.replace("_", " ") },
                                { label: "Timeline", value: job.timeline },
                                { label: "Budget", value: `₹${job.minBudget.toLocaleString("en-IN")} - ₹${job.maxBudget.toLocaleString("en-IN")}` },
                                { label: "Carpet area", value: `${job.totalCarpetArea} ${job.areaUnit}²` },
                                { label: "Rooms", value: `${job.selectedRooms.length} room${job.selectedRooms.length > 1 ? "s" : ""}` },
                                { label: "Location", value: `${job.city}, ${job.state}` },
                            ].map(({ label, value }) => (
                                <li key={label} className="flex items-center justify-between gap-2">
                                    <span className="text-text-faint text-xs">{label}</span>
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