import { AuthorsRepository } from '@/authors/repositories/authors-repository'
import { PostOutput } from '../dto/post-output'
import { PostsRepository } from '../repositories/posts-repository'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { UserNotFound } from '@/shared/errors/not-found-error'
import slugify from 'slugify'
import { ConflictError } from '@/shared/errors/conflict-error'

export namespace CreatePost {
  export type Input = {
    title: string

    content: string
    authorId: string
  }
  export type Output = PostOutput

  export class UseCase {
    constructor(
      private readonly postRepository: PostsRepository,
      private readonly authorsRepository: AuthorsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { title, content, authorId } = input

      if (!title || !content || !authorId) {
        throw new BadRequestError('Invalid input')
      }

      const author = await this.authorsRepository.getAuthorById(authorId)

      if (!author) {
        throw new UserNotFound('Author not found')
      }

      const slug = slugify(title, { lower: true, trim: true })

      const slugExists = await this.postRepository.getPostBySlug(slug)

      if (slugExists) {
        throw new ConflictError('Title used by another post')
      }

      const post = await this.postRepository.createPost({
        title,
        content,
        authorId,
        slug,
      })

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        published: post.published,
        authorId: post.authorId,
      }
    }
  }
}
