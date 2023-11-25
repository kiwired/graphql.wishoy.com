import type { Relation } from 'typeorm'
import { BaseEntity, Entity, Index, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { PostProduct } from './PostProduct'

@Entity()
export class PostProductVariation extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@ManyToOne(() => PostProduct, (product) => product.variations)
	product: Relation<PostProduct>

	@Index()
	@Column()
	label: string

	@Column()
	value: string
}