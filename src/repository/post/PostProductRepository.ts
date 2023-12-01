import { FindOptionsOrder, FindOptionsWhere } from 'typeorm'
import { dataSource } from '../../dataSource'
import { Post, PostProduct } from '../../entity'

export const PostProductRepository = dataSource.getRepository(PostProduct).extend({
	async findOrCreate(alias: Post['alias'], data: Partial<PostProduct>) {
		let fined = await this.findOneBy({ alias })
		if (!fined) {
			fined = this.create({ alias, ...data })
		}
		return fined.save({ data })
	},

	async findByParams({ order, skip, take }: { order: FindOptionsOrder<PostProduct>; skip: number; take: number }) {
		const filter: FindOptionsWhere<PostProduct> = {}
		// const order: FindOptionsOrder<PostProduct> = {
		// 	updatedAt: 'DESC',
		// }

		/*const category =
			req.nextUrl.searchParams.get('category') != 'undefined' ? req.nextUrl.searchParams.get('category') : 'categories'

		if (category) {
			const cat = await CategoryRepository.findOne({
				where: {
					alias: category,
				},
				select: ['id'],
				cache: true,
			})

			const ancestors = await CategoryRepository.findAncestors(cat)
			const descendants = await CategoryRepository.findDescendants(cat)

			const ids = []

			for (const cat of ancestors) {
				ids[ids.length] = cat.id
			}

			for (const cat of descendants) {
				ids[ids.length] = cat.id
			}

			filter.categories = {
				id: In(ids),
			}
		}*/

		/*const sort = req.nextUrl.searchParams.get('sort')

		if (sort) {
			if (sort == 'popularity') {
				filter.deals = {
					percent: Not(IsNull()),
				}
				// order.updatedAt = 'DESC'
			}
			if (sort == 'best-deals') {
				filter.deals = {
					percent: Not(IsNull()),
				}
				order.deals = {
					percent: 'DESC',
				}
			}
		}*/

		return this.find({
			where: {
				...filter,
			},

			// select: {
			// 	id: true,
			// 	alias: true,
			// 	title: true,
			// 	images: true,
			// 	updatedAt: true,
			// },

			relations: {
				deals: true,
			},

			// order: {
			// 	...order,
			// },

			skip: Number(skip || 0),
			take: Number(take || 12),

			cache: true,
		})
	},
})