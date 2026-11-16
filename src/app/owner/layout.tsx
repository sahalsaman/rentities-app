'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { User, Home, Building2, Store, Building, Lamp, Bell, Users, ReceiptText, BriefcaseBusiness, BedIcon } from 'lucide-react';
import localStorageServiceSelectedOptions from '@/utils/localStorageHandler';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { IProperty } from '../types';
import { PropertyStatus, SubscritptionStatus, UserRoles } from '@/utils/contants';
import SubscriptionPlan from './subscription-plan/page';
import { Button } from '@/components/ui/button';
import { app_config } from '../../../app-config';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const prop = localStorageServiceSelectedOptions.getItem()?.property;
  const router = useRouter();
  const pathname = usePathname();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [organisation, setOrganisation] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { title: 'Home', path: '/owner/dashboard' },
    { title: 'Invoices', path: '/owner/invoices' },
    { title: 'Units', path: '/owner/units' },
    { title: 'Tenants', path: '/owner/tenants' },
    { title: 'Business', path: '/owner/business' },
  ]

  const mobileMenu = [
    { title: 'Home', path: '/owner/dashboard', icon: <Home size={21} /> },
    { title: 'Invoices', path: '/owner/invoices', icon: <ReceiptText size={21} /> },
    { title: 'Units', path: '/owner/units', icon: <BedIcon size={21} /> },
    { title: 'Tenants', path: '/owner/tenants', icon: <Users size={21} /> },
    { title: 'Business', path: '/owner/business', icon: <BriefcaseBusiness size={21} /> },
  ];

  const fetchUser = async () => {
    try {
      const res = await apiFetch("/api/me");
      const data = await res.json();
      setUser(data)
      if (data.role !== UserRoles.OWNER && data.role !== UserRoles.MANAGER && data.role !== UserRoles.ADMIN) {
        router.push('/');
      }
    }
    catch (err) {
      console.log(err);
    }
  };


  const fetchProperties = async () => {
    const res = await apiFetch("/api/property?status=" + PropertyStatus.ACTIVE);
    const data = await res.json();
    setProperties(data);
    if (data.length > 0) {
      if (prop && prop?._id) {
        setSelectedPropertyId(prop?._id);
        return;
      } else {
        localStorageServiceSelectedOptions.setItem({ property: data[0] });
        setSelectedPropertyId(data[0]._id);
      }
    };
  }

  const fetchOrganisation = async () => {
    const res = await apiFetch("/api/organisation");
    const data = await res.json();
    setOrganisation(data);
  };


  useEffect(() => {
    fetchUser()
    fetchOrganisation();
    fetchProperties();
  }, []);



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setSelectedPropertyId(value);
    const prop = properties.find(p => p._id === value)
    localStorageServiceSelectedOptions.setItem({ property: prop });
    window.location.reload();
  };



  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="w-full border-b border-slate-200 bg-white px-4 py-3 shadow-sm md:px-12 lg:px-20">
        <div className="w-full flex justify-between items-center">
          {/* Desktop Nav */}
          <div className="mr-5 block lg:hidden">
            <div className="flex items-center gap-2">
              {/* <ArrowLeft className={` text-white cursor-pointer   ${pathname === "/owner/dashboard" ? "hidden" : "block"}`} onClick={() => router.back()} /> */}
              <Image src={app_config.APP_LOGO} alt="Logo" width={32} className='cursor-pointer'
                onClick={() => router.push('/owner/dashboard')} />
              <span className="text-lg font-bold tracking-tight text-slate-900">Rentities</span>
            </div>

          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-4">
              <Image src={app_config.APP_LOGO} alt="Logo" width={30} className='cursor-pointer' />
              <h1
                onClick={() => router.push('/owner/dashboard')}
                className="text-2xl font-bold text-slate-900 mr-5 cursor-pointer"
              >
                Rentities
              </h1></div>
            {options.map((card, idx) => (
              <div
                key={idx}
                onClick={() => router.push(card.path)}
                className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition
                  ${pathname === card.path ? "bg-emerald-50 text-green-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
              >
                <span>{card.title}</span>
              </div>
            ))}
          </div>
          {/* Profile Dropdown */}
          <div className="flex items-center gap-2 md:gap-5">

            {user?.role == UserRoles.OWNER ?
              <div className='hidden md:block'>
                {properties?.length ? <div >
                  {/* <p className='text-white'>Current Property</p> */}
                  <div className='w-full rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between pr-2'>
                    <Building className='ml-4 text-slate-500' />
                    <select
                      name="frequency"
                      value={selectedPropertyId || ""}
                      onChange={handleChange}
                      className="bg-transparent text-slate-700 focus:outline-none border-0 outline-0 pr-2"
                      style={{ minWidth: "220px", border: "0px", height: "48px" }}
                      required
                    >
                      <option value=""> Select Property</option>
                      {properties.map((property: any) => (
                        <option key={property?._id} value={property?._id}>
                          {property?.name} - {property?.category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div> :
                  organisation?.subscription ?
                    <Button className=" w-full text-white bg-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/owner/properties')}>
                      Add Property
                    </Button> :
                    <Button className=" w-full text-white bg-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/owner/subscription-plan')}>
                      Start Free Trial
                    </Button>
                }
              </div> : ""}
            <button aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><Bell size={20} /></button><div className="relative" ref={dropdownRef}>
              <button
                onClick={() => router.push('/owner/profile')}
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-900 text-white cursor-pointer transition hover:bg-green-700"
              >
                <User size={20} />
              </button>
            </div>
          </div>
        </div>

        {user?.role == UserRoles.OWNER ? <div className='block md:hidden mt-3'>
          {properties?.length ?
            <div className='w-full rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between pr-2'>
              <Building className='ml-3 text-slate-500' />
              <select
                name="frequency"
                value={selectedPropertyId || ""}
                onChange={handleChange}
                className="bg-transparent text-slate-700 focus:outline-none border-0 outline-0 pr-2"
                style={{ minWidth: "220px", border: "0px", height: "48px" }}
                required
              >
                <option value=""> Select Property</option>
                {properties.map((property: any) => (
                  <option key={property?._id} value={property?._id}>
                    {property?.name} - {property?.category}
                  </option>
                ))}
              </select>
            </div>
            :
            organisation?.subscription ?
              <Button className=" w-full bg-green-700 text-white font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/owner/properties')}>
                Add Property
              </Button> :
              <Button className=" w-full bg-white text-green-700 font-semibold text-md rounded-xl px-8 py-6 hover:bg-green-100 transition" onClick={() => router.push('/owner/subscription-plan')}>
                Start Free Trial
              </Button>
          }
        </div> : ""}
      </header>
      {organisation?.subscription?.status && organisation?.subscription?.status !== SubscritptionStatus.ACTIVE ? <div className="bg-amber-100 py-2.5 px-5 text-center text-sm font-medium text-amber-900 md:px-20">
        {organisation?.subscription?.status === SubscritptionStatus.FREE ? 'Your subscription is free' : organisation?.subscription?.status === SubscritptionStatus.EXPIRED ? 'Your subscription has expired. Please renew to continue using our services.' : organisation?.subscription?.status === SubscritptionStatus.CANCELLED ? 'Your subscription has been cancelled. Please contact support for more information.' : ''}
      </div> : ""}

      {organisation?.subscription?.status === SubscritptionStatus.EXPIRED ? <SubscriptionPlan /> : <main className="owner-surface">{children}</main>}

      {/* Mobile Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-evenly border-t border-slate-200 bg-white/95 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        {mobileMenu.map((item, idx) => (
          <button
            key={idx}
            onClick={() => router.push(item.path)}
            className={`flex min-w-0 flex-1 flex-col gap-1 items-center rounded-xl py-1.5 text-[10px] font-medium ${pathname === item.path ? "bg-emerald-50 text-green-700" : "text-slate-500"
              }`}
          >
            {item.icon}
            <span>{item.title}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
