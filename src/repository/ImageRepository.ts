import { dataSource } from '../dataSource'
import { Image } from '../entity'

export const ImageRepository = dataSource.getRepository(Image).extend({

	async findOneOrCreate(src: Image['src'], data: Partial<Image>) {
		let fined = await this.findOneBy({ src })
		if (!fined) {
			fined = this.create({ src, ...data })
		}
		return fined.save({ data })
	},
})

