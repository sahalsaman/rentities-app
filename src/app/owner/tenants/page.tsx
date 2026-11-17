"use client";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { PageSkeleton } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import BookingFormModal from "@/components/BookingFormModal";

const tabs = ["Active", "Alumni", "Enquired"];
export default function TenantsPage() {
  const property = localStorageServiceSelectedOptions.getItem()?.property;
  const [bookings, setBookings] = useState<any[]>([]); const [tab, setTab] = useState("Active"); const [loading, setLoading] = useState(true);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  useEffect(() => { apiFetch(`/api/list?page=booking&propertyId=${property?._id}`).then((res) => res.json()).then((data) => setBookings(Array.isArray(data) ? data : [])).finally(() => setLoading(false)); }, [property?._id]);
  const tenants = useMemo(() => bookings.filter((booking) => tab === "Active" ? booking.status !== "Checked-Out" : tab === "Alumni" ? booking.status === "Checked-Out" : false), [bookings, tab]);
  if (loading) return <PageSkeleton rows={5} />;
  return <><div className="mx-auto max-w-7xl p-4 pt-5 md:px-12 lg:px-20"><div className="flex justify-between gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-blue-700">{property?.name || "Selected property"}</p><h1 className="text-2xl font-bold text-slate-900">Tenants</h1></div><Button variant="blue" onClick={() => setEnquiryOpen(true)}><UserPlus size={17} /> Add enquiry</Button></div><div className="mt-6 flex gap-2 overflow-x-auto pb-1">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === item ? "bg-blue-700 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>{item}</button>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{tab === "Enquired" || tenants.length === 0 ? <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Users className="mx-auto text-slate-400" /><p className="mt-3 font-semibold text-slate-800">No {tab.toLowerCase()} tenants</p><p className="mt-1 text-sm text-slate-500">New booking enquiries will appear here.</p></div> : tenants.map((booking) => <div key={booking._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="font-bold text-slate-900">{booking.userId?.firstName} {booking.userId?.lastName}</p><p className="mt-1 text-sm text-slate-500">{booking.userId?.countryCode} {booking.userId?.phone}</p><div className="mt-4 flex justify-between text-sm"><span>{booking.code}</span><span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-semibold text-blue-700">{booking.status}</span></div></div>)}</div></div><BookingFormModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} onSave={() => { setEnquiryOpen(false); }} property_data={property} /></>;
}
