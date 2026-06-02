import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export default function Souvenirs() {

  const [messages, setMessages] =
    useState([]);

  const [images, setImages] =
    useState([]);

  const [selectedImage, setSelectedImage] =
    useState(null);

  // =========================
  // CHARGER DONNEES
  // =========================

  useEffect(() => {

    async function chargerDonnees() {

      // =========================
      // MESSAGES
      // =========================

      const messagesData =
        await getDocs(
          collection(db, "messages")
        );

      const listeMessages =
        messagesData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

      setMessages(listeMessages);

      // =========================
      // IMAGES
      // =========================

      const imagesData =
        await getDocs(
          collection(db, "images")
        );

      const listeImages =
        imagesData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

      setImages(listeImages);
    }

    chargerDonnees();

  }, []);

  // =========================
  // GROUPER PAR ANNEE
  // =========================

  const souvenirsParAnnee = {};

  // =========================
  // AJOUT MESSAGES
  // =========================

  messages.forEach((msg) => {

    const annee =
      msg.annee || "2026";

    const auteur =
      msg.nom || "Anonyme";

    if (!souvenirsParAnnee[annee]) {

      souvenirsParAnnee[annee] = {};

    }

    if (
      !souvenirsParAnnee[annee][auteur]
    ) {

      souvenirsParAnnee[annee][auteur] = {
        messages: [],
        images: []
      };

    }

    souvenirsParAnnee[annee][auteur]
      .messages.push(msg);

  });

  // =========================
  // AJOUT IMAGES
  // =========================

  images.forEach((img) => {

    const annee =
      img.annee || "2026";

    const auteur =
      img.auteur || "Anonyme";

    if (!souvenirsParAnnee[annee]) {

      souvenirsParAnnee[annee] = {};

    }

    if (
      !souvenirsParAnnee[annee][auteur]
    ) {

      souvenirsParAnnee[annee][auteur] = {
        messages: [],
        images: []
      };

    }

    souvenirsParAnnee[annee][auteur]
      .images.push(img);

  });

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-red-50 p-10">

      <div className="max-w-7xl mx-auto">

        {/* ========================= */}
        {/* BOUTONS */}
        {/* ========================= */}

        <div className="flex justify-center gap-4 mb-12">

          <Link to="/garden">

            <button className="px-6 py-3 rounded-2xl bg-white shadow-lg hover:scale-105 transition">

              🌸 Retour au jardin

            </button>

          </Link>

          <Link to="/">

            <button className="px-6 py-3 rounded-2xl bg-white shadow-lg hover:scale-105 transition">

              🏠 Accueil

            </button>

          </Link>

        </div>

        {/* ========================= */}
        {/* TITRE */}
        {/* ========================= */}

        <h1 className="text-5xl font-bold text-center text-gray-800 mb-16">

          📚 Les Souvenirs du Jardin

        </h1>

        {/* ========================= */}
        {/* ANNEES */}
        {/* ========================= */}

        {Object.keys(souvenirsParAnnee)
          .sort((a, b) => b - a)
          .map((annee) => (

          <div
            key={annee}
            className="mb-24"
          >

            <h2 className="text-4xl font-bold text-pink-600 mb-12">

              🌸 Souvenirs {annee}

            </h2>

            {/* ========================= */}
            {/* PERSONNES */}
            {/* ========================= */}

            {Object.keys(
              souvenirsParAnnee[annee]
            ).map((auteur) => {

              const personne =
                souvenirsParAnnee[annee][auteur];

              return (

                <div
                  key={auteur}
                  className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-12"
                >

                  <h3 className="text-3xl font-bold text-gray-800 mb-8">

                    👤 {auteur}

                  </h3>

                  {/* ========================= */}
                  {/* MESSAGES */}
                  {/* ========================= */}

                  <div className="space-y-6 mb-10">

                    {personne.messages.map(
                      (msg, index) => (

                      <div
                        key={index}
                        className="bg-green-50 rounded-3xl p-6 shadow"
                      >

                        <div className="flex justify-between items-center mb-3">

                          <span className="font-semibold text-green-700">

                            💌 Message

                          </span>

                          <span className="text-sm text-gray-500">

                            {msg.date}

                          </span>

                        </div>

                        <p className="text-gray-700 text-lg">

                          {msg.texte}

                        </p>

                      </div>

                    ))}

                  </div>

                  {/* ========================= */}
                  {/* PHOTOS */}
                  {/* ========================= */}

                  <div className="columns-1 sm:columns-2 md:columns-3 gap-8 space-y-8">

                    {personne.images.map(
                      (img, index) => (

                      <div
                        key={index}
                        className="break-inside-avoid shadow-2xl overflow-hidden bg-white p-3 hover:scale-105 transition duration-300 rounded-3xl"
                      >

                        <img
                          src={img.url}
                          alt="Souvenir"
                          className="w-full object-cover cursor-pointer rounded-2xl"
                          onClick={() =>
                            setSelectedImage(
                              img.url
                            )
                          }
                        />

                        <div className="mt-4">

                          <p className="text-sm text-gray-500">

                            📅 {img.date}

                          </p>

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