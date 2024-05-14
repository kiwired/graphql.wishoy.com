import type { Relation } from 'typeorm'
import { BaseEntity, Entity, Tree, PrimaryGeneratedColumn, Index, Column, TreeParent, TreeChildren, BeforeInsert } from 'typeorm'
import { slugify } from '../utils'

@Entity()
@Tree('closure-table')
export class Category extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@Column('text', { unique: true, nullable: true })
	gid: string | null

	@Index()
	@Column()
	alias: string

	@Column()
	title: string

	@Column('simple-json', { nullable: true })
	seo: {
		title: string,
		description: string,
		keywords: string
	}
	// @OneToOne(() => CategorySeo, { eager: true })
	// @JoinColumn()
	// seo: CategorySeo

	@Column('simple-json', { nullable: true })
	card: {
		title: string,
		image: string
	}
	// @OneToOne(() => CategoryCard, { eager: true })
	// @JoinColumn()
	// card: CategoryCard

	@TreeParent()
	parent: Relation<Category>

	@TreeChildren()
	childs: Relation<Category[]>

	@BeforeInsert()
	beforeInsert() {
		this.title = this.title.replace(/ +(?= )/g, '').trim()
		if (!this.alias) {
			this.alias = slugify(this.title)
		}
	}

	/*browseNodes() {
		return amazon.post('/paapi5/GetBrowseNodes', {
			BrowseNodeIds: [this.gid],
			Resources: [
				'BrowseNodes.Ancestor',
				'BrowseNodes.Children'
			]
		})
	}

	searchItems(keys: string, page: number = 1) {
		return amazon.post('/paapi5/SearchItems', {
			BrowseNodeId: this.gid,
			Keywords: keys,
			SearchIndex: 'all',
			// MinReviewsRating: 4,
			// MinSavingPercent: 30,
			ItemCount: 1,
			ItemPage: page,
			Condition: 'Any',
			Resources: [
				'ParentASIN',
				'Images.Primary.Large',
				'Images.Primary.Medium',
				// 'Images.Primary.Small',
				'Images.Variants.Large',
				'ItemInfo.Title',
				'ItemInfo.ByLineInfo',
				// 'ItemInfo.Classifications',
				// 'ItemInfo.ContentInfo',
				// 'ItemInfo.ContentRating',
				'ItemInfo.ExternalIds',
				'ItemInfo.Features',
				'ItemInfo.ManufactureInfo',
				'ItemInfo.ProductInfo',
				// 'ItemInfo.TechnicalInfo',
				// 'ItemInfo.TradeInInfo',
				'Offers.Listings.Price',
				'BrowseNodeInfo.BrowseNodes',
				// 'BrowseNodeInfo.BrowseNodes.SalesRank'
			],
		})
	}*/
}