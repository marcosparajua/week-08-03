import { type Book } from './book.js';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: 'admin' | 'user';

  books: Partial<Book[]>;
};

export type UserCreateDto = {
  name: string;
  email: string;

  password: string;
  avatar?: string;
};

export type UserUpdateDto = Partial<UserCreateDto>;
