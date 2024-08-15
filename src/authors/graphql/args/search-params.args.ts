import { ArgsType, Field, Int } from '@nestjs/graphql'

@ArgsType()
export class SearchParamsArgas {
  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  perPage?: number

  @Field({ nullable: true })
  sort?: string

  @Field({ nullable: true })
  sortDir?: string

  @Field({ nullable: true })
  filter?: string
}
