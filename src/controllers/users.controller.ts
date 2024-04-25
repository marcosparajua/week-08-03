import { type NextFunction, type Request, type Response } from 'express';
import createDebug from 'debug';
import { type UserCreateDto, type User } from '../entities/user.js';
import {
  userCreateDtoSchema,
  userUpdateDtoSchema,
} from '../entities/user.schema.js';
import { HttpError } from '../middlewares/errors.middleware.js';
import { type WithLoginRepo } from '../repositories/type.repo.js';
import { BaseController } from './base.controller.js';
import { Auth } from '../services/auth.service.js';

const debug = createDebug('W7E:users:controller');

export class UsersController extends BaseController<User, UserCreateDto> {
  constructor(protected readonly repo: WithLoginRepo<User, UserCreateDto>) {
    super(repo, userCreateDtoSchema, userUpdateDtoSchema);
    debug('Instantiated user controller');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, name, password } = req.body as UserCreateDto;

    if ((!email && !name) || !password) {
      next(
        new HttpError(
          400,
          'Bad Request',
          'Email/name and password are required'
        )
      );
      return;
    }

    const error = new HttpError(
      401,
      'Unauthorized',
      'Email/name and password invalid'
    );

    try {
      const user = await this.repo.searchForLogin(
        email ? 'email' : 'name',
        email || name
      );

      if (!user) {
        next(error);
        return;
      }

      if (!(await Auth.compare(password, user.password!))) {
        next(error);
        return;
      }

      const token = Auth.signJwt({
        id: user.id!,
        role: user.role!,
      });

      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    if (!req.body.password || typeof req.body.password !== 'string') {
      next(
        new HttpError(
          400,
          'Bad Request',
          'Password is required and must be a string'
        )
      );
      return;
    }

    req.body.password = await Auth.hash(req.body.password as string);

    req.body.avatar = req.file ? req.file.filename : 'sample.jpg';

    await super.create(req, res, next);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    if (req.body.password && typeof req.body.password === 'string') {
      req.body.password = await Auth.hash(req.body.password as string);
    }

    await super.update(req, res, next);
  }
}
