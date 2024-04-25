import { type NextFunction, type Request, type Response } from 'express';
import { HttpError } from '../middlewares/errors.middleware.js';

export class FilesController {
  fileHandler(req: Request, res: Response, next: NextFunction) {
    console.log('File', req.file);
    console.log('Body', req.body);
    if (!req.file) {
      next(new HttpError(400, 'Bad request', 'No file uploaded'));
      return;
    }

    res.json({
      message: 'File uploaded',
      file: req.file,
    });
  }
}
