import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Souvenirs() {
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function chargerDonnees() {
      const messagesData = await getDocs(collection(db, "messages"));
      setMessages(messagesData.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const imagesData = await getDocs(collection(db, "images"));
      const toutesImages = imagesData.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(toutesImages.filter((img) => img.approuve !== false));
    }
    chargerDonnees();
  }, []);

  async function reagirMessage(id, type) {
    await updateDoc(doc(db, "messages", id), { [type]: increment(1) });
    setMessages(messages.map((m) => (m.id === id ? { ...m, [type]: (m[type] || 0) + 1 } : m)));
  }

  async function reagirImage(id, type) {
    await updateDoc(doc(db, "images", id), { [type]: increment(1) });
    setImages(images.map((img) => (img.id === id ? { ...img, [type]: (img[type] || 0) + 1 } : img)));
  }

  function BoutonsReaction({ item, onReagir }) {
    return (
      <div className="flex gap-2 mt-3">
        {[
          { type: "likes", label: "cœur", count: item.likes },
          { type: "fleurs", label: "fleur", count: item.fleurs },
          { type: "etoiles", label: "étoile", count: item.etoiles },
        ].map(({ type, label, count }) => (
          <button
            key={type}
            onClick={() => onReagir(item.id, type)}
            className="px-2.5 py-1 rounded-full text-xs bg-cream border border-line text-pine-soft hover:bg-cream-dark transition"
            title={label}
          >
            {count || 0}
          </button>
        ))}
      </div>
    );
  }

  const souvenirsParAnnee = {};

  messages.forEach((msg) => {
    const annee = msg.annee || "2026";
    const auteur = msg.nom || "Anonyme";
    if (!souvenirsParAnnee[annee]) souvenirsParAnnee[annee] = {};
    if (!souvenirsParAnnee[annee][auteur]) souvenirsParAnnee[annee][auteur] = { messages: [], images: [] };
    souvenirsParAnnee[annee][auteur].messages.push(msg);
  });

  images.forEach((img) => {
    const annee = img.annee || "2026";
    const auteur = img.auteur || "Anonyme";
    if (!souvenirsParAnnee[annee]) souvenirsParAnnee[annee] = {};
    if (!souvenirsParAnnee[annee][auteur]) souvenirsParAnnee[annee][auteur] = { messages: [], images: [] };
    souvenirsParAnnee[annee][auteur].images.push(img);
  });

  return (
    <div className="min-h-screen bg-cream p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display text-center text-pine mb-16">
          Les souvenirs du jardin
        </h1>

        {Object.keys(souvenirsParAnnee).length === 0 && (
          <p className="text-center text-pine-soft py-16">Aucun souvenir pour l'instant.</p>
        )}

        {Object.keys(souvenirsParAnnee).sort((a, b) => b - a).map((annee) => (
          <div key={annee} className="mb-20">
            <h2 className="text-3xl font-display text-terracotta mb-10">Souvenirs {annee}</h2>

            {Object.keys(souvenirsParAnnee[annee]).map((auteur) => {
              const personne = souvenirsParAnnee[annee][auteur];
              return (
                <div key={auteur} className="bg-white border border-line rounded-2xl p-8 mb-10">
                  <h3 className="text-2xl font-display text-pine mb-7">{auteur}</h3>

                  <div className="space-y-4 mb-8">
                    {personne.messages.map((msg, index) => (
                      <div key={index} className="bg-cream rounded-xl p-5 border border-line">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs uppercase tracking-wide text-sage font-medium">Message</span>
                          <span className="text-xs text-pine-soft/60">{msg.date}</span>
                        </div>
                        <p className="text-pine-soft">{msg.texte}</p>
                        <BoutonsReaction item={msg} onReagir={reagirMessage} />
                      </div>
                    ))}
                  </div>

                  <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                    {personne.images.map((img, index) => (
                      <div key={index} className="break-inside-avoid border border-line overflow-hidden bg-white p-2 rounded-lg hover:-translate-y-1 transition duration-300">
                        <img
                          src={img.url}
                          alt="Souvenir"
                          className="w-full object-cover cursor-pointer rounded"
                          onClick={() => setSelectedImage(img.url)}
                        />
                        <div className="mt-2 px-1 pb-1">
                          <p className="text-xs text-pine-soft/70">{img.date}</p>
                          <BoutonsReaction item={img} onReagir={reagirImage} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Grand souvenir" className="max-w-full max-h-full rounded-2xl" />
        </div>
      )}
    </div>
  );
}