import { Module } from '@nestjs/common'
import { AuthorsResolver } from './graphql/resolvers/authors/authors.resolver'
import { PrismaService } from '@/database/prisma/prisma.service'
import { Query } from '@nestjs/graphql'
import { Author } from './graphql/models/author'
import { DatabaseModule } from '@/database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [AuthorsResolver],
})
export class AuthorsModule {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Author])
  authors() {
    return this.prisma.author.findMany()
  }
}
