import { ChildEntity } from 'typeorm'
import { Post } from './Post'

@ChildEntity('page')
export class PostPage extends Post {}
