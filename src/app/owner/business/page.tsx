"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { PageSkeleton } from "@/components/Loader";
import { ArrowRight, BadgeIndianRupee, Building, ChevronRight, CircleDollarSign, Crown, Edit, Globe, Landmark, MapPin, Receipt, Users } from "lucide-react";
import { UserRoles } from "@/utils/contants";
import { IUser } from "@/app/types";
import { useRouter } from "next/navigation";
import EditBusinessDialog from "@/components/BusinessEditDialog";
import toast from "react-hot-toast";

export default function PropertiesPage() {
  const [business, setBusiness] = useState<any | null>(null);
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();


  const fetchUser = async () => {
    const res = await apiFetch("/api/me");
    const data = await res.json();
    setUser(data);
  };

  useEffect(() => {
    fetchUser();
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    const res = await apiFetch("/api/business");
    const data = await res.json();
    setBusiness(data);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Business" },
  ];
  if (!business) return <PageSkeleton rows={5} />;

  const ownerOptions = [
    {
      title: "Properties",
      path: "/owner/properties",
      icon: <Building className="w-6 h-6 md:w-8 md:h-8 min-w-6 min-h-6" />,
    },  {
      title: "Managers",
      path: "/owner/properties",
      icon: <Users className="w-6 h-6 md:w-8 md:h-8 min-w-6 min-h-6" />,
    },
    {
      title: "Bank & UPI Details",
      path: "/owner/bank-upi-list",
      icon: <Landmark className="w-6 h-6 md:w-8 md:h-8 min-w-6 min-h-6" />,
    },
    {
      title: "Subscription Plan",
      path: "/owner/subscription-plan",
      icon: <Crown className="w-6 h-6 md:w-8 md:h-8 min-w-6 min-h-6" />,
    },
    {
      title: "Subscription Payments",
      path: "/owner/subcription-payments",
      icon: <BadgeIndianRupee className="w-6 h-6 md:w-8 md:h-8 min-w-6 min-h-6" />,
    },
  ];


  return (
    <div className="mx-auto w-full max-w-3xl px-3 py-3 sm:px-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <div className="w-full flex justify-between ">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-blue-700">
              {business?.name?.charAt(0).toUpperCase()}
            </div>
            <div >
              <h1 className="text-2xl md:text-3xl font-bold">{business?.name}</h1>
              <p className="text-sm">Business</p>
            </div>
          </div>
          <Button size="icon" variant="outline" onClick={() => { setOrgModalOpen(true) }} >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-1">
          {business?.address ? <p className="flex gap-1 items-center"><MapPin size={14} />{business?.address}</p> : ""}
          {business?.website ? <p className="flex gap-1 items-center"><Globe size={14} />{business?.website}</p> : ""}
        </div>
      </div>
      <div className="mt-4 mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


        <div className="flex flex-col text-md">
          {user?.role === UserRoles.OWNER &&
            ownerOptions.map((item, idx) => (
              <a
                key={idx}
                className="p-4 border-b border-b-gray-200 cursor-pointer flex items-center gap-3"
                onClick={() => router.push(item.path)}
              >
                {item.icon && item.icon}
                {item.title}
              </a>
            ))
          }
        </div>

      </div>
      <EditBusinessDialog
        open={orgModalOpen}
        onClose={() => setOrgModalOpen(false)}
        business={business}
        onUpdated={() => {
          fetchBusiness()
          toast.success("Updated successfully!")
        }}
      />

    </div>
  );
}
