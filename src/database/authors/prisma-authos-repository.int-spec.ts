import { Test, TestingModule } from '@nestjs/testing'
import { PrismaAuthorsRepository } from './prisma-authos-repository'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'

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
})
