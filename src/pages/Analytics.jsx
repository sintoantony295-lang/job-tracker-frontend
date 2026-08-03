import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiArrowLeft } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getJobs } from "../services/jobService";

const STATUS_COLORS = {
  Applied: "#3E5A73",
  Interview: "#A6802C",
  Offer: "#2E5B4C",
  Rejected: "#9C3F30",
};

function Analytics() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const total = jobs.length;

  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const interviewRate = total
    ? Math.round(
        (((statusCounts.Interview || 0) + (statusCounts.Offer || 0)) /
          total) *
          100
      )
    : 0;

  const offerRate = total
    ? Math.round(((statusCounts.Offer || 0) / total) * 100)
    : 0;

  const responseRate = total
    ? Math.round(((total - (statusCounts.Applied || 0)) / total) * 100)
    : 0;

  const pieData = Object.keys(STATUS_COLORS).map((s) => ({
    name: s,
    value: statusCounts[s] || 0,
  }));

  const appsOverTime = (() => {
    const counts = {};
    jobs.forEach((job) => {
      // Use createdAt if present, otherwise fall back to the timestamp
      // baked into every MongoDB _id — works even for older records
      // created before timestamps: true was added to the schema.
      const date = job.createdAt
        ? new Date(job.createdAt)
        : new Date(parseInt(job._id.substring(0, 8), 16) * 1000);

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, count]) => {
        const [y, m] = key.split("-");
        const d = new Date(Number(y), Number(m));
        return {
          month: d.toLocaleString("default", { month: "short" }),
          count,
        };
      });
  })();

  return (
    <div className="min-h-screen bg-paper">
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
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink border-b border-transparent hover:border-ink pb-0.5 transition-colors"
            >
              <FiArrowLeft size={15} />
              Register
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

      <main className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="text-[11.5px] tracking-[0.14em] uppercase text-muted mb-3">
          Insights
        </div>
        <h1 className="font-serif text-[34px] mb-10">Analytics</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          <div className="bg-paper-2 border border-line-strong rounded-[2px] p-5">
            <div className="font-serif text-[28px] mb-1">{total}</div>
            <div className="text-[11px] tracking-[0.08em] uppercase text-muted">
              Total Applications
            </div>
          </div>
          <div className="bg-paper-2 border border-line-strong rounded-[2px] p-5">
            <div className="font-mono text-[28px] mb-1 text-gold">
              {interviewRate}%
            </div>
            <div className="text-[11px] tracking-[0.08em] uppercase text-muted">
              Interview Rate
            </div>
          </div>
          <div className="bg-paper-2 border border-line-strong rounded-[2px] p-5">
            <div className="font-mono text-[28px] mb-1 text-accent">
              {offerRate}%
            </div>
            <div className="text-[11px] tracking-[0.08em] uppercase text-muted">
              Offer Rate
            </div>
          </div>
          <div className="bg-paper-2 border border-line-strong rounded-[2px] p-5">
            <div className="font-mono text-[28px] mb-1 text-blue">
              {responseRate}%
            </div>
            <div className="text-[11px] tracking-[0.08em] uppercase text-muted">
              Response Rate
            </div>
          </div>
        </div>

        {total === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-line-strong">
            <h3 className="font-serif text-lg text-ink mb-1">
              No data yet
            </h3>
            <p className="text-ink-soft text-sm">
              Add some job applications to see your analytics here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Applications over time */}
            <div className="bg-paper-2 border border-line-strong rounded-[2px] p-6">
              <div className="text-[10.5px] tracking-[0.1em] uppercase text-muted mb-5 font-mono">
                Applications Over Time
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={appsOverTime}>
                  <CartesianGrid stroke="#DFD8C6" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    stroke="#948E7D"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: "#DFD8C6" }}
                  />
                  <YAxis
                    stroke="#948E7D"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: "#DFD8C6" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#FAF8F3",
                      border: "1px solid #C9C0A9",
                      borderRadius: 2,
                      fontSize: 13,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2E5B4C"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#2E5B4C" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Status breakdown */}
            <div className="bg-paper-2 border border-line-strong rounded-[2px] p-6">
              <div className="text-[10.5px] tracking-[0.1em] uppercase text-muted mb-5 font-mono">
                Applications by Status
              </div>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                    >
                      {pieData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={STATUS_COLORS[entry.name]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2.5">
                  {pieData.map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[entry.name] }}
                      />
                      <span className="text-ink-soft">{entry.name}</span>
                      <span className="text-ink font-mono text-xs ml-auto">
                        {entry.value} (
                        {total ? Math.round((entry.value / total) * 100) : 0}
                        %)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Analytics;