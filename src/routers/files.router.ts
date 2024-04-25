import { Router as createRouter } from 'express';
import { type FilesController } from '../controllers/files.controller';
import { type FilesInterceptor } from '../middlewares/files.interceptor';

export class FilesRouter {
  router = createRouter();

  constructor(
    readonly controller: FilesController,
    readonly interceptor: FilesInterceptor
  ) {
    this.router.post(
      '/',
      interceptor.singleFile('avatar').bind(interceptor),
      controller.fileHandler.bind(controller)
    );
  }
}
