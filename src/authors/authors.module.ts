import { Module } from '@nestjs/common'
import { AuthorsResolver } from './graphql/resolvers/authors/authors.resolver'
import { DatabaseModule } from '@/database/database.module'
import { PrismaAuthorsRepository } from '@/database/authors/prisma-authos-repository'

@Module({
  imports: [DatabaseModule, PrismaAuthorsRepository],
  providers: [AuthorsResolver],
})
export class AuthorsModule {}
