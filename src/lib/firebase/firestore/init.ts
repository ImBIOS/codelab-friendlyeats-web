import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

// Because of hot-reloading, this file is executed multiple times by Next.js
if (!admin.apps.length)
	admin.initializeApp({
		// If GOOGLE_APPLICATION_CREDENTIALS is set, use it to initialize the
		// admin SDK.
		credential: applicationDefault(),
	});

// Export the admin client, so you can use it
export { admin };
