import 'reflect-metadata'
import { createServer } from 'node:http'
import { createYoga, createSchema, createGraphQLError } from 'graphql-yoga'
import { dataSource } from './dataSource'
import { CategoryRepository, PostProductRepository } from './repository'

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

				html: String
				images: [String]
				categories: [Category]
				reviews: [Review]

				deals: [ProductDeal]
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

			type Query {
				category(alias: String): Category
				product(alias: String!): Product
				products(order: String, skip: Int, take: Int): [Product]
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
					return PostProductRepository.findOneBy(args)
				},

				products: (_parent, args) => {
					return PostProductRepository.findByParams(args)
				},
			},

			Category: {
				ancestors: (parent) => {
					return CategoryRepository.findAncestors(parent)
						.then((rows) => rows.filter((row) => row.id !== parent.id))
				},
				parent: (parent) => {
					return CategoryRepository.findAncestors(parent)
						.then((rows) => {
							for (const row of rows) {
								if (parent.id !== row.id) {
									return row
								}
							}
							return null
						})
				},
				childs: (parent) => {
					return CategoryRepository.findDescendantsTree(parent, { depth: 1 })
						.then((val) => val.childs)
				},
			},
		},
	}),
})

createServer(yoga).listen(process.env.PORT || 3000)