export default function GardenHeader() {

  const aujourdHui = new Date();

  const jour = aujourdHui.getDate();
  const mois = aujourdHui.getMonth() + 1;

  // =========================
  // CITATIONS
  // =========================

  const citations = [

    "🌸 Les souvenirs sont les fleurs du temps.",

    "💫 Les plus beaux jardins poussent dans le cœur.",

    "🌺 Chaque souvenir est une graine de bonheur.",

    "✨ Certaines personnes deviennent des souvenirs, d'autres deviennent des jardins.",

    "🌿 Là où l'amour passe, les fleurs poussent."

  ];

  const citationDuJour =
    citations[
      aujourdHui.getDate() %
      citations.length
    ];

  // =========================
  // ANNIVERSAIRE
  // =========================

  const anniversaireAujourdHui =
    jour === 18 && mois === 7;

  // =========================
  // COMPTE A REBOURS
  // =========================

  const ouverture =
    new Date(
      aujourdHui.getFullYear(),
      5,
      1
    );

  const difference =
    ouverture - aujourdHui;

  const joursRestants =
    Math.ceil(
      difference /
      (1000 * 60 * 60 * 24)
    );

  return (

    <div className="text-center mb-12">

      {/* TITRE */}

      <h1 className="text-5xl font-bold text-gray-800 mb-6">

        🌸 Le Jardin de Patricia

      </h1>

      {/* DESCRIPTION */}

      <p className="text-gray-600 text-xl mb-6">

        Un espace de souvenirs,
        de douceur et de belles pensées.

      </p>

      {/* CITATION */}

      <div className="bg-white/80 rounded-3xl shadow-lg p-6 mb-6">

        <p className="text-pink-600 text-lg italic">

          {citationDuJour}

        </p>

      </div>

      {/* ANNIVERSAIRE */}

      {anniversaireAujourdHui && (

        <div className="bg-yellow-100 text-yellow-700 rounded-3xl shadow-lg p-6 mb-6 font-bold text-2xl">

          🎉 Joyeux anniversaire Patricia 🎂

        </div>

      )}

      {/* COMPTE A REBOURS */}

      {!anniversaireAujourdHui &&
        joursRestants > 0 && (

        <div className="bg-pink-100 text-pink-700 rounded-3xl shadow-lg p-6 font-semibold">

          🌸 Le jardin ouvrira dans
          {" "}
          {joursRestants}
          {" "}
          jours

        </div>

      )}

    </div>

  );
}