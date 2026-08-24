import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const KEYLEN = 64;
const COST = 2 ** 15;

export async function hashPassword(plain) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(plain, salt, KEYLEN, { N: COST });
  return `scrypt$${COST}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export async function verifyPassword(plain, stored) {
  const [scheme, costStr, saltHex, hashHex] = stored.split('$');
  if (scheme !== 'scrypt') return false;
  const cost = Number(costStr);
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scryptAsync(plain, salt, expected.length, { N: cost });
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
