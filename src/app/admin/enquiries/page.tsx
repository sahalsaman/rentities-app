"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { PageSkeleton } from "@/components/Loader";

export default function EnquiryPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const size = 10;

  const fetchEnquiries = async () => {
    try { const res = await apiFetch("/api/enquiry"); const data = await res.json(); setEnquiries(Array?.isArray(data) ? data : []); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filtered = enquiries.filter((e:any) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / size);
  const paginated = filtered.slice((page - 1) * size, page * size);

  if (loading) return <PageSkeleton rows={6} />;
  return (
    <div className="admin-page mb-10">
      <div className="mb-6 flex items-end justify-between"><div><p className="text-sm font-medium text-blue-700">Inbox</p><h1 className="text-2xl font-bold text-slate-900">Enquiries</h1><p className="mt-1 text-sm text-slate-500">Follow up on messages sent from the public site.</p></div><span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-blue-700">{enquiries.length} total</span>
      </div>

      {/* Search */}
      <input
        className="border px-3 py-2 rounded mb-4 w-full md:w-1/3"
        placeholder="Search enquiries..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      {/* Table */}
      <div className="admin-table-shell">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Message</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((e:any) => (
              <tr key={e._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                    <p> {e?.name || "—"}</p>
                    <p className="text-xs"> {e?.countryCode || ""}
                      {" " + e?.phone || "—"}</p>
                  </td>
                <td className="px-4 py-3">{e.email || "—"}</td>
                <td className="px-4 py-3">{e.status}</td>
                <td className="px-4 py-3">{e.message}</td>
                <td className="px-4 py-3">
                  <button className="px-3 py-1 bg-black text-white rounded text-sm">
                    View
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
      )}
    </div>
  );
}
