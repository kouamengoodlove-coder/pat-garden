function IconCoeur() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2.3 5 6 5c2 0 3.5 1.1 4.3 2.4.2.3.7.3.9 0C12 6.1 13.5 5 15.5 5c3.7 0 5.5 3.4 4 6.8-2.5 4.6-10 9.2-10 9.2z" />
    </svg>
  );
}

function IconFleur() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 9.4C10.5 8 10 5.8 11.2 4.3c1.3-1.5 3.6-1.2 4.5.5.8 1.6 0 3.5-1.5 4.4" />
      <path d="M14.6 12c1.4-1.5 3.6-2 5.1-.8 1.5 1.3 1.2 3.6-.5 4.5-1.6.8-3.5 0-4.4-1.5" />
      <path d="M12 14.6c1.5 1.4 2 3.6.8 5.1-1.3 1.5-3.6 1.2-4.5-.5-.8-1.6 0-3.5 1.5-4.4" />
      <path d="M9.4 12c-1.4 1.5-3.6 2-5.1.8-1.5-1.3-1.2-3.6.5-4.5 1.6-.8 3.5 0 4.4 1.5" />
    </svg>
  );
}

function IconEtoile() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.1 6-.7z" />
    </svg>
  );
}

const REACTIONS = [
  { type: "likes", label: "cœur", Icon: IconCoeur },
  { type: "fleurs", label: "fleur", Icon: IconFleur },
  { type: "etoiles", label: "étoile", Icon: IconEtoile },
];

export default function ReactionButtons({ item, onReagir, size = "normal" }) {
  const padding = size === "small" ? "px-2 py-1" : "px-2.5 py-1.5";

  return (
    <div className="flex gap-1.5">
      {REACTIONS.map(({ type, label, Icon }) => {
        const count = item[type] || 0;
        return (
          <button
            key={type}
            onClick={() => onReagir(item.id, type)}
            className={`${padding} rounded-full text-xs flex items-center gap-1.5 transition border ${
              count > 0
                ? "bg-terracotta/10 border-terracotta/30 text-terracotta-dark"
                : "bg-cream border-line text-pine-soft hover:bg-cream-dark"
            }`}
            title={label}
            aria-label={label}
          >
            <Icon />
            <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
}