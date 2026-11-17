"use client";

import { IProperty, IUnit } from "@/app/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { statusColorMap } from "@/utils/contants";

interface UnitCardProps {
  unit: IUnit;
  property: IProperty;
  onEdit: (unit: IUnit) => void;
  onDelete: (id: string) => void;
  onBook: (unit: IUnit) => void;
}

export default function UnitCard({ unit, property, onEdit, onDelete, onBook }: UnitCardProps) {
  const router = useRouter();
  return (
    <Card className={`cursor-pointer border-2 py-2 shadow-sm transition-colors ${unit.status === "Booked" ? "border-emerald-200 bg-emerald-100" : unit.status === "Maintenance" ? "border-amber-200 bg-amber-100" : "border-slate-200 bg-slate-50"}`} onClick={() => router.push(`/owner/units/${unit._id}`)}>

      <CardContent className="px-2 sm:px-3">

        <div className="flex justify-center my-6">
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${statusColorMap[unit.status] || "bg-gray-100 text-gray-800"
              }`}
          >
            {unit.status}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="mt-1 truncate text-base font-bold sm:text-base">{unit.name}</h2>
          <p className="text-xs font-bold sm:text-base">
            {property?.currency}{unit.amount?.toLocaleString()}
          </p>
        </div>

        {/* {unit.type && <p className="hidden text-sm text-gray-500 sm:block">Type: {unit.type}</p>} */}


        <div className="flex justify-between items-center gap-2">

          {unit.noOfSlots > 1 ? <p className="text-[10px] text-gray-500 sm:text-sm">{(unit?.currentBooking ?? 0)}/{unit.noOfSlots}</p> : <p></p>}
          <span className='hover:text-gray-700 transition  cursor-pointer '
            onClick={() => router.push(`/owner/properties/${property._id}/${unit._id}`)}
          >
            <ArrowRight size={18} />
          </span>

        </div>

      </CardContent>
    </Card>
  );
}
