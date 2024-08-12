import { Author } from '../graphql/models/author'

export type AuthorSearchInput = {
  page?: number
  perPage?: number
  filter?: string
  sort?: string
  sortDir?: 'asc' | 'desc'
}

export type AuthorSearchOutput = {
  authors: Author[]
  currentPage: number
  perPage: number
  lastPage: number
  total: number
}

export abstract class AuthorsRepository {
  abstract getAuthors(): Promise<Author[]>
  abstract getAuthorById(id: number): Promise<Author>
  abstract getAuthorByEmail(email: string): Promise<Author>
  abstract createAuthor(author: Author): Promise<Author>
  abstract updateAuthor(author: Author): Promise<Author>
  abstract deleteAuthor(id: number): Promise<Author>
  abstract searchAuthors(search: AuthorSearchInput): Promise<AuthorSearchOutput>
}
