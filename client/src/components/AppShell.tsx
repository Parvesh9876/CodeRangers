import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/dashboard", label: "Dashboard" }
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-art" />

      <header className="sticky top-0 z-30 border-b border-cyan/20 bg-[#02082acc]/95 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-placeholder.svg" alt="Code Rangers" className="h-10 w-10 rounded-full ring-2 ring-cyan/70" />
            <div>
              <p className="font-display text-xs tracking-[0.22em] text-cyan sm:text-sm">CODE RANGERS</p>
              <p className="text-[10px] text-slate-300 sm:text-xs">Club Management System</p>
            </div>
          </Link>

          <div className="order-3 flex w-full items-center justify-center gap-2 sm:order-2 sm:w-auto sm:gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 text-sm font-semibold transition ${
                    isActive ? "bg-cyan/20 text-cyan" : "text-slate-200 hover:text-cyan"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="order-2 ml-auto flex items-center gap-3 sm:order-3 sm:ml-0">
            {user ? (
              <>
                <span className="hidden rounded-full border border-amber/40 px-3 py-1 text-xs text-amber sm:block">
                  {user.role.toUpperCase()}
                </span>
                <button
                  onClick={onLogout}
                  className="rounded-full bg-gradient-to-r from-amber to-orange-500 px-4 py-2 text-xs font-bold text-slate-900 transition hover:brightness-110 sm:text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="rounded-full bg-gradient-to-r from-electric to-cyan px-4 py-2 text-xs font-bold text-slate-900 transition hover:brightness-110 sm:text-sm"
              >
                Login / Register
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-cyan/10 py-6 text-center text-sm text-slate-400">
        <p>Code Rangers CRMS | Be a Warrior, Not a Worrier</p>
      </footer>
    </div>
  );
}