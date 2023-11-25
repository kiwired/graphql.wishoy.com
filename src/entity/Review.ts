import type { Relation } from 'typeorm'
import { BaseEntity, Entity, PrimaryGeneratedColumn, Index, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { User, Post } from '../entity'

@Entity()
export class Review extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@ManyToOne(() => User) 
	user: Relation<User>

	@ManyToOne(() => Post)
	post: Relation<Post>

	@Index()
	@Column({ nullable: true })
	gid?: string

	@Column()
	title: string

	@Column('text')
	html: string

	@Column('int2')
	rating: number

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}