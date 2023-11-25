import { ChildEntity } from 'typeorm'
import { Post } from './Post'

@ChildEntity('store')
export class PostStore extends Post {}