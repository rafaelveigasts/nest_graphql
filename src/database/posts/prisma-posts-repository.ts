import { PostsRepository } from '@/posts/repositories/posts-repository'
import { PrismaService } from '../prisma/prisma.service'
import { Post } from '@/posts/graphql/models/post'
import { UserNotFound } from '@/shared/errors/not-found-error'

export interface CreatePostInput {
  title: string
  content: string
  authorId: string
  published?: boolean
}

export interface UpdatePostInput {
  title?: string
  content?: string
  published?: boolean
}

export class PrismaPostRepository implements PostsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(data: CreatePostInput): Promise<any> {
    // return this.prismaService.create({ data })
  }
  async getPosts(): Promise<Post[]> {
    const posts = await this.prismaService.post.findMany()

    if (!posts) {
      throw new UserNotFound('Posts not found')
    }

    return posts
  }
  async getPostBySlug(slug: string): Promise<Post> {
    const post = await this.prismaService.post.findUnique({
      where: { slug },
    })

    if (!post) {
      throw new UserNotFound(`Post with slug ${slug} not found`)
    }

    return post
  }
  async getPostById(id: string): Promise<Post> {
    const post = await this.prismaService.post.findFirst({
      where: { id },
    })

    if (!post) {
      throw new UserNotFound(`Post with id ${id} not found`)
    }

    return post
  }
  async updatePost(id: string, data: UpdatePostInput): Promise<Post> {
    const post = await this.getPostById(id)

    return this.prismaService.post.update({
      where: { id },
      data,
    })
  }
}
