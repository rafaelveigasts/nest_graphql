import { Author } from '@/authors/graphql/models/author'
import {
  AuthorSearchInput,
  AuthorSearchOutput,
  AuthorsRepository,
} from '@/authors/repositories/authors-repository'
import { PrismaService } from '../prisma/prisma.service'
import { NotFoundError } from 'rxjs'
import { UserNotFound } from '@/shared/errors/not-found-error'

export class PrismaAuthorsRepository implements AuthorsRepository {
  constructor(private prisma: PrismaService) {}

  sortableFields: string[] = ['name', 'email', 'createdAt']

  async getAuthors(): Promise<Author[]> {
    const authors = await this.prisma.author.findMany()

    return authors
  }
  async getAuthorById(id: string): Promise<Author> {
    const author = await this.prisma.author.findUnique({
      where: { id },
    })

    if (!author) {
      throw new UserNotFound(`Author with id ${id} not found`)
    }

    return author
  }
  getAuthorByEmail(email: string): Promise<Author> {
    const author = this.prisma.author.findUnique({
      where: { email },
    })

    if (!author) {
      throw new UserNotFound(`Author with email ${email} not found`)
    }

    return author
  }
  async createAuthor(author: Author): Promise<Author> {
    const _author = await this.prisma.author.create({
      data: author,
    })

    return _author
  }
  updateAuthor(author: Author): Promise<Author> {
    const _author = this.prisma.author.update({
      where: { id: author.id },
      data: author,
    })

    return _author
  }
  deleteAuthor(id: string): Promise<Author> {
    const deleted = this.prisma.author.delete({
      where: { id },
    })

    return deleted
  }

  async searchAuthors(search: AuthorSearchInput): Promise<AuthorSearchOutput> {
    const { page = 1, perPage = 15, filter, sort, sortDir } = search
    const sortable = this.sortableFields?.includes(sort) || false
    const orderByField = sortable ? sort : 'createdAt'
    const orderByDir = sortable ? sortDir : 'desc'

    const count = await this.prisma.author.count({
      ...(filter && {
        where: {
          OR: [
            { name: { contains: filter, mode: 'insensitive' } },
            { email: { contains: filter, mode: 'insensitive' } },
          ],
        },
      }),
    })

    const authors = await this.prisma.author.findMany({
      ...(filter && {
        where: {
          OR: [
            { name: { contains: filter, mode: 'insensitive' } },
            { email: { contains: filter, mode: 'insensitive' } },
          ],
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: page > 0 ? (page - 1) * perPage : 1,
      take: perPage > 0 ? perPage : 15,
    })

    return {
      data: authors,
      currentPage: page,
      perPage,
      lastPage: Math.ceil(count / perPage),
      total: count,
    }
  }
}
