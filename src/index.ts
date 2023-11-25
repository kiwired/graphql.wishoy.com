import 'reflect-metadata'
import { createServer } from 'node:http'
import { createYoga, createSchema, createGraphQLError } from 'graphql-yoga'
import { dataSource } from './dataSource'

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
			type Query {
				greetings: String
			}
		`,
		resolvers: {
			Query: {
				greetings: (parent, args, ctx) => 'This is the `greetings` field of the root `Query` type',
			},
		},
	}),
})

createServer(yoga).listen(process.env.PORT || 3000)