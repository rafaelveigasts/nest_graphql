import { faker } from '@faker-js/faker'
import { Author } from '../graphql/models/author'

export function createUser(data: Partial<Author>): Author {
  return {
    id: data.id ?? faker.string.uuid(),
    name: data.name ?? faker.internet.userName(),
    email: data.email ?? faker.internet.email(),
    createdAt: data.createdAt ?? new Date(),
  }
}
