import { initializeApp, getApps, getApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

let adminDb: FirebaseFirestore.Firestore | null = null

export function getAdminApp() {
  if (getApps().length) return getApp()

  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase admin environment variables")
  }

  privateKey = privateKey
    .replace(/^"|"$/g, "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")

  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  })

  return app
}

export function getAdminDb() {
  if (adminDb) return adminDb
  const app = getAdminApp()
  adminDb = getFirestore(app)
  return adminDb
}
