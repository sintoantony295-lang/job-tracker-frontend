import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiInbox,
  FiArrowDown,
} from "react-icons/fi";

import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../services/jobService";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// Presentational helper only — no logic/state change
const STATUS_STYLES = {
  Applied: "text-blue border-blue",
  Interview: "text-gold border-gold",
  Offer: "text-accent border-accent",
  Rejected: "text-red border-red",
};

const STATUS_DOT = {
  Applied: "bg-blue",
  Interview: "bg-gold",
  Offer: "bg-accent",
  Rejected: "bg-red",
};

function Dashboard() {
  // ---- Original state, untouched ----
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  // ---- Original functions, untouched ----
  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateJob(editingId, {
          company,
          position,
          status,
        });

        setEditingId(null);
      } else {
        await createJob({
          company,
          position,
          status,
        });
      }

      setCompany("");
      setPosition("");
      setStatus("Applied");
      fetchJobs();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Purely UI: clears the form back to "add" mode. Reuses existing setters only.
  const handleCancelEdit = () => {
    setCompany("");
    setPosition("");
    setStatus("Applied");
    setEditingId(null);
  };

  // Purely UI: scrolls down to the working area. No state/logic change.
  const scrollToWork = () => {
    document.getElementById("job-tracker-work")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Purely derived/display data — no new state, no API calls
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});
// Purely derived/display data — reuses statusCounts, no new API calls

  // Purely derived/display logic — doesn't touch your filter, just reorders the result
  const sortJobs = (list) => {
    const sorted = [...list];
    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "companyAsc":
        return sorted.sort((a, b) => a.company.localeCompare(b.company));
      case "companyDesc":
        return sorted.sort((a, b) => b.company.localeCompare(a.company));
      default:
        return sorted;
    }
  };



  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <header className="border-b border-line bg-paper sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-[74px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-ink flex items-center justify-center -rotate-6 font-serif font-semibold text-[12px] shrink-0">
              JT
            </div>
            <span className="font-serif font-semibold text-lg tracking-tight">
              Job Tracker
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToWork}
              className="text-sm text-ink-soft hover:text-ink border-b border-transparent hover:border-ink pb-0.5 transition-colors"
            >
              Register
            </button>

            <Link
              to="/analytics"
              className="text-sm text-ink-soft hover:text-ink border-b border-transparent hover:border-ink pb-0.5 transition-colors"
            >
              Analytics
            </Link>

            <Link
              to="/settings"
              className="text-sm text-ink-soft hover:text-ink border-b border-transparent hover:border-ink pb-0.5 transition-colors"
            >
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-ink-soft hover:text-red border-b border-transparent hover:border-red pb-0.5 transition-colors"
            >
              <FiLogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen homepage / hero */}
      <section className="min-h-[calc(100vh-74px)] flex flex-col justify-center bg-paper-2 border-b border-line">
        <div className="max-w-6xl mx-auto px-6 md:px-10 w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[11.5px] tracking-[0.14em] uppercase text-muted mb-5">
              Your Application Log
            </div>
            <h1 className="font-serif text-[40px] md:text-[52px] leading-[1.06] tracking-[-0.015em] mb-6">
              Every application,
              <br />
              accounted for.
            </h1>
            <p className="text-[16px] leading-relaxed text-ink-soft max-w-md mb-8">
              {jobs.length === 0
                ? "Start logging your job applications and watch your register fill up."
                : `You're tracking ${jobs.length} application${
                    jobs.length !== 1 ? "s" : ""
                  } right now.`}
            </p>

            <button
              onClick={scrollToWork}
              className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink border-b border-transparent hover:border-ink pb-0.5 transition-colors"
            >
              View full register
              <FiArrowDown size={15} />
            </button>
          </div>

          {/* Recent jobs preview — reads from your existing jobs state, no new API calls */}
          <div className="bg-paper border border-line-strong rounded-[2px] shadow-[0_18px_40px_-18px_rgba(27,26,23,0.28)] p-6">
            <div className="text-[10.5px] tracking-[0.1em] uppercase text-muted mb-4 font-mono">
              Recent Entries
            </div>

            {jobs.length === 0 ? (
              <div className="text-sm text-ink-soft py-6 text-center">
                No records yet — add your first below.
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 4).map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between py-2 border-b border-line last:border-0"
                  >
                    <div>
                      <div className="font-serif text-[15px] text-ink">
                        {job.company}
                      </div>
                      <div className="text-xs text-ink-soft">
                        {job.position}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-medium border rounded-[2px] px-2 py-1 ${
                        STATUS_STYLES[job.status] ||
                        "text-muted border-line-strong"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          STATUS_DOT[job.status] || "bg-muted"
                        }`}
                      />
                      {job.status}
                    </span>
                  </div>
                ))}

                {jobs.length > 4 && (
                  <button
                    onClick={scrollToWork}
                    className="text-xs text-ink-soft hover:text-ink pt-1"
                  >
                    +{jobs.length - 4} more in the full register
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Working area — everything below the fold */}
      <div id="job-tracker-work">
        {/* Stats rule */}
        <section className="border-b border-line">
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4">
            <div className="pr-6">
              <div className="font-serif text-[28px] mb-1">{jobs.length}</div>
              <div className="text-[11px] tracking-[0.08em] uppercase text-muted">
                Total Applications
              </div>
            </div>
            <div className="px-6 border-l border-line">
              <div className="font-mono text-[28px] mb-1 text-blue">
                {statusCounts.Applied || 0}
              </div>
              <div className="text-[11px] tracking-[0.08em] uppercase text-muted">
                Applied
              </div>
            </div>
            <div className="px-6 border-l border-line">
              <div className="font-mono text-[28px] mb-1 text-gold">
                {statusCounts.Interview || 0}
              </div>
              <div className="text-[11px] tracking-[0.08em] uppercase text-muted">
                Interview
              </div>
            </div>
            <div className="px-6 border-l border-line">
              <div className="font-mono text-[28px] mb-1 text-accent">
                {statusCounts.Offer || 0}
              </div>
              <div className="text-[11px] tracking-[0.08em] uppercase text-muted">
                Offer
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-6 md:px-10 py-12">
          {/* Add / Edit form — styled like an index card */}
          <section className="relative mb-14 max-w-xl">
            <div className="bg-paper-2 border border-line-strong rounded-[2px] shadow-[0_18px_40px_-18px_rgba(27,26,23,0.28)] p-7">
              <div className="flex items-center justify-between text-[10.5px] tracking-[0.1em] uppercase text-muted mb-5 font-mono">
                <span>{editingId ? "Edit Record" : "New Record"}</span>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 text-ink-soft hover:text-red normal-case tracking-normal transition-colors"
                  >
                    <FiX size={13} />
                    cancel
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-[11px] tracking-[0.06em] uppercase text-muted mb-1.5">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-paper border border-line-strong rounded-[2px] px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition"
                  />
                </div>

                <div className="md:w-48">
                  <label className="block text-[11px] tracking-[0.06em] uppercase text-muted mb-1.5">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-paper border border-line-strong rounded-[2px] px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition"
                  >
                    <option value="All">All Status</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="md:w-48">
                  <label className="block text-[11px] tracking-[0.06em] uppercase text-muted mb-1.5">
                    Sort
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-paper border border-line-strong rounded-[2px] px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="companyAsc">Company A–Z</option>
                    <option value="companyDesc">Company Z–A</option>
                  </select>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] tracking-[0.06em] uppercase text-muted mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-paper border border-line-strong rounded-[2px] px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition font-serif"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.06em] uppercase text-muted mb-1.5">
                    Position
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Backend Web Developer"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-paper border border-line-strong rounded-[2px] px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.06em] uppercase text-muted mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-paper border border-line-strong rounded-[2px] px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-ink hover:bg-accent text-paper font-medium text-sm px-4 py-2.5 rounded-[3px] transition-colors mt-2"
                >
                  {editingId ? (
                    <>
                      <FiEdit2 size={15} />
                      Update Record
                    </>
                  ) : (
                    <>
                      <FiPlus size={15} />
                      Add Record
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* The register — job list */}
          <section>
            <div className="flex items-end justify-between mb-2 flex-wrap gap-3">
              <div className="font-serif text-[26px]">
                The <span className="text-accent">register</span>
              </div>
              <div className="text-[12.5px] text-ink-soft font-mono">
                {jobs.length} record{jobs.length !== 1 ? "s" : ""}
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-line-strong mt-8">
                <div className="w-14 h-14 rounded-full border border-line-strong flex items-center justify-center mb-4">
                  <FiInbox className="text-muted" size={24} />
                </div>
                <h3 className="font-serif text-lg text-ink mb-1">
                  No records yet
                </h3>
                <p className="text-ink-soft text-sm">
                  Add your first job application above to start your register.
                </p>
              </div>
            ) : (
              <div className="mt-8">
                {/* Column headings — desktop only */}
                <div className="hidden md:grid grid-cols-[52px_1fr_1fr_120px_150px] pb-3 border-b-2 border-ink text-[10.5px] tracking-[0.1em] uppercase text-muted">
                  <div>No.</div>
                  <div>Company</div>
                  <div>Position</div>
                  <div>Status</div>
                  <div></div>
                </div>

                {sortJobs(
                  jobs.filter((job) => {
                    const matchesSearch = job.company
                      .toLowerCase()
                      .includes(search.toLowerCase());

                    const matchesStatus =
                      filterStatus === "All" || job.status === filterStatus;

                    return matchesSearch && matchesStatus;
                  })
                ).map((job, index) => (
                  <div
                    key={job._id}
                    className="grid grid-cols-1 md:grid-cols-[52px_1fr_1fr_120px_150px] gap-2 md:gap-0 items-center py-5 border-b border-line hover:bg-paper-2 transition-colors px-2 -mx-2"
                  >
                    <div className="hidden md:block font-mono text-xs text-muted">
                      {String(index + 1).padStart(3, "0")}
                    </div>

                    <div className="font-serif text-[17px] text-ink">
                      {job.company}
                    </div>

                    <div className="text-sm text-ink-soft">{job.position}</div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-[0.04em] border rounded-[2px] px-2.5 py-1 ${
                          STATUS_STYLES[job.status] ||
                          "text-muted border-line-strong"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            STATUS_DOT[job.status] || "bg-muted"
                          }`}
                        />
                        {job.status}
                      </span>
                    </div>

                    <div className="flex gap-4 md:justify-end">
                      <button
                        onClick={() => {
                          setCompany(job.company);
                          setPosition(job.position);
                          setStatus(job.status);
                          setEditingId(job._id);
                        }}
                        className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink border-b border-transparent hover:border-ink pb-0.5 transition-colors"
                      >
                        <FiEdit2 size={12} />
                        Edit
                      </button>

                      <button
                        onClick={async () => {
                          const confirmDelete = window.confirm(
                            "Are you sure you want to delete this job?"
                          );

                          if (!confirmDelete) return;

                          await deleteJob(job._id);
                          fetchJobs();
                        }}
                        className="flex items-center gap-1.5 text-xs text-red hover:text-ink border-b border-transparent hover:border-red pb-0.5 transition-colors"
                      >
                        <FiTrash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        <footer className="border-t border-line mt-8">
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex items-center justify-center">
            <div className="flex items-center gap-2.5 text-[13.5px] text-ink-soft">
              <div className="w-6 h-6 rounded-full border border-ink flex items-center justify-center -rotate-6 font-serif text-[9.5px] shrink-0">
                JT
              </div>
              Job Tracker
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;