import { dataSource } from '../dataSource'
import { ImageVector } from '../entity'

export const ImageVectorRepository = dataSource.getRepository(ImageVector).extend({})

