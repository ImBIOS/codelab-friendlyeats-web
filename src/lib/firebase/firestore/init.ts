import { env } from "@/src/env";
import * as admin from "firebase-admin";

// Because of hot-reloading, this file is executed multiple times by Next.js
if (!admin.apps.length)
	admin.initializeApp({
		// If GOOGLE_APPLICATION_CREDENTIALS is set, use it to initialize the
		// admin SDK.
		credential: admin.credential.cert({
			clientEmail: env.FIREBASE_CLIENT_EMAIL,
			privateKey: env.FIREBASE_PRIVATE_KEY,
			projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		}),
	});

// Export the admin client, so you can use it
export { admin };
