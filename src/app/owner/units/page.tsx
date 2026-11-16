"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IUnit } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import UnitCard from "@/components/UnitCard";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";
import UnitAddEditModal from "@/components/UnitFormModal";
import { FullscreenLoader, } from "@/components/Loader";

export default function UnitListPage() {
  const property = localStorageServiceSelectedOptions.getItem()?.property
  const [units, setUnits] = useState<IUnit[]>([]);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [editUnitData, setEditUnitData] = useState<IUnit | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<IUnit | null>(null);


  useEffect(() => {
    fetchUnits();
  }, []);


  const fetchUnits = () => {
    apiFetch(`/api/unit?propertyId=${property?._id}`)
      .then(res => res.json())
      .then(setUnits);
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
        <div className="mb-5 flex items-end justify-between gap-3"><div><h1 className="text-2xl font-bold">Units</h1><p className="mt-1 text-sm text-slate-500">Add and organise rentable spaces.</p></div>
          <Button onClick={() => setShowUnitModal(true)} variant="green" className="whitespace-nowrap ">
            + Add Unit
          </Button>
        </div>
        {/* Units Grid */}
        {units.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><p className="font-semibold text-slate-800">No units or rooms yet</p><p className="mt-1 text-sm text-slate-500">Add a unit or room to start accepting bookings.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {units.map(unit => (
              <UnitCard
                key={unit._id}
                unit={unit}
                property={property}
                onEdit={(unit) => {
                  setEditUnitData(unit);
                  setShowUnitModal(true);
                }}
                onDelete={(id) => {
                  setDeleteId(id);
                  setShowDelete(true);
                }}
                onBook={(unit) => {
                  setSelectedUnit(unit);
                  setShowBookingModal(true);
                }}
              />
            ))}
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
