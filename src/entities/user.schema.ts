import Joi from 'joi';
import { type UserCreateDto } from './user';

export const userCreateDtoSchema = Joi.object<UserCreateDto>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  avatar: Joi.string(),
  password: Joi.string().required(),
});

export const userUpdateDtoSchema = Joi.object<UserCreateDto>({
  name: Joi.string(),
  email: Joi.string().email(),
  avatar: Joi.string(),
  password: Joi.string(),
});
