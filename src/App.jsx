import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Garden from "./pages/Garden";
import Souvenirs from "./pages/Souvenirs";
import LivreDor from "./pages/LivreDor";
import Admin from "./pages/Admin";

import NavBar from "./components/NavBar";
import MusicPlayer from "./components/MusicPlayer";

export default function App() {
  return (
    <div className="bg-white min-h-screen">
      <BrowserRouter>
        <NavBar />
        <MusicPlayer />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/garden" element={<Garden />} />
            <Route path="/souvenirs" element={<Souvenirs />} />
            <Route path="/livredor" element={<LivreDor />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}