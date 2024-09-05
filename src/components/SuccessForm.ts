import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { ISuccessResult } from '../types';

export class SuccessForm extends Component<never> {
	protected closeButton: HTMLButtonElement;
	protected totalSpent: HTMLElement;

	constructor(container: HTMLElement, operation: ISuccessResult) {
		super(container);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this.totalSpent = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (operation?.Click) {
			this.closeButton.addEventListener('click', operation.Click);
		}
	}

	set TotalSpentCounter(total: number | string) {
		this.totalSpent.textContent = `Списано ${total} синапсов`;
	}
}
