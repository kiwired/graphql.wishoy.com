import type { Relation } from 'typeorm'
import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Index,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	TableInheritance,
	ManyToMany,
	JoinTable,
	BeforeInsert,
	OneToMany,
} from 'typeorm'
import { Image, Category, Review } from '../../entity'
import { slugify } from '../../utils'

enum PostType {
	POST = 'post',
	PAGE = 'page',
	PRODUCT = 'product',
	ATTACH = 'attach',
}

@Entity()
@TableInheritance({
	column: {
		name: 'type',
		type: 'varchar',
		enum: PostType,
	},
})
export class Post extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@Column('varchar')
	type: string

	@Index()
	@Column()
	alias: string

	@Column({ nullable: true })
	href?: string

	@Column('text')
	title: string

	@Column('text')
	html: string

	@Column('simple-json', { nullable: true })
	seo: {
		title: string
		description: string
		keywords: string
	}

	@Column('simple-array', { nullable: true })
	images: string[] | null

	@ManyToMany(() => Image)
	@JoinTable({ name: 'post_image' })
	imgs: Relation<Image[]>

	@ManyToMany(() => Category)
	@JoinTable({ name: 'post_category' })
	categories: Relation<Category[]>

	@OneToMany(() => Review, (review) => review.post)
	reviews: Relation<Review[]>

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@BeforeInsert()
	beforeInsert() {
		this.title = this.title.replace(/ +(?= )/g, '').trim()
		if (!this.alias) {
			this.alias = slugify(this.title)
		}
	}
}
