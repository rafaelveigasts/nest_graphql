import { ArgsType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@ArgsType()
export class PostIdArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  id: string
}
