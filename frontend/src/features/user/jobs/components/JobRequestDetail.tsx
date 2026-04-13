import { MapPin, Clock, Wallet, BedDouble, Ruler, Phone, Tag, ChevronLeft, User, Calendar } from "lucide-react";

import { useState } from "react";
// import ApplyForJob from ".";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAJobRequestDetailQuery } from "../jobEndpoints";
import ApplyForJob from "./applyForJob";




export default function JobRequestDetail() {
    const [modalType, setModalType] = useState<boolean>(false)
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()
    const { data, isLoading, error } = useGetAJobRequestDetailQuery(id!, { skip: !id })
    const job = data?.data
   
    if (isLoading) {
        return <div className="p-10 text-center animate-pulse text-gray-400">Loading Job Request Details...</div>;
    }
    if (error || !job) {
        return <div className="p-10 text-center text-red-500 font-Jost-Semibold">Job Request not found.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">


            <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-sm text-soft-black hover:underline">
                <ChevronLeft className="w-4 h-4" />
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-5">


                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                        <div className="px-6 py-5">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <h1 className="font-Jost-Semibold text-2xl text-soft-black leading-snug">
                                    {job.projectTitle}
                                </h1>

                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-5">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                    {job.city}, {job.district}, {job.state}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                                    {job.phone}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                    {job.createdAt}
                                </span>
                            </div>


                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                                    <Tag className="w-3.5 h-3.5 text-slate-500" /> {job.propertyType}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {job.timeline}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                                    <Wallet className="w-3.5 h-3.5 text-slate-500" /> ₹{Number(job.budget).toLocaleString("en-IN")}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                                    <BedDouble className="w-3.5 h-3.5 text-slate-500" /> {job.rooms.length} Room{job.rooms.length > 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black mb-3">Description</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
                    </div>

                    {/* Design Styles */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black mb-3">Design Styles</h2>
                        <div className="flex flex-wrap gap-2">
                            {job.designStyles.map((style: string) => (
                                <span key={style} className="text-xs font-medium px-3 py-1.5 rounded-full bg-snow-white text-soft-black">
                                    {style}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Room Measurements */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-gray-400 mb-4">Room Measurements</h2>
                        <div className="space-y-3">
                            {job.rooms.map((room, i: number) => (
                                <div key={i} className="p-4 rounded-xl border border-gray-200 shadow-sm">

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <div className="flex items-center gap-2 min-w-35">
                                            <div className="bg-white p-1.5 rounded-lg border border-gray-200">
                                                <Ruler className="w-3.5 h-3.5 text-slate-600" />
                                            </div>
                                            <span className="text-sm font-Jost-Semibold text-gray-800">{room.spaceType}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                            <span>L: <strong className="text-gray-800">{room.length} {room.unit}</strong></span>
                                            <span>W: <strong className="text-gray-800">{room.width} {room.unit}</strong></span>
                                            {room.ceilingHeight && (
                                                <span>H: <strong className="text-gray-800">{room.ceilingHeight} {room.unit}</strong></span>
                                            )}
                                        </div>
                                    </div>

                                    {room.notes && (
                                        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="16" y1="13" x2="8" y2="13" />
                                                <line x1="16" y1="17" x2="8" y2="17" />
                                            </svg>
                                            <p className="text-sm text-amber-800 leading-relaxed">{room.notes}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {modalType && (
                        <ApplyForJob onClose={() => setModalType(false)} jobId={job.id} />
                    )}
                    <button
                        onClick={() => setModalType(true)}
                        className="auth-button w-full"
                    >
                        Apply for job
                    </button>

                </div>


                <div className="space-y-5">

                    {/* Customer Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-gray-400 mb-4">Posted By</h2>
                        <div className="flex flex-col items-center text-center gap-3">

                            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                <User className="w-7 h-7 text-gray-400" />
                            </div>

                            <div>
                                <p className="font-Jost-Semibold text-gray-800">{job.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Member since {job.userCreatedAt}</p>
                            </div>
                            <div className="w-full h-px bg-gray-100" />
                            <div className="flex justify-around w-full">
                                <div className="text-center">
                              
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Summary */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
                        <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-gray-400 mb-4">Quick Summary</h2>
                        <ul className="space-y-3 text-sm">
                            {[
                                { label: "Property", value: job.propertyType },
                                { label: "Timeline", value: job.timeline },
                                { label: "Budget", value: `₹${Number(job.budget).toLocaleString("en-IN")}` },
                                { label: "Rooms", value: `${job.rooms.length} room${job.rooms.length > 1 ? "s" : ""}` },
                                { label: "Location", value: `${job.city}, ${job.state}` },
                            ].map(({ label, value }) => (
                                <li key={label} className="flex items-center justify-between gap-2">
                                    <span className="text-gray-400 text-xs">{label}</span>
                                    <span className="font-Jost-Semibold text-gray-700 text-xs text-right">{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}