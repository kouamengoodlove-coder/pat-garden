import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function MotsDePat() {
  const aujourdHui = new Date();
  const jour = aujourdHui.getDate();
  const mois = aujourdHui.getMonth() + 1;
  const jardinOuvert = mois === 7 && jour >= 10 && jour <= 25;

  const [nom, setNom] = useState("");
  const [texte, setTexte] = useState("");
  const [entrees, setEntrees] = useState([]);
  const [formOuvert, setFormOuvert] = useState(false);

  const collectionMots = collection(db, "motsdepat");

  useEffect(() => {
    async function charger() {
      const data = await getDocs(collectionMots);
      const liste = data.docs.map((d) => ({ id: d.id, ...d.data() }));
      liste.sort((a, b) => (a.date < b.date ? 1 : -1));
      setEntrees(liste);
    }
    charger();
  }, []);

  async function publier() {
    if (nom.trim() === "" || texte.trim() === "") {
      alert("Dis-nous qui tu es et partage ton souvenir");
      return;
    }
    const nouvelle = {
      nom,
      texte,
      date: new Date().toLocaleDateString("fr-FR"),
      annee: new Date().getFullYear(),
      coeurs: 0,
    };
    const docRef = await addDoc(collectionMots, nouvelle);
    setEntrees([{ id: docRef.id, ...nouvelle }, ...entrees]);
    setNom("");
    setTexte("");
    setFormOuvert(false);
  }

  async function ajouterCoeur(id) {
    await updateDoc(doc(db, "motsdepat", id), { coeurs: increment(1) });
    setEntrees(entrees.map((e) => (e.id === id ? { ...e, coeurs: (e.coeurs || 0) + 1 } : e)));
  }

  function rotation(index) {
    const valeurs = ["-1.5deg", "1deg", "-1deg", "1.5deg", "-0.5deg"];
    return valeurs[index % valeurs.length];
  }

  return (
    <div className="min-h-screen bg-cream py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest text-terracotta font-medium">
            Un recueil pour Patricia
          </span>
          <h1 className="text-4xl md:text-5xl font-display text-pine mt-3 mb-6">
            Les mots de Pat
          </h1>
          <p className="font-display italic text-xl text-pine-soft max-w-xl mx-auto leading-relaxed">
            Quel conseil, quelle phrase de Pat t'a marqué·e au bon moment ?
          </p>
        </div>

        {jardinOuvert ? (
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setFormOuvert(!formOuvert)}
              className="px-8 py-3.5 rounded-full bg-terracotta hover:bg-terracotta-dark text-cream font-medium transition"
            >
              {formOuvert ? "Fermer" : "Partager un souvenir"}
            </button>
          </div>
        ) : (
          <div className="bg-honey/10 border border-honey/40 rounded-xl p-5 mb-12 text-center text-sm text-terracotta-dark">
            Le jardin est actuellement fermé — reviens du 10 au 25 juillet pour partager un souvenir.
          </div>
        )}

        {formOuvert && jardinOuvert && (
          <div className="bg-white rounded-2xl border border-line p-8 mb-14">
            <h2 className="text-lg font-display text-pine mb-5">Ton souvenir</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ton prénom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full p-4 rounded-xl border border-line focus:outline-none focus:ring-1 focus:ring-terracotta text-pine"
              />
              <textarea
                placeholder="Quel conseil ou quelle phrase de Pat t'a marqué·e ?"
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                className="w-full p-4 rounded-xl border border-line h-36 resize-none focus:outline-none focus:ring-1 focus:ring-terracotta text-pine"
              />
              <div className="flex justify-end">
                <button
                  onClick={publier}
                  className="px-8 py-3 rounded-xl bg-terracotta hover:bg-terracotta-dark text-cream font-medium transition"
                >
                  Publier
                </button>
              </div>
            </div>
          </div>
        )}

        {entrees.length === 0 && (
          <p className="text-center text-pine-soft/60 py-10">
            Sois le premier à partager un souvenir des mots de Pat.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-7">
          {entrees.map((entree, index) => (
            <div
              key={entree.id}
              className="bg-white border border-line rounded-lg p-7 shadow-sm"
              style={{ transform: `rotate(${rotation(index)})` }}
            >
              <span className="font-display text-3xl text-terracotta leading-none block mb-2">
                "
              </span>
              <p className="font-display italic text-lg text-pine leading-snug mb-5">
                {entree.texte}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-pine">{entree.nom}</p>
                  <p className="text-xs text-pine-soft/60">{entree.date}</p>
                </div>
                <button
                  onClick={() => ajouterCoeur(entree.id)}
                  className="px-3 py-1.5 rounded-full text-xs bg-cream border border-line text-pine-soft hover:bg-cream-dark transition"
                  title="cœur"
                >
                  {entree.coeurs || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}