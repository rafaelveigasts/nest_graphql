import { Module } from '@nestjs/common'
import { AuthorsResolver } from './graphql/resolvers/authors.resolver'
import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { AuthorsPrismaRepository } from './repositories/authors-prisma.repository'
import { ListAuthorsUsecase } from './usecases/list-authors.usecase'
import { GetAuthorUsecase } from './usecases/get-author.usecase'
import { CreateAuthorUsecase } from './usecases/create-author.usecase'
import { UpdateAuthorUsecase } from './usecases/update-author.usecase'
import { DeleteAuthorUsecase } from './usecases/delete-author.usecase'

@Module({
  imports: [DatabaseModule],
  providers: [
    AuthorsResolver,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'AuthorsRepository',
      useFactory: (prisma: PrismaService) => {
        return new AuthorsPrismaRepository(prisma)
      },
      inject: ['PrismaService'],
    },
    {
      provide: ListAuthorsUsecase.Usecase,
      useFactory: (authosRepository: AuthorsPrismaRepository) => {
        return new ListAuthorsUsecase.Usecase(authosRepository)
      },
      inject: ['AuthorsRepository'],
    },
    {
      provide: GetAuthorUsecase.Usecase,
      useFactory: (authosRepository: AuthorsPrismaRepository) => {
        return new GetAuthorUsecase.Usecase(authosRepository)
      },
      inject: ['AuthorsRepository'],
    },
    {
      provide: CreateAuthorUsecase.Usecase,
      useFactory: (authosRepository: AuthorsPrismaRepository) => {
        return new CreateAuthorUsecase.Usecase(authosRepository)
      },
      inject: ['AuthorsRepository'],
    },
    {
      provide: UpdateAuthorUsecase.Usecase,
      useFactory: (authosRepository: AuthorsPrismaRepository) => {
        return new UpdateAuthorUsecase.Usecase(authosRepository)
      },
      inject: ['AuthorsRepository'],
    },
    {
      provide: DeleteAuthorUsecase.Usecase,
      useFactory: (authosRepository: AuthorsPrismaRepository) => {
        return new DeleteAuthorUsecase.Usecase(authosRepository)
      },
      inject: ['AuthorsRepository'],
    },
  ],
})
export class AuthorsModule {}
