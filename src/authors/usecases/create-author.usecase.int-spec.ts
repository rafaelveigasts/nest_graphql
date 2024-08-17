import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { NotFoundError } from '@/shared/errors/not-found-error'
import { AuthorDataBuilder } from '../helpers/author-data-builder'
import { AuthorsPrismaRepository } from '../repositories/authors-prisma.repository'
import { CreateAuthorUsecase } from './create-author.usecase'
import { ConflictError } from '@/shared/errors/conflict-error'
import { BadRequestError } from '@/shared/errors/bad-request-error'

describe('CreateAuthorUsecase Integration Tests', () => {
  let module: TestingModule
  let repository: AuthorsPrismaRepository
  let usecase: CreateAuthorUsecase.Usecase
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new AuthorsPrismaRepository(prisma as any)
    usecase = new CreateAuthorUsecase.Usecase(repository)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  test('should create a author', async () => {
    const data = AuthorDataBuilder({})

    const author = await usecase.execute(data)

    expect(author.id).toBeDefined()
    expect(author.createdAt).toBeInstanceOf(Date)
    expect(author).toMatchObject(data)
  })

  test('should not be able to create with same email twice', async () => {
    const data = AuthorDataBuilder({ email: 'a@a.com' })
    await usecase.execute(data)

    await expect(() => usecase.execute(data)).rejects.toBeInstanceOf(
      ConflictError,
    )
  })

  test('should throws error when name not provided', async () => {
    const data = AuthorDataBuilder({})
    data.name = null
    await expect(() => usecase.execute(data)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  test('should throws error when email not provided', async () => {
    const data = AuthorDataBuilder({})
    data.email = null
    await expect(() => usecase.execute(data)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
})
