import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateAuthorInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  email?: string
}
