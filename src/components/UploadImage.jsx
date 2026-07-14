import { useState } from "react";
import axios from "axios";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function UploadImage() {
  const [image, setImage] = useState(null);
  const [auteur, setAuteur] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const imagesCollection = collection(db, "images");

  async function uploadImage() {
    if (!image || auteur === "") {
      alert("Ajoutez un nom et une image");
      return;
    }

    setEnvoiEnCours(true);

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

      await addDoc(imagesCollection, nouvelleImage);

      setAuteur("");
      setImage(null);
      alert("Photo envoyée ! Elle apparaîtra dans le jardin après validation.");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi");
    } finally {
      setEnvoiEnCours(false);
    }
  }

  return (
    <div>
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
        disabled={envoiEnCours}
        className="px-8 py-3.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-cream font-medium transition disabled:opacity-60"
      >
        {envoiEnCours ? "Envoi en cours..." : "Envoyer la photo"}
      </button>

      <p className="text-xs text-pine-soft/70 mt-3">
        Chaque photo est vérifiée avant d'apparaître publiquement dans le jardin.
      </p>
    </div>
  );
}