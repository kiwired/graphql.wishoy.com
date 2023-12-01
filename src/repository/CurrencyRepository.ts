import { dataSource } from '../dataSource'
import { Currency } from '../entity'

export const CurrencyRepository = dataSource.getRepository(Currency).extend({

	findByCode(code: string) {
		return this.findOneBy({ code })
	}
})

