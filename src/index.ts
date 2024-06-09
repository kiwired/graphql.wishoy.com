import 'reflect-metadata'
import { createServer } from 'node:http'
import { createYoga, createSchema, createGraphQLError } from 'graphql-yoga'
import { dataSource } from './dataSource'
import { CategoryRepository, PostProductRepository, ImageVectorRepository } from './repository'
import { gpt } from 'gpti'
import { In, Like, Not } from 'typeorm'
import { PostProduct } from './entity'

const yoga = createYoga({
	graphqlEndpoint: '/',
	// landingPage: false,
	context: async (ctx) => {
		try {
			if (!dataSource.isInitialized) {
				await dataSource.initialize()
			}

			return ctx
		} catch (error) {
			return createGraphQLError(JSON.stringify(error), {
				extensions: {
					code: 'INTERNAL_SERVER_ERROR',
				},
			})
		}
	},
	schema: createSchema({
		typeDefs: `

			scalar Date

			type User {
				name: String
				picture: String
				email: String
				country: String
				verified: Boolean
			}

			type Review {
				user: User
				title: String
				html: String
				rating: Int
				createdAt: Date
			}

			type Currency {
				code: String!
				title: String
				value: Int
				format: String
			}

			type Seo {
				title: String
				description: String
				keywords: String
			}

			type Category {
				alias: String!
				title: String
				seo: Seo
				card: CategoryCard
				parent: Category
				childs: [Category]
				ancestors: [Category]
			}

			type CategoryCard {
				title: String
				image: String
			}

			type Store {
				alias: String!
				title: String
			}

			type Product {
				alias: String!
				title: String
				seo: Seo
				html: String
				images: [String]
				categories: [Category]
				reviews: [Review]

				deals: [ProductDeal]
				specifics: [ProductSpecific]
				features: String
				similars: [Product]
			}

			type ProductDeal {
				currency: Currency
				store: Store
				title: String
				url: String
				price: Int
				salePrice: Int
				saving: Int
				percent: Int
			}

			type ProductSpecific {
				label: String
				title: String
				value: String
			}

			type Query {
				category(alias: String): Category
				product(alias: String!): Product
				products(category: String, sort: String, skip: Int, take: Int): [Product]
			}

		`,
		resolvers: {
			Query: {
				category: (_parent, args: { alias: string }) => {
					return CategoryRepository.findOne({
						where: {
							alias: args.alias || 'categories',
						},
						cache: true,
					})
				},

				product: (_parent, args: { alias: string }) => {
					return PostProductRepository.findOne({
						where: {
							alias: args.alias,
						},
						relations: {
							categories: true,
							reviews: {
								user: true,
							},
							deals: true,
							specifics: true,
							imgs: true
						},
						cache: true,
					})
				},

				products: (_parent, args) => {
					return PostProductRepository.findByParams(args)
				},
			},

			Category: {
				ancestors: (parent) => {
					return CategoryRepository.findAncestors(parent)
				},
				parent: (parent) => {
					return CategoryRepository.findAncestors(parent).then((rows) => {
						for (const row of rows) {
							if (parent.id !== row.id) {
								return row
							}
						}
						return null
					})
				},
				childs: (parent) => {
					return CategoryRepository.findDescendantsTree(parent, { depth: 1 }).then((val) => val.childs)
				},
			},

			Product: {
				categories: (parent) => {
					return parent.categories || []
				},

				title: async (parent) => {
					if (parent.html && parent.title.length < 70) {
						if (parent.title.startsWith('"') || parent.title.startsWith("'")) {
							parent.title = parent.title.replace(/^['"]|['"]$/g, '').trim()
							await parent.save()
						}
						return parent.title
					}
					// если html еще не генерировали
					return new Promise((resolve) => {
						gpt(
							{
								messages: [
									{
										role: 'user',
										content: `Generate a new title for the product (maximum 50 characters): ${parent.title}\n${parent.features}`,
									},
								],
							},
							(err, data) => {
								if (err !== null) {
									console.error(err)
									resolve(parent.title)
									return
								}
								const title = data.gpt.replace(/^['"]|['"]$/g, '').trim()
								if (!title || !title.length) {
									resolve(parent.title)
								}
								parent.title = title
								parent.save().then(() => {
									resolve(parent.title)
								})
							}
						)
					})
				},

				html: async (parent) => {
					if (parent.html) {
						return parent.html
					}
					return new Promise((resolve) => {
						try {
							gpt(
								{
									messages: [
										{
											role: 'user',
											// content: `Generate a new title for the product: ${parent.title}`,
											content: `Generate a description for the product: ${parent.title}\n${parent.features}`,
										},
									],
									markdown: true,
								},
								(err, data) => {
									if (err !== null) {
										resolve(data.html)
									}
									parent.html = data.original || data.gpt
									parent.save().then(() => {
										resolve(parent.html)
									})
								}
							)
						} catch (err) {
							resolve(parent.html)
						}
					})
				},

				reviews: (parent) => {
					return parent.reviews || []
				},

				deals: (parent) => {
					return parent.deals || []
				},

				specifics: (parent) => {
					return parent.specifics || []
				},

				similars: async (parent): Promise<PostProduct[]> => {
					for await (const image of parent.imgs || []) {

						const key = `box_${image.id}_%`

						const vec = await ImageVectorRepository.findOneBy({
							id: Like(key),
						})

						if (!vec) {
							return []
						}

						const simmilars = await ImageVectorRepository.createQueryBuilder()
							.where({
								id: Not(Like(key)),
							})
							.orderBy('vec <-> :vec')
							.setParameters({ vec: vec.vec })
							.take(10)
							.getMany()
							.then((rows) => rows.map((row) => row.metadata.imageId))

						return PostProductRepository.find({
							where: {
								imgs: {
									id: In(simmilars),
								},
							},
							relations: {
								imgs: true,
								deals: true,
							},
							take: 5,
						})
					}

					return []
				},
			},
		},
	}),
})

createServer(yoga).listen(process.env.PORT || 3000)