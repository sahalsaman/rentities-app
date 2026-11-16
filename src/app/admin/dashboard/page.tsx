"use client";

import { Building2, Users, ReceiptText, Building } from "lucide-react";
import { useState, useEffect } from "react";
import DashboardCard from "../../../components/card";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { DashboardSkeleton } from "@/components/Loader";


export default function OwnerDashboard() {
  const router = useRouter();
  const [loader, setLoader] = useState(true);

  const [status, setStatus] = useState({
    businessCount: 0,
    vendorCount: 0,
    userCount: 0,
    propertyCount: 0,
    bookingCount: 0,
    subcriptionPaymentLastMonth: 0
  });


  // Fetch status from backend API
  const fetchDashboardData = async (id?: any) => {
    const start = Date.now();
    setLoader(true);
    try {
      const res = await apiFetch(`/api/admin/dashboard`); // replace with your API route
      console.log(res);

      if (!res.ok) throw new Error("Failed to fetch dashboard status");
      const data = await res.json();
      setStatus({
        businessCount: data.businessCount,
        vendorCount: data.vendorCount,
        userCount: data.userCount,
        propertyCount: data.propertyCount,
        bookingCount: data.bookingCount,
        subcriptionPaymentLastMonth: data.subcriptionPaymentLastMonth.total || 0
      });
      setLoader(false);
      console.log("Execution time:", Date.now() - start, "ms");
    } catch (err) {
      console.error(err);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);


  if (loader) return <DashboardSkeleton />;

  const mix = [
    { label: "Businesss", value: status.businessCount, color: "bg-sky-500" },
    { label: "Properties", value: status.propertyCount, color: "bg-cyan-500" },
    { label: "Bookings", value: status.bookingCount, color: "bg-violet-500" },
  ];
  const maximum = Math.max(...mix.map((item) => item.value), 1);

  return (
    <main className="admin-page text-gray-800 mb-10">
      <div className="mb-7"><h1 className="text-3xl font-bold text-slate-900">Platform overview</h1><p className="mt-1 text-sm text-slate-500">Your platform performance at a glance.</p></div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <DashboardCard title="Businesss" value={status?.businessCount} icon={Building} color={"slate-900"}/>
        <DashboardCard title="Properties" value={status?.propertyCount} icon={Building2} color={"slate-900"}/>
        <DashboardCard title="Users" value={status?.userCount} icon={Users} color={"slate-900"}/>
        <DashboardCard title="Bookings" value={status?.bookingCount} icon={ReceiptText} color={"slate-900"}/>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="font-bold text-slate-900">Platform mix</h2><p className="mt-1 text-sm text-slate-500">Relative volume across your platform.</p></div></div><div className="mt-8 space-y-6">{mix.map((item) => <div key={item.label}><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-slate-700">{item.label}</span><span className="font-semibold text-slate-900">{item.value}</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / maximum) * 100}%` }} /></div></div>)}</div></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">Activity snapshot</h2><p className="mt-1 text-sm text-slate-500">A quick view of key platform totals.</p><div className="mt-8 flex h-44 items-end justify-around gap-5 border-b border-slate-200 px-4">{mix.map((item) => <div key={item.label} className="flex h-full flex-1 flex-col justify-end"><div className={`mx-auto w-full max-w-14 rounded-t-xl ${item.color}`} style={{ height: `${Math.max((item.value / maximum) * 100, item.value ? 8 : 2)}%` }} /><p className="mt-3 text-center text-xs font-medium text-slate-500">{item.label}</p></div>)}</div></section></div>

    </main>
  );
}
