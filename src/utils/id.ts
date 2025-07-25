/**
 * Generate a MongoDB-compatible ObjectId string
 * This generates a 24-character hexadecimal string similar to MongoDB ObjectIds
 */
export function generateId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomBytes = Array.from({ length: 5 }, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');
  const counter = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  
  return timestamp + randomBytes + counter;
}

/**
 * Generate a simple unique string ID
 */
export function generateSimpleId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
