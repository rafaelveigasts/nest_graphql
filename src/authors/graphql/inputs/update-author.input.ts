import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateAuthorInput {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  name?: string

  @IsString()
  @IsEmail()
  @IsOptional()
  @Field({ nullable: true })
  email?: string
}
