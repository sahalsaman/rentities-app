"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IUnit } from "@/app/types";
import { apiFetch } from "@/lib/api";
import UnitCard from "@/components/UnitCard";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import UnitAddEditModal from "@/components/UnitFormModal";
import { PageSkeleton } from "@/components/Loader";
import { ChevronDown, Plus } from "lucide-react";

export default function UnitListPage() {
  const [property, setProperty] = useState<any>(null);
  const [units, setUnits] = useState<IUnit[]>([]);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [editUnitData, setEditUnitData] = useState<IUnit | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<IUnit | null>(null);
  const [openFloors, setOpenFloors] = useState<Record<string, boolean>>({});


  useEffect(() => {
    const syncProperty = () => setProperty(localStorageServiceSelectedOptions.getItem()?.property || null);
    syncProperty();
    const timer = window.setInterval(syncProperty, 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (property?._id) fetchUnits();
  }, [property?._id]);


  const fetchUnits = () => {
    if (!property?._id) return;
    apiFetch(`/api/unit?propertyId=${property?._id}`)
      .then(async (res) => {
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      })
      .then(setUnits)
      .catch(() => setUnits([]));
  };

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: property?.name || "Property" },
  ];

  return (
    <div className="">
      {/* Property Header */}
      {/* <div className="flex flex-col justify-between items-start  gap-3 bg-slate-100 md:p-14 md:px-32 p-5 shadow-sm">


        <Breadcrumbs items={breadcrumbItems} />
        <div className="w-full flex justify-between ">
          <div className="flex items-center gap-4">

            <div className="w-14 h-14 bg-blue-200 rounded-md flex items-center justify-center text-gray-500 text-2xl">
              {property?.name?.charAt(0).toUpperCase()}
            </div>


            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{property?.name}</h1>
              <p className="text-sm text-gray-600">
                {property?.address}, {property?.city}, {property?.state} {property?.zipCode}, {property?.country}
              </p>
              <Badge variant="default">{property?.category}</Badge>
         
            </div>
          </div>
          <div className="flex gap-2"> 
         
            <Button onClick={() => setShowUnitModal(true)} className="whitespace-nowrap hidden sm:block">
              Add Unit
            </Button></div>
        </div>
      </div> */}
      <div className="p-4 pt-5 md:px-12 lg:px-20 mb-10">
        <div className="mb-5 flex items-end justify-between gap-3"><div>
          <p className="text-sm font-semibold text-blue-700">{property?.name || "Selected property"}</p>
          <h1 className="text-2xl font-bold">Units</h1><p className="mt-1 text-sm text-slate-500">Add and organise rentable spaces.</p></div>
          <Button onClick={() => setShowUnitModal(true)} variant="blue" className="whitespace-nowrap ">
            + Add Unit
          </Button>
        </div>
        {/* Units Grid */}
        {units.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><p className="font-semibold text-slate-800">No units or rooms yet</p><p className="mt-1 text-sm text-slate-500">Add a unit or room to start accepting bookings.</p></div>
        ) : (
          <div className="space-y-3">
            {Object.entries(units.reduce<Record<string, IUnit[]>>((groups, unit) => {
              const floor = unit.floor || "Ground";
              (groups[floor] ||= []).push(unit);
              return groups;
            }, {})).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([floor, floorUnits]) => {
              const isOpen = openFloors[floor] ?? true;
              return <section key={floor} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left" onClick={() => setOpenFloors(prev => ({ ...prev, [floor]: !isOpen }))}>
                  <span className="font-semibold text-slate-800">{floor === "Ground" ? "Ground floor" : `Floor ${floor}`}</span>
                  <span className="flex items-center gap-2 text-xs text-slate-500">{floorUnits.length} units <ChevronDown size={18} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} /></span>
                </button>
                {isOpen && <div className="grid grid-cols-3 gap-2 border-t border-slate-100 p-2 sm:grid-cols-2 md:grid-cols-8 md:gap-4 md:p-4">
                  {floorUnits.map(unit => <UnitCard key={unit._id} unit={unit} property={property} onEdit={(item) => { setEditUnitData(item); setShowUnitModal(true); }} onDelete={() => fetchUnits()} onBook={(item) => { setSelectedUnit(item); setShowBookingModal(true); }} />)}
                  <button type="button" onClick={() => setShowUnitModal(true)} className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs font-semibold text-slate-500 "  style={{minHeight:"100px"}}><Plus size={18} />Add unit</button>
                </div>}
              </section>;
            })}
          </div>)}
      </div>
      <UnitAddEditModal
        property={property}
        open={showUnitModal}
        onClose={() => {
          setShowUnitModal(false);
        }}
        onSave={() => {
          setShowUnitModal(false);
          fetchUnits();
        }}
      />

    </div>
  );
}
