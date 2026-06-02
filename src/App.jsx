import LivreDor from "./pages/LivreDor";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Garden from "./pages/Garden";
import Souvenirs from "./pages/Souvenirs";
import Admin from "./pages/Admin";

import MusicPlayer from "./components/MusicPlayer";

import {
  ThemeProvider,
  useTheme
} from "./context/ThemeContext";

// =========================
// CONTENU APP
// =========================

function AppContent() {

  const { darkMode, toggleTheme } =
    useTheme();

  return (

    <div
      className={
        darkMode
          ? "bg-black text-white min-h-screen transition duration-500"
          : "bg-white text-black min-h-screen transition duration-500"
      }
    >

      <BrowserRouter>

        {/* MUSIQUE */}

        <MusicPlayer />

        {/* BOUTON THEME */}

        <button
          onClick={toggleTheme}
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition"
        >

          {darkMode
            ? "☀️ Mode Jour"
            : "🌙 Mode Nuit"}

        </button>

        {/* ROUTES */}

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/livredor"
            element={<LivreDor />}
          />
          <Route
            path="/garden"
            element={<Garden />}
          />

          <Route
            path="/souvenirs"
            element={<Souvenirs />}
          />

          <Route
            path="/livredor"
            element={<LivreDor />}
          />

          <Route
            path="/admin"
            element={<Admin />}
          />
          <Route
            path="/livredor"
            element={<LivreDor />}
          />

        </Routes>

      </BrowserRouter>

    </div>

  );
}

// =========================
// APP PRINCIPALE
// =========================

export default function App() {

  return (

    <ThemeProvider>

      <AppContent />

    </ThemeProvider>

  );
}