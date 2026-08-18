const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

async function requireAdmin(request) {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in first.");
  const snap = await getFirestore().doc(`users/${request.auth.uid}`).get();
  if (!snap.exists || snap.data().role !== "Admin") throw new HttpsError("permission-denied", "Admin access required.");
}

exports.adminSetUserRole = onCall(async (request) => {
  await requireAdmin(request);
  const { uid, role } = request.data || {};
  if (!uid || !["Admin", "Customer"].includes(role)) throw new HttpsError("invalid-argument", "Valid uid and role are required.");
  await getFirestore().doc(`users/${uid}`).set({ role }, { merge: true });
  return { ok: true };
});

exports.adminDeleteUser = onCall(async (request) => {
  await requireAdmin(request);
  const { uid } = request.data || {};
  if (!uid) throw new HttpsError("invalid-argument", "uid is required.");
  if (uid === request.auth.uid) throw new HttpsError("failed-precondition", "You cannot delete your own admin account.");
  await getAuth().deleteUser(uid);
  await getFirestore().doc(`users/${uid}`).delete();
  return { ok: true };
});
