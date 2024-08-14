import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { PrismaAuthorsRepository } from '@/database/authors/prisma-authos-repository'
import { GetAuthor } from './get-author.usecase.ts'
import { UserNotFound } from '@/shared/errors/not-found-error'
import { createUser } from '../factories/create-user'

describe('GetAuthorUsecase Integration Tests', () => {
  let module: TestingModule
  let repository: PrismaAuthorsRepository
  let usecase: GetAuthor.UseCase
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new PrismaAuthorsRepository(prisma as any)
    usecase = new GetAuthor.UseCase(repository)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  test('should throws an error when id is not found', async () => {
    await expect(() => usecase.execute({ id: '1' })).rejects.toBeInstanceOf(
      UserNotFound,
    )
  })

  test('should return an author', async () => {
    const data = createUser({})

    const author = await repository.createAuthor(data)

    const result = await usecase.execute({ id: author.id })

    expect(result.id).toBe(author.id)
  })
})
