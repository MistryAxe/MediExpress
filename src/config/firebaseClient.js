import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseClientConfig } from './firebaseClientConfig';

let app;
if (!getApps().length) {
  app = initializeApp(firebaseClientConfig);
} else {
  app = getApps()[0];
}

export const firebaseApp = app;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
