import { PostOutput } from '../dto/post-output'
import { PostsRepository } from '../repositories/posts-repository'
import { BadRequestError } from '@/shared/errors/bad-request-error'

export namespace GetPost {
  export type Input = {
    id: string
  }
  export type Output = PostOutput

  export class UseCase {
    constructor(private readonly postRepository: PostsRepository) {}

    async execute(input: Input): Promise<Output> {
      const { id } = input

      if (!id) {
        throw new BadRequestError('Invalid input')
      }

      const post = await this.postRepository.getPostById(id)

      return post as PostOutput
    }
  }
}
