import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function LivreDor() {
  const [nom, setNom] = useState("");
  const [ville, setVille] = useState("");
  const [message, setMessage] = useState("");
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

  async function signerLivre() {
    if (nom.trim() === "" || message.trim() === "") {
      alert("Veuillez remplir le nom et le message 🌸");
      return;
    }
    const existe = pages.some((p) => p.nom?.toLowerCase().trim() === nom.toLowerCase().trim());
    if (existe) {
      alert("Vous avez déjà signé le Livre d'Or 🌸");
      return;
    }
    const nouvellePage = {
      nom, ville, texte: message,
      date: new Date().toLocaleDateString("fr-FR"),
      annee: new Date().getFullYear(),
    };
    const docRef = await addDoc(collectionLivre, nouvellePage);
    const nouvelleListe = [...pages, { id: docRef.id, ...nouvellePage }];
    setPages(nouvelleListe);
    setPageActuelle(nouvelleListe.length - 1);
    setNom(""); setVille(""); setMessage("");
    setFormOuvert(false);
    alert("Merci d'avoir signé le Livre d'Or 🌸");
  }

  const page = pages[pageActuelle];
  const total = pages.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <p className="text-pink-400 text-sm font-medium tracking-widest uppercase mb-2">Livre d'Or</p>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Les mots de nos invités</h1>
          <p className="text-gray-400">Chaque signature est un souvenir précieux pour Patricia</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-pink-500">{total}</p>
            <p className="text-xs text-gray-400 mt-1">Signatures</p>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-pink-500">
              {[...new Set(pages.map((p) => p.ville).filter(Boolean))].length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Villes</p>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-pink-500">
              {[...new Set(pages.map((p) => p.annee))].length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Années</p>
          </div>
        </div>

        {/* BOUTON SIGNER */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setFormOuvert(!formOuvert)}
            className="px-8 py-4 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            {formOuvert ? "✕ Fermer" : "✍️ Signer le Livre d'Or"}
          </button>
        </div>

        {/* FORMULAIRE (accordéon) */}
        {formOuvert && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Votre signature</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Votre nom *"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
                />
                <input
                  type="text"
                  placeholder="Votre ville (facultatif)"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
                />
              </div>
              <textarea
                placeholder="Votre mot pour Patricia..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-200 h-36 resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
              />
              <div className="flex justify-end">
                <button
                  onClick={signerLivre}
                  className="px-8 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold transition"
                >
                  Publier 🌸
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LECTEUR DE PAGES */}
        {total > 0 && page && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

            {/* BARRE DE PROGRESSION */}
            <div className="h-1 bg-gray-100">
              <div
                className="h-1 bg-pink-400 transition-all duration-500"
                style={{ width: `${((pageActuelle + 1) / total) * 100}%` }}
              />
            </div>

            <div className="p-8 md:p-12">

              {/* AUTEUR */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-2xl font-bold text-pink-500">
                  {page.nom?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{page.nom}</h2>
                  {page.ville && (
                    <p className="text-sm text-gray-400">📍 {page.ville}</p>
                  )}
                </div>
                <span className="ml-auto text-xs text-gray-300">{page.date}</span>
              </div>

              {/* MESSAGE */}
              <blockquote className="text-gray-600 text-lg leading-relaxed italic border-l-4 border-pink-200 pl-6 min-h-[120px]">
                "{page.texte}"
              </blockquote>

            </div>

            {/* NAVIGATION */}
            <div className="border-t border-gray-50 px-8 py-5 flex items-center justify-between">
              <button
                onClick={() => setPageActuelle(Math.max(pageActuelle - 1, 0))}
                disabled={pageActuelle === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
              >
                ← Précédent
              </button>

              <span className="text-sm text-gray-300 font-medium">
                {pageActuelle + 1} / {total}
              </span>

              <button
                onClick={() => setPageActuelle(Math.min(pageActuelle + 1, total - 1))}
                disabled={pageActuelle === total - 1}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
              >
                Suivant →
              </button>
            </div>
          </div>
        )}

        {total === 0 && (
          <div className="text-center py-20 text-gray-300">
            <p className="text-5xl mb-4">🌸</p>
            <p className="text-lg">Sois le premier à signer !</p>
          </div>
        )}

      </div>
    </div>
  );
}