import { BaseEntity, Entity, PrimaryGeneratedColumn, Index, Column, JoinColumn, OneToOne } from 'typeorm'
import { Post } from './Post'

@Entity()
@Index('idx_gin_document', { synchronize: false }) // CREATE INDEX idx_gin_document ON post_vector USING GIN(document);
export class PostVector extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@OneToOne(() => Post)
	@JoinColumn()
	post: Post

	// @Index()
	@Column('tsvector')
	document: string
}