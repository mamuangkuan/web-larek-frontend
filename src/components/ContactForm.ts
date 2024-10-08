import { Form } from './Form';
import { IEvents } from './base/events';
import { IContactForm, ISuccessForm } from '../types';

interface ContactRender {
	email: string;
	phone: string;
	valid: boolean;
	errors: string;
}

export class ContactForm extends Form<ContactRender> implements IContactForm {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
	set email(text: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			text;
	}
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	protected inputChange(
		field: keyof IContactForm,
		value: IContactForm[keyof IContactForm]
	) {
		this.events.emit(`contacts:change`, { field, value });
	}
}
