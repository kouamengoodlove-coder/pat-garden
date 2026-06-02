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

  // =========================
  // STATES
  // =========================

  const [image, setImage] =
    useState(null);

  const [auteur, setAuteur] =
    useState("");

  const [images, setImages] =
    useState([]);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const imagesCollection =
    collection(db, "images");

  // =========================
  // CHARGER IMAGES
  // =========================

  useEffect(() => {

    async function chargerImages() {

      const data =
        await getDocs(imagesCollection);

      const listeImages =
        data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

      setImages(listeImages);
    }

    chargerImages();

  }, []);

  // =========================
  // UPLOAD IMAGE
  // =========================

  async function uploadImage() {

    if (!image || auteur === "") {

      alert(
        "Ajoutez un nom et une image 🌸"
      );

      return;
    }

    const formData = new FormData();

    formData.append("file", image);

    formData.append(
      "upload_preset",
      "pat-garden"
    );

    formData.append(
      "cloud_name",
      "dgrtscfij"
    );

    try {

      // =========================
      // ENVOI CLOUDINARY
      // =========================

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dgrtscfij/image/upload",
        formData
      );

      const imageUrl =
        response.data.secure_url;

      // =========================
      // DATE
      // =========================

      const datePublication =
        new Date().toLocaleDateString(
          "fr-FR"
        );

      // =========================
      // OBJET IMAGE
      // =========================

      const nouvelleImage = {

        url: imageUrl,

        auteur: auteur,

        date: datePublication,

        annee:
          new Date().getFullYear(),

        likes: 0,

        fleurs: 0,

        etoiles: 0

      };

      // =========================
      // FIREBASE
      // =========================

      const docRef =
        await addDoc(
          imagesCollection,
          nouvelleImage
        );

      // =========================
      // AJOUT DIRECT
      // =========================

      setImages([
        {
          id: docRef.id,
          ...nouvelleImage
        },
        ...images
      ]);

      // =========================
      // RESET
      // =========================

      setAuteur("");

      setImage(null);

      alert("Souvenir ajouté 🌸");

    } catch (error) {

      console.error(error);

      alert("Erreur upload");

    }
  }

  // =========================
  // REACTIONS
  // =========================

  async function ajouterReaction(
    id,
    type
  ) {

    const imageRef =
      doc(db, "images", id);

    await updateDoc(imageRef, {
      [type]: increment(1)
    });

    // =========================
    // UPDATE LOCAL
    // =========================

    const nouvellesImages =
      images.map((img) => {

        if (img.id === id) {

          return {

            ...img,

            [type]:
              (img[type] || 0) + 1

          };

        }

        return img;
      });

    setImages(nouvellesImages);
  }

  // =========================
  // STYLES ALEATOIRES
  // =========================

  function randomStyle(index) {

    const rotations = [
      "-6deg",
      "4deg",
      "-3deg",
      "7deg",
      "-8deg",
      "5deg"
    ];

    const borderRadius = [
      "50%",
      "30px",
      "20%",
      "40px",
      "50% 50% 0 50%",
      "45% 55% 60% 40%"
    ];

    return {

      transform:
        `rotate(${rotations[index % rotations.length]})`,

      borderRadius:
        borderRadius[
          index % borderRadius.length
        ],

    };
  }

  return (

    <div className="mb-16">

      {/* ========================= */}
      {/* FORMULAIRE */}
      {/* ========================= */}

      <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">

        <h2 className="text-3xl font-semibold text-pink-600 mb-6">

          📸 Ajouter un souvenir

        </h2>

        <input
          type="text"
          placeholder="Votre prénom"
          value={auteur}
          onChange={(e) =>
            setAuteur(e.target.value)
          }
          className="w-full p-4 rounded-2xl border border-gray-200 mb-6 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <input
          type="file"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
          className="mb-6"
        />

        <button
          onClick={uploadImage}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition"
        >

          Envoyer la photo ✨

        </button>

      </div>

      {/* ========================= */}
      {/* GALERIE */}
      {/* ========================= */}

      <div className="columns-1 sm:columns-2 md:columns-3 gap-8 space-y-8">

        {images.map((img, index) => (

          <div
            key={index}
            className="break-inside-avoid shadow-2xl overflow-hidden bg-white p-3 transition hover:scale-105 duration-300"
            style={randomStyle(index)}
          >

            {/* IMAGE */}

            <img
              src={img.url}
              alt="Souvenir"
              className="w-full object-cover cursor-pointer"
              onClick={() =>
                setSelectedImage(img.url)
              }
            />

            {/* INFOS */}

            <div className="mt-4 px-2">

              <p className="font-semibold text-gray-800">

                🌸 {img.auteur}

              </p>

              <p className="text-sm text-gray-500 mb-4">

                📅 {img.date}

              </p>

              {/* REACTIONS */}

              <div className="flex gap-3 flex-wrap">

                <button
                  onClick={() =>
                    ajouterReaction(
                      img.id,
                      "likes"
                    )
                  }
                  className="bg-red-100 hover:bg-red-200 px-3 py-2 rounded-2xl transition"
                >

                  ❤️ {img.likes || 0}

                </button>

                <button
                  onClick={() =>
                    ajouterReaction(
                      img.id,
                      "fleurs"
                    )
                  }
                  className="bg-pink-100 hover:bg-pink-200 px-3 py-2 rounded-2xl transition"
                >

                  🌸 {img.fleurs || 0}

                </button>

                <button
                  onClick={() =>
                    ajouterReaction(
                      img.id,
                      "etoiles"
                    )
                  }
                  className="bg-yellow-100 hover:bg-yellow-200 px-3 py-2 rounded-2xl transition"
                >

                  ✨ {img.etoiles || 0}

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* ========================= */}
      {/* MODAL IMAGE */}
      {/* ========================= */}

      {selectedImage && (

        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
          onClick={() =>
            setSelectedImage(null)
          }
        >

          <img
            src={selectedImage}
            alt="Grand souvenir"
            className="max-w-full max-h-full rounded-3xl shadow-2xl"
          />

        </div>

      )}

    </div>
  );
}