import { Author } from '@/authors/graphql/models/author'
import {
  AuthorSearchInput,
  AuthorSearchOutput,
  AuthorsRepository,
} from '@/authors/repositories/authors-repository'

export class PrismaAuthorsRepository implements AuthorsRepository {
  sortableFields: string[] = ['name', 'email', 'createdAt']
  getAuthors(): Promise<Author[]> {
    throw new Error('Method not implemented.')
  }
  getAuthorById(id: number): Promise<Author> {
    throw new Error('Method not implemented.')
  }
  getAuthorByEmail(email: string): Promise<Author> {
    throw new Error('Method not implemented.')
  }
  createAuthor(author: Author): Promise<Author> {
    throw new Error('Method not implemented.')
  }
  updateAuthor(author: Author): Promise<Author> {
    throw new Error('Method not implemented.')
  }
  deleteAuthor(id: number): Promise<Author> {
    throw new Error('Method not implemented.')
  }
  searchAuthors(search: AuthorSearchInput): Promise<AuthorSearchOutput> {
    throw new Error('Method not implemented.')
  }
}
