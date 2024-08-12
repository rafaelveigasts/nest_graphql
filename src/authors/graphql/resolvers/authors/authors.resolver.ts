import { Resolver } from '@nestjs/graphql'
import { Author } from '../../models/author'

@Resolver(() => Author)
export class AuthorsResolver {}
