import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Timeline() {
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function charger() {
      const q = query(collection(db, "timeline"), orderBy("date", "asc"));
      const data = await getDocs(q);
      setEvenements(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setChargement(false);
    }
    charger();
  }, []);

  if (chargement) return null;
  if (evenements.length === 0) return null;

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-display text-pine text-center mb-12">
        La frise du jardin
      </h2>
      <div className="max-w-2xl mx-auto relative pl-8 border-l-2 border-line">
        {evenements.map((ev) => (
          <div key={ev.id} className="relative mb-10 last:mb-0">
            <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-terracotta border-2 border-cream" />
            <span className="text-xs uppercase tracking-wide text-terracotta font-medium">
              {ev.date}
            </span>
            <h3 className="font-display text-xl text-pine mt-1 mb-1">{ev.titre}</h3>
            {ev.description && (
              <p className="text-pine-soft text-sm leading-relaxed">{ev.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
