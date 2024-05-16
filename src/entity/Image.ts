import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

@Entity()
export class Image extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@Column()
	@Index()
	src: string

	@Column()
	alt: string
}