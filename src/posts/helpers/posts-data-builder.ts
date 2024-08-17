import { faker } from '@faker-js/faker'
import { Post } from '../graphql/models/post'

export function PostsDataBuilder(
  props: Partial<Post>,
): Omit<Post, 'id' | 'authorId'> {
  return {
    title: props.title ?? faker.lorem.sentence(),
    slug: props.slug ?? faker.lorem.slug(),
    content: props.content ?? faker.lorem.paragraph(),
    published: props.published ?? false,
    createdAt: props.createdAt ?? new Date(),
  }
}
