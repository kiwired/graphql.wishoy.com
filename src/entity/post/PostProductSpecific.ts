import type { Relation } from 'typeorm'
import { BaseEntity, Entity, Index, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { PostProduct } from './PostProduct'

@Entity()
export class PostProductSpecific extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@ManyToOne(() => PostProduct, (product) => product.specifics)
	product: Relation<PostProduct>

	@Index()
	@Column()
	label: string

	@Column({ nullable: true })
	title?: string

	@Column()
	value: string
}