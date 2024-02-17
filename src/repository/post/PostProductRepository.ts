import { FindOptionsOrder, FindOptionsWhere, In, IsNull, Not } from 'typeorm'
import { dataSource } from '../../dataSource'
import { Post, PostProduct } from '../../entity'
import { CategoryRepository } from '../CategoryRepository'

export const PostProductRepository = dataSource.getRepository(PostProduct).extend({
	async findOrCreate(alias: Post['alias'], data: Partial<PostProduct>) {
		let fined = await this.findOneBy({ alias })
		if (!fined) {
			fined = this.create({ alias, ...data })
		}
		return fined.save({ data })
	},

	async findByParams({ skip, take, ...args }: { category: string; sort: string; skip: number; take: number }) {
		const filter: FindOptionsWhere<PostProduct> = {}
		const order: FindOptionsOrder<PostProduct> = {
			updatedAt: 'DESC',
		}

		if (args.category) {
			const category = await CategoryRepository.findOne({
				where: {
					alias: args.category,
				},
				select: ['id'],
				cache: true,
			})

			if (category) {
				const ancestors = await CategoryRepository.findAncestors(category)
				const descendants = await CategoryRepository.findDescendants(category)

				const ids = []

				for (const row of ancestors) ids[ids.length] = row.id
				for (const row of descendants) ids[ids.length] = row.id

				filter.categories = {
					id: In(ids),
				}
			}
		}

		if (args.sort) {
			const discrict = args.sort.startsWith('-') ? 'DESC' : 'ASC'
			if (args.sort == 'popularity' || args.sort == '-popularity') {
				filter.deals = {
					percent: Not(IsNull()),
				}
				// order.updatedAt = discrict
			}
			if (args.sort == 'recently-bought' || args.sort == '-recently-bought') {
				filter.deals = {
					percent: Not(IsNull()),
				}
				order.updatedAt = discrict
			}
			if (args.sort == 'best-deals' || args.sort == '-best-deals') {
				filter.deals = {
					percent: Not(IsNull()),
				}
				order.deals = {
					percent: discrict,
				}
			}
			if (args.sort == 'price' || args.sort == '-price') {
				filter.deals = {
					salePrice: Not(IsNull()),
				}
				order.deals = {
					salePrice: discrict,
				}
			}
		}

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

			order: {
				...order,
			},

			skip: Number(skip || 0),
			take: Number(take || 12),

			cache: true,
		})
	},
})