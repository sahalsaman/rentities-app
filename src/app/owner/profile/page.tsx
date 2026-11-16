"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { PageSkeleton } from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { UserRoles } from "@/utils/contants";
import { IUser } from "@/app/types";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit } from "lucide-react";

export default function PropertiesPage() {
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    const res = await apiFetch("/api/me");
    const data = await res.json();
    setUser(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Profile" },
  ];
  if (!user) return <PageSkeleton rows={4} />;

  return (
    <div className="mx-auto w-full max-w-3xl px-3 py-3 sm:px-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <div className="w-full flex justify-between ">
          <div className="w-full flex flex-col md:flex-row md:gap-4 gap-2">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
              {user?.firstName?.slice(0, 2).toUpperCase()}
            </div>
            <div >
              <h1 className="text-2xl md:text-3xl font-bold">{user?.firstName} {user?.lastName}</h1>
              <p>{user?.countryCode} {user?.phone}</p>
              <Badge variant="default">{user?.role}</Badge>
            </div>
          </div>

          <Button size="icon" variant="outline" onClick={() => router.push('/owner/profile/edit')} >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white text-sm shadow-sm">
        <a className="p-4 border-b-1 border-b-gray-200 flex justify-between items-center" href='/privacy'
          target="_blank">
          Privacy and policy <ChevronRight/>
        </a>
        <a className="p-4 border-b-1 border-b-gray-200 flex justify-between items-center" href='/terms'
          target="_blank">
          Terms & Conditions <ChevronRight/>
        </a>
        <a className="p-4 border-b-1 border-b-gray-200 flex justify-between items-center" href='/#faq'
          target="_blank">
          FAQ <ChevronRight/>
        </a>
        <a className="p-4 border-b-1 border-b-gray-200 flex justify-between items-center" href='/#contact'
          target="_blank">
          Help & Support <ChevronRight/>
        </a>
        <button onClick={() => { logout(); }}
          className="p-4 border-b-1 border-b-gray-200 text-red-600 cursor-pointer">
          Logout
        </button>
      </div>
    </div>
  );
}
