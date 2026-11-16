"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { PageSkeleton } from "@/components/Loader";
import { statusColorMap } from "@/utils/contants";

export default function OrganisationsPage() {
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchOrganisations = async () => {
    try { const res = await apiFetch("/api/organisation"); const data = await res.json(); setOrganisations(data || []); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchOrganisations();
  }, []);

  const filteredOrgs = organisations?.filter((org: any) =>
    org.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage);

  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Organisations" },
  ];

  if (loading) return <PageSkeleton rows={6} />;

  return (
    <div className="admin-page mb-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-medium text-green-700">Platform directory</p><h1 className="text-2xl font-bold text-slate-900">Organisations</h1><p className="mt-1 text-sm text-slate-500">Review every workspace on your platform.</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-green-700">{organisations.length} total</span>
        <input
          type="text"
          placeholder="Search organisation..."
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
        <p className="admin-empty">No organisations found.</p>
      ) : (
        <div className="admin-table-shell">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Subcription Type & Status</th>
                <th className="px-4 py-3 text-left">Bookings & Balance</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrgs.map((org) => (
                <tr key={org._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <p>{org.name}</p>
                    <p className="text-xs">{org.address || "—"}</p>
                  </td>

                  <td className="px-4 py-3">
                    <p> {org.owner?.firstName || "—"}
                      {" " + org.owner?.lastName || "—"}</p>
                    <p className="text-xs"> {org.owner?.countryCode || "—"}
                      {" " + org.owner?.phone || "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p> {org.subscription?.plan || "—"} -
                      {" " + org.subscription?.unitPrice || "—"}</p>
                    <div>  <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColorMap[org.subscription?.status ?? ""] || "bg-gray-100 text-gray-800"
                      }`}>
                      {org.subscription?.status}
                    </span>
                    </div>
                  </td>
                  <td className="px-4 py-3"></td>

                  <td className="px-4 py-3">
                    {org.deleted ? (
                      <span className="text-red-500 font-medium">Deleted</span>
                    ) : org.disabled ? (
                      <span className="text-yellow-600 font-medium">Disabled</span>
                    ) : (
                      <span className="text-green-600 font-medium">Active</span>
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
