import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Author } from './author'

@ObjectType()
export class SearchAuthorsResult {
  @Field(() => [Author])
  items: Author[]

  @Field(() => Int)
  currentPage: number

  @Field(() => Int)
  perPage: number

  @Field(() => Int)
  lastPage: number

  @Field(() => Int)
  total: number
}
