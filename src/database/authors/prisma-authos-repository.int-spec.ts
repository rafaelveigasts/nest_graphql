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

  describe('Search method', () => {
    test('Should only apply pagination when the parameters are null', async () => {
      const createdAt = new Date()

      const data = []

      const arrange = Array(16).fill(createUser({}))

      arrange.forEach((user, index) => {
        const timestamp = createdAt.getTime() + index
        data.push({
          ...user,
          email: `author${index}@a.com`,
          createdAt: new Date(timestamp),
        })
      })

      await prisma.author.createMany({
        data,
      })

      const authors = await repository.searchAuthors({})

      expect(authors.total).toBe(16)
      expect(authors.data.length).toBe(15)
      authors.data.forEach(item => {
        expect(item.id).toBeDefined()
      })

      authors.data.reverse().forEach((item, index) => {
        expect(`${item.email}${index + 1}@a.com`)
      })
    })
    test('Should only apply pagination and ordering', async () => {
      const createdAt = new Date()

      const data = []

      const arrange = 'badec'.split('').forEach((letter, index) => {
        const timestamp = createdAt.getTime() + index
        data.push({
          ...createUser({ name: letter }),
          email: `author${index}@a.com`,
          createdAt: new Date(timestamp),
        })
      })

      await prisma.author.createMany({
        data,
      })

      const authors = await repository.searchAuthors({
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
      })

      console.log('authors', authors)
      console.log('arrange', data)

      expect(authors.data[0].name).toMatch(data[1].name)
      expect(authors.data[1]).toMatchObject(data[0])
    })
  })
})
