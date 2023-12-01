import { dataSource } from '../../dataSource'
import { PostPage } from '../../entity'

export const PostPageRepository = dataSource.getRepository(PostPage).extend({})