import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "../env";

const firebaseAdminConfig = {
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: (env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  }),
};

let adminAuth: any;

if (getApps().length === 0) {
  const app = initializeApp(firebaseAdminConfig);
  adminAuth = getAuth(app);
} else {
  adminAuth = getAuth(getApps()[0]);
}

export { adminAuth };
