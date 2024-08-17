import { Post } from '../graphql/models/post'

export interface PostsRepository {
  create(data: Omit<Post, 'id'>): Promise<Post>
  update(post: Post): Promise<Post>
  findById(id: string): Promise<Post>
  findBySlug(slug: string): Promise<Post>
  get(id: string): Promise<Post>
}
