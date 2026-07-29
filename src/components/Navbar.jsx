import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="border-b border-line bg-paper sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-[74px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-ink flex items-center justify-center -rotate-6 font-serif font-semibold text-[12px] shrink-0">
            JT
          </div>
          <span className="font-serif font-semibold text-lg tracking-tight">
            Job Tracker
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {token ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink border-b border-transparent hover:border-ink pb-0.5 transition-colors"
            >
              <FiLogOut size={15} />
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink border-b border-transparent hover:border-ink pb-0.5 transition-colors"
              >
                <FiLogIn size={15} />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-ink text-paper text-sm font-medium px-4 py-2 rounded-[3px] hover:bg-accent transition-colors"
              >
                <FiUserPlus size={15} />
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;


