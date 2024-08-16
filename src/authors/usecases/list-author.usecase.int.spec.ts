import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { PrismaAuthorsRepository } from '@/database/authors/prisma-authos-repository'
import { createUser } from '../factories/create-user'
import { ListAuthors } from './list-author.usecase'

describe('ListAuthorUsecase Integration Tests', () => {
  let module: TestingModule
  let repository: PrismaAuthorsRepository
  let usecase: ListAuthors.UseCase
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new PrismaAuthorsRepository(prisma as any)
    usecase = new ListAuthors.UseCase(repository)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  test('should only apply pagination when the parameters are null', async () => {
    const createdAt = new Date()
    const data = []
    const arrange = Array(3).fill(createUser({}))
    arrange.forEach((element, index) => {
      const timestamp = createdAt.getTime() + index
      data.push({
        ...element,
        email: `a${index}@a.com`,
        createdAt: new Date(timestamp),
      })
    })

    await prisma.author.createMany({ data })
    const result = await usecase.execute({})

    expect(result).toMatchObject({
      data: data.reverse(),
      total: data.length,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    })
  })

  test('should apply pagination, filter and ordering', async () => {
    const createdAt = new Date()
    const data = []
    const arrange = ['test', 'a', 'TEST', 'b', 'Test']
    arrange.forEach((element, index) => {
      const timestamp = createdAt.getTime() + index
      data.push({
        ...createUser({ name: element }),
        email: `author${index}@a.com`,
        createdAt: new Date(timestamp),
      })
    })

    console.log(data)

    await prisma.author.createMany({ data })
    const result1 = await usecase.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: ['asc'],
      filter: 'TEST',
    })

    console.log(result1)

    expect(result1.data[0]).toMatchObject(data[0])
  })
})