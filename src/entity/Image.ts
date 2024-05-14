import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Image extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@Column()
	src: string
}