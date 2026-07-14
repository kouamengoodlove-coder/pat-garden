export default function GardenHeader() {
  const aujourdHui = new Date();
  const jour = aujourdHui.getDate();
  const mois = aujourdHui.getMonth() + 1;

  const citations = [
    "Les souvenirs sont les fleurs du temps.",
    "Les plus beaux jardins poussent dans le cœur.",
    "Chaque souvenir est une graine de bonheur.",
    "Certaines personnes deviennent des souvenirs, d'autres deviennent des jardins.",
    "Là où l'amour passe, les fleurs poussent.",
  ];

  const citationDuJour = citations[aujourdHui.getDate() % citations.length];

  const anniversaireAujourdHui = jour === 18 && mois === 7;

  const ouverture = new Date(aujourdHui.getFullYear(), 5, 1);
  const difference = ouverture - aujourdHui;
  const joursRestants = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return (
    <div className="text-center mb-10">
      <span className="text-xs uppercase tracking-widest text-terracotta font-medium">
        Le jardin
      </span>
      <h1 className="text-4xl md:text-5xl text-pine mt-2 mb-5">
        Le Jardin de Patricia
      </h1>

      <p className="text-pine-soft text-lg mb-6 max-w-md mx-auto">
        Un espace de souvenirs, de douceur et de belles pensées.
      </p>

      <div className="bg-white border border-line rounded-xl p-6 mb-4">
        <p className="font-display italic text-terracotta text-lg">
          {citationDuJour}
        </p>
      </div>

      {anniversaireAujourdHui && (
        <div className="bg-honey/15 text-terracotta-dark rounded-xl p-5 font-medium text-xl">
          Joyeux anniversaire Patricia
        </div>
      )}

      {!anniversaireAujourdHui && joursRestants > 0 && (
        <div className="bg-pine text-cream rounded-xl p-5 font-medium">
          Le jardin ouvrira dans {joursRestants} jours
        </div>
      )}
    </div>
  );
}
