import { Test, TestingModule } from '@nestjs/testing'
import { Prisma, PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { CreateAuthor } from './create-author.usecase'
import { PrismaAuthorsRepository } from '@/database/authors/prisma-authos-repository'
import { createUser } from '../factories/create-user'
import { ConflictError } from '@/shared/errors/conflict-error'
import { BadRequestError } from '@/shared/errors/bad-request-error'

describe('CreateAuthorUsecase Integration Tests', () => {
  let module: TestingModule
  let repository: PrismaAuthorsRepository
  let usecase: CreateAuthor.UseCase
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new PrismaAuthorsRepository(prisma as any)
    usecase = new CreateAuthor.UseCase(repository)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  test('should create a author', async () => {
    const data = createUser({})

    const author = await usecase.execute(data)

    expect(author.id).toBeDefined()
    expect(author.createdAt).toBeInstanceOf(Date)
  })

  test('should not create a author with same email', async () => {
    await usecase.execute(createUser({ email: 'a@a.com' }))

    await expect(
      usecase.execute(createUser({ email: 'a@a.com' })),
    ).rejects.toThrow(new ConflictError('Author already exists'))
  })

  test('should throws error when name not provided', async () => {
    const data = createUser({})
    data.name = null
    await expect(() => usecase.execute(data)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  test('should throws error when email not provided', async () => {
    const data = createUser({})
    data.email = null
    await expect(() => usecase.execute(data)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
})
