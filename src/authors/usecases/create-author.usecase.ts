import { Injectable } from '@nestjs/common'
import { AuthorsRepository } from '../repositories/authors-repository'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { ConflictError } from '@/shared/errors/conflict-error'
import { AuthorOutput } from '../dto/author-output'

export namespace CreateAuthor {
  type Input = {
    name: string
    email: string
  }

  type Output = AuthorOutput

  @Injectable()
  export class UseCase {
    constructor(private authorsRepository: AuthorsRepository) {}

    async execute(input: Input): Promise<Output> {
      const { name, email } = input
      if (!name || !email) {
        throw new BadRequestError('Invalid input')
      }

      const alreadyExists = await this.authorsRepository.getAuthorByEmail(email)

      if (alreadyExists) {
        throw new ConflictError('Author already exists')
      }

      const author = await this.authorsRepository.createAuthor({
        name,
        email,
      })

      return author
    }
  }
}
