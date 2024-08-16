import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { UserNotFound } from '@/shared/errors/not-found-error'
import { faker } from '@faker-js/faker'

import { PrismaPostRepository } from './prisma-posts-repository'
import { makePost } from '@/posts/helpers/factories/make-post'
import { createUser } from '@/authors/factories/create-user'

describe('PrismaPostsRepository Integrations Test', () => {
  let module: TestingModule
  let repository: PrismaPostRepository
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()

    repository = new PrismaPostRepository(prisma as any)
  })

  beforeEach(async () => {
    await prisma.post.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  test('Should throw an error if author not found', async () => {
    const id = faker.string.uuid()
    await expect(repository.getPostById(id)).rejects.toThrow(
      new UserNotFound(`Post with id ${id} not found`),
    )
  })

  test('Should find a post by id', async () => {
    const postdata = makePost()
    const authordata = createUser({})

    const author = await prisma.author.create({ data: authordata })

    const post = await prisma.post.create({
      data: {
        ...postdata,
        author: {
          connect: { ...author },
        },
      },
    })

    const foundPost = await repository.getPostById(post.id)

    expect(foundPost.id).toBe(post.id)
  })
})
