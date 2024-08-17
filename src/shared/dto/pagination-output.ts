export type PaginationOutput<Item = any> = {
  items: Item[]
  total: number
  currentPage: number
  perPage: number
  lastPage: number
}
