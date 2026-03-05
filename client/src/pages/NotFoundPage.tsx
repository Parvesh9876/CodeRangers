import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-cyan/20 bg-slate-950/70 p-6 text-center">
      <h1 className="font-display text-4xl text-cyan">404</h1>
      <p className="mt-2 text-slate-300">Page not found.</p>
      <Link to="/" className="mt-4 inline-block rounded-lg border border-cyan/40 px-4 py-2 font-semibold text-cyan">
        Back Home
      </Link>
    </section>
  );
}