import { BadRequestError } from '@/shared/errors/bad-request-error'
import { AuthorsPrismaRepository } from '../repositories/authors-prisma.repository'
import { ConflictError } from '@/shared/errors/conflict-error'
import { AuthorOutput } from '../dto/author-output'

export namespace CreateAuthorUsecase {
  export type Input = {
    name: string
    email: string
  }

  export type Output = AuthorOutput

  export class Usecase {
    constructor(private authorsRepository: AuthorsPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      const { email, name } = input
      if (!email || !name) {
        throw new BadRequestError('Input data not provided')
      }

      const emailExists = await this.authorsRepository.findByEmail(email)
      if (emailExists) {
        throw new ConflictError('Email address used by other author')
      }

      const author = await this.authorsRepository.create(input)
      return author
    }
  }
}
