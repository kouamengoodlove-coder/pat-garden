import { Link } from "react-router-dom";
import GardenHeader from "../components/GardenHeader";
import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import Petals from "../components/Petals";
import UploadImage from "../components/UploadImage";

export default function Garden() {

  // =========================
  // DATE ET ETAT DU JARDIN
  // =========================

  const aujourdHui = new Date();

  const jour = aujourdHui.getDate();

  const mois = aujourdHui.getMonth() + 1;

  const anneeActuelle =
    aujourdHui.getFullYear();

  // ⚠️ CHANGE 5 EN 7 SI TU VEUX JUILLET

  const jardinOuvert =
    mois === 6 && jour >= 1 && jour <= 20;

  // =========================
  // STATES
  // =========================

  const [nom, setNom] = useState("");

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const messagesCollection =
    collection(db, "messages");

  // =========================
  // CHARGER LES MESSAGES
  // =========================

  useEffect(() => {

    async function chargerMessages() {

      const data =
        await getDocs(messagesCollection);

      const listeMessages =
        data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

      // =========================
      // FILTRER PAR ANNEE
      // =========================

      const messagesAnnee =
        listeMessages.filter(
          (msg) =>
            msg.annee === anneeActuelle
        );

      // =========================
      // LIMITER AUX 10 DERNIERS
      // =========================

      const derniersMessages =
        messagesAnnee.slice(0, 10);

      setMessages(derniersMessages);
    }

    chargerMessages();

  }, []);

  // =========================
  // PUBLIER MESSAGE
  // =========================

  async function publierMessage() {

    if (nom === "" || message === "") {

      alert(
        "Veuillez remplir tous les champs 🌸"
      );

      return;
    }

    const nouvelleDate =
      new Date().toLocaleDateString("fr-FR");

    const nouveauMessage = {

      nom: nom,

      texte: message,

      date: nouvelleDate,

      annee: anneeActuelle,

      likes: 0,

      fleurs: 0,

      etoiles: 0

    };

    // =========================
    // FIREBASE
    // =========================

    const docRef = await addDoc(
      messagesCollection,
      nouveauMessage
    );

    // =========================
    // AJOUT DIRECT
    // =========================

    setMessages([
      {
        id: docRef.id,
        ...nouveauMessage
      },
      ...messages
    ]);

    // =========================
    // RESET
    // =========================

    setNom("");

    setMessage("");
  }

  // =========================
  // REACTIONS
  // =========================

  async function ajouterReaction(
    id,
    type
  ) {

    const messageRef =
      doc(db, "messages", id);

    await updateDoc(messageRef, {
      [type]: increment(1)
    });

    // =========================
    // UPDATE LOCAL
    // =========================

    const nouveauxMessages =
      messages.map((msg) => {

        if (msg.id === id) {

          return {
            ...msg,
            [type]: (msg[type] || 0) + 1
          };

        }

        return msg;
      });

    setMessages(nouveauxMessages);
  }

  return (

    <>

      {/* ========================= */}
      {/* PETALES */}
      {/* ========================= */}

      <Petals />

      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-red-50 p-10">

        <div className="max-w-5xl mx-auto">

          {/* ========================= */}
          {/* BOUTON RETOUR */}
          {/* ========================= */}

          <div className="flex justify-center mb-10">

            <Link to="/">

              <button className="px-6 py-3 rounded-2xl bg-white shadow-lg hover:scale-105 transition">

                🏠 Retour accueil

              </button>

            </Link>

          </div>

          {/* ========================= */}
          {/* TITRE */}
          {/* ========================= */}

            <GardenHeader />

          {/* ========================= */}
          {/* BOUTON SOUVENIRS */}
          {/* ========================= */}

          <div className="flex justify-center mb-10">

            <Link to="/souvenirs">

              <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow-xl hover:scale-105 transition">

                📚 Voir tous les souvenirs

              </button>

            </Link>

          </div>

          {/* ========================= */}
          {/* ETAT DU JARDIN */}
          {/* ========================= */}

          <div className="flex justify-center mb-12">

            {jardinOuvert ? (

              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-semibold shadow">

                🌸 Le jardin est actuellement ouvert

              </div>

            ) : (

              <div className="bg-red-100 text-red-700 px-6 py-3 rounded-2xl font-semibold shadow">

                🔒 Le jardin est actuellement fermé

              </div>

            )}

          </div>

          {/* ========================= */}
          {/* UPLOAD IMAGE */}
          {/* ========================= */}

          {jardinOuvert && (

            <UploadImage />

          )}

          {/* ========================= */}
          {/* FORMULAIRE MESSAGE */}
          {/* ========================= */}

          {jardinOuvert && (

            <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

              <h2 className="text-3xl font-semibold text-green-700 mb-6">

                💌 Laisser un message

              </h2>

              <div className="space-y-4">

                <input
                  type="text"
                  placeholder="Votre nom"
                  value={nom}
                  onChange={(e) =>
                    setNom(e.target.value)
                  }
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                />

                <textarea
                  placeholder="Votre message..."
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  className="w-full p-4 rounded-2xl border border-gray-200 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                />

                <button
                  onClick={publierMessage}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition"
                >

                  Publier ✨

                </button>

              </div>

            </div>

          )}

          {/* ========================= */}
          {/* DERNIERS MESSAGES */}
          {/* ========================= */}

          <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">

            ✨ Les derniers souvenirs

          </h2>

          <div className="space-y-6">

            {messages.map((msg, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl shadow-lg p-6 backdrop-blur-md"
              >

                <div className="flex justify-between items-center mb-3">

                  <h3 className="text-2xl font-semibold text-gray-800">

                    🌸 {msg.nom}

                  </h3>

                  <span className="text-sm text-gray-500">

                    {msg.date}

                  </span>

                </div>

                <p className="text-gray-600 text-lg mb-6">

                  {msg.texte}

                </p>

                {/* ========================= */}
                {/* REACTIONS */}
                {/* ========================= */}

                <div className="flex gap-4 flex-wrap">

                  <button
                    onClick={() =>
                      ajouterReaction(
                        msg.id,
                        "likes"
                      )
                    }
                    className="bg-red-100 hover:bg-red-200 px-4 py-2 rounded-2xl transition"
                  >

                    ❤️ {msg.likes || 0}

                  </button>

                  <button
                    onClick={() =>
                      ajouterReaction(
                        msg.id,
                        "fleurs"
                      )
                    }
                    className="bg-pink-100 hover:bg-pink-200 px-4 py-2 rounded-2xl transition"
                  >

                    🌸 {msg.fleurs || 0}

                  </button>

                  <button
                    onClick={() =>
                      ajouterReaction(
                        msg.id,
                        "etoiles"
                      )
                    }
                    className="bg-yellow-100 hover:bg-yellow-200 px-4 py-2 rounded-2xl transition"
                  >

                    ✨ {msg.etoiles || 0}

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </>

  );
}