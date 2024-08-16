import { DatabaseModule } from '@/database/database.module'
import { PrismaPostRepository } from '@/database/posts/prisma-posts-repository'
import { PrismaService } from '@/database/prisma/prisma.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'PostsRepository',
      useFactory: (prisma: PrismaService) => new PrismaPostRepository(prisma),
      inject: ['PrismaService'],
    },
  ],
})
export class PostsModule {}
