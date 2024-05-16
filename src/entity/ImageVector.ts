import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

@Entity({ schema: 'vecs', name: 'image_vectors_512', synchronize: false })
export class ImageVector extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string

	@Column('tsvector')
	vec: string

	@Column('jsonb')
	metadata: Record<string, unknown>
}