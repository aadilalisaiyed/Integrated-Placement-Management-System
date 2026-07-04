// frontend/src/pages/Companies.jsx

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import { PROGRAMMES } from "../constants/programmes";

// ── Helpers ──────────────────────────────────────────────
const getInitials = (name) =>
  name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

const INITIAL_BG = [
  "bg-primary-fixed/30 text-primary",
  "bg-secondary-container/30 text-secondary",
  "bg-tertiary-fixed/40 text-tertiary-container",
  "bg-error-container/30 text-error",
];
const getInitialColor = (name) =>
  INITIAL_BG[(name?.charCodeAt(0) || 0) % INITIAL_BG.length];

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

// ── Empty form ────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  role: "",
  ctc: "",
  eligible_branch: "",
  min_cgpa: "",
  drive_date: "",
  last_date_to_apply: "",
  portal_link: "",
};
// ── Company Modal ─────────────────────────────────────────
const CompanyModal = ({ open, onClose, onSaved, editing }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        role: editing.role || "",
        ctc: editing.ctc || "",
        eligible_branch: editing.eligible_branch || "",
        min_cgpa: editing.min_cgpa || "",
        drive_date: editing.drive_date
          ? new Date(editing.drive_date).toISOString().split("T")[0]
          : "",
        last_date_to_apply: editing.last_date_to_apply
          ? new Date(editing.last_date_to_apply).toISOString().split("T")[0]
          : "",
        portal_link: editing.portal_link || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError("");
  }, [editing, open]);

  if (!open) return null;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editing) {
        await api.put(`/companies/${editing.id}`, form);
      } else {
        await api.post("/companies", form);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-[0_20px_60px_rgba(27,28,26,0.18)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-surface-container-low">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-on-surface">
              {editing ? "Edit Company" : "Add New Company"}
            </h2>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {editing
                ? "Update company details"
                : "Register a new recruiting company"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              close
            </span>
          </button>
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 px-8 py-6 overflow-y-auto"
        >
          {/* Company Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
              Company Name <span className="text-error">*</span>
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Google India"
              className="
                w-full bg-surface-container-low text-on-surface
                px-4 py-3 rounded-lg text-sm
                outline-none border-2 border-transparent
                focus:border-primary/40 focus:bg-white
                transition-all duration-200
                placeholder:text-outline/40
              "
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
              Job Role
            </label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              className="
                w-full bg-surface-container-low text-on-surface
                px-4 py-3 rounded-lg text-sm
                outline-none border-2 border-transparent
                focus:border-primary/40 focus:bg-white
                transition-all duration-200
                placeholder:text-outline/40
              "
            />
          </div>

          {/* CTC + Min CGPA — side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
                CTC (LPA)
              </label>
              <input
                name="ctc"
                type="number"
                step="0.01"
                min="0"
                value={form.ctc}
                onChange={handleChange}
                placeholder="e.g. 12.50"
                className="
                  w-full bg-surface-container-low text-on-surface
                  font-mono px-4 py-3 rounded-lg text-sm
                  outline-none border-2 border-transparent
                  focus:border-primary/40 focus:bg-white
                  transition-all duration-200
                  placeholder:text-outline/40 placeholder:font-sans
                "
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
                Min CGPA
              </label>
              <input
                name="min_cgpa"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.min_cgpa}
                onChange={handleChange}
                placeholder="e.g. 7.5"
                className="
                  w-full bg-surface-container-low text-on-surface
                  font-mono px-4 py-3 rounded-lg text-sm
                  outline-none border-2 border-transparent
                  focus:border-primary/40 focus:bg-white
                  transition-all duration-200
                  placeholder:text-outline/40 placeholder:font-sans
                "
              />
            </div>
          </div>

          {/* Eligible Programme */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
              Eligible Programme
            </label>
            <select
              name="eligible_branch"
              value={form.eligible_branch}
              onChange={handleChange}
              className="
                w-full bg-surface-container-low text-on-surface
                px-4 py-3 rounded-lg text-sm
                outline-none border-2 border-transparent
                focus:border-primary/40 focus:bg-white
                transition-all duration-200
              "
            >
              <option value="">All Programmes</option>
              {PROGRAMMES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Drive Date + Last Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
                Drive Date
              </label>
              <input
                name="drive_date"
                type="date"
                value={form.drive_date}
                onChange={handleChange}
                className="w-full bg-surface-container-low text-on-surface font-mono px-4 py-3 rounded-lg text-sm outline-none border-2 border-transparent focus:border-primary/40 focus:bg-white transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
                Last Date to Apply
              </label>
              <input
                name="last_date_to_apply"
                type="date"
                value={form.last_date_to_apply}
                onChange={handleChange}
                className="w-full bg-surface-container-low text-on-surface font-mono px-4 py-3 rounded-lg text-sm outline-none border-2 border-transparent focus:border-primary/40 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>
          {/* Portal Link */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8rem] font-semibold text-on-surface tracking-wide">
              Company Portal Link
            </label>
            <input
              name="portal_link"
              type="url"
              value={form.portal_link}
              onChange={handleChange}
              placeholder="https://careers.company.com/apply"
              className="w-full bg-surface-container-low text-on-surface font-mono px-4 py-3 rounded-lg text-sm outline-none border-2 border-transparent focus:border-primary/40 focus:bg-white transition-all duration-200"
            />
          </div>
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-error-container/40 text-on-error-container px-4 py-3 rounded-lg">
              <span
                className="material-symbols-outlined text-error"
                style={{ fontSize: "16px" }}
              >
                error
              </span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 py-3 rounded-lg text-sm font-bold
                bg-surface-container text-on-surface-variant
                hover:bg-surface-container-high
                transition-colors duration-200
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1 py-3 rounded-lg text-sm font-bold
                btn-gradient text-white
                shadow-primary hover:shadow-primary-hover
                hover:scale-[1.01] active:scale-[0.98]
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Saving...
                </>
              ) : editing ? (
                "Save Changes"
              ) : (
                "Add Company"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Delete Confirm Modal ──────────────────────────────────
const DeleteModal = ({ open, company, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  if (!open || !company) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/companies/${company.id}`);
      onDeleted();
      onClose();
    } catch {
      /* handled by axios interceptor */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-[0_20px_60px_rgba(27,28,26,0.18)] p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="w-12 h-12 rounded-full bg-error-container/40 flex items-center justify-center mb-2">
            <span
              className="material-symbols-outlined text-error"
              style={{ fontSize: "24px" }}
            >
              delete
            </span>
          </div>
          <h2 className="text-lg font-bold text-on-surface">Delete Company</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-bold text-on-surface">{company.name}</span>?
            This will also remove all associated applications. This cannot be
            undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg text-sm font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-3 rounded-lg text-sm font-bold bg-error text-white hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "16px" }}
                >
                  delete
                </span>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────
const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    company: null,
  });

  const fetchCompanies = async () => {
    try {
      const { data } = await api.get("/companies");
      setCompanies(data);
      setFiltered(data);
    } catch {
      /* axios interceptor handles 401 */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Live search filter
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      companies.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.role?.toLowerCase().includes(q) ||
          c.eligible_branch?.toLowerCase().includes(q),
      ),
    );
  }, [search, companies]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setModalOpen(true);
  };
  const openDelete = (c) => setDeleteModal({ open: true, company: c });

  return (
    <Layout title="Companies">
      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-grow relative">
          <span
            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
            style={{ fontSize: "20px" }}
          >
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies, roles, programmes..."
            className="
              w-full pl-12 pr-4 py-3
              bg-surface-container-highest rounded-lg
              text-on-surface text-sm
              outline-none border-2 border-transparent
              focus:border-primary/30 focus:bg-white
              transition-all duration-200
              placeholder:text-outline/50
            "
          />
        </div>

        {/* Add button */}
        <button
          onClick={openAdd}
          className="
            btn-gradient
            flex items-center gap-2
            px-6 py-3 rounded-lg
            text-white font-semibold text-sm
            shadow-primary hover:shadow-primary-hover
            hover:scale-[1.01] active:scale-[0.98]
            transition-all duration-200
            whitespace-nowrap
          "
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "18px" }}
          >
            add
          </span>
          Add Company
        </button>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-surface-container-low rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <span
              className="material-symbols-outlined mb-3"
              style={{ fontSize: "48px" }}
            >
              business
            </span>
            <p className="text-base font-semibold">
              {search
                ? "No companies match your search"
                : "No companies added yet"}
            </p>
            <p className="text-sm mt-1">
              {!search && 'Click "Add Company" to register the first one'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              {/* Head */}
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container">
                  {[
                    "Company",
                    "Role",
                    "CTC (LPA)",
                    "Drive Date",
                    "Min CGPA",
                    "Programme",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`
                        px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider
                        ${h === "Actions" ? "text-right" : ""}
                        ${h === "Min CGPA" ? "text-center" : ""}
                      `}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {filtered.map((company, idx) => (
                  <tr
                    key={company.id}
                    className={`
                      hover:bg-surface-container-low transition-colors duration-150
                      ${idx !== filtered.length - 1 ? "border-b border-surface-container-low" : ""}
                    `}
                  >
                    {/* Company name + avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
                          font-bold text-sm flex-shrink-0
                          ${getInitialColor(company.name)}
                        `}
                        >
                          {getInitials(company.name)}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-sm leading-none mb-1">
                            {company.name}
                          </p>
                          <p className="text-xs text-outline font-mono">
                            ID: COMP-{String(company.id).padStart(3, "0")}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-on-surface">
                        {company.role || "—"}
                      </span>
                    </td>

                    {/* CTC */}
                    <td className="px-6 py-4">
                      {company.ctc ? (
                        <span className="font-mono text-sm font-bold text-on-secondary-container bg-secondary-container/20 px-2 py-1 rounded">
                          {Number(company.ctc).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-outline text-sm">—</span>
                      )}
                    </td>

                    {/* Drive date */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-on-surface font-medium">
                          {formatDate(company.drive_date)}
                        </span>
                      </div>
                    </td>

                    {/* Min CGPA */}
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-sm text-on-surface-variant">
                        {company.min_cgpa || "—"}
                      </span>
                    </td>

                    {/* Programme */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                        {company.eligible_branch || "All"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(company)}
                          className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all duration-150"
                          title="Edit"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "18px" }}
                          >
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => openDelete(company)}
                          className="p-2 rounded-lg hover:bg-error-container/30 text-on-surface-variant hover:text-error transition-all duration-150"
                          title="Delete"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "18px" }}
                          >
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────── */}
      <CompanyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchCompanies}
        editing={editing}
      />
      <DeleteModal
        open={deleteModal.open}
        company={deleteModal.company}
        onClose={() => setDeleteModal({ open: false, company: null })}
        onDeleted={fetchCompanies}
      />
    </Layout>
  );
};

export default Companies;
