"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { PageSkeleton } from "@/components/Loader";
import { statusColorMap } from "@/utils/contants";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchPayments = async () => {
    try { const res = await apiFetch("/api/admin/payments"); const data = await res.json(); setPayments(data || []); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredOrgs = payments?.filter((payment: any) =>
    `${payment.businessId?.name || ""} ${payment.plan || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage);

  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Payments" },
  ];

  if (loading) return <PageSkeleton rows={6} />;

  return (
    <div className="admin-page mb-10">
      <div className="mb-6 flex items-end justify-between"><div><p className="text-sm font-medium text-blue-700">Revenue</p><h1 className="text-2xl font-bold text-slate-900">Subscription payments</h1><p className="mt-1 text-sm text-slate-500">Track platform subscription activity and payment health.</p></div><span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-blue-700">{payments.length} total</span>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search payment..."
          className="border px-3 py-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      {paginatedOrgs.length === 0 ? (
        <p className="admin-empty">No payments found.</p>
      ) : (
        <div className="admin-table-shell">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Business</th><th className="px-4 py-3 text-left">Plan</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Method</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Started</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrgs.map((payment) => (
                <tr key={payment._id} className="border-b hover:bg-gray-50 transition"><td className="px-4 py-3 font-medium">{payment.businessId?.name || "—"}</td><td className="px-4 py-3 capitalize">{payment.plan || "—"}</td><td className="px-4 py-3 font-semibold">₹{Number(payment.total_price || payment.plan_price || 0).toLocaleString("en-IN")}</td><td className="px-4 py-3 capitalize">{payment.paymentMethod || "—"}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColorMap[payment.status ?? ""] || "bg-slate-100 text-slate-700"}`}>{payment.status || "Pending"}</span></td><td className="px-4 py-3">{payment.startDate ? new Date(payment.startDate).toLocaleDateString("en-IN") : "—"}</td>
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
