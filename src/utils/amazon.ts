import axios from 'axios'
import { createAuthorizationHeader, toAmzDate } from './aws4'

const instance = axios.create({
	baseURL: 'https://webservices.amazon.com/',
	headers: {
		'content-encoding': 'amz-1.0',
		'content-type': 'application/json; charset=utf-8',
		host: 'webservices.amazon.com',
	},
})

instance.interceptors.request.use((config) => {
	if (!config.data) {
		config.data = {}
	}

	const url = config.url || ''

	const operation = url.substring(url.lastIndexOf('/') + 1)
	const timestamp = Date.now()

	config.url = url.toLowerCase()
	config.data.PartnerTag = process.env.AMAZON_TAG_ID
	config.data.PartnerType = 'Associates'
	config.data.Marketplace = 'www.amazon.com'

	config.headers.set('x-amz-date', toAmzDate(timestamp))
	config.headers.set('x-amz-target', `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`)

	const auth = createAuthorizationHeader(
		process.env.AMAZON_TAG_ACCESS,
		process.env.AMAZON_TAG_SECRET,
		{
			'content-encoding': config.headers.get('content-encoding'),
			host: config.headers.get('host'),
			'x-amz-date': config.headers.get('x-amz-date'),
			'x-amz-target': config.headers.get('x-amz-target'),
		},
		(config.method || 'options').toUpperCase(),
		config.url.toLowerCase(),
		config.data,
		'us-east-1',
		'ProductAdvertisingAPI',
		timestamp
	)

	config.headers.set('Authorization', auth)

	return config
})

instance.interceptors.response.use(
	(res) => {
		return res
	},
	(error) => {
		for (const err of error.response.data?.Errors || []) {
			return Promise.reject(new Error(err.Message))
		}
		return Promise.reject(error)
	}
)

export const amazon = instance