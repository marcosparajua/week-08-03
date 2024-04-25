import { type NextFunction, type Request, type Response } from 'express';
import createDebug from 'debug';
import { HttpError } from './errors.middleware.js';
import { Auth, type Payload } from '../services/auth.service.js';
import { type Repo } from '../repositories/type.repo.js';
const debug = createDebug('W7E:auth:interceptor');

export class AuthInterceptor {
  constructor() {
    debug('Instantiated auth interceptor');
  }

  authentication(req: Request, _res: Response, next: NextFunction) {
    const data = req.get('Authorization');

    const error = new HttpError(498, ' Token expired/invalid', 'Token invalid');

    if (!data?.startsWith('Bearer ')) {
      next(error);
      return;
    }

    const token = data.slice(7);
    try {
      const payload = Auth.verifyJwt(token);
      req.body.payload = payload;
      next();
    } catch (err) {
      error.message = (err as Error).message;
      next(error);
    }
  }

  isAdmin(req: Request, res: Response, next: NextFunction) {
    const { payload } = req.body as { payload: Payload };
    const { role } = payload;
    if (role !== 'admin') {
      next(
        new HttpError(
          403,
          'Forbidden',
          'You are not allowed to access this resource'
        )
      );
      return;
    }

    next();
  }

  authorization<T>(repo: Repo<T, any>, ownerKey?: keyof T) {
    return async (req: Request, res: Response, next: NextFunction) => {
      debug('Authorizing');

      const { payload, ...rest } = req.body as { payload: Payload };
      req.body = rest;

      const { role } = payload;
      if (role === 'admin') {
        next();
        return;
      }

      try {
        const item = (await repo.readById(req.params.id)) as Awaited<T> & {
          id: string;
        };
        const ownerId = ownerKey
          ? (item[ownerKey] as { id: string }).id
          : item.id;
        if (payload.id !== ownerId) {
          next(
            new HttpError(
              403,
              'Forbidden',
              'You are not allowed to access this resource'
            )
          );
          return;
        }

        debug('Authorized', req.body);
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
