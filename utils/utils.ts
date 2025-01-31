import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "./constant";


export function uuidToBinary(uuid: string): Buffer {
  return Buffer.from(uuid.replace(/-/g, ''), 'hex');
}


export function binaryToUuid(binary: Uint8Array): string {
  const hex = Array.from(binary).map(byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export const extractUserFromToken = (authHeader: any): { userId: number; email: string } => {


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error(ERROR_MESSAGES.INVALID_HEADER);
  } 
  
  const token = authHeader.split(' ')[1];
  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
      throw new Error("Server configuration error: SECRET_KEY is not defined.");
  }

  try {
      const decoded = jwt.verify(token, secretKey) as { userId: string; email: string };
      return {
          userId: Number(decoded.userId),
          email: decoded.email,
      };
  } catch (err) {
      throw new Error("Invalid or expired token.");
  }
};