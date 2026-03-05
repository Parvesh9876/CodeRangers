import { type FormEvent, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const nextPath = useMemo(() => {
    const state = location.state as { from?: string } | undefined;
    return state?.from || "/dashboard";
  }, [location.state]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      navigate(nextPath, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Request failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg rounded-3xl border border-cyan/20 bg-slate-950/70 p-6 md:p-8">
      <h1 className="font-display text-3xl text-white">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
      <p className="mt-2 text-slate-300">Authenticate to access profile and dashboard.</p>

      <div className="mt-5 grid grid-cols-2 rounded-xl border border-slate-700 bg-slate-900/70 p-1">
        <button
          onClick={() => setMode("login")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === "login" ? "bg-cyan/20 text-cyan" : "text-slate-300"}`}
          type="button"
        >
          Login
        </button>
        <button
          onClick={() => setMode("register")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === "register" ? "bg-cyan/20 text-cyan" : "text-slate-300"}`}
          type="button"
        >
          Register
        </button>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "register" ? (
          <label className="block space-y-2">
            <span className="text-sm text-slate-200">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2"
            />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm text-slate-200">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-slate-200">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2"
          />
        </label>

        {error ? <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-electric to-cyan px-4 py-2 font-bold text-slate-900 disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Want to browse first? <Link to="/events" className="text-cyan hover:text-amber">View events</Link>
      </p>
    </section>
  );
}
