import { type User } from './user';

export type BookSingle = {
  id: string;
  title: string;
  author: string;
  description: string;
};

export type BookSingleCreateDto = {
  title: string;
  author: string;
  description?: string;
};

export type Book = {
  id: string;
  title: string;
  author: Partial<User>;
  description: string;
};

export type BookCreateDto = {
  title: string;
  authorId: string;
  description?: string;
};
