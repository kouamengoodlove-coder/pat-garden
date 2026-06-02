import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export default function Admin() {

  const [password, setPassword] =
    useState("");

  const [access, setAccess] =
    useState(false);

  const ADMIN_PASSWORD =
    "patricia2026";

  const [messages, setMessages] =
    useState([]);

  const [images, setImages] =
    useState([]);

  const [livreDor, setLivreDor] =
    useState([]);

  function checkPassword() {

    if (
      password === ADMIN_PASSWORD
    ) {

      setAccess(true);

    } else {

      alert(
        "Mot de passe incorrect ❌"
      );

    }

  }

  useEffect(() => {

    if (!access) return;

    async function chargerDonnees() {

      const messagesData =
        await getDocs(
          collection(db, "messages")
        );

      setMessages(
        messagesData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );

      const imagesData =
        await getDocs(
          collection(db, "images")
        );

      setImages(
        imagesData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );

      const livreData =
        await getDocs(
          collection(db, "livredor")
        );

      setLivreDor(
        livreData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );

    }

    chargerDonnees();

  }, [access]);

  async function supprimerMessage(id) {

    const confirmation =
      window.confirm(
        "Supprimer ce message ?"
      );

    if (!confirmation) return;

    await deleteDoc(
      doc(db, "messages", id)
    );

    setMessages(
      messages.filter(
        (msg) => msg.id !== id
      )
    );

  }

  async function supprimerImage(id) {

    const confirmation =
      window.confirm(
        "Supprimer cette image ?"
      );

    if (!confirmation) return;

    await deleteDoc(
      doc(db, "images", id)
    );

    setImages(
      images.filter(
        (img) => img.id !== id
      )
    );

  }

  async function supprimerLivreDor(id) {

    const confirmation =
      window.confirm(
        "Supprimer cette page du Livre d'Or ?"
      );

    if (!confirmation) return;

    await deleteDoc(
      doc(db, "livredor", id)
    );

    setLivreDor(
      livreDor.filter(
        (page) => page.id !== id
      )
    );

  }

  if (!access) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">

        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

          <h1 className="text-4xl font-bold text-center mb-8">

            🔐 Administration

          </h1>

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full p-4 rounded-2xl border mb-6"
          />

          <button
            onClick={checkPassword}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
          >

            Entrer

          </button>

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-12">

          🔐 Administration

        </h1>

        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <h3 className="text-xl font-bold">

              💌 Messages

            </h3>

            <p className="text-4xl mt-4">

              {messages.length}

            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <h3 className="text-xl font-bold">

              📖 Livre d'Or

            </h3>

            <p className="text-4xl mt-4">

              {livreDor.length}

            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <h3 className="text-xl font-bold">

              📸 Images

            </h3>

            <p className="text-4xl mt-4">

              {images.length}

            </p>

          </div>

        </div>

        {/* MESSAGES */}

        <div className="mb-20">

          <h2 className="text-3xl font-bold mb-8">

            💌 Messages

          </h2>

          <div className="space-y-6">

            {messages.map((msg) => (

              <div
                key={msg.id}
                className="bg-white rounded-3xl shadow-lg p-6"
              >

                <h3 className="text-2xl font-bold mb-2">

                  🌸 {msg.nom}

                </h3>

                <p className="mb-4">

                  {msg.texte}

                </p>

                <button
                  onClick={() =>
                    supprimerMessage(
                      msg.id
                    )
                  }
                  className="px-5 py-3 rounded-2xl bg-red-500 text-white"
                >

                  🗑 Supprimer

                </button>

              </div>

            ))}

          </div>

        </div>

        {/* LIVRE D'OR */}

        <div className="mb-20">

          <h2 className="text-3xl font-bold mb-8">

            📖 Livre d'Or

          </h2>

          <div className="space-y-6">

            {livreDor.map((page) => (

              <div
                key={page.id}
                className="bg-white rounded-3xl shadow-lg p-6"
              >

                <h3 className="text-2xl font-bold mb-2">

                  🌸 {page.nom}

                </h3>

                {page.ville && (

                  <p className="text-green-700 mb-3">

                    📍 {page.ville}

                  </p>

                )}

                <p className="mb-4">

                  {page.texte}

                </p>

                <p className="text-gray-500 mb-4">

                  📅 {page.date}

                </p>

                <button
                  onClick={() =>
                    supprimerLivreDor(
                      page.id
                    )
                  }
                  className="px-5 py-3 rounded-2xl bg-red-500 text-white"
                >

                  🗑 Supprimer

                </button>

              </div>

            ))}

          </div>

        </div>

        {/* IMAGES */}

        <div>

          <h2 className="text-3xl font-bold mb-8">

            📸 Images

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {images.map((img) => (

              <div
                key={img.id}
                className="bg-white rounded-3xl shadow-lg p-4"
              >

                <img
                  src={img.url}
                  alt="Souvenir"
                  className="rounded-2xl mb-4"
                />

                <p className="font-semibold mb-4">

                  🌸 {img.auteur}

                </p>

                <button
                  onClick={() =>
                    supprimerImage(
                      img.id
                    )
                  }
                  className="px-5 py-3 rounded-2xl bg-red-500 text-white"
                >

                  🗑 Supprimer

                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}