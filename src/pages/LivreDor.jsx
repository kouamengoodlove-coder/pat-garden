import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function LivreDor() {
  const [nom, setNom] = useState("");
  const [ville, setVille] = useState("");
  const [message, setMessage] = useState("");
  const [pages, setPages] = useState([]);
  const [pageActuelle, setPageActuelle] = useState(0);

  const collectionLivre = collection(db, "livredor");

  useEffect(() => {
    async function chargerLivre() {
      const data = await getDocs(collectionLivre);

      const liste = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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

    const existe = pages.some(
      (page) =>
        page.nom &&
        page.nom.toLowerCase().trim() === nom.toLowerCase().trim()
    );

    if (existe) {
      alert("Vous avez déjà signé le Livre d'Or 🌸");
      return;
    }

    const nouvellePage = {
      nom,
      ville,
      texte: message,
      date: new Date().toLocaleDateString("fr-FR"),
      annee: new Date().getFullYear(),
    };

    const docRef = await addDoc(collectionLivre, nouvellePage);

    const nouvelleListe = [
      ...pages,
      { id: docRef.id, ...nouvellePage },
    ];

    setPages(nouvelleListe);
    setPageActuelle(nouvelleListe.length - 1);

    setNom("");
    setVille("");
    setMessage("");

    alert("Merci d'avoir signé le Livre d'Or 🌸");
  }

  const page = pages[pageActuelle];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-center text-pink-700 mb-8">
          📖 Livre d'Or de Patricia
        </h1>

        <div className="flex justify-center mb-10">
          <Link to="/garden">
            <button className="px-6 py-3 rounded-2xl bg-white shadow-lg hover:scale-105 transition">
              🌸 Retour au Jardin
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12">
          <h2 className="text-3xl font-semibold text-pink-600 mb-6">
            ✍️ Signer le Livre d'Or
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Votre nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full p-4 rounded-2xl border"
            />

            <input
              type="text"
              placeholder="Ville (facultatif)"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="w-full p-4 rounded-2xl border"
            />

            <textarea
              placeholder="Votre mot pour Patricia..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 rounded-2xl border h-40"
            />

            <button
              onClick={signerLivre}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-green-500 text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              Ajouter une page 📖
            </button>
          </div>
        </div>

        {pages.length > 0 && page && (
          <div className="relative pb-24">

            <div className="absolute -top-6 left-6 text-5xl">🌿🌸</div>
            <div className="absolute -top-6 right-6 text-5xl">🌸🌿</div>

            <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 rounded-3xl min-h-[600px] overflow-hidden border border-amber-200 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">

              <div className="absolute top-0 right-16 w-6 h-40 bg-gradient-to-b from-pink-400 to-pink-600 rounded-b-xl shadow-lg"></div>

              <div className="absolute top-0 bottom-0 left-8 w-5 bg-gradient-to-b from-pink-300 via-pink-600 to-pink-300 rounded-full shadow-inner"></div>

              <div className="absolute inset-0 opacity-5 flex items-center justify-center text-[200px]">
                🌸
              </div>

              <div className="relative pl-20 pr-10 py-12">
                <h2 className="text-4xl font-bold text-pink-700 mb-4">
                  🌸 {page.nom}
                </h2>

                {page.ville && (
                  <p className="text-green-700 text-lg mb-8">
                    📍 {page.ville}
                  </p>
                )}

                <div className="min-h-[250px]">
                  <p className="text-gray-700 text-2xl leading-relaxed whitespace-pre-wrap">
                    {page.texte}
                  </p>
                </div>

                <div className="mt-16 text-right text-gray-500 italic">
                  📅 {page.date}
                </div>
              </div>
            </div>

            <div className="absolute bottom-32 left-6 text-5xl">🌿🌸</div>
            <div className="absolute bottom-32 right-6 text-5xl">🌸🌿</div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() =>
                  setPageActuelle(Math.max(pageActuelle - 1, 0))
                }
                className="px-8 py-4 rounded-2xl bg-white shadow-lg"
              >
                ⬅️ Page précédente
              </button>

              <div className="bg-white px-6 py-3 rounded-2xl shadow font-semibold text-pink-700">
                📖 Page {pageActuelle + 1} sur {pages.length}
              </div>

              <button
                onClick={() =>
                  setPageActuelle(
                    Math.min(pageActuelle + 1, pages.length - 1)
                  )
                }
                className="px-8 py-4 rounded-2xl bg-white shadow-lg"
              >
                Page suivante ➡️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
