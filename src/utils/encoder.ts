import { DecodedData } from '@/utils/getUser';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};

const getSecret = async () => {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
  if (!secret) {
    throw new Error('JWT Secret environment variable is not set.');
  }
  return new TextEncoder().encode(secret);
};

export const generateJWT = async (payload: object) => {
  const secret = await getSecret();
  const token = await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret);
  return token;
};

export const verifyJWT = async (
  token: string
): Promise<{ verify: boolean } & Partial<DecodedData>> => {
  try {
    const secret = await getSecret();
    const decoded = await jose.jwtVerify(token, secret);
    return { verify: true, ...decoded.payload };
  } catch (error) {
    console.error(error);
    return { verify: false };
  }
};

export const getCookie = (name: string) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};
