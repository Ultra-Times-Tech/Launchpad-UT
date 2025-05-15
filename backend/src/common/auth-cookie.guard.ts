import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthCookieGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['access_token'];
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }
    try {
      // Vérifie que le secret JWT est bien défini
      if (!process.env.JWT_SECRET) {
        throw new UnauthorizedException('JWT_SECRET non défini côté serveur');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      (request as any).user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
} 