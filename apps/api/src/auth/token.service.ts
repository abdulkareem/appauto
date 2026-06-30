import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

type JwtPayload = Record<string, unknown> & { exp?: number };

@Injectable()
export class TokenService {
  sign(payload: Record<string, unknown>, secret: string, expiresInSeconds: number) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const body = { ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSeconds };
    const unsigned = `${this.encode(header)}.${this.encode(body)}`;
    return `${unsigned}.${this.signature(unsigned, secret)}`;
  }

  verify<T extends JwtPayload>(token: string, secret: string): T {
    const [encodedHeader, encodedBody, signature] = token.split('.');
    if (!encodedHeader || !encodedBody || !signature) throw new UnauthorizedException('Invalid token format');
    const unsigned = `${encodedHeader}.${encodedBody}`;
    const expected = this.signature(unsigned, secret);
    if (!this.safeEqual(signature, expected)) throw new UnauthorizedException('Invalid token signature');
    const payload = JSON.parse(Buffer.from(encodedBody, 'base64url').toString('utf8')) as T;
    if (payload.exp && payload.exp <= Math.floor(Date.now() / 1000)) throw new UnauthorizedException('Token expired');
    return payload;
  }

  private encode(value: unknown) {
    return Buffer.from(JSON.stringify(value)).toString('base64url');
  }

  private signature(value: string, secret: string) {
    return createHmac('sha256', secret).update(value).digest('base64url');
  }

  private safeEqual(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
  }
}
