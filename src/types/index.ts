//товар
export interface IProduct extends ICard {
	title: string;
	id: string;
	category: string;
	description: string;
	image: string;
	price: number | null;	
}

//Карточка товара
export interface ICard {
	actionButtonText: string;	
}

//Интерфейс данных приложения
export interface IAppData {
	cardList: IProduct[];
	basket: IProduct[];
}

//интерфейс окна формы
export interface IForm<T> {
	errors: string;
	validity: boolean;
}

//интерфейс модального окна заказа
export interface IOrderForm {
	payment: string;
	address: string;
}

//Интерфейс заполнения контактной информации
export interface IContactForm {
	email: string;
	phone: string;
}

//Интерфейс заказа
export interface IOrder {
	payment: string;
	address: string;
	phone: string;
	email: string;
}

//интерфейс валидации формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

//интерфейс корзины
export interface IBasket {
	products: HTMLElement[];
	price: number;
}

//интерфейс успешное оформление заказа
export interface ISuccessForm {
	count: number | string;
}

//интерфейс действий над карточкой
export interface IOperation {
	Click: (event: MouseEvent) => void;
}

//интерфейс действий окна успешного оформления заказа
export interface ISuccessResult {
	Click: () => void;
}

//интерфейс главной страницы
export interface IPage {
	productsContainer: HTMLElement[];
	basketCounter: number;
	scrollLock: boolean;
}

// интерфейс данных ответа сервера на создание заказа
export interface IOrderResult {
	id: string;
	total: number;
}
// Модальное окно
export interface IModal {
	content: HTMLElement;
}

export type ModalRender = Pick<IModal, 'content'>;