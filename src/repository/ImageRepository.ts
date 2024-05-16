import { dataSource } from '../dataSource'
import { Image } from '../entity'

export const ImageRepository = dataSource.getRepository(Image).extend({})

