import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAuthorsRepository } from './authors/prisma-authos-repository'

@Module({
  providers: [PrismaService, PrismaAuthorsRepository],
  exports: [PrismaService, PrismaAuthorsRepository],
})
export class DatabaseModule {}
