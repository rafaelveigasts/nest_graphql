import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAuthorsRepository } from './authors/prisma-authos-repository'
import { PrismaPostRepository } from './posts/prisma-posts-repository'

@Module({
  providers: [PrismaService, PrismaAuthorsRepository, PrismaPostRepository],
  exports: [PrismaService, PrismaAuthorsRepository, PrismaPostRepository],
})
export class DatabaseModule {}
