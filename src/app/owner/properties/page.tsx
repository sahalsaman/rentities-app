"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PropertyCard from "../../../components/PropertyCard";
import PropertyFormModal from "../../../components/PropertyFormModal";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [organisation, setOrganisation] = useState<any | null>(null);
  const current_property = localStorageServiceSelectedOptions.getItem()?.property

  const fetchProperties = async () => {
    const res = await apiFetch("/api/property");
    const data = await res.json();
    setProperties(data);
  };

  const fetchOrganisation = async () => {
    const res = await apiFetch("/api/organisation");
    const data = await res.json();
    setOrganisation(data);
  };

  useEffect(() => {
    fetchProperties();
    fetchOrganisation()
  }, []);

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Properties" },
  ];
  return (
    <div className="p-4 pt-5 md:px-12 lg:px-20 mb-10">
      <div className="mb-6 flex items-end justify-between gap-3"><div><p className="text-sm font-medium text-green-700">Your portfolio</p><h1 className="text-2xl font-bold">Properties</h1><p className="mt-1 text-sm text-slate-500">Manage spaces your tenants call home.</p></div>
        {organisation?.subscription && <Button onClick={() => { setAddEditOpen(true); setSelectedProperty(null); }} variant="green">
          <span className="hidden sm:inline">Add Property</span><span className="sm:hidden">+ Add</span>
        </Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.length ? properties?.map((property: any) => (
          <PropertyCard
            key={property?._id}
            property={property}
            currentProperty={current_property}
            onEdit={(p: any) => { setSelectedProperty(p); setAddEditOpen(true); }}
            onDelete={(p: any) => { setSelectedProperty(p); setDeleteOpen(true); }}

          />
        )) : (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><p className="font-semibold text-slate-800">No properties yet</p><p className="mt-1 text-sm text-slate-500">Add your first property to start managing units and bookings.</p></div>
        )}
      </div>

      <PropertyFormModal
        open={addEditOpen}
        onClose={() => {
          setAddEditOpen(false);
        }}
        onSave={() => {
          setAddEditOpen(false);
          window.location.reload();
          // fetchProperties();
        }}
        initialData={selectedProperty}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={fetchProperties}
        item={selectedProperty}
      />
    </div>
  );
}
