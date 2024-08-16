import { DatabaseModule } from '@/database/database.module'
import { PrismaPostRepository } from '@/database/posts/prisma-posts-repository'
import { PrismaService } from '@/database/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { CreatePost } from './usecases/create-post-usecase'
import { PostsRepository } from './repositories/posts-repository'
import { PrismaAuthorsRepository } from '@/database/authors/prisma-authos-repository'
import { GetPost } from './usecases/get-post-usecase'
import { TogglePost } from './usecases/publish-post-usecase'

@Module({
  imports: [DatabaseModule, PrismaAuthorsRepository, PrismaPostRepository],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: PrismaPostRepository,
      useFactory: (prisma: PrismaService) => new PrismaPostRepository(prisma),
      inject: ['PrismaService'],
    },
    {
      provide: 'AuthorsRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PrismaAuthorsRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: CreatePost.UseCase,
      useFactory: (
        postsRepository: PrismaPostRepository,
        authorsRepository: PrismaAuthorsRepository,
      ) => {
        return new CreatePost.UseCase(postsRepository, authorsRepository)
      },
      inject: [PrismaPostRepository, PrismaAuthorsRepository],
    },
    {
      provide: GetPost.UseCase,
      useFactory: (postsRepository: PrismaPostRepository) => {
        return new GetPost.UseCase(postsRepository)
      },
      inject: [PrismaPostRepository],
    },
    {
      provide: TogglePost.UseCase,
      useFactory: (postsRepository: PrismaPostRepository) => {
        return new TogglePost.UseCase(postsRepository)
      },
      inject: [PrismaPostRepository],
    },
  ],
})
export class PostsModule {}
