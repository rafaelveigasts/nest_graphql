import { Author } from '@/authors/graphql/models/author'

export type PaginationOutput<T = Author> = {
  data: T[]
  total: number
  currentPage: number
  perPage: number
  lastPage: number
}
