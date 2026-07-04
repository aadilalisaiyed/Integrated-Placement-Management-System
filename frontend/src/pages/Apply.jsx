// frontend/src/pages/Apply.jsx — replace entire file

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// ── Helpers ───────────────────────────────────────────────
const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

const AVATAR_COLORS = [
  "bg-primary-fixed/30 text-primary",
  "bg-secondary-container/30 text-secondary",
  "bg-tertiary-fixed/40 text-tertiary-container",
  "bg-error-container/30 text-error",
];
const getAvatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const isExpired = (last_date_to_apply) => {
  if (!last_date_to_apply) return false;
  const deadline = new Date(last_date_to_apply);
  deadline.setHours(23, 59, 59, 999);
  return new Date() > deadline;
};
const RedirectCountdown = ({ url, onComplete }) => {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      window.open(url, "_blank");
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  return <p>Redirecting in {count}s...</p>;
};
// ── Apply Modal ───────────────────────────────────────────
const ApplyModal = ({ company, profile, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!company) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post(`/applications/apply/${company.id}`, {
        roll_no: profile.roll_no,
        name: profile.name,
        email: profile.email,
        branch: profile.branch,
        cgpa: profile.cgpa,
        graduation_year: profile.graduation_year,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-[0_20px_60px_rgba(27,28,26,0.18)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-surface-container-low flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-on-surface">
              Apply to {company.name}
            </h2>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {company.role || "Open Role"} ·{" "}
              <span className="font-mono font-bold text-on-secondary-container">
                {company.ctc
                  ? `${Number(company.ctc).toFixed(1)} LPA`
                  : "CTC N/A"}
              </span>
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

        {/* Success state */}
        {success ? (
          <div className="text-center p-6">
            <h3>Application Submitted!</h3>

            <p>
              {company.portal_link
                ? "Redirecting to company portal..."
                : "Placement cell will contact you."}
            </p>

            {company.portal_link ? (
              <>
                <RedirectCountdown
                  url={company.portal_link}
                  onComplete={() => {
                    onSuccess(company.id);
                    onClose();
                  }}
                />

                <button onClick={() => window.open(company.portal_link)}>
                  Go Now
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onSuccess(company.id);
                  onClose();
                }}
              >
                Back
              </button>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 px-8 py-6 overflow-y-auto"
          >
            {/* Eligibility strip */}
            <div className="bg-surface-container-low rounded-xl p-4 flex flex-wrap gap-4">
              {company.min_cgpa && (
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "14px" }}
                  >
                    school
                  </span>
                  Min CGPA{" "}
                  <span className="font-mono font-bold text-on-surface ml-0.5">
                    {company.min_cgpa}
                  </span>
                </div>
              )}
              {company.eligible_branch && (
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "14px" }}
                  >
                    category
                  </span>
                  <span className="font-bold text-on-surface">
                    {company.eligible_branch}
                  </span>
                </div>
              )}
              {company.drive_date && (
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "14px" }}
                  >
                    calendar_month
                  </span>
                  <span className="font-mono font-bold text-on-surface">
                    {formatDate(company.drive_date)}
                  </span>
                </div>
              )}
            </div>

            {/* Pre-filled profile summary */}
            <div className="bg-primary-fixed/10 border border-primary/10 rounded-xl p-4">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                Applying as
              </p>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${getAvatarColor(profile?.name)}`}
                >
                  {getInitials(profile?.name)}
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">
                    {profile?.name}
                  </p>
                  <p className="font-mono text-xs text-on-surface-variant">
                    {profile?.roll_no}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Email", value: profile?.email },
                  { label: "Programme", value: profile?.branch },
                  { label: "CGPA", value: profile?.cgpa, mono: true },
                  {
                    label: "Grad. Year",
                    value: profile?.graduation_year,
                    mono: true,
                  },
                ].map(({ label, value, mono }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-on-surface-variant font-medium">
                      {label}
                    </span>
                    <span
                      className={`text-on-surface font-semibold ${mono ? "font-mono" : ""}`}
                    >
                      {value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CGPA eligibility warning */}
            {company.min_cgpa &&
              profile?.cgpa &&
              Number(profile.cgpa) < Number(company.min_cgpa) && (
                <div className="flex items-start gap-2 bg-error-container/30 text-on-error-container px-4 py-3 rounded-lg">
                  <span
                    className="material-symbols-outlined text-error flex-shrink-0"
                    style={{ fontSize: "16px" }}
                  >
                    warning
                  </span>
                  <p className="text-sm font-medium">
                    Your CGPA ({profile.cgpa}) is below the minimum required (
                    {company.min_cgpa}). You may still apply but shortlisting is
                    at the company's discretion.
                  </p>
                </div>
              )}

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
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-lg text-sm font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-lg text-sm font-bold btn-gradient text-white shadow-primary hover:shadow-primary-hover hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "16px" }}
                    >
                      send
                    </span>
                    Confirm & Apply
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Company Card ──────────────────────────────────────────
const CompanyCard = ({ company, onApply, applied }) => {
  const expired = isExpired(company.last_date_to_apply);

  return (
    <div
      className={`
      bg-surface-container-lowest rounded-xl p-6
      border border-white/50 shadow-card
      flex flex-col gap-4
      ${applied || expired ? "opacity-75" : ""}
    `}
    >
      {/* Top */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold">{company.name}</h3>
          <p className="text-xs">{company.role || "Open Role"}</p>
        </div>
      </div>

      {/* Dates */}
      <div className="flex flex-col gap-1 text-xs">
        {company.drive_date && (
          <span>Drive: {formatDate(company.drive_date)}</span>
        )}

        {company.last_date_to_apply && (
          <span className={expired ? "text-red-500 font-bold" : ""}>
            Last Date: {formatDate(company.last_date_to_apply)}
          </span>
        )}
      </div>

      {/* Button */}
      <button
        onClick={() => !applied && !expired && onApply(company)}
        disabled={applied || expired}
        className={`
          w-full py-2 rounded-lg text-sm font-bold
          ${
            expired
              ? "bg-red-100 text-red-500 cursor-not-allowed"
              : applied
                ? "bg-gray-200 cursor-not-allowed"
                : "btn-gradient text-white"
          }
        `}
      >
        {expired ? "Registration Closed" : applied ? "Applied" : "Apply Now"}
      </button>
    </div>
  );
};
// ── Main Page ─────────────────────────────────────────────
const Apply = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [selectedCompany, setSelected] = useState(null);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [myApplications, setMyApplications] = useState([]);

  // Fetch profile + companies + my applications in parallel
  useEffect(() => {
    // Replace the entire fetchAll function inside useEffect

    const fetchAll = async () => {
      try {
        const [profileRes, companiesRes, appsRes] = await Promise.all([
          api.get("/students/me"),
          api.get("/companies"),
          api.get("/applications/mine"),
        ]);

        setProfile(profileRes.data);
        setCompanies(companiesRes.data);

        // /mine returns array directly
        const myApps = appsRes.data || [];
        setMyApplications(myApps);
        setAppliedIds(new Set(myApps.map((a) => a.company_id)));
      } catch {
        /* axios interceptor handles 401 */
      } finally {
        setLoadingPage(false);
      }
    };
    fetchAll();
  }, []);

  const handleSuccess = (companyId) => {
    setAppliedIds((prev) => new Set([...prev, companyId]));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filtered = companies.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.role?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top Nav ───────────────────────────────────── */}
      <header className="sticky top-0 z-30 glass-panel border-b border-white/20 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}
              >
                account_balance
              </span>
            </div>
            <span className="font-bold text-lg text-primary-container tracking-tight">
              Placement Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-on-surface leading-none">
                {user?.name || "Student"}
              </p>
              <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                {profile?.roll_no || ""}
              </p>
            </div>
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(user?.name)}`}
            >
              {getInitials(user?.name)}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-error bg-error-container/30 hover:bg-error-container/50 transition-colors duration-200"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "14px" }}
              >
                logout
              </span>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────── */}
      <div className="bg-surface-container-low border-b border-white/20 px-8 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Welcome + stats */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-on-background tracking-tight mb-1">
                Welcome, {profile?.name?.split(" ")[0] || user?.name} 👋
              </h1>
              <p className="text-on-surface-variant text-base">
                Browse and apply to companies visiting your campus this
                placement season.
              </p>
            </div>

            {/* My stats strip */}
            {profile && (
              <div className="flex gap-4">
                <div className="bg-surface-container-lowest rounded-xl px-5 py-3 text-center shadow-level-1">
                  <p className="text-2xl font-extrabold text-on-background tracking-tight">
                    {appliedIds.size}
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    Applied
                  </p>
                </div>
                <div className="bg-surface-container-lowest rounded-xl px-5 py-3 text-center shadow-level-1">
                  <p className="text-2xl font-extrabold text-secondary tracking-tight">
                    {
                      myApplications.filter((a) => a.status === "selected")
                        .length
                    }
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    Selected
                  </p>
                </div>
                <div className="bg-surface-container-lowest rounded-xl px-5 py-3 text-center shadow-level-1">
                  <p className="text-2xl font-extrabold text-on-background tracking-tight font-mono">
                    {profile.cgpa}
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    CGPA
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <span
              className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
              style={{ fontSize: "20px" }}
            >
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies or roles..."
              className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest rounded-xl text-on-surface text-sm outline-none border-2 border-transparent focus:border-primary/30 shadow-level-1 transition-all duration-200 placeholder:text-outline/50"
            />
          </div>
        </div>
      </div>

      {/* ── Company Grid ──────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* My Applications section */}
        {myApplications.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold tracking-tight mb-4">
              My Applications
            </h2>
            <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden">
              <div className="divide-y divide-surface-container-low">
                {myApplications.map((app) => (
                  <div
                    key={app.application_id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div>
                      <p className="font-bold text-on-surface text-sm">
                        {app.company_name}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {app.role || "—"} · Applied {formatDate(app.applied_at)}
                      </p>
                    </div>
                    <span
                      className={`badge ${
                        app.status === "selected"
                          ? "badge-selected"
                          : app.status === "rejected"
                            ? "badge-rejected"
                            : "badge-pending"
                      }`}
                    >
                      {app.status?.charAt(0).toUpperCase() +
                        app.status?.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All companies */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight">All Companies</h2>
          <p className="text-sm text-on-surface-variant font-medium">
            {loadingPage ? "..." : `${filtered.length} available`}
          </p>
        </div>

        {loadingPage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-surface-container-low rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
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
                : "No companies listed yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onApply={setSelected}
                applied={appliedIds.has(company.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Apply Modal ───────────────────────────────── */}
      <ApplyModal
        company={selectedCompany}
        profile={profile}
        onClose={() => setSelected(null)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Apply;
