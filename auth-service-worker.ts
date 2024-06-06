/// <reference lib="webworker" />
import { type FirebaseOptions, initializeApp } from "firebase/app";
import { type Auth, getAuth, getIdToken } from "firebase/auth";
import { getInstallations, getToken } from "firebase/installations";

export default null;
declare let self: ServiceWorkerGlobalScope;

// this is set during install
let firebaseConfig: FirebaseOptions;

self.addEventListener("install", () => {
	// extract firebase config from query string
	const serializedFirebaseConfig = new URL(location.href).searchParams.get(
		"firebaseConfig",
	);

	if (!serializedFirebaseConfig) {
		throw new Error(
			"Firebase Config object not found in service worker query string.",
		);
	}

	firebaseConfig = JSON.parse(serializedFirebaseConfig);
	console.log("Service worker installed with Firebase config", firebaseConfig);
});

self.addEventListener("fetch", (event: FetchEvent) => {
	const { origin } = new URL(event.request.url);
	if (origin !== self.location.origin) return;
	event.respondWith(fetchWithFirebaseHeaders(event.request));
});

async function fetchWithFirebaseHeaders(request: Request) {
	try {
		const app = initializeApp(firebaseConfig);
		const auth = getAuth(app);
		const installations = getInstallations(app);
		const headers = new Headers(request.headers);
		const [authIdToken, installationToken] = await Promise.all([
			getAuthIdToken(auth),
			getToken(installations),
		]);
		headers.append("Firebase-Instance-ID-Token", installationToken);
		if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`);
		const newRequest = new Request(request, { headers });
		return await fetch(newRequest);
	} catch (e) {
		console.error("Error fetching with Firebase headers", e);
		return await fetch(request);
	}
}

async function getAuthIdToken(auth: Auth) {
	await auth.authStateReady();
	if (!auth.currentUser) return;
	return await getIdToken(auth.currentUser);
}
