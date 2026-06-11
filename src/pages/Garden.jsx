import GardenHeader from "../components/GardenHeader";
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Petals from "../components/Petals";
import UploadImage from "../components/UploadImage";

// Formes SVG pour les images
const FORMES = [
  // Coeur
  "polygon(50% 0%, 100% 35%, 100% 70%, 50% 100%, 0% 70%, 0% 35%)",
  // Fleur 6 pétales
  "polygon(50% 0%, 65% 25%, 100% 25%, 80% 50%, 100% 75%, 65% 75%, 50% 100%, 35% 75%, 0% 75%, 20% 50%, 0% 25%, 35% 25%)",
  // Étoile 5 branches
  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
];

const formeCoeur = `path('M 50,30 A 20,20,0,0,1,90,30 A 20,20,0,0,1,130,30 Q 130,60,50,90 Q -30,60,-30,30 A 20,20,0,0,1,10,30 A 20,20,0,0,1,50,30 Z')`;

const CLIPS = [
  // Coeur (via clip-path url SVG inline)
  "heart",
  // Fleur
  "flower",
  // Étoile
  "star",
];

export default function Garden() {

  const aujourdHui = new Date();
  const jour = aujourdHui.getDate();
  const mois = aujourdHui.getMonth() + 1;
  const anneeActuelle = aujourdHui.getFullYear();

  const jardinOuvert = mois === 6 && jour >= 1 && jour <= 20;

  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);
  const [formOuvert, setFormOuvert] = useState(false);
  const [uploadOuvert, setUploadOuvert] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const messagesCollection = collection(db, "messages");

  useEffect(() => {
    async function chargerDonnees() {
      const data = await getDocs(messagesCollection);
      const liste = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filtres = liste.filter((msg) => msg.annee === anneeActuelle);
      setMessages(filtres.slice(0, 3));

      const imagesData = await getDocs(collection(db, "images"));
      const listeImages = imagesData.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const imagesAnnee = listeImages
        .filter((img) => img.annee === anneeActuelle)
        .slice(0, 3);
      setImages(imagesAnnee);
    }
    chargerDonnees();
  }, []);

  async function publierMessage() {
    if (nom === "" || message === "") {
      alert("Veuillez remplir tous les champs 🌸");
      return;
    }
    const nouvelleDate = new Date().toLocaleDateString("fr-FR");
    const nouveauMessage = {
      nom, texte: message, date: nouvelleDate,
      annee: anneeActuelle, likes: 0, fleurs: 0, etoiles: 0
    };
    const docRef = await addDoc(messagesCollection, nouveauMessage);
    setMessages([{ id: docRef.id, ...nouveauMessage }, ...messages].slice(0, 3));
    setNom(""); setMessage(""); setFormOuvert(false);
  }

  async function ajouterReaction(id, type) {
    const messageRef = doc(db, "messages", id);
    await updateDoc(messageRef, { [type]: increment(1) });
    setMessages(messages.map((msg) =>
      msg.id === id ? { ...msg, [type]: (msg[type] || 0) + 1 } : msg
    ));
  }

  // Forme aléatoire stable par index
  const getShape = (index) => {
    const shapes = [
      // Coeur
      {
        style: {
          clipPath: "url(#heart-clip)",
          WebkitClipPath: "url(#heart-clip)",
        },
        svgId: "heart"
      },
      // Fleur
      {
        style: {
          clipPath: "polygon(50% 0%, 61% 20%, 85% 10%, 75% 33%, 100% 40%, 78% 53%, 93% 75%, 68% 70%, 65% 95%, 50% 78%, 35% 95%, 32% 70%, 7% 75%, 22% 53%, 0% 40%, 25% 33%, 15% 10%, 39% 20%)",
          WebkitClipPath: "polygon(50% 0%, 61% 20%, 85% 10%, 75% 33%, 100% 40%, 78% 53%, 93% 75%, 68% 70%, 65% 95%, 50% 78%, 35% 95%, 32% 70%, 7% 75%, 22% 53%, 0% 40%, 25% 33%, 15% 10%, 39% 20%)",
        },
        svgId: null
      },
      // Étoile
      {
        style: {
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          WebkitClipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        },
        svgId: null
      },
    ];
    return shapes[index % shapes.length];
  };

  return (
    <>
      <Petals />

      {/* SVG defs pour le clip coeur */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.25 C0.5,0.1,0.25,0,0.15,0.15 C0,0.3,0,0.5,0.5,0.85 C1,0.5,1,0.3,0.85,0.15 C0.75,0,0.5,0.1,0.5,0.25 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">

          {/* HEADER */}
          <GardenHeader />

          {/* STATUT */}
          <div className="flex justify-center my-8">
            <span className={`px-5 py-2 rounded-full text-sm font-semibold ${
              jardinOuvert
                ? "bg-green-100 text-green-600"
                : "bg-red-50 text-red-400"
            }`}>
              {jardinOuvert ? "🌸 Jardin ouvert" : "🔒 Jardin fermé"}
            </span>
          </div>

          {/* BOUTONS ACTIONS */}
          {jardinOuvert && (
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => { setFormOuvert(!formOuvert); setUploadOuvert(false); }}
                className={`px-6 py-3 rounded-2xl font-semibold shadow hover:scale-105 transition text-sm ${
                  formOuvert ? "bg-gray-200 text-gray-600" : "bg-pink-500 hover:bg-pink-600 text-white"
                }`}
              >
                {formOuvert ? "✕ Fermer" : "💌 Laisser un message"}
              </button>
              <button
                onClick={() => { setUploadOuvert(!uploadOuvert); setFormOuvert(false); }}
                className={`px-6 py-3 rounded-2xl font-semibold shadow hover:scale-105 transition text-sm ${
                  uploadOuvert ? "bg-gray-200 text-gray-600" : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {uploadOuvert ? "✕ Fermer" : "📷 Ajouter une photo"}
              </button>
            </div>
          )}

          {/* UPLOAD */}
          {jardinOuvert && uploadOuvert && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
              <UploadImage />
            </div>
          )}

          {/* FORMULAIRE MESSAGE */}
          {jardinOuvert && formOuvert && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-5">Votre message</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
                />
                <textarea
                  placeholder="Votre message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 h-36 resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
                />
                <div className="flex justify-end">
                  <button
                    onClick={publierMessage}
                    className="px-8 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold transition"
                  >
                    Publier ✨
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DERNIÈRES PHOTOS en formes */}
          {images.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">📷 Dernières photos</h2>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                {images.map((img, index) => {
                  const shape = getShape(index);
                  return (
                    <div
                      key={index}
                      className="cursor-pointer hover:scale-110 transition duration-300"
                      style={{ width: 160, height: 160 }}
                      onClick={() => setSelectedImage(img.url)}
                    >
                      <img
                        src={img.url}
                        alt="Souvenir"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          ...shape.style,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MESSAGES style carte manuscrite */}
          <div className="mt-4">
            <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">✨ Derniers messages</h2>

            {messages.length === 0 && (
              <div className="text-center py-16 text-gray-300">
                <p className="text-5xl mb-3">🌿</p>
                <p>Aucun message pour l'instant</p>
              </div>
            )}

            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="relative p-8 rounded-2xl shadow-md overflow-hidden"
                  style={{
                    background: index % 3 === 0
                      ? "linear-gradient(135deg, #fff9f0, #fff3e0)"
                      : index % 3 === 1
                      ? "linear-gradient(135deg, #fff0f5, #ffe4ed)"
                      : "linear-gradient(135deg, #f0fff4, #e0f7e9)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                  }}
                >
                  {/* Coin décoratif haut gauche */}
                  <div className="absolute top-3 left-3 text-2xl opacity-20 select-none">❧</div>
                  {/* Coin décoratif bas droite */}
                  <div className="absolute bottom-3 right-3 text-2xl opacity-20 select-none rotate-180">❧</div>

                  {/* Ligne décorative */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
                    <span className="text-pink-300 text-xs">✦</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
                  </div>

                  {/* Nom stylisé */}
                  <p
                    className="text-center text-xl mb-4"
                    style={{
                      fontFamily: "'Georgia', serif",
                      color: "#b06080",
                      fontStyle: "italic",
                      letterSpacing: "0.05em",
                    }}
                  >
                    ~ {msg.nom} ~
                  </p>

                  {/* Message */}
                  <p
                    className="text-center leading-relaxed mb-5 px-4"
                    style={{
                      fontFamily: "'Georgia', serif",
                      color: "#5a4a42",
                      fontSize: "1.05rem",
                      lineHeight: "1.9",
                    }}
                  >
                    {msg.texte}
                  </p>

                  {/* Ligne décorative bas */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
                    <span className="text-pink-300 text-xs">✦</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
                  </div>

                  {/* Date + réactions */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <span
                      className="text-xs"
                      style={{ color: "#b0a090", fontStyle: "italic" }}
                    >
                      {msg.date}
                    </span>
                    <div className="flex gap-2">
                      {[
                        { type: "likes", emoji: "❤️", count: msg.likes },
                        { type: "fleurs", emoji: "🌸", count: msg.fleurs },
                        { type: "etoiles", emoji: "✨", count: msg.etoiles },
                      ].map(({ type, emoji, count }) => (
                        <button
                          key={type}
                          onClick={() => ajouterReaction(msg.id, type)}
                          className="px-3 py-1 rounded-xl text-sm transition hover:scale-110 bg-white/60 hover:bg-white"
                          style={{ border: "1px solid rgba(0,0,0,0.07)" }}
                        >
                          {emoji} {count || 0}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* MODAL IMAGE */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Photo agrandie"
            className="max-w-full max-h-full rounded-3xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}