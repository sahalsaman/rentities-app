"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { PageSkeleton } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import LeadForm from "./LeadForm";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const size = 10;

  const fetchLeads = async () => {
    try { const res = await apiFetch("/api/admin/lead"); const data = await res.json(); setLeads(Array.isArray(data) ? data : []); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filtered = leads.filter((l) =>
    l?.name?.toLowerCase().includes(search?.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / size);
  const paginated = filtered.slice((page - 1) * size, page * size);

  if (loading) return <PageSkeleton rows={6} />;
  return (
    <div className="admin-page mb-10">
      <div className="mb-6 flex items-end justify-between"><div><p className="text-sm font-medium text-green-700">Pipeline</p><h1 className="text-2xl font-bold text-slate-900">Leads</h1><p className="mt-1 text-sm text-slate-500">Capture, qualify, and keep prospect conversations moving.</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-green-700">{leads.length} total</span>
      </div>

   <div className="flex justify-between mb-4">
       {/* Search */}
      <input
        className="border px-3 py-2 rounded mb-4 w-full md:w-1/3"
        placeholder="Search leads..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />
         <Button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
        >
          + Add Lead
        </Button>
   </div>

      {/* Table */}
      <div className="admin-table-shell">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Lead From</th>
              <th className="px-4 py-3">Assign</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((l) => (
              <tr key={l._id} className="border-b hover:bg-gray-50">
                     <td className="px-4 py-3">
                    <p> {l?.name || "—"}</p>
                    <p className="text-xs"> {l?.countryCode || "—"}
                      {" " + l?.phone || "—"}</p>
                  </td>
                <td className="px-4 py-3">{l.lead_from || "—"}</td>
                <td className="px-4 py-3">{l.assign || "—"}</td>
                <td className="px-4 py-3">{l.status || "—"}</td>
                <td className="px-4 py-3">{l.label || "—"}</td>
                <td className="px-4 py-3">
                  <button className="px-3 py-1 bg-black text-white rounded text-sm" onClick={() => {
                    setEditData(l);
                    setOpen(true);
                  }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between mt-5">
          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}  {/* Form Modal */}
      <LeadForm
        open={open}
        onClose={() => setOpen(false)}
        editData={editData}
        refresh={fetchLeads}
      />
    </div>
  );
}
