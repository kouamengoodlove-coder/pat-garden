import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import gardenHero from "../assets/garden-hero.jpg";

import photo1 from "../assets/souvenirs/photo1.jpg";
import photo2 from "../assets/souvenirs/photo2.jpg";
import photo3 from "../assets/souvenirs/photo3.jpg";
import photo4 from "../assets/souvenirs/photo4.jpg";
import photo5 from "../assets/souvenirs/photo5.jpg";

export default function Home() {

  const photos = [
    photo1,
    photo2,
    photo3,
    photo4,
    photo5
  ];

  const [photoActuelle, setPhotoActuelle] =
    useState(0);

  useEffect(() => {

    const timer = setInterval(() => {

      setPhotoActuelle((ancienne) =>
        (ancienne + 1) % photos.length
      );

    }, 10000);

    return () => clearInterval(timer);

  }, []);

  const citations = [

    "🌸 Chaque souvenir est une fleur qui continue de fleurir dans le cœur.",

    "💫 Les plus belles personnes laissent des jardins dans les cœurs.",

    "🌿 Là où l'amour passe, les fleurs poussent.",

    "🌺 Un sourire sincère éclaire plus qu'un soleil.",

    "✨ Certaines personnes deviennent des souvenirs, d'autres deviennent des jardins."

  ];

  const citation =
    citations[
      new Date().getDate() %
      citations.length
    ];

  const aujourdHui = new Date();

  const anniversaire =
    new Date(
      aujourdHui.getFullYear(),
      6,
      18
    );

  const difference =
    anniversaire - aujourdHui;

  const joursRestants =
    Math.ceil(
      difference /
      (1000 * 60 * 60 * 24)
    );

  const galerie = [

    photos[photoActuelle],

    photos[
      (photoActuelle + 1) %
      photos.length
    ],

    photos[
      (photoActuelle + 2) %
      photos.length
    ]

  ];

  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50">

      {/* HERO */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div>

            <span className="inline-block px-5 py-2 rounded-full bg-pink-100 text-pink-700 font-medium mb-6">

              🌸 Le Jardin de Patricia

            </span>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight mb-6">

              Bienvenue dans

              <br />

              <span className="text-pink-600">

                le Jardin de Patricia

              </span>

            </h1>

            <p className="text-xl text-gray-600 mb-10">

              Un espace plein d'amour,
              de souvenirs et de petites fleurs
              pour une personne extraordinaire.

            </p>

            <div className="flex flex-wrap gap-4">

              <Link to="/garden">

                <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold shadow-xl hover:scale-105 transition">

                  🌸 Explorer le Jardin

                </button>

              </Link>

              <Link to="/livredor">

                <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-xl hover:scale-105 transition">

                  📖 Aller au Livre d'Or

                </button>

              </Link>

            </div>

          </div>

          <div>

            <img
              src={gardenHero}
              alt="Le Jardin de Patricia"
              className="w-full rounded-3xl shadow-2xl"
            />

          </div>

        </div>

      </section>

      {/* SOUVENIRS */}

      <section className="max-w-6xl mx-auto px-6 pb-20">

        <div className="text-center mb-10">

          <h2 className="text-4xl font-bold text-pink-700">

            📸 Quelques souvenirs

          </h2>

          <p className="text-gray-600 mt-3">

            Quelques instants précieux du jardin

          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {galerie.map((photo, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >

              <img
                src={photo}
                alt="Souvenir"
                className="w-full h-80 object-cover"
              />

            </div>

          ))}

        </div>

      </section>

      {/* CITATION */}

      <section className="max-w-4xl mx-auto px-6 pb-12">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <h2 className="text-3xl font-bold text-pink-700 mb-6">

            💌 Citation du jour

          </h2>

          <p className="text-2xl italic text-pink-600">

            {citation}

          </p>

        </div>

      </section>

      {/* COMPTE À REBOURS */}

      <section className="max-w-4xl mx-auto px-6 pb-12">

        <div className="bg-gradient-to-r from-pink-100 to-green-100 rounded-3xl shadow-xl p-10 text-center">

          {joursRestants > 0 ? (

            <>

              <h2 className="text-3xl font-bold text-pink-700 mb-4">

                🎂 Compte à rebours

              </h2>

              <p className="text-2xl">

                Patricia fête son anniversaire dans

                <span className="font-bold text-pink-600">

                  {" "}
                  {joursRestants}
                  {" "}
                  jours

                </span>

              </p>

            </>

          ) : (

            <h2 className="text-4xl font-bold text-pink-700">

              🎉 Joyeux anniversaire Patricia !

            </h2>

          )}

        </div>

      </section>

      {/* BAS */}

      <section className="pb-16">

        <div className="text-center">

          <p className="text-pink-600 italic text-lg">

            🌿 Merci de contribuer à faire fleurir ce jardin de souvenirs 🌿

          </p>

        </div>

      </section>

    </div>

  );

}