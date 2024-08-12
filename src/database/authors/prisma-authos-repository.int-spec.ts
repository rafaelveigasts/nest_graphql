import { Test, TestingModule } from '@nestjs/testing'
import { PrismaAuthorsRepository } from './prisma-authos-repository'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { UserNotFound } from '@/shared/errors/not-found-error'
import { faker } from '@faker-js/faker'
import { createUser } from '@/authors/factories/create-user'

describe('PrismaAuthorsRepository Integrations Test', () => {
  let module: TestingModule
  let repository: PrismaAuthorsRepository
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()

    repository = new PrismaAuthorsRepository(prisma as any)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  test('Should throw an error if author not found', async () => {
    const id = faker.string.uuid()
    await expect(repository.getAuthorById(id)).rejects.toThrow(
      new UserNotFound(`Author with id ${id} not found`),
    )
  })

  test('Should find an author', async () => {
    const user = createUser({})

    const created = await prisma.author.create({
      data: user,
    })

    const author = await repository.getAuthorById(created.id)

    expect(author).toEqual(created)
  })

  test('Should create an author', async () => {
    const user = createUser({})

    const created = await prisma.author.create({
      data: user,
    })

    const author = await repository.getAuthorById(created.id)

    expect(author).toHaveProperty('id')
  })
})
