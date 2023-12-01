import { dataSource } from '../../dataSource'
import { Post } from '../../entity'

export const PostRepository = dataSource.getRepository(Post).extend({})