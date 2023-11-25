import { dataSource } from '@/dataSource'
import { Post, PostProduct } from '@/entity'

export const PostProductRepository = dataSource.getRepository(PostProduct).extend({

	async findOrCreate(alias: Post['alias'], data: Partial<PostProduct>) {
		let fined = await this.findOneBy({ alias })
		if (!fined) {
			fined = this.create({ alias, ...data })
		}
		return fined.save({ data })
	},
})