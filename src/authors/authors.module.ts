import { Module } from '@nestjs/common'
import { AuthorsResolver } from './graphql/resolvers/authors/authors.resolver'
import { DatabaseModule } from '@/database/database.module'
import { PrismaAuthorsRepository } from '@/database/authors/prisma-authos-repository'
import { ListAuthors } from './usecases/list-author.usecase'
import { PrismaService } from '@/database/prisma/prisma.service'
import { GetAuthor } from './usecases/get-author.usecase.ts'
import { UpdateAuthor } from './usecases/update-author.usecase'
import { DeleteAuthor } from './usecases/delete-author.usecase.'
import { CreateAuthor } from './usecases/create-author.usecase'

@Module({
  imports: [DatabaseModule, PrismaAuthorsRepository],
  providers: [
    AuthorsResolver,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: PrismaAuthorsRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaAuthorsRepository(prisma),
      inject: ['PrismaService'],
    },
    {
      provide: ListAuthors.UseCase,
      useFactory: (repository: PrismaAuthorsRepository) =>
        new ListAuthors.UseCase(repository),
      inject: [PrismaAuthorsRepository],
    },
    {
      provide: GetAuthor.UseCase,
      useFactory: (repository: PrismaAuthorsRepository) =>
        new GetAuthor.UseCase(repository),
      inject: [PrismaAuthorsRepository],
    },
    {
      provide: UpdateAuthor.UseCase,
      useFactory: (repository: PrismaAuthorsRepository) =>
        new UpdateAuthor.UseCase(repository),
      inject: [PrismaAuthorsRepository],
    },
    {
      provide: DeleteAuthor.UseCase,
      useFactory: (repository: PrismaAuthorsRepository) =>
        new DeleteAuthor.UseCase(repository),
      inject: [PrismaAuthorsRepository],
    },
    {
      provide: CreateAuthor.UseCase,
      useFactory: (repository: PrismaAuthorsRepository) =>
        new CreateAuthor.UseCase(repository),
      inject: [PrismaAuthorsRepository],
    },
  ],
})
export class AuthorsModule {}
