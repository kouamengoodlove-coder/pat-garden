const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Secrets à configurer une seule fois avec:
//   firebase functions:secrets:set GMAIL_USER
//   firebase functions:secrets:set GMAIL_APP_PASSWORD
// (GMAIL_APP_PASSWORD = un "mot de passe d'application" Google, pas ton mot de passe normal)
const GMAIL_USER = defineSecret("GMAIL_USER");
const GMAIL_APP_PASSWORD = defineSecret("GMAIL_APP_PASSWORD");

// L'adresse qui doit recevoir les notifications (toi)
const DESTINATAIRE = "TON_EMAIL@exemple.com"; // <-- remplace par ton email avant de déployer

function creerTransporteur() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER.value(),
      pass: GMAIL_APP_PASSWORD.value(),
    },
  });
}

async function envoyerEmail(sujet, texte) {
  const transporteur = creerTransporteur();
  await transporteur.sendMail({
    from: `"Le Jardin de Patricia" <${GMAIL_USER.value()}>`,
    to: DESTINATAIRE,
    subject: sujet,
    text: texte,
  });
}

exports.notifierNouveauMessageLivreDor = onDocumentCreated(
  { document: "livredor/{id}", secrets: [GMAIL_USER, GMAIL_APP_PASSWORD] },
  async (event) => {
    const data = event.data.data();
    await envoyerEmail(
      "Nouvelle signature dans le Livre d'Or",
      `${data.nom} vient de signer le Livre d'Or.\n\nMessage : ${data.texte}\n\nVille : ${data.ville || "non renseignée"}`
    );
  }
);

exports.notifierNouvellePhoto = onDocumentCreated(
  { document: "images/{id}", secrets: [GMAIL_USER, GMAIL_APP_PASSWORD] },
  async (event) => {
    const data = event.data.data();
    await envoyerEmail(
      "Nouvelle photo en attente de validation",
      `${data.auteur} a envoyé une nouvelle photo.\n\nElle est en attente de validation dans l'espace Admin avant d'être visible publiquement.\n\nLien : ${data.url}`
    );
  }
);
