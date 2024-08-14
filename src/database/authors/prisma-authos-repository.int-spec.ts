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

  test('Should throw an error when updating if author not found', async () => {
    const data = createUser({})
    const id = faker.string.uuid()
    const author = {
      id,
      ...data,
    }
    await expect(repository.updateAuthor(author)).rejects.toThrow(
      new UserNotFound(`Author with id ${id} not found`),
    )
  })

  test('Should update an author', async () => {
    const author = await prisma.author.create({
      data: createUser({}),
    })

    const result = await repository.updateAuthor({
      ...author,
      name: 'Updated',
    })

    expect(result.name).toBe('Updated')
  })

  test('Should throw an error when deleting if author not found', async () => {
    const data = createUser({})
    const id = faker.string.uuid()
    const author = {
      id,
      ...data,
    }
    await expect(repository.deleteAuthor(id)).rejects.toThrow(
      new UserNotFound(`Author with id ${id} not found`),
    )
  })

  test('Should delete an author', async () => {
    const author = await prisma.author.create({
      data: createUser({}),
    })

    const result = await repository.deleteAuthor(author.id)

    expect(result).toMatchObject(author)
  })

  test('Should throw an error when author email not found', async () => {
    const email = 'teste@teste.com'
    await expect(repository.getAuthorByEmail(email)).rejects.toThrow(
      new UserNotFound(`Author with email ${email} not found`),
    )
  })

  test('Should find author by email', async () => {
    const author = await prisma.author.create({
      data: createUser({
        email: 'found@found.com',
      }),
    })

    const result = await repository.getAuthorByEmail(author.email)

    expect(result).toMatchObject(author)
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

      expect(authors.data[0].name).toMatch(data[1].name)
      expect(authors.data[1]).toMatchObject(data[0])
    })
    test('Should only apply pagination, filter and ordering', async () => {
      const createdAt = new Date()

      const data = []

      const arrange = ['test', 'a', 'TEST', 'B', 'Test'].forEach(
        (element, index) => {
          const timestamp = createdAt.getTime() + index
          data.push({
            ...createUser({ name: element }),
            email: `author${index}@a.com`,
            createdAt: new Date(timestamp),
          })
        },
      )

      await prisma.author.createMany({
        data,
      })

      const authors = await repository.searchAuthors({
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'TEST',
      })

      expect(authors.data[0].name).toMatch(data[0].name)
      expect(authors.data[1]).toMatchObject(data[4])

      const authors2 = await repository.searchAuthors({
        page: 2,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'TEST',
      })

      expect(authors2.data[0]).toMatchObject(data[2])
      expect(authors2.data.length).toBe(1)
    })
  })
})
