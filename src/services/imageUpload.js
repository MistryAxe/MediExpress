import { storage, db } from '../config/firebaseClient';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';

const uriToBlob = async (uri) => {
  const response = await fetch(uri);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
  return await response.blob();
};

export const uploadProfilePicture = async (userId, imageUri) => {
  try {
    if (!userId) throw new Error('User ID is required');

    if (!imageUri) {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { profilePicture: null, updatedAt: Date.now() });
      try { await deleteObject(ref(storage, `profile-pictures/${userId}.jpg`)); } catch {}
      return null;
    }

    const timestamp = Date.now();
    const imageRef = ref(storage, `profile-pictures/${userId}_${timestamp}.jpg`);
    const blob = await uriToBlob(imageUri);
    const metadata = { contentType: 'image/jpeg', customMetadata: { uploadedBy: userId, uploadedAt: new Date().toISOString() }};
    const snapshot = await uploadBytes(imageRef, blob, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    await updateDoc(doc(db, 'users', userId), { profilePicture: downloadURL, updatedAt: Date.now() });
    return downloadURL;
  } catch (error) {
    console.error('Detailed error in uploadProfilePicture:', { message: error.message, code: error.code, serverResponse: error.serverResponse, customData: error.customData });
    if (error.code === 'storage/unauthorized') throw new Error('You do not have permission to upload images.');
    if (error.code === 'storage/canceled') throw new Error('Upload was canceled');
    if (error.code === 'storage/unknown') throw new Error('Upload failed due to a server error. Please try again.');
    throw new Error(error.message || 'Failed to upload image');
  }
};

export const deleteProfilePicture = async (userId) => {
  try {
    await deleteObject(ref(storage, `profile-pictures/${userId}.jpg`));
    await updateDoc(doc(db, 'users', userId), { profilePicture: null, updatedAt: Date.now() });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    throw error;
  }
};
