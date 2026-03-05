import admin from "firebase-admin"

let app: admin.app.App | null = null

function getApp() {
  if (app) return app
  const projectId = process.env.FIREBASE_PROJECT_ID as string
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL as string
  const privateKey = JSON.parse(`"${process.env.FIREBASE_PRIVATE_KEY}"`)
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  
  if (!app) {
    if (admin.apps.length > 0) {
      app = admin.apps[0]
    } else {
      app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: storageBucket,
      })
    }
  }
  return app
}

export function getAdminDb() {
  const a = getApp()
  return admin.firestore(a)
}

export function getAdminStorageBucket() {
  const a = getApp()
  // This uses the default bucket provided in initializeApp, which is usually projectId.appspot.com
  // or the explicit storageBucket value if provided.
  const bucket = admin.storage(a).bucket()
  
  // Log the bucket name to help with debugging if it fails
  if (!bucket.name) {
    console.warn("[v0] Storage bucket name is empty. Make sure NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is set correctly.")
  }
  
  return bucket
}
