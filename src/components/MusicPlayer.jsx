import { useRef, useState } from "react";

import music from "../assets/music.mp3";

export default function MusicPlayer() {

  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  function toggleMusic() {

    if (isPlaying) {

      audioRef.current.pause();

    } else {

      audioRef.current.play();

    }

    setIsPlaying(!isPlaying);
  }

  return (

    <div className="fixed bottom-6 right-6 z-50">

      <audio ref={audioRef} loop>
        <source src={music} type="audio/mp3" />
      </audio>

      <button
        onClick={toggleMusic}
        className="bg-white shadow-xl px-5 py-4 rounded-full text-2xl hover:scale-110 transition"
      >

        {isPlaying ? "⏸️" : "🎵"}

      </button>

    </div>
  );
}