import type { Relation } from 'typeorm'
import { ChildEntity, Column, ManyToMany, OneToMany } from 'typeorm'
import { Post } from './Post'
import { PostProductDeal } from './PostProductDeal'
import { PostProductSpecific } from './PostProductSpecific'
import { PostProductVariation } from './PostProductVariation'

@ChildEntity('product')
export class PostProduct extends Post {

	@Column('simple-array')
	EANs: string[]

	@Column('simple-array')
	UPCs: string[]

	@Column('simple-array')
	MPNs: string[]

	@OneToMany(() => PostProductDeal, (deal) => deal.product)
	// @JoinColumn()
	deals: Relation<PostProductDeal[]>

	@OneToMany(() => PostProductSpecific, (specific) => specific.product)
	specifics: Relation<PostProductSpecific[]>

	@ManyToMany(() => PostProductVariation)
	variations: PostProductVariation[]

	@Column()
	features: string

	/**
	 * Variants
	 */
	// @ManyToMany(() => Product, { lazy: true })
	// @JoinTable({ name: 'product_group' })
	// group: Product[]
}