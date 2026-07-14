import { useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

function grouperParAnneeEtNom(liste, champNom) {
  const groupes = {};
  liste.forEach((item) => {
    const annee = item.annee || "Sans année";
    const nom = item[champNom] || "Anonyme";
    if (!groupes[annee]) groupes[annee] = {};
    if (!groupes[annee][nom]) groupes[annee][nom] = [];
    groupes[annee][nom].push(item);
  });
  return groupes;
}

function filtrerParRecherche(liste, recherche, champsTexte) {
  if (recherche.trim() === "") return liste;
  const r = recherche.toLowerCase();
  return liste.filter((item) =>
    champsTexte.some((champ) => (item[champ] || "").toString().toLowerCase().includes(r))
  );
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [access, setAccess] = useState(false);
  const ADMIN_PASSWORD = "patricia2026";

  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);
  const [livreDor, setLivreDor] = useState([]);
  const [citations, setCitations] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [motsDePat, setMotsDePat] = useState([]);

  const [rechercheMessages, setRechercheMessages] = useState("");
  const [rechercheImages, setRechercheImages] = useState("");
  const [rechercheLivreDor, setRechercheLivreDor] = useState("");
  const [rechercheMots, setRechercheMots] = useState("");

  const [nouvelleCitation, setNouvelleCitation] = useState("");
  const [tlDate, setTlDate] = useState("");
  const [tlTitre, setTlTitre] = useState("");
  const [tlDescription, setTlDescription] = useState("");

  function checkPassword() {
    if (password === ADMIN_PASSWORD) {
      setAccess(true);
    } else {
      alert("Mot de passe incorrect");
    }
  }

  async function chargerDonnees() {
    const messagesData = await getDocs(collection(db, "messages"));
    setMessages(messagesData.docs.map((d) => ({ id: d.id, ...d.data() })));

    const imagesData = await getDocs(collection(db, "images"));
    setImages(imagesData.docs.map((d) => ({ id: d.id, ...d.data() })));

    const livreData = await getDocs(collection(db, "livredor"));
    setLivreDor(livreData.docs.map((d) => ({ id: d.id, ...d.data() })));

    const citationsData = await getDocs(collection(db, "citations"));
    setCitations(citationsData.docs.map((d) => ({ id: d.id, ...d.data() })));

    const timelineData = await getDocs(collection(db, "timeline"));
    setTimeline(
      timelineData.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.date > b.date ? 1 : -1))
    );

    const playlistData = await getDocs(collection(db, "playlist"));
    setPlaylist(playlistData.docs.map((d) => ({ id: d.id, ...d.data() })));

    const motsData = await getDocs(collection(db, "motsdepat"));
    setMotsDePat(motsData.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => {
    if (!access) return;
    chargerDonnees();
  }, [access]);

  async function supprimerMessage(id) {
    if (!window.confirm("Supprimer ce message ?")) return;
    await deleteDoc(doc(db, "messages", id));
    setMessages(messages.filter((m) => m.id !== id));
  }

  async function supprimerImage(id) {
    if (!window.confirm("Supprimer cette image ?")) return;
    await deleteDoc(doc(db, "images", id));
    setImages(images.filter((i) => i.id !== id));
  }

  async function toggleApprobation(id, etatActuel) {
    await updateDoc(doc(db, "images", id), { approuve: !(etatActuel !== false) });
    setImages(images.map((i) => (i.id === id ? { ...i, approuve: !(etatActuel !== false) } : i)));
  }

  async function supprimerLivreDor(id) {
    if (!window.confirm("Supprimer cette page du Livre d'Or ?")) return;
    await deleteDoc(doc(db, "livredor", id));
    setLivreDor(livreDor.filter((p) => p.id !== id));
  }

  async function ajouterCitation() {
    if (nouvelleCitation.trim() === "") return;
    const docRef = await addDoc(collection(db, "citations"), { texte: nouvelleCitation.trim() });
    setCitations([...citations, { id: docRef.id, texte: nouvelleCitation.trim() }]);
    setNouvelleCitation("");
  }

  async function supprimerCitation(id) {
    await deleteDoc(doc(db, "citations", id));
    setCitations(citations.filter((c) => c.id !== id));
  }

  async function ajouterEvenement() {
    if (tlDate.trim() === "" || tlTitre.trim() === "") {
      alert("La date et le titre sont requis");
      return;
    }
    const nouvel = { date: tlDate, titre: tlTitre, description: tlDescription };
    const docRef = await addDoc(collection(db, "timeline"), nouvel);
    setTimeline(
      [...timeline, { id: docRef.id, ...nouvel }].sort((a, b) => (a.date > b.date ? 1 : -1))
    );
    setTlDate(""); setTlTitre(""); setTlDescription("");
  }

  async function supprimerEvenement(id) {
    await deleteDoc(doc(db, "timeline", id));
    setTimeline(timeline.filter((e) => e.id !== id));
  }

  async function supprimerPropositionMorceau(id) {
    await deleteDoc(doc(db, "playlist", id));
    setPlaylist(playlist.filter((p) => p.id !== id));
  }

  async function supprimerMotDePat(id) {
    if (!window.confirm("Supprimer ce souvenir ?")) return;
    await deleteDoc(doc(db, "motsdepat", id));
    setMotsDePat(motsDePat.filter((m) => m.id !== id));
  }

  const messagesFiltres = useMemo(
    () => filtrerParRecherche(messages, rechercheMessages, ["nom", "date", "texte"]),
    [messages, rechercheMessages]
  );
  const imagesFiltrees = useMemo(
    () => filtrerParRecherche(images, rechercheImages, ["auteur", "date"]),
    [images, rechercheImages]
  );
  const livreDorFiltre = useMemo(
    () => filtrerParRecherche(livreDor, rechercheLivreDor, ["nom", "date", "ville", "texte"]),
    [livreDor, rechercheLivreDor]
  );
  const motsFiltres = useMemo(
    () => filtrerParRecherche(motsDePat, rechercheMots, ["nom", "date", "texte"]),
    [motsDePat, rechercheMots]
  );

  const messagesGroupes = useMemo(() => grouperParAnneeEtNom(messagesFiltres, "nom"), [messagesFiltres]);
  const imagesGroupees = useMemo(() => grouperParAnneeEtNom(imagesFiltrees, "auteur"), [imagesFiltrees]);
  const livreDorGroupe = useMemo(() => grouperParAnneeEtNom(livreDorFiltre, "nom"), [livreDorFiltre]);
  const motsGroupes = useMemo(() => grouperParAnneeEtNom(motsFiltres, "nom"), [motsFiltres]);

  if (!access) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pine p-6">
        <div className="bg-white rounded-2xl p-10 w-full max-w-md">
          <h1 className="text-3xl font-display text-pine text-center mb-8">Administration</h1>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl border border-line mb-6 focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
          <button
            onClick={checkPassword}
            className="w-full py-4 rounded-xl bg-pine text-cream font-medium hover:bg-pine-soft transition"
          >
            Entrer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-display text-pine mb-12">Administration</h1>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-5 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-line">
            <h3 className="text-sm uppercase tracking-wide text-pine-soft">Messages</h3>
            <p className="text-3xl font-display text-terracotta mt-2">{messages.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-line">
            <h3 className="text-sm uppercase tracking-wide text-pine-soft">Livre d'or</h3>
            <p className="text-3xl font-display text-terracotta mt-2">{livreDor.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-line">
            <h3 className="text-sm uppercase tracking-wide text-pine-soft">Images</h3>
            <p className="text-3xl font-display text-terracotta mt-2">{images.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-line">
            <h3 className="text-sm uppercase tracking-wide text-pine-soft">Mots de Pat</h3>
            <p className="text-3xl font-display text-terracotta mt-2">{motsDePat.length}</p>
          </div>
        </div>

        {/* MODERATION IMAGES */}
        <div className="mb-20">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <h2 className="text-2xl font-display text-pine">Photos, par année et par personne</h2>
          </div>
          <p className="text-sm text-pine-soft mb-5">
            Les nouvelles photos sont masquées au public jusqu'à validation.
          </p>
          <input
            type="text"
            placeholder="Rechercher par nom ou date..."
            value={rechercheImages}
            onChange={(e) => setRechercheImages(e.target.value)}
            className="w-full p-3 rounded-xl border border-line mb-8 focus:outline-none focus:ring-1 focus:ring-terracotta"
          />

          {Object.keys(imagesGroupees).length === 0 && (
            <p className="text-pine-soft/60 text-sm">Aucun résultat.</p>
          )}

          {Object.keys(imagesGroupees).sort((a, b) => b - a).map((annee) => (
            <div key={annee} className="mb-10">
              <h3 className="text-lg font-display text-terracotta mb-4">{annee}</h3>
              {Object.keys(imagesGroupees[annee]).map((auteur) => (
                <div key={auteur} className="mb-6">
                  <p className="text-sm font-medium text-pine mb-3">{auteur}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {imagesGroupees[annee][auteur].map((img) => {
                      const approuvee = img.approuve !== false;
                      return (
                        <div key={img.id} className="bg-white rounded-2xl border border-line p-4">
                          <img src={img.url} alt="Souvenir" className="rounded-xl mb-3 w-full h-48 object-cover" />
                          <p className="text-xs text-pine-soft/70 mb-3">{img.date}</p>
                          <span
                            className={`inline-block text-xs px-2.5 py-1 rounded-full mb-3 ${
                              approuvee ? "bg-sage/20 text-pine" : "bg-honey/25 text-terracotta-dark"
                            }`}
                          >
                            {approuvee ? "Visible" : "En attente"}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleApprobation(img.id, img.approuve)}
                              className="flex-1 px-3 py-2 rounded-lg bg-pine text-cream text-xs font-medium hover:bg-pine-soft transition"
                            >
                              {approuvee ? "Masquer" : "Approuver"}
                            </button>
                            <button
                              onClick={() => supprimerImage(img.id)}
                              className="px-3 py-2 rounded-lg bg-terracotta text-cream text-xs font-medium hover:bg-terracotta-dark transition"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* CITATIONS */}
        <div className="mb-20">
          <h2 className="text-2xl font-display text-pine mb-2">Citations du jour</h2>
          <p className="text-sm text-pine-soft mb-6">
            Contrôlez les citations affichées sur la page d'accueil. Si vide, des citations par défaut sont utilisées.
          </p>
          <div className="bg-white rounded-2xl border border-line p-6 mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Nouvelle citation..."
                value={nouvelleCitation}
                onChange={(e) => setNouvelleCitation(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-line focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
              <button
                onClick={ajouterCitation}
                className="px-6 py-3 rounded-xl bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition"
              >
                Ajouter
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {citations.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-line p-4 flex justify-between items-center">
                <p className="text-pine-soft italic font-display">{c.texte}</p>
                <button
                  onClick={() => supprimerCitation(c.id)}
                  className="text-xs text-terracotta hover:text-terracotta-dark ml-4 shrink-0"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TIMELINE */}
        <div className="mb-20">
          <h2 className="text-2xl font-display text-pine mb-2">Frise chronologique</h2>
          <p className="text-sm text-pine-soft mb-6">Les grandes étapes affichées sur la page Jardin.</p>
          <div className="bg-white rounded-2xl border border-line p-6 mb-6 grid md:grid-cols-3 gap-3">
            <input
              type="date"
              value={tlDate}
              onChange={(e) => setTlDate(e.target.value)}
              className="p-3 rounded-xl border border-line focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
            <input
              type="text"
              placeholder="Titre de l'événement"
              value={tlTitre}
              onChange={(e) => setTlTitre(e.target.value)}
              className="p-3 rounded-xl border border-line focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
            <input
              type="text"
              placeholder="Description (optionnel)"
              value={tlDescription}
              onChange={(e) => setTlDescription(e.target.value)}
              className="p-3 rounded-xl border border-line focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
            <button
              onClick={ajouterEvenement}
              className="md:col-span-3 px-6 py-3 rounded-xl bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition"
            >
              Ajouter à la frise
            </button>
          </div>
          <div className="space-y-2">
            {timeline.map((ev) => (
              <div key={ev.id} className="bg-white rounded-xl border border-line p-4 flex justify-between items-center">
                <div>
                  <span className="text-xs uppercase tracking-wide text-terracotta">{ev.date}</span>
                  <p className="font-display text-pine">{ev.titre}</p>
                  {ev.description && <p className="text-sm text-pine-soft/70">{ev.description}</p>}
                </div>
                <button
                  onClick={() => supprimerEvenement(ev.id)}
                  className="text-xs text-terracotta hover:text-terracotta-dark ml-4 shrink-0"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PLAYLIST */}
        <div className="mb-20">
          <h2 className="text-2xl font-display text-pine mb-2">Morceaux proposés</h2>
          <p className="text-sm text-pine-soft mb-6">Suggestions envoyées via le lecteur de musique.</p>
          <div className="space-y-2">
            {playlist.length === 0 && <p className="text-pine-soft/60 text-sm">Aucune proposition pour l'instant.</p>}
            {playlist.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-line p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-pine">{p.titre}</p>
                  <p className="text-xs text-pine-soft/70">Proposé par {p.proposePar} — {p.date}</p>
                </div>
                <button
                  onClick={() => supprimerPropositionMorceau(p.id)}
                  className="text-xs text-terracotta hover:text-terracotta-dark ml-4 shrink-0"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* MESSAGES */}
        <div className="mb-20">
          <h2 className="text-2xl font-display text-pine mb-2">Messages, par année et par personne</h2>
          <input
            type="text"
            placeholder="Rechercher par nom, date ou contenu..."
            value={rechercheMessages}
            onChange={(e) => setRechercheMessages(e.target.value)}
            className="w-full p-3 rounded-xl border border-line mb-8 mt-4 focus:outline-none focus:ring-1 focus:ring-terracotta"
          />

          {Object.keys(messagesGroupes).length === 0 && (
            <p className="text-pine-soft/60 text-sm">Aucun résultat.</p>
          )}

          {Object.keys(messagesGroupes).sort((a, b) => b - a).map((annee) => (
            <div key={annee} className="mb-10">
              <h3 className="text-lg font-display text-terracotta mb-4">{annee}</h3>
              {Object.keys(messagesGroupes[annee]).map((nom) => (
                <div key={nom} className="mb-6">
                  <p className="text-sm font-medium text-pine mb-3">{nom}</p>
                  <div className="space-y-4">
                    {messagesGroupes[annee][nom].map((msg) => (
                      <div key={msg.id} className="bg-white rounded-2xl border border-line p-6">
                        <p className="text-pine-soft mb-2">{msg.texte}</p>
                        <p className="text-xs text-pine-soft/60 mb-4">{msg.date}</p>
                        <button
                          onClick={() => supprimerMessage(msg.id)}
                          className="px-4 py-2 rounded-lg bg-terracotta text-cream text-xs font-medium hover:bg-terracotta-dark transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* LES MOTS DE PAT */}
        <div className="mb-20">
          <h2 className="text-2xl font-display text-pine mb-2">Les mots de Pat, par année et par personne</h2>
          <input
            type="text"
            placeholder="Rechercher par nom, date ou contenu..."
            value={rechercheMots}
            onChange={(e) => setRechercheMots(e.target.value)}
            className="w-full p-3 rounded-xl border border-line mb-8 mt-4 focus:outline-none focus:ring-1 focus:ring-terracotta"
          />

          {Object.keys(motsGroupes).length === 0 && (
            <p className="text-pine-soft/60 text-sm">Aucun résultat.</p>
          )}

          {Object.keys(motsGroupes).sort((a, b) => b - a).map((annee) => (
            <div key={annee} className="mb-10">
              <h3 className="text-lg font-display text-terracotta mb-4">{annee}</h3>
              {Object.keys(motsGroupes[annee]).map((nom) => (
                <div key={nom} className="mb-6">
                  <p className="text-sm font-medium text-pine mb-3">{nom}</p>
                  <div className="space-y-4">
                    {motsGroupes[annee][nom].map((entree) => (
                      <div key={entree.id} className="bg-white rounded-2xl border border-line p-6">
                        <p className="text-pine-soft italic font-display mb-2">"{entree.texte}"</p>
                        <p className="text-xs text-pine-soft/60 mb-4">{entree.date} — {entree.coeurs || 0} cœur(s)</p>
                        <button
                          onClick={() => supprimerMotDePat(entree.id)}
                          className="px-4 py-2 rounded-lg bg-terracotta text-cream text-xs font-medium hover:bg-terracotta-dark transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* LIVRE D'OR */}
        <div>
          <h2 className="text-2xl font-display text-pine mb-2">Livre d'or, par année et par personne</h2>
          <input
            type="text"
            placeholder="Rechercher par nom, ville, date ou contenu..."
            value={rechercheLivreDor}
            onChange={(e) => setRechercheLivreDor(e.target.value)}
            className="w-full p-3 rounded-xl border border-line mb-8 mt-4 focus:outline-none focus:ring-1 focus:ring-terracotta"
          />

          {Object.keys(livreDorGroupe).length === 0 && (
            <p className="text-pine-soft/60 text-sm">Aucun résultat.</p>
          )}

          {Object.keys(livreDorGroupe).sort((a, b) => b - a).map((annee) => (
            <div key={annee} className="mb-10">
              <h3 className="text-lg font-display text-terracotta mb-4">{annee}</h3>
              {Object.keys(livreDorGroupe[annee]).map((nom) => (
                <div key={nom} className="mb-6">
                  <p className="text-sm font-medium text-pine mb-3">{nom}</p>
                  <div className="space-y-4">
                    {livreDorGroupe[annee][nom].map((page) => (
                      <div key={page.id} className="bg-white rounded-2xl border border-line p-6">
                        {page.ville && <p className="text-sage text-sm mb-2">{page.ville}</p>}
                        <p className="text-pine-soft mb-2">{page.texte}</p>
                        <p className="text-pine-soft/60 text-xs mb-4">
                          {page.date}
                          {page.dateRevelation ? ` — capsule révélée le ${new Date(page.dateRevelation).toLocaleDateString("fr-FR")}` : ""}
                        </p>
                        <button
                          onClick={() => supprimerLivreDor(page.id)}
                          className="px-4 py-2 rounded-lg bg-terracotta text-cream text-xs font-medium hover:bg-terracotta-dark transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}