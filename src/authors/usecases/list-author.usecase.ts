import { Injectable } from '@nestjs/common'
import { AuthorsRepository } from '../repositories/authors-repository'
import { AuthorOutput } from '../dto/author-output'
import { SearchInput } from '@/shared/dto/search-input'
import { Author } from '../graphql/models/author'
import { PaginationOutput } from '@/shared/dto/pagination-output'

export namespace ListAuthors {
  type Input = SearchInput

  type Output = PaginationOutput<Author>

  @Injectable()
  export class UseCase {
    constructor(private authorsRepository: AuthorsRepository) {}

    async execute(input: Input): Promise<Output> {
      const { items, currentPage, lastPage, perPage, total } =
        await this.authorsRepository.searchAuthors({
          ...input,
          sortDir: 'desc',
        })

      return {
        data: items,
        total,
        currentPage,
        perPage,
        lastPage,
      }
    }
  }
}
