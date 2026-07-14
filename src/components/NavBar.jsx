import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const liens = [
    { to: "/", label: "Accueil" },
    { to: "/garden", label: "Jardin" },
    { to: "/souvenirs", label: "Souvenirs" },
    { to: "/livredor", label: "Livre d'or" },
    { to: "/motsdepat", label: "Les mots de Pat" },
  ];

  // Ferme automatiquement le menu quand on change de page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Empêche le scroll du fond quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-line">
      <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
        <Link to="/" className="font-display italic text-xl text-pine">
          Le Jardin de Patricia
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-1">
          {liens.map((l) => (
            <Link key={l.to} to={l.to}>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  pathname === l.to
                    ? "bg-pine text-cream"
                    : "text-pine-soft hover:bg-cream-dark"
                }`}
              >
                {l.label}
              </button>
            </Link>
          ))}
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-full border border-line active:bg-cream-dark"
          onClick={() => setOpen(!open)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
        >
          <span
            className={`block w-5 h-0.5 bg-pine rounded-full transition-transform duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-pine rounded-full transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-pine rounded-full transition-transform duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Fond assombri derrière le menu mobile */}
      <div
        className={`md:hidden fixed inset-0 top-[57px] bg-pine/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Panneau du menu mobile */}
      <div
        className={`md:hidden fixed top-[57px] left-0 right-0 bg-cream border-b border-line overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {liens.map((l) => (
            <Link key={l.to} to={l.to}>
              <button
                className={`w-full text-left px-4 py-3.5 rounded-xl text-base font-medium transition active:scale-[0.98] ${
                  pathname === l.to
                    ? "bg-pine text-cream"
                    : "text-pine-soft active:bg-cream-dark"
                }`}
              >
                {l.label}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}