import { dataSource } from '../../dataSource'
import { PostProductSpecific } from '../../entity'

export const PostProductSpecificRepository = dataSource.getRepository(PostProductSpecific).extend({})