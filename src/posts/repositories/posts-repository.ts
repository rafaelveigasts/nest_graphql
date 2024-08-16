import {
  CreatePostInput,
  UpdatePostInput,
} from '@/database/posts/prisma-posts-repository'
import { Post } from '../graphql/models/post'

export abstract class PostsRepository {
  abstract createPost(data: CreatePostInput): Promise<Post>
  abstract getPosts(): Promise<Post[]>
  abstract getPostById(id: string): Promise<Post>
  abstract getPostBySlug(slug: string): Promise<Post>
  abstract updatePost(id: string, data: UpdatePostInput): Promise<Post>
}
