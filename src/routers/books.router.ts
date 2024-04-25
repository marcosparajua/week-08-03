import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { type BooksController } from '../controllers/books.controller';
import { type AuthInterceptor } from '../middlewares/auth.interceptor';
import { type BooksSqlRepo } from '../repositories/books.sql.repo';

const debug = createDebug('W7E:articles:router');

export class BooksRouter {
  router = createRouter();

  constructor(
    readonly controller: BooksController,
    readonly authInterceptor: AuthInterceptor,
    readonly booksSqlRepo: BooksSqlRepo
  ) {
    debug('Instantiated articles router');

    this.router.get(
      '/',
      authInterceptor.authentication.bind(authInterceptor),
      controller.getAll.bind(controller)
    );
    this.router.get(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      controller.getById.bind(controller)
    );
    this.router.post(
      '/',
      authInterceptor.authentication.bind(authInterceptor),
      controller.create.bind(controller)
    );
    this.router.patch(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      authInterceptor
        .authorization(booksSqlRepo, 'author')
        .bind(authInterceptor),
      controller.update.bind(controller)
    );
    this.router.delete(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      authInterceptor
        .authorization(booksSqlRepo, 'author')
        .bind(authInterceptor),
      controller.delete.bind(controller)
    );
  }
}
