const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
db.settings({ databaseId: "admiterepoli" });

exports.gumroadWebhook = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // Verificare token secret
  const expectedToken = process.env.WEBHOOK_TOKEN;
  if (!expectedToken || req.query.token !== expectedToken) {
    console.warn("Token invalid sau lipsă");
    return res.status(401).send("Unauthorized");
  }

  console.log("[Webhook] Body:", JSON.stringify(req.body));

  // Gumroad folosește "email" pentru sale/refund și "user_email" pentru subscription events
  const {
    email,
    user_email,
    product_permalink,
    sale_id,
    subscription_id,
    refunded,
    cancelled,
    cancelled_at,
    cancelled_by_buyer,
    cancelled_due_to_payment_failures,
    ended_at,
    ended_reason,
  } = req.body;

  const isCancellationEvent = cancelled === "true" || cancelled === true;
  const isEndedEvent = !!ended_at;

  try {
    let uid;

    // Pentru cancellation și subscription_ended, Gumroad trimite subscription_id și user_email
    // (care în test mode e emailul seller-ului, nu al cumpărătorului).
    // Căutăm userul după subscription_id salvat în Firestore — mai fiabil decât emailul.
    if ((isCancellationEvent || isEndedEvent) && subscription_id) {
      const snap = await db.collection("users")
        .where("gumroadSubscriptionId", "==", subscription_id)
        .limit(1)
        .get();

      if (snap.empty) {
        console.error(`Niciun user cu subscription_id: ${subscription_id}`);
        return res.status(404).send("User not found");
      }
      uid = snap.docs[0].id;
    } else {
      // Pentru sale/refund folosim emailul din payload
      const rawEmail = email || user_email;
      if (!rawEmail) {
        console.error("Webhook primit fără email");
        return res.status(400).send("Missing email");
      }
      const userRecord = await admin.auth().getUserByEmail(rawEmail.toLowerCase());
      uid = userRecord.uid;
    }

    // --- subscription_ended: subscripția s-a terminat efectiv (acces revocat acum) ---
    if (isEndedEvent) {
      await db.collection("users").doc(uid).set(
        {
          status: "free",
          subscriptionEndedAt: ended_at,
          subscriptionEndedReason: ended_reason || null,
        },
        { merge: true }
      );
      console.log(`Subscripție terminată pentru uid ${uid} (${ended_reason})`);
      return res.status(200).send("Subscription ended processed");
    }

    // --- cancellation: userul a cerut anulare, dar accesul continuă până la cancelled_at ---
    if (isCancellationEvent) {
      await db.collection("users").doc(uid).set(
        {
          status: "pending_cancellation",
          pendingCancellationAt: cancelled_at || null,
          cancelledByBuyer: cancelled_by_buyer === "true" || cancelled_by_buyer === true || false,
          cancelledDueToPaymentFailures: cancelled_due_to_payment_failures === "true" || cancelled_due_to_payment_failures === true || false,
        },
        { merge: true }
      );
      console.log(`Anulare programată pentru uid ${uid}, activ până la ${cancelled_at}`);
      return res.status(200).send("Cancellation processed");
    }

    // --- refund: ramburs imediat, revocare acces ---
    if (refunded === "true" || refunded === true) {
      await db.collection("users").doc(uid).set(
        { status: "free", refundedAt: admin.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
      console.log(`Refund procesat pentru uid ${uid}`);
      return res.status(200).send("Refund processed");
    }

    // --- sale: simulare plătită ---
    const isSimulare = product_permalink === "simulare_09_05" ||
      (typeof product_permalink === "string" && product_permalink.endsWith("/simulare_09_05"));
    if (isSimulare && refunded !== "true" && refunded !== true) {
      await db.collection("users").doc(uid).set(
        {
          status: "trial_pending",
          gumroadSaleId: sale_id || null,
          gumroadProduct: product_permalink,
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      console.log(`[Webhook] Trial pending activat pentru uid ${uid}`);
      return res.status(200).send("Trial pending activated");
    }

    // --- sale: cumpărare nouă sau reînnoire ---
    await db.collection("users").doc(uid).set(
      {
        status: "paid",
        gumroadSaleId: sale_id || null,
        gumroadProduct: product_permalink || null,
        gumroadSubscriptionId: subscription_id || null,
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`Status actualizat la 'paid' pentru uid ${uid}`);
    return res.status(200).send("OK");
  } catch (e) {
    if (e.code === "auth/user-not-found") {
      console.error(`Niciun user Firebase cu emailul din webhook`);
      return res.status(404).send("User not found");
    }
    console.error("Eroare webhook:", e);
    return res.status(500).send("Internal error");
  }
});

// Activare trial: 9 mai 2026, 08:00 EEST = 05:00 UTC
exports.activateTrialUsers = onSchedule({ schedule: "0 5 9 5 *", timeZone: "UTC" }, async () => {
    const snap = await db.collection("users")
      .where("status", "==", "trial_pending")
      .get();

    if (snap.empty) {
      console.log("[activateTrialUsers] Niciun user trial_pending de activat.");
      return null;
    }

    const batch = db.batch();
    snap.docs.forEach(docSnap => {
      batch.update(docSnap.ref, { status: "trial" });
    });
    await batch.commit();
    console.log(`[activateTrialUsers] ${snap.docs.length} useri trial_pending → trial`);
    return null;
  });

// Expirare trial: 12 mai 2026, 10:00 EEST = 07:00 UTC
exports.expireTrialUsers = onSchedule({ schedule: "0 7 12 5 *", timeZone: "UTC" }, async () => {
    const snap = await db.collection("users")
      .where("status", "in", ["trial", "trial_pending"])
      .get();

    if (snap.empty) {
      console.log("[expireTrialUsers] Niciun user trial/trial_pending de expirat.");
      return null;
    }

    const batch = db.batch();
    snap.docs.forEach(docSnap => {
      batch.update(docSnap.ref, { status: "free" });
    });
    await batch.commit();
    console.log(`[expireTrialUsers] ${snap.docs.length} useri trial/trial_pending → free`);
    return null;
  });
