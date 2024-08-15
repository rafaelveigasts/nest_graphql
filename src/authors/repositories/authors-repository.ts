import { Author } from '../graphql/models/author'

export type SearchParams = {
  page?: number
  perPage?: number
  filter?: string
  sort?: string
  sortDir?: 'asc' | 'desc'
}
export type SearchResult = {
  items: Author[]
  currentPage: number
  perPage: number
  lastPage: number
  total: number
}

export abstract class AuthorsRepository {
  sortableFields: string[] = ['name', 'email', 'createdAt']
  abstract getAuthors(): Promise<Author[]>
  abstract getAuthorById(id: string): Promise<Author>
  abstract getAuthorByEmail(email: string): Promise<Author>
  abstract createAuthor(author: Author): Promise<Author>
  abstract updateAuthor(author: Author): Promise<Author>
  abstract deleteAuthor(id: string): Promise<Author>
  abstract searchAuthors(search: SearchParams): Promise<SearchResult>
}
