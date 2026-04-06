import ReactNativeBlobUtil from 'react-native-blob-util';
import { createCipheriv } from 'react-native-quick-crypto';

import { API_BASE_URL } from '@env';
import { getToken } from './tokenService';

//---------------------------------------
export interface IEncryptionKeyResponse {
  key: string; // base64-encoded 32-byte key
  iv: string; // base64-encoded 12-byte IV
  algorithm: string; // "aes-256-gcm"
}

//---------------------------------------
export interface IEncryptionResult {
  encryptedFilePath: string;
  iv: string; // base64
  authTag: string; // base64
  algorithm: string;
}

//---------------------------------------
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

//---------------------------------------
const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

//---------------------------------------
/**
 * Fetch a one-time encryption key + iv from the backend.
 * Key is returned as a base64 string; caller keeps it in a local variable only.
 */
export const fetchEncryptionKey =
  async (): Promise<IEncryptionKeyResponse> => {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/recordings/encryption-key`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch encryption key: ${response.status}`);
    }

    const json: any = await response.json();
    return json?.data ?? json;
  };

//---------------------------------------
/**
 * Encrypt a file on disk with AES-256-GCM.
 * Returns the path of the .enc file plus iv and authTag for upload metadata.
 * The caller is responsible for deleting the original file afterward.
 */
export const encryptFile = async (
  sourceFilePath: string,
  base64Key: string,
  base64Iv: string,
): Promise<IEncryptionResult> => {
  const cleanPath = sourceFilePath.replace('file://', '');

  // Read entire file as base64, convert to Uint8Array
  const fileBase64 = await ReactNativeBlobUtil.fs.readFile(cleanPath, 'base64');
  const fileData = base64ToUint8Array(fileBase64);

  // Decode key and IV from base64 to Uint8Array
  const key = base64ToUint8Array(base64Key);
  const iv = base64ToUint8Array(base64Iv);

  // Encrypt with AES-256-GCM
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const updated = cipher.update(fileData);
  const final = cipher.final();
  const authTag = cipher.getAuthTag();

  // Combine encrypted chunks
  const ciphertext = new Uint8Array(updated.length + final.length);
  ciphertext.set(new Uint8Array(updated), 0);
  ciphertext.set(new Uint8Array(final), updated.length);

  const authTagBytes = new Uint8Array(authTag);

  // Write [IV 12b][ciphertext][authTag 16b] to .enc file — self-describing format
  const fileContent = new Uint8Array(iv.length + ciphertext.length + authTagBytes.length);
  fileContent.set(iv, 0);
  fileContent.set(ciphertext, iv.length);
  fileContent.set(authTagBytes, iv.length + ciphertext.length);

  const encryptedFilePath = cleanPath.replace(/\.[^.]+$/, '.enc');
  await ReactNativeBlobUtil.fs.writeFile(
    encryptedFilePath,
    uint8ArrayToBase64(fileContent),
    'base64',
  );

  return {
    encryptedFilePath,
    iv: base64Iv,
    authTag: uint8ArrayToBase64(authTagBytes),
    algorithm: 'aes-256-gcm',
  };
};

//---------------------------------------
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

/**
 * Parse IV and authTag from a self-describing .enc file: [IV 12b][ciphertext][authTag 16b].
 * Returns base64-encoded iv and authTag.
 */
export const parseEncFileHeaders = async (
  filePath: string,
): Promise<{ iv: string; authTag: string }> => {
  const cleanPath = filePath.replace('file://', '');
  const fileBase64 = await ReactNativeBlobUtil.fs.readFile(cleanPath, 'base64');
  const bytes = base64ToUint8Array(fileBase64);

  if (bytes.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error('Invalid .enc file: too small to contain IV and authTag');
  }

  const iv = bytes.slice(0, IV_LENGTH);
  const authTag = bytes.slice(bytes.length - AUTH_TAG_LENGTH);

  return {
    iv: uint8ArrayToBase64(iv),
    authTag: uint8ArrayToBase64(authTag),
  };
};
