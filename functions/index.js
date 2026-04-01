const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
db.settings({ databaseId: "admiterepoli" });

exports.gumroadWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // Verificare token secret
  const expectedToken = functions.config().webhook?.token;
  if (!expectedToken || req.query.token !== expectedToken) {
    console.warn("Token invalid sau lipsă");
    return res.status(401).send("Unauthorized");
  }

  const { email, product_permalink, sale_id, refunded } = req.body;

  if (!email) {
    console.error("Webhook primit fără email");
    return res.status(400).send("Missing email");
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const userRecord = await admin.auth().getUserByEmail(normalizedEmail);
    const uid = userRecord.uid;

    if (refunded === "true" || refunded === true) {
      await db.collection("users").doc(uid).set(
        { status: "free", refundedAt: admin.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
      console.log(`Status revenit la 'free' pentru ${normalizedEmail} (uid: ${uid})`);
      return res.status(200).send("Refund processed");
    }

    await db.collection("users").doc(uid).set(
      {
        status: "paid",
        gumroadSaleId: sale_id || null,
        gumroadProduct: product_permalink || null,
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`Status actualizat la 'paid' pentru ${normalizedEmail} (uid: ${uid})`);
    return res.status(200).send("OK");
  } catch (e) {
    if (e.code === "auth/user-not-found") {
      console.error(`Niciun user Firebase cu emailul: ${normalizedEmail}`);
      return res.status(404).send("User not found");
    }
    console.error("Eroare webhook:", e);
    return res.status(500).send("Internal error");
  }
});
