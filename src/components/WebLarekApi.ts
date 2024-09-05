import { IOrder, IOrderResult, IProduct } from '../types';
import { Api, ApiListResponse } from './base/api';
export interface IAppAPI {
	getProductsList: () => Promise<IProduct[]>;
	makeOrder(value: IOrder): Promise<IOrderResult>;
}
export class WebLarekApi extends Api implements IAppAPI {
	constructor(readonly cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductsList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	makeOrder(value: IOrder): Promise<IOrderResult> {
		return this.post('/order', value).then((data: IOrderResult) => data);
	}
}
