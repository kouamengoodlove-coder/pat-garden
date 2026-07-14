import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function LivreDor() {
  const aujourdHui = new Date();
  const jour = aujourdHui.getDate();
  const mois = aujourdHui.getMonth() + 1;
  const jardinOuvert = mois === 7 && jour >= 10 && jour <= 25;

  const [nom, setNom] = useState("");
  const [ville, setVille] = useState("");
  const [message, setMessage] = useState("");
  const [dateRevelation, setDateRevelation] = useState("");
  const [pages, setPages] = useState([]);
  const [pageActuelle, setPageActuelle] = useState(0);
  const [formOuvert, setFormOuvert] = useState(false);

  const collectionLivre = collection(db, "livredor");

  useEffect(() => {
    async function chargerLivre() {
      const data = await getDocs(collectionLivre);
      const liste = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      liste.sort((a, b) => (a.date < b.date ? 1 : -1));
      setPages(liste);
    }
    chargerLivre();
  }, []);

  const aujourdHuiISO = new Date().toISOString().slice(0, 10);

  const pagesVisibles = pages.filter(
    (p) => !p.dateRevelation || p.dateRevelation <= aujourdHuiISO
  );
  const capsulesEnAttente = pages.filter(
    (p) => p.dateRevelation && p.dateRevelation > aujourdHuiISO
  );

  async function signerLivre() {
    if (nom.trim() === "" || message.trim() === "") {
      alert("Veuillez remplir le nom et le message");
      return;
    }
    const existe = pages.some((p) => p.nom?.toLowerCase().trim() === nom.toLowerCase().trim());
    if (existe) {
      alert("Vous avez déjà signé le Livre d'Or");
      return;
    }
    const nouvellePage = {
      nom, ville, texte: message,
      date: new Date().toLocaleDateString("fr-FR"),
      annee: new Date().getFullYear(),
      dateRevelation: dateRevelation || null,
      likes: 0, fleurs: 0, etoiles: 0,
    };
    const docRef = await addDoc(collectionLivre, nouvellePage);
    const nouvelleListe = [...pages, { id: docRef.id, ...nouvellePage }];
    setPages(nouvelleListe);
    setNom(""); setVille(""); setMessage(""); setDateRevelation("");
    setFormOuvert(false);
    alert(
      dateRevelation
        ? "Merci ! Votre message sera révélé le " + new Date(dateRevelation).toLocaleDateString("fr-FR")
        : "Merci d'avoir signé le Livre d'Or"
    );
  }

  async function ajouterReaction(id, type) {
    const pageRef = doc(db, "livredor", id);
    await updateDoc(pageRef, { [type]: increment(1) });
    setPages(pages.map((p) => (p.id === id ? { ...p, [type]: (p[type] || 0) + 1 } : p)));
  }

  const page = pagesVisibles[pageActuelle];
  const total = pagesVisibles.length;

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-terracotta text-xs font-medium tracking-widest uppercase mb-2">Livre d'or</p>
          <h1 className="text-4xl font-display text-pine mb-3">Les mots de nos invités</h1>
          <p className="text-pine-soft">Chaque signature est un souvenir précieux pour Patricia</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl p-5 text-center border border-line">
            <p className="text-3xl font-display text-terracotta">{total}</p>
            <p className="text-xs text-pine-soft/70 mt-1">Signatures</p>
          </div>
          <div className="bg-white rounded-xl p-5 text-center border border-line">
            <p className="text-3xl font-display text-terracotta">
              {[...new Set(pagesVisibles.map((p) => p.ville).filter(Boolean))].length}
            </p>
            <p className="text-xs text-pine-soft/70 mt-1">Villes</p>
          </div>
          <div className="bg-white rounded-xl p-5 text-center border border-line">
            <p className="text-3xl font-display text-terracotta">
              {[...new Set(pagesVisibles.map((p) => p.annee))].length}
            </p>
            <p className="text-xs text-pine-soft/70 mt-1">Années</p>
          </div>
        </div>

        {capsulesEnAttente.length > 0 && (
          <div className="bg-honey/10 border border-honey/40 rounded-xl p-4 mb-8 text-center text-sm text-terracotta-dark">
            {capsulesEnAttente.length} message{capsulesEnAttente.length > 1 ? "s" : ""} en capsule temporelle,
            {" "}pas encore révélé{capsulesEnAttente.length > 1 ? "s" : ""}.
          </div>
        )}

        {jardinOuvert ? (
          <div className="flex justify-center mb-10">
            <button
              onClick={() => setFormOuvert(!formOuvert)}
              className="px-8 py-3.5 rounded-full bg-terracotta hover:bg-terracotta-dark text-cream font-medium transition"
            >
              {formOuvert ? "Fermer" : "Signer le livre d'or"}
            </button>
          </div>
        ) : (
          <div className="bg-honey/10 border border-honey/40 rounded-xl p-5 mb-10 text-center text-sm text-terracotta-dark">
            Le jardin est actuellement fermé — reviens du 10 au 25 juillet pour signer le Livre d'or.
          </div>
        )}

        {formOuvert && jardinOuvert && (
          <div className="bg-white rounded-2xl border border-line p-8 mb-10">
            <h2 className="text-xl font-display text-pine mb-6">Votre signature</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Votre nom *"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full p-4 rounded-xl border border-line focus:outline-none focus:ring-1 focus:ring-terracotta text-pine"
                />
                <input
                  type="text"
                  placeholder="Votre ville (facultatif)"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="w-full p-4 rounded-xl border border-line focus:outline-none focus:ring-1 focus:ring-terracotta text-pine"
                />
              </div>
              <textarea
                placeholder="Votre mot pour Patricia..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 rounded-xl border border-line h-36 resize-none focus:outline-none focus:ring-1 focus:ring-terracotta text-pine"
              />
              <div>
                <label className="text-sm text-pine-soft block mb-2">
                  Révéler ce message à une date précise (optionnel — capsule temporelle)
                </label>
                <input
                  type="date"
                  value={dateRevelation}
                  onChange={(e) => setDateRevelation(e.target.value)}
                  className="p-3 rounded-xl border border-line text-pine text-sm focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={signerLivre}
                  className="px-8 py-3 rounded-xl bg-terracotta hover:bg-terracotta-dark text-cream font-medium transition"
                >
                  Publier
                </button>
              </div>
            </div>
          </div>
        )}

        {total > 0 && page && (
          <div className="bg-white rounded-2xl border border-line overflow-hidden">
            <div className="h-1 bg-cream-dark">
              <div
                className="h-1 bg-terracotta transition-all duration-500"
                style={{ width: `${((pageActuelle + 1) / total) * 100}%` }}
              />
            </div>

            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-terracotta/15 flex items-center justify-center text-xl font-display text-terracotta-dark">
                  {page.nom?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-display text-pine">{page.nom}</h2>
                  {page.ville && <p className="text-sm text-pine-soft/70">{page.ville}</p>}
                </div>
                <span className="ml-auto text-xs text-pine-soft/50">{page.date}</span>
              </div>

              <blockquote className="text-pine-soft text-lg leading-relaxed italic font-display border-l-2 border-terracotta/40 pl-6 min-h-[100px]">
                "{page.texte}"
              </blockquote>

              <div className="flex gap-2 mt-6">
                {[
                  { type: "likes", label: "cœur", count: page.likes },
                  { type: "fleurs", label: "fleur", count: page.fleurs },
                  { type: "etoiles", label: "étoile", count: page.etoiles },
                ].map(({ type, label, count }) => (
                  <button
                    key={type}
                    onClick={() => ajouterReaction(page.id, type)}
                    className="px-3 py-1.5 rounded-full text-xs bg-cream border border-line text-pine-soft hover:bg-cream-dark transition"
                    title={label}
                  >
                    {count || 0}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-line px-8 py-5 flex items-center justify-between">
              <button
                onClick={() => setPageActuelle(Math.max(pageActuelle - 1, 0))}
                disabled={pageActuelle === 0}
                className="px-5 py-2 rounded-xl text-sm font-medium text-pine-soft hover:bg-cream disabled:opacity-30 transition"
              >
                ← Précédent
              </button>
              <span className="text-sm text-pine-soft/60 font-medium">
                {pageActuelle + 1} / {total}
              </span>
              <button
                onClick={() => setPageActuelle(Math.min(pageActuelle + 1, total - 1))}
                disabled={pageActuelle === total - 1}
                className="px-5 py-2 rounded-xl text-sm font-medium text-pine-soft hover:bg-cream disabled:opacity-30 transition"
              >
                Suivant →
              </button>
            </div>
          </div>
        )}

        {total === 0 && (
          <div className="text-center py-20 text-pine-soft/50">
            <p className="text-lg">Sois le premier à signer !</p>
          </div>
        )}
      </div>
    </div>
  );
}