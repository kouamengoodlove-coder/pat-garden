import GardenHeader from "../components/GardenHeader";
import Timeline from "../components/Timeline";
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Petals from "../components/Petals";
import UploadImage from "../components/UploadImage";

export default function Garden() {
  const aujourdHui = new Date();
  const jour = aujourdHui.getDate();
  const mois = aujourdHui.getMonth() + 1;
  const anneeActuelle = aujourdHui.getFullYear();

  const jardinOuvert = mois === 7 && jour >= 10 && jour <= 25;

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
        .filter((img) => img.annee === anneeActuelle && img.approuve !== false)
        .slice(0, 3);
      setImages(imagesAnnee);
    }
    chargerDonnees();
  }, []);

  async function publierMessage() {
    if (nom === "" || message === "") {
      alert("Veuillez remplir tous les champs");
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

  const getShape = (index) => {
    const shapes = [
      { style: { clipPath: "url(#heart-clip)", WebkitClipPath: "url(#heart-clip)" } },
      { style: {
        clipPath: "polygon(50% 0%, 61% 20%, 85% 10%, 75% 33%, 100% 40%, 78% 53%, 93% 75%, 68% 70%, 65% 95%, 50% 78%, 35% 95%, 32% 70%, 7% 75%, 22% 53%, 0% 40%, 25% 33%, 15% 10%, 39% 20%)",
        WebkitClipPath: "polygon(50% 0%, 61% 20%, 85% 10%, 75% 33%, 100% 40%, 78% 53%, 93% 75%, 68% 70%, 65% 95%, 50% 78%, 35% 95%, 32% 70%, 7% 75%, 22% 53%, 0% 40%, 25% 33%, 15% 10%, 39% 20%)",
      } },
      { style: {
        clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        WebkitClipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
      } },
    ];
    return shapes[index % shapes.length];
  };

  return (
    <>
      <Petals />

      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.25 C0.5,0.1,0.25,0,0.15,0.15 C0,0.3,0,0.5,0.5,0.85 C1,0.5,1,0.3,0.85,0.15 C0.75,0,0.5,0.1,0.5,0.25 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="min-h-screen bg-cream py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <GardenHeader />

          <div className="flex justify-center my-8">
            <span className={`px-5 py-2 rounded-full text-sm font-medium ${
              jardinOuvert
                ? "bg-sage/20 text-pine"
                : "bg-terracotta/10 text-terracotta-dark"
            }`}>
              {jardinOuvert ? "Jardin ouvert" : "Jardin fermé"}
            </span>
          </div>

          {jardinOuvert && (
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => { setFormOuvert(!formOuvert); setUploadOuvert(false); }}
                className={`px-6 py-3 rounded-full font-medium transition text-sm ${
                  formOuvert ? "bg-cream-dark text-pine-soft" : "bg-terracotta text-cream hover:bg-terracotta-dark"
                }`}
              >
                {formOuvert ? "Fermer" : "Laisser un message"}
              </button>
              <button
                onClick={() => { setUploadOuvert(!uploadOuvert); setFormOuvert(false); }}
                className={`px-6 py-3 rounded-full font-medium transition text-sm ${
                  uploadOuvert ? "bg-cream-dark text-pine-soft" : "bg-sage text-cream hover:bg-pine"
                }`}
              >
                {uploadOuvert ? "Fermer" : "Ajouter une photo"}
              </button>
            </div>
          )}

          {jardinOuvert && uploadOuvert && (
            <div className="bg-white rounded-2xl border border-line p-6 mb-6">
              <UploadImage />
            </div>
          )}

          {jardinOuvert && formOuvert && (
            <div className="bg-white rounded-2xl border border-line p-8 mb-8">
              <h2 className="text-lg font-display text-pine mb-5">Votre message</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full p-4 rounded-xl border border-line focus:outline-none focus:ring-1 focus:ring-terracotta text-pine"
                />
                <textarea
                  placeholder="Votre message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-xl border border-line h-36 resize-none focus:outline-none focus:ring-1 focus:ring-terracotta text-pine"
                />
                <div className="flex justify-end">
                  <button
                    onClick={publierMessage}
                    className="px-8 py-3 rounded-xl bg-terracotta hover:bg-terracotta-dark text-cream font-medium transition"
                  >
                    Publier
                  </button>
                </div>
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-display text-pine mb-6 text-center">Dernières photos</h2>
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
                        style={{ width: "100%", height: "100%", objectFit: "cover", ...shape.style }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 mb-16">
            <h2 className="text-xl font-display text-pine mb-6 text-center">Derniers messages</h2>

            {messages.length === 0 && (
              <div className="text-center py-16 text-pine-soft/50">
                <p>Aucun message pour l'instant</p>
              </div>
            )}

            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="relative p-8 rounded-2xl bg-white border border-line"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-line" />
                    <span className="text-terracotta text-xs">✦</span>
                    <div className="h-px flex-1 bg-line" />
                  </div>

                  <p className="font-display italic text-center text-xl mb-4 text-terracotta-dark">
                    {msg.nom}
                  </p>

                  <p className="text-center leading-relaxed mb-5 px-4 text-pine-soft">
                    {msg.texte}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-line" />
                    <span className="text-terracotta text-xs">✦</span>
                    <div className="h-px flex-1 bg-line" />
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <span className="text-xs text-pine-soft/60 italic">{msg.date}</span>
                    <div className="flex gap-2">
                      {[
                        { type: "likes", label: "cœur", count: msg.likes },
                        { type: "fleurs", label: "fleur", count: msg.fleurs },
                        { type: "etoiles", label: "étoile", count: msg.etoiles },
                      ].map(({ type, label, count }) => (
                        <button
                          key={type}
                          onClick={() => ajouterReaction(msg.id, type)}
                          className="px-3 py-1 rounded-full text-xs transition hover:bg-cream-dark bg-cream border border-line text-pine-soft"
                          title={label}
                        >
                          {count || 0}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Timeline />
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Photo agrandie" className="max-w-full max-h-full rounded-2xl" />
        </div>
      )}
    </>
  );
}
