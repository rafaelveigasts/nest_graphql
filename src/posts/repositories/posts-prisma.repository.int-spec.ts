import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { NotFoundError } from '@/shared/errors/not-found-error'
import { PostsPrismaRepository } from './posts-prisma.repository'
import { PostsDataBuilder } from '../helpers/posts-data-builder'
import { AuthorDataBuilder } from '@/authors/helpers/author-data-builder'

describe('PostsPrismaRepository Integration Tests', () => {
  let module: TestingModule
  let repository: PostsPrismaRepository
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new PostsPrismaRepository(prisma as any)
  })

  beforeEach(async () => {
    await prisma.post.deleteMany()
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  test('should throws an error when the id is not found', async () => {
    await expect(
      repository.findById('796c5a25-1d3b-4228-9a75-06f416c6e218'),
    ).rejects.toThrow(
      new NotFoundError(
        'Post not found using ID 796c5a25-1d3b-4228-9a75-06f416c6e218',
      ),
    )
  })

  test('should find a post by id', async () => {
    const postData = PostsDataBuilder({})
    const authorData = AuthorDataBuilder({})
    const author = await prisma.author.create({ data: authorData })

    const post = await prisma.post.create({
      data: {
        ...postData,
        author: {
          connect: { ...author },
        },
      },
    })

    const result = await repository.findById(post.id)
    expect(result).toStrictEqual(post)
  })

  test('should create a post', async () => {
    const postData = PostsDataBuilder({})
    const authorData = AuthorDataBuilder({})
    const author = await prisma.author.create({ data: authorData })

    const result = await repository.create({ ...postData, authorId: author.id })
    expect(result).toMatchObject(postData)
  })

  test('should throws an error when updating a post not found', async () => {
    const data = PostsDataBuilder({})
    const post = {
      ...data,
      id: '796c5a25-1d3b-4228-9a75-06f416c6e218',
      authorId: '796c5a25-1d3b-4228-9a75-06f416c6e218',
    }
    await expect(repository.update(post)).rejects.toThrow(
      new NotFoundError(
        'Post not found using ID 796c5a25-1d3b-4228-9a75-06f416c6e218',
      ),
    )
  })

  test('should update a post', async () => {
    const postData = PostsDataBuilder({})
    const authorData = AuthorDataBuilder({})
    const author = await prisma.author.create({ data: authorData })

    const post = await repository.create({ ...postData, authorId: author.id })
    const result = await repository.update({
      ...post,
      published: true,
      title: 'title-updated',
    })
    expect(result.published).toEqual(true)
    expect(result.title).toEqual('title-updated')
  })

  test('should return null when it does not find an post with the slug provided', async () => {
    const result = await repository.findBySlug('fake-slug-data')
    expect(result).toBeNull()
  })

  test('should find a post by slug', async () => {
    const postData = PostsDataBuilder({})
    const authorData = AuthorDataBuilder({})
    const author = await prisma.author.create({ data: authorData })

    const post = await prisma.post.create({
      data: {
        ...postData,
        author: {
          connect: { ...author },
        },
      },
    })

    const result = await repository.findBySlug(post.slug)
    expect(result).toStrictEqual(post)
  })
})
