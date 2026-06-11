import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const liens = [
    { to: "/", label: "🏠 Accueil" },
    { to: "/garden", label: "🌸 Jardin" },
    { to: "/souvenirs", label: "📚 Souvenirs" },
    { to: "/livredor", label: "📖 Livre d'Or" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-pink-600 font-semibold text-lg">🌸 Patricia</span>

        {/* Desktop */}
        <div className="hidden md:flex gap-2">
          {liens.map((l) => (
            <Link key={l.to} to={l.to}>
              <button className={`px-4 py-2 rounded-xl text-sm font-medium transition hover:scale-105 ${
                pathname === l.to
                  ? "bg-pink-500 text-white shadow"
                  : "bg-pink-50 text-pink-700 hover:bg-pink-100"
              }`}>
                {l.label}
              </button>
            </Link>
          ))}
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden px-3 py-2 rounded-xl bg-pink-50 text-pink-700 text-xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {open && (
        <div className="md:hidden flex flex-col gap-2 px-4 pb-4 bg-white/95">
          {liens.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
              <button className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
                pathname === l.to
                  ? "bg-pink-500 text-white"
                  : "bg-pink-50 text-pink-700"
              }`}>
                {l.label}
              </button>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}