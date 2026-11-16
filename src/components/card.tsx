"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRightIcon, LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  onClick?: () => void;
  color?: string;
}

export default function DashboardCard({ title, value, icon: Icon, onClick,color }: DashboardCardProps) {

  return (
    <Card
      className="rounded-2xl border-slate-200 transition cursor-pointer p-3 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className=" max-sm:p-0">
        <div className="flex items-center justify-between md:mb-4 mb-1">
          {Icon && <Icon className="h-9 w-9 rounded-xl bg-blue-700 p-2 text-white" />}
          <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{value}</p>
        </div>
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
      </CardContent>
    </Card>
  );
}
