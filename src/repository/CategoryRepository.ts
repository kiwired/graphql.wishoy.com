import { In } from 'typeorm'
import { dataSource } from '@/dataSource'
import { Category } from '@/entity'

export const CategoryRepository = dataSource.getTreeRepository(Category).extend({

	findByGID(gid: string[]) {
		return this.findBy({ gid: In(gid) })
	},

	async findOrCreate(gid: string, data: Category) {
		let fined = await this.findOneBy({ gid })
		if (!fined) {
			fined = this.create({ gid, ...data })
		}
		return fined.save({ data })
	},

	/*async importRoots() {
		const db = await mongoClient()
		const Node = db.collection('nodes')

		const nodes = await Node.find({ parent: null }).toArray()

		const category = await this.save({
			alias: 'categories',
			title: 'Categories',
			seo: {
				title: 'Browse and compare prices on our wide range of products! Check out our catalogue of categories! Use WISHOY!',
				description: 'WISHOY is a very useful and easy platform to compare prices on the desired products. WISHOY will help you to save time on online shopping, it gives informative  product descriptions, real reviews and really wide range of products: from the latest models of gadgets to trending fashion items, sports accessories and many more!',
				keywords: 'compare prices, find price, find prices, online shopping, product comparison, compare products, product reviews, product best pricing, shopping for products, customer reviews, best prices, find lowest price, lowest price, best deals'
			}
		})

		const parents: Category[] = []

		for (const node of nodes) {
			parents[parents.length] = await this.findOrCreate(node.gid, {
				alias: node.alias,
				title: node.title,
				parent: category,
				card: node.card || null,
				seo: node.seo || null,
			})
			console.log(`imported superparent node ${node.gid}`)
		}

		for (const parent of parents) {
			const node = await Node.findOne({ gid: parent.gid })

			if (!node) {
				continue
			}

			for (const _id of node.childs) {
				const child = await Node.findOne({ _id })
				const category = await this.findOrCreate(child.gid, {
					alias: child.alias,
					title: child.title,
					parent: parent,
					card: child.card || null,
					seo: child.seo || null,
				})
				parents[parents.length] = await category.save()
				console.log(`imported node ${category.id} ${category.gid}`)
			}
		}

	}*/
})

