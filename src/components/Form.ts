import { Component } from './base/Component';
import { IEvents } from './base/events';
import { IForm } from '../types';
import { ensureElement } from '../utils/utils';

interface FormRender {
	errors: string;
	validity: boolean;
}

export class Form<T> extends Component<FormRender> implements IForm<T> {
	protected submitButton: HTMLButtonElement;
	protected formErrors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this.container.addEventListener('input', (evt: Event) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.inputChange(field, value);
		});
		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this.formErrors = ensureElement<HTMLElement>(
			'.form__errors',
			this.container
		);
		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	set validity(value: boolean) {
		this.submitButton.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this.formErrors, value);
	}

	protected inputChange(field: keyof T, value: string) {
		this.events.emit(`order:change`, { field, value });
	}

	render(data: Partial<T> & Pick<IForm<T>, 'errors' | 'validity'>) {
		const { errors, validity, ...inputs } = data;
		super.render({ errors, validity });
		Object.assign(this, inputs);
		return this.container;
	}
}
