import Joi from 'joi';
import { type BookCreateDto } from './book.js';

export const bookCreateDtoSchema = Joi.object<BookCreateDto>({
  title: Joi.string().required(),
  authorId: Joi.string().required(),
  description: Joi.string(),
});

export const bookUpdateDtoSchema = Joi.object<BookCreateDto>({
  title: Joi.string(),
  authorId: Joi.string(),
  description: Joi.string(),
});
