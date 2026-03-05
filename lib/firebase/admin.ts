import admin from "firebase-admin"

let app: admin.app.App | null = null

function getApp() {
  // If already initialized, return the instance
  if (app) return app

  // Check if an app instance already exists in the admin.apps array
  if (admin.apps.length > 0) {
    app = admin.apps[0]
    return app
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY
  const storageBucketRaw = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

  if (!projectId || !clientEmail || !privateKeyRaw) {
    console.error("[v0] Missing Firebase Admin environment variables:", {
      projectId: !!projectId,
      clientEmail: !!clientEmail,
      privateKey: !!privateKeyRaw
    })
    throw new Error("Missing Firebase Admin environment variables")
  }

  // Clean the private key
  const privateKey = privateKeyRaw
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n")

  // Clean storage bucket name
  const storageBucket = storageBucketRaw?.trim().replace(/^["']|["']$/g, "")

  // For debugging
  console.log(`[v0] Initializing Firebase Admin for project: ${projectId}`)
  console.log(`[v0] Using storage bucket: ${storageBucket}`)

  try {
    const bucketOptions = storageBucket ? { storageBucket } : {}
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      ...bucketOptions,
    })
    return app
  } catch (error) {
    console.error("[v0] Firebase Admin initialization error:", error)
    throw error
  }
}

export function getAdminDb() {
  const adminApp = getApp()
  return adminApp.firestore()
}

export function getAdminAuth() {
  const adminApp = getApp()
  return adminApp.auth()
}

export function getAdminStorage() {
  const adminApp = getApp()
  return adminApp.storage()
}

export function getAdminStorageBucket() {
  const adminApp = getApp()
  // Use the default bucket configured during initializeApp
  const bucket = adminApp.storage().bucket()
  console.log(`[v0] Accessing storage bucket: ${bucket.name}`)
  return bucket
}
