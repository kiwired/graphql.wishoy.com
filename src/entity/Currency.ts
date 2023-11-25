import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Currency extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@Column({
		length: 3,
		unique: true
	})
	code: string

	@Column()
	title: string

	@Column('int')
	value: number

	@Column()
	format: string
}