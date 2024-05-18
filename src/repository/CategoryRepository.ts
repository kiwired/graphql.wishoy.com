import { In } from 'typeorm'
import { dataSource } from '../dataSource'
import { Category } from '../entity'

export const CategoryRepository = dataSource.getTreeRepository(Category).extend({
	findByGID(gid: string[]) {
		return this.findBy({ gid: In(gid) })
	},

	async findOrCreate(gid: string, data: Omit<Category, 'gid'>) {
		let fined = await this.findOneBy({ gid })
		if (!fined) {
			fined = this.create({ gid, ...data })
		}
		return fined.save({ data })
	},
})

