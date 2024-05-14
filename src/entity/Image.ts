import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { ImageVector } from './ImageVector'

@Entity()
export class Image extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@Column()
	src: string

	@Column()
	alt: string

	@OneToMany(() => ImageVector, vect => vect.image)
	vectors: ImageVector[]
}