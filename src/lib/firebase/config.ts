import { env } from "@/src/env";
import type { FirebaseOptions } from "firebase/app";

const config: Record<string, string> = {
	apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
} satisfies FirebaseOptions;

// When deployed, there are quotes that need to be stripped
for (const key in config) {
	const configValue = `${config[key]}`;
	if (configValue.startsWith('"')) {
		config[key] = configValue.substring(1, configValue.length - 1);
	}
}

export const firebaseConfig = config;
