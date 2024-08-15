import { Injectable } from '@nestjs/common'
import { AuthorsRepository } from '../repositories/authors-repository'
import { AuthorOutput } from '../dto/author-output'
import { Author } from '../graphql/models/author'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { ConflictError } from '@/shared/errors/conflict-error'

export namespace UpdateAuthor {
  type Input = Partial<Author>

  type Output = AuthorOutput

  @Injectable()
  export class UseCase {
    constructor(private authorsRepository: AuthorsRepository) {}

    async execute(input: Input): Promise<Output> {
      if (!input?.id) {
        throw new BadRequestError('id is required')
      }

      const author = await this.authorsRepository.getAuthorById(input.id)

      if (input.email) {
        const emailTaken = await this.authorsRepository.getAuthorByEmail(
          input.email,
        )

        if (emailTaken && author.id !== input.id) {
          throw new ConflictError('Email already taken')
        }

        author.email = input.email
      }

      if (input.name) {
        author.name = input.name
      }

      return await this.authorsRepository.updateAuthor(author)
    }
  }
}
