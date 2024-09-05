import { IBasket } from '../types';
import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { createElement, ensureElement } from '../utils/utils';

export class Basket extends Component<never> implements IBasket {
	protected basketProductsList: HTMLElement;
	protected totalPrice: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.basketProductsList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.totalPrice = this.container.querySelector('.basket__price');
		this.basketButton = this.container.querySelector('.basket__button');

		if (this.basketButton) {
			this.basketButton.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
		this.products = [];
	}

	set products(products: HTMLElement[]) {
		if (products.length) {
			this.basketProductsList.replaceChildren(...products);
			this.setDisabled(this.basketButton, false);
		} else {
			this.basketProductsList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Пока в корзине ничего нет',
				})
			);
			this.setDisabled(this.basketButton, true);
		}
	}

	set price(price: number) {
		this.setText(this.totalPrice, `${price} синапсов`);
	}
}
