import {
  NestMiddleware,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_PRIVATE_KEY, USE_BEARER_TOKEN, X_API_KEY } from '../config';

export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, headers } = req;

    this.logger.log(`${method} ${url} ${JSON.stringify(headers)}`);

    const { authorization } = headers;
    const apiKey = headers['x-api-key'];

    if (apiKey && !authorization) {
      if (apiKey === X_API_KEY) {
        return next();
      } else
        throw new HttpException(
          { code: HttpStatus.UNAUTHORIZED, error: 'Unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );
    } else if (!apiKey && authorization) {
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
    } else {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          error: 'No content authorization in headers',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private verifyToken(token: string, method: string): string {
    try {
      method = method.toUpperCase();

      const tokenVerified: any = jwt.verify(token, JWT_PRIVATE_KEY);

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

    if (USE_BEARER_TOKEN === true) {
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
    } else {
      if (!authorization) {
        throw new HttpException(
          {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Authorization wrong format',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return authorization;
    }
  }
}
