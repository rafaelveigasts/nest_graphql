import { Author } from '@/authors/graphql/models/author'
import {
  AuthorsRepository,
  SearchParams,
  SearchResult,
} from '@/authors/repositories/authors-repository'
import { PrismaService } from '../prisma/prisma.service'

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
  async getAuthorByEmail(email: string): Promise<Author> {
    const author = await this.prisma.author.findUnique({
      where: { email },
    })

    return author
  }
  async createAuthor(author: Author): Promise<Author> {
    const _author = await this.prisma.author.create({
      data: author,
    })

    return _author
  }
  async updateAuthor(author: Author): Promise<Author> {
    await this.getAuthorById(author.id)
    const _author = await this.prisma.author.update({
      where: { id: author.id },
      data: author,
    })

    return _author
  }

  async deleteAuthor(id: string): Promise<Author> {
    const author = await this.getAuthorById(id)

    await this.prisma.author.delete({
      where: { id },
    })

    return author
  }

  async searchAuthors(params: SearchParams): Promise<SearchResult> {
    const { page = 1, perPage = 15, filter, sort, sortDir } = params
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
      items: authors,
      currentPage: page,
      perPage,
      lastPage: Math.ceil(count / perPage),
      total: count,
    }
  }
}
