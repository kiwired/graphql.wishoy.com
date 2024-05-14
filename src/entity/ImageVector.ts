import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne } from 'typeorm'
import { Image } from './Image'

@Entity()
export class ImageVector extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@ManyToOne(() => Image)
	@JoinColumn()
	image: Image

	@Column('int')
	score: number

	@Column('int')
	xMin: number

	@Column('int')
	yMin: number

	@Column('int')
	xMax: number

	@Column('int')
	yMax: number

	@Column('tsvector')
	vector: string
}