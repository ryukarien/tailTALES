import { getAuth } from 'firebase-admin/auth'
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'

// Uses the same Firebase project as the client (tailtales-66e93). The service
// account key comes from Firebase Console > Project settings > Service accounts
// > Generate new private key. Put its contents in the FIREBASE_SERVICE_ACCOUNT
// env var (as a single-line JSON string) on whatever host runs this server.
initializeApp({
  credential: process.env.FIREBASE_SERVICE_ACCOUNT
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : applicationDefault(),
})

// Requires a valid Google-signed Firebase ID token on every request. This is
// the actual security boundary — the client's Authorization header is the
// only thing we trust to say who's asking, everything after this checks
// ownership in the database, never in the UI.
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing Authorization header' })

  try {
    const decoded = await getAuth().verifyIdToken(token)
    req.uid = decoded.uid
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}