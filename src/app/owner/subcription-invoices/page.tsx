"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import SubscriptionPaymentCard from "@/components/SubscriptionPaymentCard";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SubscriptionPayments() {
  const [subscriptionPayments, setSubscriptionPayments] = useState([]);
  const [loader, setLoader] = useState(false);

  const property = localStorageServiceSelectedOptions.getItem()?.property;

  // Month-Year filters
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchSubscriptionPayments = async ( year: number) => {
    setLoader(true);
    apiFetch(
      `/api/subscription/payments?propertyId=${property?._id}&year=${year}`
    )
      .then((res) => res.json())
      .then((data) => {
        setSubscriptionPayments(data?.data || []);
      })
      .catch((err) => console.error("Fetch Error:", err))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    if (property?._id) {
      fetchSubscriptionPayments( selectedYear);
    }
  }, [property?._id, selectedYear]);

  if (loader) return <FullscreenLoader />;

  return (
    <div className="p-4 pt-5 md:px-12 lg:px-20 mb-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Subscription Invoices</h1>

      <div className="flex items-center gap-3">
        <label htmlFor="subscription-year" className="text-sm font-medium text-slate-500">Year</label>
        <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
          <SelectTrigger className="h-11 w-32 rounded-xl border-slate-200 bg-white text-sm font-medium shadow-sm"><SelectValue /></SelectTrigger>
          <SelectContent>{Array.from({ length: 5 }).map((_, i) => { const year = new Date().getFullYear() - i; return <SelectItem key={year} value={String(year)}>{year}</SelectItem>; })}</SelectContent>
        </Select>
      </div>
      </div>

      {/* Listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subscriptionPayments.length > 0 ? (
          subscriptionPayments.map((payment: any) => (
            <SubscriptionPaymentCard key={payment._id} invoice={payment} />
          ))
        ) : (
          <p className="text-gray-600">No subscription payments found.</p>
        )}
      </div>
    </div>
  );
}
