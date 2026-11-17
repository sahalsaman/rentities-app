"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IProperty, IUnit } from "@/app/types";
import { useState, useEffect } from "react";
import { FLAT_TYPES, RentFrequency, UnitStatus } from "@/utils/contants";
import { Label } from "@radix-ui/react-label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  property: IProperty | null;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editData?: IUnit | null;
}


export default function UnitAddEditModal({ property, open, onClose, onSave, editData }: Props) {
  const [formData, setFormData] = useState<Partial<IUnit>>({});
  const [isMultipleUnit, setIsMultipleUnit] = useState(false);
  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setIsMultipleUnit(false);
    } else {
      setFormData({
        frequency: RentFrequency.MONTH,
        status: UnitStatus.AVAILABLE,
      });
    }
  }, [editData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === "amount" ||
          name === "advanceAmount" ||
          name === "noOfSlots" ||
          name === "numberOfUnits"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveUnit(formData);
  };

  const handleSaveUnit = async (data: Partial<IUnit>) => {
    const method = editData ? "PUT" : "POST";
    const url = editData ? `/api/unit?id=${editData._id}` : `/api/unit`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...data, propertyId: property?._id, isMultipleUnit }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.error || "Failed to save unit");
        return;
      }

      toast.success(editData ? "Unit updated successfully" : "Unit added successfully");
      onSave();
    } catch (err) {
      console.error("Error saving unit:", err);
      toast.error("An error occurred. Please try again.");
    }
  };


  const isHostelOrPG = property?.category?.toLowerCase().includes("hostel") || property?.category?.toLowerCase().includes("pg") || property?.category?.toLowerCase().includes("Co-Working");
  const isFlatOrApartment = property?.category?.toLowerCase().includes("flat") || property?.category?.toLowerCase().includes("apartment") || property?.category?.toLowerCase().includes("house");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-1rem)] overflow-y-auto rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Unit" : "Add Unit"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">

          <Label>Floor*</Label>
          <Select value={formData.floor || "Ground"} onValueChange={(value) => setFormData((prev) => ({ ...prev, floor: value }))}><SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger><SelectContent><SelectItem value="Ground">Ground floor</SelectItem>{Array.from({ length: 20 }, (_, index) => <SelectItem key={index + 1} value={String(index + 1)}>Floor {index + 1}</SelectItem>)}</SelectContent>
          </Select>

          <Label>Number of Units*</Label>
          <Input
            name="numberOfUnits"
            type="number"
            placeholder="eg: 5 (creates units 1, 2, 3...)"
            value={formData.numberOfUnits || ""}
            onChange={handleChange}
            required
          />
                {isHostelOrPG && (
            <>
              <Label>Number of Slots</Label>
              <Input
                name="noOfSlots"
                type="number"
                placeholder="eg: 3"
                value={formData.noOfSlots || ""}
                onChange={handleChange}
                required={isHostelOrPG ? true : false}
              />
            </>
          )}
          <Label>Description</Label>
          <Textarea
            name="description"
            placeholder="Enter your amenities and services"
            value={formData.description || ""}
            onChange={handleChange}
          />

          <Label>Rent Amount*</Label>
          <div className="flex items-center gap-1">
            {property?.currency}
            <Input
              name="amount"
              type="number"
              placeholder="eg: 12000"
              value={formData.amount || ""}
              onChange={handleChange}
              required
            />
          </div>
          <Label>Select Rent Duration*</Label>
          <Select value={formData.frequency || undefined} onValueChange={(value) => setFormData((prev) => ({ ...prev, frequency: value as RentFrequency }))}><SelectTrigger><SelectValue placeholder="Select Rent Duration" /></SelectTrigger><SelectContent>{Object.values(RentFrequency).map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select>


          {isFlatOrApartment && (
            <>   <Label>Select Unit Type*</Label>
              <Select value={formData.type || undefined} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}><SelectTrigger><SelectValue placeholder="Select Unit Type" /></SelectTrigger><SelectContent>{FLAT_TYPES.map((flat) => <SelectItem key={flat} value={flat}>{flat}</SelectItem>)}</SelectContent></Select></>
          )}

    

          <Label>Advance Amount</Label>
          <div className="flex items-center gap-1">
            {property?.currency}
            <Input
              name="advanceAmount"
              type="number"
              placeholder="eg: 12000"
              value={formData.advanceAmount || ""}
              onChange={handleChange}
            /></div>

          <Label>Status*</Label>
          <Select value={formData.status || undefined} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as UnitStatus }))}><SelectTrigger><SelectValue placeholder="Select unit status" /></SelectTrigger><SelectContent>{Object.values(UnitStatus).map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select>
          <div className="w-full grid grid-cols-2 gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className='w-full' variant="blue">
              {editData ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
