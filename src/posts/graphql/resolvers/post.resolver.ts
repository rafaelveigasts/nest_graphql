import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Post } from '../models/post'
import { Inject } from '@nestjs/common'
import { CreatePost } from '@/posts/usecases/create-post-usecase'
import { CreatePostInput } from '../../inputs/create-post.input'

@Resolver(() => Post)
export class PostsResolver {
  @Inject(CreatePost.UseCase)
  private createPostUseCase: CreatePost.UseCase

  @Mutation(() => Post)
  async createPost(@Args('data') data: CreatePostInput) {
    return this.createPostUseCase.execute(data)
  }
}
