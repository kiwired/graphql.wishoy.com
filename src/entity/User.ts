import type { Relation } from 'typeorm'
import { BaseEntity, Entity, PrimaryGeneratedColumn, Index, Column, OneToMany } from 'typeorm'
import { Review } from '../entity'

export enum UserRole {
	ADMIN = 'admin',
	EDITOR = 'editor',
	GUEST = 'guest',
}

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@Column()
	name: string

	@Column({ nullable: true })
	picture?: string

	@Index()
	@Column()
	email: string

	@Column()
	password: string

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.GUEST,
	})
	role: UserRole

	@Column({ nullable: true })
	country?: string

	@Column('bool', { default: false })
	verified: boolean

	@OneToMany(() => Review, (review) => review.user)
	reviews: Relation<Review[]>

	comparePassword(password: string): boolean {
		return this.password === password
	}
}