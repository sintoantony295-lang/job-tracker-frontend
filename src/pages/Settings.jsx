import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiArrowLeft } from "react-icons/fi";
import { changePassword, deleteAccount } from "../services/authService";

function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // UI-only state — no backend route yet for storing preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");

    try {
      const data = await changePassword({ currentPassword, newPassword });
      setPasswordMessage(data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setPasswordMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await deleteAccount();
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-paper sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-[74px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-ink flex items-center justify-center -rotate-6 font-serif font-semibold text-[12px] shrink-0">
              AF
            </div>
            <span className="font-serif font-semibold text-lg tracking-tight">
              ApplyFlow
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

      <main className="max-w-3xl mx-auto px-6 md:px-10 py-12 space-y-8">
        <div>
          <div className="text-[11.5px] tracking-[0.14em] uppercase text-muted mb-3">
            Account
          </div>
          <h1 className="font-serif text-[34px]">Settings</h1>
        </div>

        {/* Change password */}
        <section className="bg-paper-2 border border-line-strong rounded-[2px] p-7">
          <div className="text-[10.5px] tracking-[0.1em] uppercase text-muted mb-5 font-mono">
            Change Password
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-[11px] tracking-[0.06em] uppercase text-muted mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-paper border border-line-strong rounded-[2px] px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.06em] uppercase text-muted mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-paper border border-line-strong rounded-[2px] px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition"
              />
            </div>

            {passwordMessage && (
              <p className="text-xs text-ink-soft">{passwordMessage}</p>
            )}

            <button
              type="submit"
              className="bg-ink hover:bg-accent text-paper font-medium text-sm px-5 py-2.5 rounded-[3px] transition-colors"
            >
              Update Password
            </button>
          </form>
        </section>

        {/* Preferences */}
        <section className="bg-paper-2 border border-line-strong rounded-[2px] p-7">
          <div className="text-[10.5px] tracking-[0.1em] uppercase text-muted mb-5 font-mono">
            Preferences
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-ink">Email Notifications</div>
                <div className="text-xs text-muted mt-0.5">
                  Get notified about application updates
                </div>
              </div>
              <button
                onClick={() => setEmailNotifications((v) => !v)}
                className={`w-10 h-5.5 rounded-full relative transition-colors ${
                  emailNotifications ? "bg-accent" : "bg-line-strong"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-paper transition-transform ${
                    emailNotifications ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-ink">Interview Reminders</div>
                <div className="text-xs text-muted mt-0.5">
                  Receive reminders for upcoming interviews
                </div>
              </div>
              <button
                onClick={() => setInterviewReminders((v) => !v)}
                className={`w-10 h-5.5 rounded-full relative transition-colors ${
                  interviewReminders ? "bg-accent" : "bg-line-strong"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-paper transition-transform ${
                    interviewReminders ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-ink">Weekly Summary</div>
                <div className="text-xs text-muted mt-0.5">
                  Get a weekly summary of your progress
                </div>
              </div>
              <button
                onClick={() => setWeeklySummary((v) => !v)}
                className={`w-10 h-5.5 rounded-full relative transition-colors ${
                  weeklySummary ? "bg-accent" : "bg-line-strong"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-paper transition-transform ${
                    weeklySummary ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <p className="text-xs text-muted mt-6">
            Note: these toggles aren't saved anywhere yet — there's no backend
            route to store preferences.
          </p>
        </section>

        {/* Danger zone */}
        <section className="border border-red rounded-[2px] p-7">
          <div className="text-sm font-medium text-red mb-1">
            Delete Account
          </div>
          <p className="text-xs text-ink-soft mb-4">
            Permanently delete your account. This action cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="border border-red text-red hover:bg-red hover:text-paper text-sm font-medium px-4 py-2 rounded-[3px] transition-colors"
          >
            Delete Account
          </button>
        </section>
      </main>
    </div>
  );
}

export default Settings;