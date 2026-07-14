import { useRef, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

import music from "../assets/music.mp3";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [panelOuvert, setPanelOuvert] = useState(false);
  const [titre, setTitre] = useState("");
  const [proposePar, setProposePar] = useState("");
  const [envoye, setEnvoye] = useState(false);

  function toggleMusic() {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  async function proposerMorceau() {
    if (titre.trim() === "") return;
    await addDoc(collection(db, "playlist"), {
      titre,
      proposePar: proposePar || "Anonyme",
      date: new Date().toLocaleDateString("fr-FR"),
    });
    setTitre("");
    setProposePar("");
    setEnvoye(true);
    setTimeout(() => setEnvoye(false), 3000);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {panelOuvert && (
        <div className="bg-white rounded-2xl shadow-xl border border-line p-5 w-72">
          <p className="font-display text-sm text-pine mb-3">Proposer un morceau</p>
          <input
            type="text"
            placeholder="Titre du morceau"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-line text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
          <input
            type="text"
            placeholder="Votre prénom (optionnel)"
            value={proposePar}
            onChange={(e) => setProposePar(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-line text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
          <button
            onClick={proposerMorceau}
            className="w-full py-2.5 rounded-lg bg-pine text-cream text-sm font-medium hover:bg-pine-soft transition"
          >
            {envoye ? "Merci !" : "Envoyer"}
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <audio ref={audioRef} loop>
          <source src={music} type="audio/mp3" />
        </audio>

        <button
          onClick={() => setPanelOuvert(!panelOuvert)}
          className="bg-white shadow-lg border border-line w-11 h-11 rounded-full text-sm hover:bg-cream-dark transition"
          aria-label="Proposer un morceau"
          title="Proposer un morceau"
        >
          +
        </button>

        <button
          onClick={toggleMusic}
          className="bg-white shadow-lg border border-line w-11 h-11 rounded-full hover:bg-cream-dark transition flex items-center justify-center"
          aria-label={isPlaying ? "Mettre en pause" : "Jouer la musique"}
        >
          <span className="text-pine text-sm">{isPlaying ? "❚❚" : "▶"}</span>
        </button>
      </div>
    </div>
  );
}
