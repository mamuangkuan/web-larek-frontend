import { IPage } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export class Page extends Component<never> implements IPage {
	protected _wrapperContainer: HTMLElement;
	protected _basketElement: HTMLElement;
	protected _basketCounter: HTMLElement;
	protected _productsContainer: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._wrapperContainer = ensureElement<HTMLElement>('.page__wrapper');
		this._basketElement = ensureElement<HTMLElement>('.header__basket');
		this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this._productsContainer = ensureElement<HTMLElement>('.gallery');

		this._basketElement.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set productsContainer(items: HTMLElement[]) {
		this._productsContainer.replaceChildren(...items);
	}

	set basketCounter(value: number) {
		this.setText(this._basketCounter, String(value));
	}

	set scrollLock(value: boolean) {
		this.toggleClass(this._wrapperContainer, 'page__wrapper_locked', value);
	}
}
