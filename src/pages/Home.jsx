import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

import gardenHero from "../assets/garden-hero.jpg";
import photo1 from "../assets/souvenirs/photo1.jpg";
import photo2 from "../assets/souvenirs/photo2.jpg";
import photo3 from "../assets/souvenirs/photo3.jpg";
import photo4 from "../assets/souvenirs/photo4.jpg";
import photo5 from "../assets/souvenirs/photo5.jpg";

export default function Home() {
  const photos = [photo1, photo2, photo3, photo4, photo5];
  const [photoActuelle, setPhotoActuelle] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhotoActuelle((a) => (a + 1) % photos.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const citationsParDefaut = [
    "Chaque souvenir est une fleur qui continue de fleurir dans le cœur.",
    "Les plus belles personnes laissent des jardins dans les cœurs.",
    "Là où l'amour passe, les fleurs poussent.",
    "Un sourire sincère éclaire plus qu'un soleil.",
    "Certaines personnes deviennent des souvenirs, d'autres deviennent des jardins.",
  ];

  const [citations, setCitations] = useState(citationsParDefaut);

  useEffect(() => {
    async function chargerCitations() {
      const data = await getDocs(collection(db, "citations"));
      const liste = data.docs.map((doc) => doc.data().texte).filter(Boolean);
      if (liste.length > 0) setCitations(liste);
    }
    chargerCitations();
  }, []);

  const citation = citations[new Date().getDate() % citations.length];

  const aujourdHui = new Date();
  const anniversaire = new Date(aujourdHui.getFullYear(), 6, 18);
  const joursRestants = Math.ceil((anniversaire - aujourdHui) / (1000 * 60 * 60 * 24));

  const galerie = [
    photos[photoActuelle],
    photos[(photoActuelle + 1) % photos.length],
    photos[(photoActuelle + 2) % photos.length],
  ];

  const legendes = [
    "Un après-midi ordinaire, rendu précieux.",
    "Ce sourire-là, celui qu'on n'oublie pas.",
    "Un moment volé, gardé ici pour toujours.",
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-terracotta font-medium mb-4 block">
              Un espace de souvenirs
            </span>
            <h1 className="text-5xl md:text-6xl leading-[1.05] text-pine mb-6">
              Bienvenue dans <br />
              <em className="not-italic font-display italic text-terracotta">le jardin</em> de Patricia
            </h1>
            <p className="text-lg text-pine-soft mb-9 max-w-md">
              Un espace qui garde ce qui compte : les instants, les mots, les visages qu'on aime revoir.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/garden">
                <button className="px-7 py-3.5 rounded-full bg-pine text-cream font-medium hover:-translate-y-0.5 transition">
                  Explorer le jardin
                </button>
              </Link>
              <Link to="/livredor">
                <button className="px-7 py-3.5 rounded-full border border-pine text-pine font-medium hover:-translate-y-0.5 transition">
                  Livre d'or
                </button>
              </Link>
              <Link to="/souvenirs">
                <button className="px-7 py-3.5 rounded-full border border-line text-pine-soft font-medium hover:-translate-y-0.5 transition">
                  Souvenirs
                </button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={gardenHero}
              alt="Le Jardin de Patricia"
              className="w-full h-[440px] object-cover rounded-tr-[64px] rounded-bl-md rounded-tl-md rounded-br-md shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-3xl font-display text-pine">Quelques instants</h2>
          <span className="text-sm text-pine-soft">Trois souvenirs, choisis au hasard</span>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {galerie.map((photo, index) => (
            <figure key={index} className={index === 1 ? "mt-7" : ""}>
              <img src={photo} alt="Souvenir" className="w-full h-72 object-cover rounded" />
              <figcaption className="text-sm text-pine-soft italic mt-2.5">
                {legendes[index]}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CITATION + COMPTE A REBOURS */}
      <section className="max-w-5xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-5">
        <div className="bg-white border border-line rounded p-9">
          <span className="font-display text-4xl text-terracotta leading-none block mb-3">"</span>
          <p className="font-display italic text-xl text-pine leading-snug">{citation}</p>
        </div>

        <div className="bg-pine rounded p-9 flex flex-col justify-center">
          {joursRestants > 0 ? (
            <>
              <span className="text-xs uppercase tracking-wide text-sage-light mb-2">
                Anniversaire
              </span>
              <span className="font-display text-4xl text-honey">{joursRestants} jours</span>
              <span className="text-sm text-cream/70 mt-1">
                avant que le jardin fête Patricia
              </span>
            </>
          ) : (
            <span className="font-display text-3xl text-honey">
              Joyeux anniversaire Patricia !
            </span>
          )}
        </div>
      </section>

      {/* BAS */}
      <section className="pb-16 text-center border-t border-line pt-10 max-w-6xl mx-auto px-6">
        <p className="font-display italic text-pine-soft text-lg">
          Merci de contribuer à faire fleurir ce jardin de souvenirs.
        </p>
      </section>
    </div>
  );
}
