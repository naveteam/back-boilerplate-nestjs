import {
  NestMiddleware,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { ACCESS_SECRET } from '../config';

export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, headers } = req;

    this.logger.log(`${method} ${url} ${JSON.stringify(headers)}`);

    const { authorization } = headers;

    if (authorization) {
      const token = this.getTokenFromAuthorizationHeader(authorization);

      const resultValidationToken = this.verifyToken(token, method);

      if (resultValidationToken) {
        req['tokenDecoded'] = resultValidationToken;

        return next();
      }

      throw new HttpException(
        {
          code: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized, please log in again',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    throw new HttpException(
      {
        code: HttpStatus.BAD_REQUEST,
        error: 'No content authorization in headers',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  private verifyToken(token: string, method: string): string {
    try {
      method = method.toUpperCase();

      const tokenVerified: any = jwt.verify(token, ACCESS_SECRET);

      if (!tokenVerified) {
        throw new HttpException(
          { code: HttpStatus.UNAUTHORIZED, error: 'Token is invalid' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      return tokenVerified;
    } catch (error) {
      throw new HttpException(
        { code: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getTokenFromAuthorizationHeader(authorization: string) {
    const [Bearer, token] = authorization.split(' ');

    if (Bearer !== 'Bearer' || !token) {
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Authorization wrong format',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return token;
  }
}
