import { type NextFunction, type Request, type Response } from 'express';
import createDebug from 'debug';
import multer from 'multer';
const debug = createDebug('W7E:files:interceptor');

export class FilesInterceptor {
  constructor() {
    debug('Instantiated auth interceptor');
  }

  singleFile(fieldName = 'avatar') {
    const storage = multer.diskStorage({
      destination: 'uploads/',
      filename(_req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
      },
    });

    const upload = multer({ storage });
    const middleware = upload.single(fieldName);

    return (req: Request, res: Response, next: NextFunction) => {
      const previousBody = req.body as Record<string, unknown>;
      middleware(req, res, next);
      req.body = { ...previousBody, ...req.body } as unknown;
    };
  }
}
