"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { PageSkeleton } from "@/components/Loader";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try { const res = await apiFetch("/api/admin/user"); const data = await res.json(); setUsers(data || []); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredOrgs = users?.filter((user: any) =>
    user?.firstName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage);

  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Users" },
  ];

  if (loading) return <PageSkeleton rows={6} />;

  return (
    <div className="admin-page mb-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-green-700">People</p><h1 className="text-2xl font-bold text-slate-900">Users</h1><p className="mt-1 text-sm text-slate-500">Manage owners, managers, and tenants in one place.</p></div>
        <input
          type="text"
          placeholder="Search user..."
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
        <p className="admin-empty">No users found.</p>
      ) : (
        <div className="admin-table-shell">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrgs.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                    <p> {user?.firstName || "—"}
                      {" " + user?.lastName || "—"}</p>
                    <p className="text-xs"> {user?.countryCode || "—"}
                      {" " + user?.phone || "—"}</p>
                  </td>
                  <td className="px-4 py-3">{user.address || "—"}</td>
                  <td className="px-4 py-3">{user.role || "—"}</td>
                  <td className="px-4 py-3">{user.email || "—"}</td>

                  <td className="px-4 py-3">
                    {user.deleted ? (
                      <span className="text-red-500 font-medium">Deleted</span>
                    ) : user.disabled ? (
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
