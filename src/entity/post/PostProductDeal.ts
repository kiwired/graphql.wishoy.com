import type { Relation } from 'typeorm'
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { PostProduct } from './PostProduct'
import { Currency } from '../Currency'
import { PostStore } from './PostStore'

@Entity()
export class PostProductDeal extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@ManyToOne(() => PostProduct)
	product: Relation<PostProduct>

	@ManyToOne(() => Currency, { eager: true })
	currency: Relation<Currency>

	@ManyToOne(() => PostStore, { eager: true })
	store: PostStore

	@Column()
	gid: string

	@Column()
	title: string

	@Column('text')
	url: string

	@Column()
	price: number

	@Column()
	salePrice: number

	@Column()
	saving: number

	@Column()
	percent: number

	@CreateDateColumn()
	createdAt: Date
}