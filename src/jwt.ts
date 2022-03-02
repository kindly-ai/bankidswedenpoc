import jwt, { JwtPayload } from 'jsonwebtoken';
import path from 'node:path';
import * as fs from 'node:fs';

const privKeyPath = path.join(__dirname, '..', 'certs', 'kindly-chat-auth', 'private.pem');
const privKey = fs.readFileSync(privKeyPath);

export const HS256_SECRET = 'secret';

// should equal bankid CompletionData.user
export interface BankIDUser {
  personalNumber: string;
  name: string;
  givenName: string;
  surname: string;
}

type BaseJWT = Pick<JwtPayload, 'iat' | 'exp' | 'iss' | 'sub'>;

export interface LocalAppJWT extends BaseJWT {
  user: BankIDUser;
}

export interface KindlyChatJWT extends BaseJWT {
  name?: string;
  email?: string;
  email_verified?: boolean;
  phone_number?: string;
  phone_number_verified?: boolean;
  picture?: string;
  chat?: {
    id: string;
    webhook_domains: string[];
  };
}

export function issueLocalJWT(user: BankIDUser): string {
  const payload: Pick<LocalAppJWT, 'iss' | 'sub' | 'user'> = {
    iss: 'bankid poc',
    sub: user.personalNumber,
    user,
  };
  return jwt.sign(payload, HS256_SECRET, { expiresIn: '30m' });
}

export function issueKindlyChatJWT(localJWT: LocalAppJWT, chatId: string): string {
  const payload: Pick<KindlyChatJWT, 'iss' | 'sub' | 'name' | 'chat'> = {
    iss: localJWT.iss,
    sub: localJWT.sub,
    name: localJWT.user.name,
    chat: {
      id: chatId,
      webhook_domains: ['example.com'],
    },
  };
  return jwt.sign(payload, privKey, {
    algorithm: 'RS256',
    expiresIn: '5m',
  });
}
