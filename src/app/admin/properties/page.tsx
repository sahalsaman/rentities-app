"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { PageSkeleton } from "@/components/Loader";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchProperties = async () => {
    try { const res = await apiFetch("/api/property"); const data = await res.json(); setProperties(data || []); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredOrgs = properties?.filter((pro: any) =>
    pro.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage);

  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Properties" },
  ];

  if (loading) return <PageSkeleton rows={6} />;

  return (
    <div className="admin-page mb-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-bold text-slate-900">Properties</h1><p className="mt-1 text-sm text-slate-500">A platform-wide view of listed rental spaces.</p></div>
        <input
          type="text"
          placeholder="Search property..."
          className="w-full sm:w-72"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      {paginatedOrgs.length === 0 ? (
        <p className="admin-empty">No properties found.</p>
      ) : (
        <div className="admin-table-shell">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Business</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrgs.map((pro) => (
                <tr key={pro._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <p>{pro.name}</p>
                    <p className="text-xs">{pro?.address}</p>
                  </td>
                  <td className="px-4 py-3">{pro.category || "—"}</td>
                  <td className="px-4 py-3">{pro.businessId?.name || "—"}</td>

                  <td className="px-4 py-3">
                    {pro.deleted ? (
                      <span className="text-red-500 font-medium">Deleted</span>
                    ) : pro.disabled ? (
                      <span className="text-yellow-600 font-medium">Disabled</span>
                    ) : (
                      <span className="text-blue-600 font-medium">Active</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <button className="px-3 py-1 text-sm bg-black text-white rounded">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-5">
          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
