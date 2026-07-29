import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import Navbar from "../components/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      console.log("Token Saved");

      navigate("/dashboard");
    } catch (error) {
      console.log(error.response);
console.log(error.response.data);
      
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm bg-paper-2 border border-line-strong rounded-[2px] shadow-[0_18px_40px_-18px_rgba(27,26,23,0.28)] p-8">
          <div className="text-[10.5px] tracking-[0.1em] uppercase text-muted mb-4 font-mono">
            Access · Record
          </div>

          <h1 className="font-serif text-[26px] mb-1 -tracking-[0.01em]">
            Welcome back
          </h1>
          <p className="text-sm text-ink-soft mb-6">
            Log in to your job register.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiMail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={15}
              />
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-paper border border-line-strong rounded-[2px] pl-9 pr-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition"
              />
            </div>

            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={15}
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-paper border border-line-strong rounded-[2px] pl-9 pr-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-ink hover:bg-accent text-paper font-medium text-sm px-4 py-2.5 rounded-[3px] transition-colors"
            >
              <FiLogIn size={15} />
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

