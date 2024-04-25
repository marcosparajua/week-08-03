import { type NextFunction, type Request, type Response } from 'express';
import createDebug from 'debug';
import {
  bookCreateDtoSchema,
  bookUpdateDtoSchema,
} from '../entities/book.schema.js';
import { type Repo } from '../repositories/type.repo';
import { BaseController } from './base.controller.js';
import { type Payload } from '../services/auth.service.js';
import { type Book, type BookCreateDto } from '../entities/book.js';

const debug = createDebug('W7E:articles:controller');

export class BooksController extends BaseController<Book, BookCreateDto> {
  constructor(protected readonly repo: Repo<Book, BookCreateDto>) {
    super(repo, bookCreateDtoSchema, bookUpdateDtoSchema);

    debug('Instantiated article controller');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    debug('Creating article');
    req.body.authorId = (req.body.payload as Payload).id;

    const { payload, ...rest } = req.body as BookCreateDto & {
      payload: Payload;
    };
    req.body = rest;

    await super.create(req, res, next);
  }
}
