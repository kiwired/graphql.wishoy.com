import { DataSource } from 'typeorm'
import { entities } from './entity'

export const dataSource = new DataSource({
	type: 'postgres',
	url: process.env.DB_URI,
	entities
})