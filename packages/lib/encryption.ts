/**
 * Client-side encryption utilities for sensitive data like HA tokens
 * Uses Web Crypto API for secure encryption/decryption
 */

// Secret salt for key derivation (should be in environment variables in production)
const ENCRYPTION_SALT = process.env.NEXT_PUBLIC_ENCRYPTION_SALT || 'casa-board-encryption-salt-2024';

/**
 * Derive an encryption key from user session data
 * @param userId - User ID from Supabase auth
 * @param sessionId - Session ID (can be derived from user data)
 * @returns Promise<CryptoKey> - Derived encryption key
 */
async function deriveEncryptionKey(userId: string, sessionId: string): Promise<CryptoKey> {
  // Combine user ID and session ID with salt
  const keyMaterial = `${userId}-${sessionId}-${ENCRYPTION_SALT}`;
  
  // Convert to ArrayBuffer
  const keyData = new TextEncoder().encode(keyMaterial);
  
  // Import the key material
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Derive the actual encryption key
  const salt = new TextEncoder().encode(ENCRYPTION_SALT);
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  return derivedKey;
}

/**
 * Encrypt a plain text token
 * @param plainText - The token to encrypt
 * @param userId - User ID for key derivation
 * @param sessionId - Session ID for key derivation
 * @returns Promise<string> - Base64 encoded encrypted data
 */
export async function encryptToken(
  plainText: string, 
  userId: string, 
  sessionId: string
): Promise<string> {
  try {
    const key = await deriveEncryptionKey(userId, sessionId);
    
    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Convert plain text to ArrayBuffer
    const data = new TextEncoder().encode(plainText);
    
    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode.apply(null, Array.from(combined)));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt token');
  }
}

/**
 * Decrypt an encrypted token
 * @param encryptedData - Base64 encoded encrypted data
 * @param userId - User ID for key derivation
 * @param sessionId - Session ID for key derivation
 * @returns Promise<string> - Decrypted plain text token
 */
export async function decryptToken(
  encryptedData: string, 
  userId: string, 
  sessionId: string
): Promise<string> {
  try {
    const key = await deriveEncryptionKey(userId, sessionId);
    
    // Convert from base64
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encrypted
    );
    
    // Convert back to string
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt token');
  }
}

/**
 * Check if a string is encrypted (base64 format with expected length)
 * @param data - String to check
 * @returns boolean - True if data appears to be encrypted
 */
export function isEncrypted(data: string): boolean {
  try {
    // Check if it's valid base64
    const decoded = atob(data);
    // Encrypted data should be at least 12 bytes (IV) + some encrypted content
    return decoded.length >= 12;
  } catch {
    return false;
  }
}

/**
 * Generate a session ID from user data
 * This creates a consistent session identifier for key derivation
 * @param userId - User ID from Supabase
 * @param userEmail - User email (optional, for additional entropy)
 * @returns string - Session identifier
 */
export function generateSessionId(userId: string, userEmail?: string): string {
  // Create a consistent session ID based on user data
  const sessionData = `${userId}-${userEmail || ''}-${Date.now().toString().slice(-6)}`;
  return btoa(sessionData).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
}
