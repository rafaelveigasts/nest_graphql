export type SearchInput = {
  page?: number
  perPage?: number
  sort?: string | null
  sortDir?: 'asc' | 'desc' | null
  filter?: string | null
}
