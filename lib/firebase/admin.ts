import admin from "firebase-admin"

let app: admin.app.App | null = null

function getApp() {
  if (app) return app
  const projectId = process.env.FIREBASE_PROJECT_ID as string
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL as string
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY as string
  const privateKey = privateKeyRaw?.replace(/\\n/g, "\n")
  app =
    admin.apps[0] ??
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  return app
}

export function getAdminDb() {
  const a = getApp()
  return admin.firestore(a)
}
