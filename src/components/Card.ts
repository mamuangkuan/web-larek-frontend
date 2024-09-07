import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IOperation, IProduct } from '../types';

const categoryColorsList: { [key: string]: string } = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	'кнопка': 'card__category_button',
	'дополнительное': 'card__category_additional',
	'другое': 'card__category_other',
};

export class Card extends Component<IProduct> {
	protected _category: HTMLElement | null;
	protected _title: HTMLElement;
	protected _text: HTMLElement | null;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement | null;
	protected _actionButton: HTMLButtonElement | null;

	constructor(container: HTMLElement, operation?: IOperation) {
		super(container);
		this._category = container.querySelector(`.card__category`);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._text = container.querySelector(`.card__text`);
		this._image = container.querySelector(`.card__image`);
		this._price = container.querySelector(`.card__price`);
		this._actionButton = container.querySelector(`.card__button`);

		if (operation?.Click) {
			if (this._actionButton) {
				this._actionButton.addEventListener('click', operation.Click);
			} else {
				container.addEventListener('click', operation.Click);
			}
		}
	}

	set price(price: number | null) {
		if (price) {
			this.setText(this._price, `${price} синапсов`);
		} else {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._actionButton, true);
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category ${categoryColorsList[value]}`;
	}

	set image(link: string) {
		this.setImage(this._image, link, this.title);
	}

	set title(text: string) {
		this.setText(this._title, text);
	}

	set description(text: string) {
		this.setText(this._text, text);
	}

	set actionButtonText(value: string) {
		this.setText(this._actionButton, value);
	}
}
export class BasketItem extends Card {
	protected _title: HTMLElement;
	protected _index: HTMLElement;
	protected _deleteButton: HTMLButtonElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, operation?: IOperation) {
		super(container, operation);

		this._index = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);
	}

	set index(index: number) {
		this.setText(this._index, index);
	}
}
