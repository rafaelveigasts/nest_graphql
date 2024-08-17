import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class CreatePostInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  title: string

  @IsString()
  @IsNotEmpty()
  @Field()
  content: string

  @IsString()
  @IsNotEmpty()
  @Field()
  authorId: string
}
