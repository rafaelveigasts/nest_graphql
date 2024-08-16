import { PostOutput } from '../dto/post-output'
import { PostsRepository } from '../repositories/posts-repository'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { UserNotFound } from '@/shared/errors/not-found-error'

export namespace TogglePost {
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

      const _post = await this.postRepository.getPostById(id)

      if (!_post) {
        throw new UserNotFound('Post not found')
      }

      return (await this.postRepository.updatePost(id, {
        published: !_post.published,
      })) as PostOutput
    }
  }
}
