import { Link } from "react-router-dom";
import GardenHeader from "../components/GardenHeader";
import Timeline from "../components/Timeline";
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Petals from "../components/Petals";
import UploadImage from "../components/UploadImage";
import ReactionButtons from "../components/ReactionButtons";

function totalReactions(item) {
  return (item.likes || 0) + (item.fleurs || 0) + (item.etoiles || 0);
}

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
      const topMessages = liste
        .filter((msg) => msg.annee === anneeActuelle)
        .sort((a, b) => totalReactions(b) - totalReactions(a))
        .slice(0, 3);
      setMessages(topMessages);

      const imagesData = await getDocs(collection(db, "images"));
      const listeImages = imagesData.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const topImages = listeImages
        .filter((img) => img.annee === anneeActuelle && img.approuve !== false)
        .sort((a, b) => totalReactions(b) - totalReactions(a))
        .slice(0, 3);
      setImages(topImages);
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
    await addDoc(messagesCollection, nouveauMessage);
    setNom(""); setMessage(""); setFormOuvert(false);
    alert("Merci pour votre message !");
  }

  async function ajouterReaction(id, type) {
    const messageRef = doc(db, "messages", id);
    await updateDoc(messageRef, { [type]: increment(1) });
    setMessages(messages.map((msg) =>
      msg.id === id ? { ...msg, [type]: (msg[type] || 0) + 1 } : msg
    ));
  }

  return (
    <>
      <Petals />

      <div className="min-h-screen bg-cream py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <GardenHeader />

          {/* STATUT */}
          <div className="flex justify-center mb-10">
            <span className={`px-5 py-2 rounded-full text-sm font-medium ${
              jardinOuvert
                ? "bg-sage/20 text-pine"
                : "bg-terracotta/10 text-terracotta-dark"
            }`}>
              {jardinOuvert ? "Jardin ouvert" : "Jardin fermé"}
            </span>
          </div>

          {/* ACTIONS */}
          {jardinOuvert && (
            <div className="flex gap-4 justify-center flex-wrap mb-10">
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
              <Link to="/souvenirs">
                <button className="px-6 py-3 rounded-full font-medium transition text-sm border border-pine text-pine hover:bg-white">
                  Accéder aux souvenirs
                </button>
              </Link>
            </div>
          )}

          {jardinOuvert && uploadOuvert && (
            <div className="bg-white rounded-2xl border border-line p-8 mb-10 max-w-xl mx-auto">
              <UploadImage />
            </div>
          )}

          {jardinOuvert && formOuvert && (
            <div className="bg-white rounded-2xl border border-line p-8 mb-10 max-w-xl mx-auto">
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

          {/* TOP PHOTOS */}
          <div className="mb-14">
            <h2 className="text-xl font-display text-pine mb-5 text-center">Les 3 photos les plus aimées</h2>
            {images.length === 0 ? (
              <p className="text-pine-soft/50 text-sm text-center">Aucune photo pour l'instant.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {images.map((img, index) => (
                  <div key={index} className="rounded-xl overflow-hidden border border-line bg-white">
                    <img
                      src={img.url}
                      alt="Souvenir"
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition"
                      onClick={() => setSelectedImage(img.url)}
                    />
                    <div className="p-3">
                      <p className="text-xs text-pine-soft/70">{img.auteur}</p>
                      <p className="text-xs text-terracotta">{totalReactions(img)} réaction{totalReactions(img) > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TOP MESSAGES */}
          <div className="mb-16">
            <h2 className="text-xl font-display text-pine mb-5 text-center">Les 3 messages les plus aimés</h2>

            {messages.length === 0 && (
              <p className="text-pine-soft/50 text-sm text-center">Aucun message pour l'instant.</p>
            )}

            <div className="space-y-4 max-w-2xl mx-auto">
              {messages.map((msg, index) => (
                <div key={index} className="p-6 rounded-xl bg-white border border-line">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-display italic text-terracotta-dark">{msg.nom}</p>
                    <span className="text-xs text-pine-soft/50">{msg.date}</span>
                  </div>
                  <p className="text-pine-soft leading-relaxed mb-3">{msg.texte}</p>
                  <ReactionButtons item={msg} onReagir={ajouterReaction} size="small" />
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