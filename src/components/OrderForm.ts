import { Form } from './Form';
import { IEvents } from './base/events';
import { IOrderForm } from '../types';

interface OrderRender {
	address: string;
	payment: string;
	errors: string;
	valid: boolean;
}

export class OrderForm extends Form<OrderRender> implements IOrderForm {
	protected onlinePaymentButton: HTMLButtonElement;
	protected cashPaymentButton: HTMLButtonElement;
	payment: string;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.onlinePaymentButton = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this.cashPaymentButton = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;

		if (this.onlinePaymentButton) {
			this.onlinePaymentButton.addEventListener('click', () => {
				events.emit(`payment:change`, {
					payment: this.onlinePaymentButton.name,
					button: this.onlinePaymentButton,
				});
			});
		}

		if (this.cashPaymentButton) {
			this.cashPaymentButton.addEventListener('click', () => {
				events.emit(`payment:change`, {
					payment: this.cashPaymentButton.name,
					button: this.cashPaymentButton,
				});
			});
		}
	}

	set address(text: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			text;
	}

	addPaymentMethod(value: HTMLElement) {
		this.removePaymentMethod();
		this.toggleClass(value, 'button_alt-active', true);
	}

	removePaymentMethod() {
		this.toggleClass(this.onlinePaymentButton, 'button_alt-active', false);
		this.toggleClass(this.cashPaymentButton, 'button_alt-active', false);
	}
}
