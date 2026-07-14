import { useEffect, useState } from "react";
import axios from "axios";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function UploadImage() {
  const [image, setImage] = useState(null);
  const [auteur, setAuteur] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const imagesCollection = collection(db, "images");

  useEffect(() => {
    async function chargerImages() {
      const data = await getDocs(imagesCollection);
      const listeImages = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(listeImages);
    }
    chargerImages();
  }, []);

  async function uploadImage() {
    if (!image || auteur === "") {
      alert("Ajoutez un nom et une image");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "pat-garden");
    formData.append("cloud_name", "dgrtscfij");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dgrtscfij/image/upload",
        formData
      );

      const imageUrl = response.data.secure_url;
      const datePublication = new Date().toLocaleDateString("fr-FR");

      const nouvelleImage = {
        url: imageUrl,
        auteur: auteur,
        date: datePublication,
        annee: new Date().getFullYear(),
        likes: 0,
        fleurs: 0,
        etoiles: 0,
        approuve: false,
      };

      const docRef = await addDoc(imagesCollection, nouvelleImage);

      setImages([{ id: docRef.id, ...nouvelleImage }, ...images]);
      setAuteur("");
      setImage(null);
      alert("Photo envoyée ! Elle apparaîtra dans le jardin après validation.");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi");
    }
  }

  async function ajouterReaction(id, type) {
    const imageRef = doc(db, "images", id);
    await updateDoc(imageRef, { [type]: increment(1) });

    const nouvellesImages = images.map((img) => {
      if (img.id === id) {
        return { ...img, [type]: (img[type] || 0) + 1 };
      }
      return img;
    });

    setImages(nouvellesImages);
  }

  function randomStyle(index) {
    const rotations = ["-3deg", "2deg", "-2deg", "3deg", "-4deg", "2.5deg"];
    return { transform: `rotate(${rotations[index % rotations.length]})` };
  }

  return (
    <div className="mb-16">
      <div className="bg-white rounded-2xl border border-line p-8 mb-10">
        <h2 className="text-2xl font-display text-pine mb-6">Ajouter un souvenir</h2>

        <input
          type="text"
          placeholder="Votre prénom"
          value={auteur}
          onChange={(e) => setAuteur(e.target.value)}
          className="w-full p-4 rounded-xl border border-line mb-4 focus:outline-none focus:ring-1 focus:ring-terracotta text-pine"
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-5 text-sm text-pine-soft"
        />

        <button
          onClick={uploadImage}
          className="px-8 py-3.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-cream font-medium transition"
        >
          Envoyer la photo
        </button>

        <p className="text-xs text-pine-soft/70 mt-3">
          Chaque photo est vérifiée avant d'apparaître publiquement dans le jardin.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        {images.map((img, index) => (
          <div
            key={index}
            className="break-inside-avoid shadow-sm border border-line overflow-hidden bg-white p-2.5 rounded-lg transition hover:-translate-y-1 duration-300"
            style={randomStyle(index)}
          >
            <div className="relative">
              <img
                src={img.url}
                alt="Souvenir"
                className="w-full object-cover cursor-pointer rounded"
                onClick={() => setSelectedImage(img.url)}
              />
              {img.approuve === false && (
                <span className="absolute top-2 left-2 bg-honey text-pine text-[11px] font-medium px-2.5 py-1 rounded-full">
                  En attente de validation
                </span>
              )}
            </div>

            <div className="mt-3 px-1">
              <p className="font-medium text-pine text-sm">{img.auteur}</p>
              <p className="text-xs text-pine-soft/70 mb-3">{img.date}</p>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => ajouterReaction(img.id, "likes")}
                  className="bg-cream hover:bg-cream-dark border border-line px-3 py-1.5 rounded-full text-xs text-pine-soft transition"
                >
                  cœur {img.likes || 0}
                </button>
                <button
                  onClick={() => ajouterReaction(img.id, "fleurs")}
                  className="bg-cream hover:bg-cream-dark border border-line px-3 py-1.5 rounded-full text-xs text-pine-soft transition"
                >
                  fleur {img.fleurs || 0}
                </button>
                <button
                  onClick={() => ajouterReaction(img.id, "etoiles")}
                  className="bg-cream hover:bg-cream-dark border border-line px-3 py-1.5 rounded-full text-xs text-pine-soft transition"
                >
                  étoile {img.etoiles || 0}
                </button>
              </div>
            </div>
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
