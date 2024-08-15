import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { PrismaAuthorsRepository } from '@/database/authors/prisma-authos-repository'
import { UserNotFound } from '@/shared/errors/not-found-error'

import { UpdateAuthor } from './update-author.usecase'
import { createUser } from '../factories/create-user'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { ConflictError } from '@/shared/errors/conflict-error'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

describe('UpdateAuthorUsecase Integration Tests', () => {
  let module: TestingModule
  let repository: PrismaAuthorsRepository
  let usecase: UpdateAuthor.UseCase
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new PrismaAuthorsRepository(prisma as any)
    usecase = new UpdateAuthor.UseCase(repository)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  test('should throws an error when id is not provides', async () => {
    const input = {
      id: null,
    }

    await expect(() => usecase.execute(input)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  test('should throws an error when provided email is duplicated', async () => {
    const data = createUser({ email: 'a@a.com' })
    await prisma.author.create({ data })
    const secondAuthor = await prisma.author.create({
      data: createUser({}),
    })

    secondAuthor.email = 'a@a.com'
    await expect(() => usecase.execute(secondAuthor)).rejects.toBeInstanceOf(
      PrismaClientKnownRequestError,
    )
  })

  // test('should return an author', async () => {
  //   const data = createUser({})

  //   const author = await repository.createAuthor(data)

  //   const result = await usecase.execute({ id: author.id })

  //   expect(result.id).toBe(author.id)
  // })
})
