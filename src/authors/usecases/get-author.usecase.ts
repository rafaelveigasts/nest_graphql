import { AuthorOutput } from '../dto/author-output'
import { AuthorsPrismaRepository } from '../repositories/authors-prisma.repository'

export namespace GetAuthorUsecase {
  export type Input = {
    id: string
  }

  export type Output = AuthorOutput

  export class Usecase {
    constructor(private authorsRepository: AuthorsPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input
      const author = await this.authorsRepository.findById(id)
      return author
    }
  }
}
