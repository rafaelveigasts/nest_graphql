import { Post } from '@/posts/graphql/models/post'
import { faker } from '@faker-js/faker'

export function makePost(
  data: Partial<Post> = {},
): Omit<Post, 'id' | 'authorId'> {
  return {
    title: data.title ?? faker.lorem.sentence(),
    content: data.content ?? faker.lorem.paragraph(),
    slug: data.slug ?? faker.lorem.slug(),
    published: data.published ?? false,
    createdAt: data.createdAt ?? new Date(),
  }
}
