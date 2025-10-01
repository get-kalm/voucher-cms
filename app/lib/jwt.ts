import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secretKey = process.env.JWT_SECRET || "default-secret";
const secret = new TextEncoder().encode(secretKey);

export async function signJwt(payload: JWTPayload, expiresIn = "7d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyJwt<T>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload) {
        return null;
    }
    return payload as T;
  } catch (error: any) {
    return null;
  }
}