import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Author } from '../../models/author'
import { ListAuthors } from '@/authors/usecases/list-author.usecase'
import { Inject } from '@nestjs/common'
import { SearchParamsArgas } from '../../args/search-params.args'
import { SearchAuthorsResult } from '../../models/search-author-result'
import { CreateAuthor } from '@/authors/usecases/create-author.usecase'
import { CreateAuthorInput } from '../../inputs/create-author.input'
import { AuthorIdArgs } from '../../inputs/author-id.args'
import { GetAuthor } from '@/authors/usecases/get-author.usecase.ts'

@Resolver(() => Author)
export class AuthorsResolver {
  @Inject(ListAuthors.UseCase)
  private listAuthorsUseCase: ListAuthors.UseCase

  @Inject(CreateAuthor.UseCase)
  private createAuthorUseCase: CreateAuthor.UseCase

  @Inject(GetAuthor.UseCase)
  private getAuthor: GetAuthor.UseCase

  @Query(() => SearchAuthorsResult)
  async authors(
    @Args() { filter, page, perPage, sort, sortDir }: SearchParamsArgas,
  ): Promise<Author[]> {
    return (await this.listAuthorsUseCase.execute({
      filter,
      page,
      perPage,
      sort,
      sortDir: ['desc'],
    })) as unknown as Promise<Author[]>
  }

  @Mutation(() => Author)
  createAuthor(@Args('data') data: CreateAuthorInput) {
    return this.createAuthorUseCase.execute(data)
  }

  @Query(() => Author)
  async getAuthorById(@Args() { id }: AuthorIdArgs) {
    return this.getAuthor.execute({ id })
  }
}
