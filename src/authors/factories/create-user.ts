import { faker } from '@faker-js/faker'
import { Author } from '../graphql/models/author'

export function createUser(data: Partial<Author>): Omit<Author, 'id'> {
  return {
    name: data.name ?? faker.internet.userName(),
    email: data.email ?? faker.internet.email(),
    createdAt: data.createdAt ?? new Date(),
  }
}
