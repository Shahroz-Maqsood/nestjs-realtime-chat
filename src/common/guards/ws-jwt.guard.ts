import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwt: JwtService, private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    // Support either `auth.token` or `headers.authorization` via transports
    const tokenFromAuth = client.handshake?.auth?.token;
    const headerAuth = client.handshake?.headers?.authorization;
    const token = (tokenFromAuth || headerAuth || '').replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Missing auth token');

    try {
      const payload = this.jwt.verify(token, { secret: this.config.get('JWT_SECRET') }) as JwtPayload;
      // Store authenticated user on the supported Socket.IO data bag
      client.data.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
