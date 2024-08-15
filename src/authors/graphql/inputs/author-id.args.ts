import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class AuthorIdArgs {
  @Field()
  id: string
}
