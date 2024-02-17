import 'reflect-metadata'
import { createServer } from 'node:http'
import { createYoga, createSchema, createGraphQLError } from 'graphql-yoga'
import { dataSource } from './dataSource'
import { CategoryRepository, PostProductRepository } from './repository'
import { gpt } from 'gpti'

const yoga = createYoga({
	graphqlEndpoint: '/',
	// landingPage: false,
	context: async (ctx) => {
		try {
			await dataSource.initialize()

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
						if (parent.title.startWith('"') || parent.title.startWith('\'')) {
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
										content: `Generate a new title for the product (maximum 70 characters): ${parent.title}\n${parent.features}`,
									},
								],
							},
							(err, data) => {
								if (err !== null) {
									resolve(data.title)
								}
								parent.title = data.gpt.replace(/^['"]|['"]$/g, '').trim()
								if (!parent.title || !parent.title.length) {
									resolve(parent.title)
								}
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
			},
		},
	}),
})

createServer(yoga).listen(process.env.PORT || 3000)