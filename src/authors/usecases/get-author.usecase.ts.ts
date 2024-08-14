import { Injectable } from '@nestjs/common'
import { AuthorsRepository } from '../repositories/authors-repository'
import { AuthorOutput } from '../dto/author-output'

export namespace GetAuthor {
  type Input = {
    id: string
  }

  type Output = AuthorOutput

  @Injectable()
  export class UseCase {
    constructor(private authorsRepository: AuthorsRepository) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input

      const author = await this.authorsRepository.getAuthorById(id)

      return author
    }
  }
}
