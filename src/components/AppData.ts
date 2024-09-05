import { IAppData, IProduct, IOrder, FormErrors } from '../types';
import { IEvents } from './base/events';
import { Model } from './base/Model';

export class AppData extends Model<IAppData> {
	productsList: IProduct[];
	basket: IProduct[] = [];
	protected formErrors: FormErrors = {};
	protected productPreview: string | null;
	protected order: IOrder = {
		payment: '',
		address: '',
		phone: '',
		email: '',
	};

	constructor(protected events: IEvents) {
		super({}, events);
	}

	createProductsList(cards: IProduct[]) {
		this.productsList = cards;
		this.emitChanges('cards:create');
	}

	calculateTotalPrice() {
		let totalPrice = 0;
		this.basket.forEach((card) => (totalPrice += card.price));
		return totalPrice;
	}

	addProductToBasket(product: IProduct) {
		if (!this.basket.some((card) => card.id === product.id)) {
			this.basket = [...this.basket, product];
			this.emitChanges('basket:changed');
		} else {
			this.removeProductFromBasket(product);
		}
	}

	removeProductFromBasket(product: IProduct) {
		if (this.basket.some((card) => card.id === product.id)) {
			this.basket = this.basket.filter((card) => product.id !== card.id);
			this.emitChanges('basket:changed');
		}
		return;
	}

	getOrder() {
		return {
			...this.order,
			total: this.calculateTotalPrice(),
			items: this.basket.map((el) => el.id),
		};
	}

	clearBasket() {
		this.order = {
			email: '',
			phone: '',
			payment: '',
			address: '',
		};
		this.basket = [];
		this.emitChanges('basket:changed');
	}

	isBasketEmpty(): boolean {
		return this.basket.length === 0;
	}

	getBasketProducts(): IProduct[] {
		return this.basket;
	}

	getBasketProductIndex(product: IProduct): number {
		return this.basket.indexOf(product) + 1;
	}

	setPaymentMethod(value: string) {
		if (this.order.payment !== value) this.order.payment = value;
	}

	setDeliveryAddress(value: string) {
		this.order.address = value;
	}
	setProductPreview(product: IProduct) {
		this.productPreview = product.id;
		this.emitChanges('preview:changed', product);
	}

	setOrderField(
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>,
		value: string
	) {
		this.order[field] = value;
		this.validateOrder();
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Укажите адрес электронной почты';
		}

		if (!this.order.phone) {
			errors.phone = 'Укажите номер телефона';
		}

		if (!this.order.address) {
			errors.address = 'Укажите адрес доставки';
		}

		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
