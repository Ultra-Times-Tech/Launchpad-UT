import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { AuthCookieGuard } from '../../common/auth-cookie.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('ultra-token')
  async getUltraToken(@Res() res: Response) {
    const tokenData = await this.authService.getUltraToken();
    // Génère un JWT signé contenant le bearer
    const jwtToken = jwt.sign(
      { access_token: tokenData.access_token },
      process.env.JWT_SECRET || 'votre_secret',
      { expiresIn: tokenData.expires_in }
    );
    res.cookie('access_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: tokenData.expires_in * 1000,
    });
    res.json({ expires_in: tokenData.expires_in });
  }

  @Post('/graphql')
  @UseGuards(AuthCookieGuard)
  async proxyGraphql(@Req() req: Request, @Res() res: Response) {
    try {
      // Récupère le bearer depuis le JWT décodé par le guard
      const user = (req as any).user;
      const bearer = user?.access_token;
      if (!bearer) {
        return res.status(401).json({ error: 'Bearer manquant' });
      }
      // Relaye la requête GraphQL vers Ultra
      const ultraResponse = await fetch('https://staging.api.ultra.io/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearer}`,
        },
        body: JSON.stringify(req.body),
      });
      const data = await ultraResponse.text();
      res.status(ultraResponse.status).send(data);
    } catch (error) {
      res.status(500).json({ error: 'Erreur proxy GraphQL', details: error.message });
    }
  }
}