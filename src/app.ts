import express, { type Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import { UsersRouter } from './routers/users.router.js';
import { BooksController } from './controllers/books.controller.js';
import { BooksRouter } from './routers/books.router.js';
import { ErrorsMiddleware } from './middlewares/errors.middleware.js';
import { type PrismaClient } from '@prisma/client';
import { BooksSqlRepo } from './repositories/books.sql.repo.js';
import { UsersSqlRepo } from './repositories/users.sql.repo.js';
import { UsersController } from './controllers/users.controller.js';
import { AuthInterceptor } from './middlewares/auth.interceptor.js';
import { FilesController } from './controllers/files.controller.js';
import { FilesRouter } from './routers/files.router.js';
import { FilesInterceptor } from './middlewares/files.interceptor.js';

const debug = createDebug('W7E:app');
export const createApp = () => {
  debug('Creating app');
  return express();
};

export const startApp = (app: Express, prisma: PrismaClient) => {
  debug('Starting app');
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.static('public'));

  const authInterceptor = new AuthInterceptor();
  const filesInterceptor = new FilesInterceptor();

  // Prev const articlesRepo = new ArticlesFsRepo();
  const booksRepo = new BooksSqlRepo(prisma);
  const booksController = new BooksController(booksRepo);
  const booksRouter = new BooksRouter(
    booksController,
    authInterceptor,
    booksRepo
  );
  app.use('/books', booksRouter.router);

  const usersRepo = new UsersSqlRepo(prisma);
  const usersController = new UsersController(usersRepo);
  const usersRouter = new UsersRouter(
    usersController,
    authInterceptor,
    filesInterceptor
  );
  app.use('/users', usersRouter.router);

  const filesController = new FilesController();
  const filesRouter = new FilesRouter(filesController, filesInterceptor);

  app.use('/files', filesRouter.router);
  const errorsMiddleware = new ErrorsMiddleware();
  app.use(errorsMiddleware.handle.bind(errorsMiddleware));
};
