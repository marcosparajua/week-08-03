import { type PrismaClient } from '@prisma/client';
import createDebug from 'debug';
import { HttpError } from '../middlewares/errors.middleware.js';
import { type Book, type BookCreateDto } from '../entities/book.js';
import { type Repo } from './type.repo.js';
const debug = createDebug('W7E:articles:repository:sql');

const select = {
  id: true,
  title: true,
  author: {
    select: {
      name: true,
      email: true,

      role: true,
    },
  },
  description: true,
};

export class BooksSqlRepo implements Repo<Book, BookCreateDto> {
  constructor(private readonly prisma: PrismaClient) {
    debug('Instantiated books sql repository');
  }

  async readAll() {
    const books = await this.prisma.book.findMany({
      select,
    });
    return books;
  }

  async readById(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      select,
    });

    if (!book) {
      throw new HttpError(404, 'Not Found', `Article ${id} not found`);
    }

    return book;
  }

  async create(data: BookCreateDto) {
    return this.prisma.book.create({
      data: {
        description: data.description ?? '',
        ...data,
      },
      select,
    });
  }

  async update(id: string, data: Partial<BookCreateDto>) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      select,
    });
    if (!book) {
      throw new HttpError(404, 'Not Found', `Article ${id} not found`);
    }

    return this.prisma.book.update({
      where: { id },
      data,
      select,
    });
  }

  async delete(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      select,
    });
    if (!book) {
      throw new HttpError(404, 'Not Found', `Article ${id} not found`);
    }

    return this.prisma.book.delete({
      where: { id },
      select,
    });
  }
}
