import { env } from "@/src/env";
import * as admin from "firebase-admin";

// Because of hot-reloading, this file is executed multiple times by Next.js
if (!admin.apps.length)
	admin.initializeApp({
		// If GOOGLE_APPLICATION_CREDENTIALS is set, use it to initialize the
		// admin SDK.
		credential: admin.credential.cert(
			JSON.parse(env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
		),
	});

// Export the admin client, so you can use it
export { admin };
