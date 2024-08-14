import { Injectable } from '@nestjs/common'
import { AuthorsRepository } from '../repositories/authors-repository'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { ConflictError } from '@/shared/errors/conflict-error'

export namespace CreateAuthorUseCase {
  type Input = {
    name: string
    email: string
  }

  type Output = {
    id?: string
    name: string
    email: string
    createdAt?: Date
  }

  @Injectable()
  export class CreateAuthorUseCase {
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
