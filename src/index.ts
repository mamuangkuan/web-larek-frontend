import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { IOrder, IProduct, IContactForm, IOrderForm } from './types';
import { EventEmitter } from './components/base/events';
import { WebLarekApi } from './components/WebLarekApi';
import { AppData } from './components/AppData';
import { Card, BasketItem } from './components/Card';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { Modal } from './components/Modal';
import { OrderForm } from './components/OrderForm';
import { ContactForm } from './components/ContactForm';
import { SuccessForm } from './components/SuccessForm';

const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Создаем шаблоны
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Создаем модель данных
const appData = new AppData(events);

const page = new Page(document.body, events);
const modalWindow = new Modal(
	ensureElement<HTMLElement>('#modal-container'),
	events
);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const deliveryForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactForm(cloneTemplate(contactsTemplate), events);
const successForm = new SuccessForm(cloneTemplate(successTemplate), {
	Click: () => {
		modalWindow.close();
	},
});

//Делаем запрос данных с сервера
api
	.getProductsList()
	.then(appData.createProductsList.bind(appData))
	.catch((error) => {
		console.error(error);
	});

//Отрисовываем товары на странице
events.on('cards:create', () => {
	page.productsContainer = appData.productsList.map((card) => {
		const cardTemplate = new Card(cloneTemplate(cardCatalogTemplate), {
			Click: () => events.emit('card:select', card),
		});
		return cardTemplate.render({
			title: card.title,
			description: card.description,
			category: card.category,
			image: card.image,
			price: card.price,
			id: card.id,
		});
	});
});

// Отправляем в превью карточку
events.on('card:select', (product: IProduct) => {
	appData.setProductPreview(product);
});

// Открываем превью карточки товара
events.on('preview:changed', (product: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		Click: () => {
			if (appData.basket.indexOf(product) < 0) {
				events.emit('product:add', product);
			} else {
				events.emit('product:remove-from-modal', product);
			}
		},
	});
	modalWindow.render({
		content: card.render({
			title: product.title,
			description: product.description,
			category: product.category,
			image: product.image,
			price: product.price,
			id: product.id,
			actionButtonText:
				appData.basket.indexOf(product) < 0
					? 'Добавить в корзину'
					: 'Удалить из корзины',
		}),
	});
});

//Блокируем прокрутку открытого модального окна
events.on('modal:open', () => {
	page.scrollLock = true;
});

//Снимаем блокировку прокрутки при закрытии окна
events.on('modal:close', () => {
	page.scrollLock = false; // Разблокируем прокрутку страницы
});

//Добавляем товар в корзину
events.on('product:add', (product: IProduct) => {
	appData.addProductToBasket(product);
	modalWindow.close();
});

// Удаляем товар из корзины через модальное окно
events.on('product:remove-from-modal', (product: IProduct) => {
	appData.removeProductFromBasket(product);
	// Обновляем содержимое модального окна, чтобы отобразить изменения
	events.emit('preview:changed', product);
});

//Удаляем товар из корзины через корзину
events.on('product:delete', (product: IProduct) => {
	appData.removeProductFromBasket(product);
});

// Открываем корзину
events.on('basket:open', () => {
	modalWindow.render({
		content: basket.render(),
	});
});

// Отслеживаем изменения товаров в корзине
events.on('basket:changed', () => {
	page.basketCounter = appData.getBasketProducts().length;
	basket.products = appData.getBasketProducts().map((product) => {
		const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
			Click: () => {
				events.emit('product:delete', product);
			},
		});

		basketItem.index = appData.getBasketProductIndex(product);

		return basketItem.render({
			title: product.title,
			price: product.price,
		});
	});
	basket.price = appData.calculateTotalPrice();
});

// Создаем модальное окно для заказа
events.on('order:open', () => {
	appData.clearOrderData();
	deliveryForm.removePaymentMethod();
	modalWindow.render({
		content: deliveryForm.render({
			address: '',
			payment: '',
			errors: '',
			validity: false,
		}),
	});
});

// Выбираем способ оплаты
events.on(
	'payment:change',
	(data: { payment: string; button: HTMLElement }) => {
		appData.setPaymentMethod(data.payment);
		deliveryForm.addPaymentMethod(data.button);
		appData.validateDeliveryFields();
	}
);

// Создаем модальное окно для заполнения емейла и телефона
events.on('order:submit', () => {
	appData.getOrder().total = appData.calculateTotalPrice();
	modalWindow.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			validity: false,
			errors: '',
		}),
	});
});

// Изменяем нужные поля для доставки товаров
events.on(
	'order:change',
	(data: { 
		field: keyof IOrderForm; 
		value: IOrderForm[keyof IOrderForm] 
	}) => {
		appData.setOrderDeliveryFields(data.field, data.value);
	}
);

// Запускаем валидацию полей доставки
events.on('DeliveryFields:change', (errors: Partial<IOrder>) => {
	const { payment, address } = errors;
	deliveryForm.validity = !payment && !address;
	deliveryForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменяем нужные поля контактной информации
events.on(
	'contacts:change',
	(data: {
		field: keyof IContactForm;
		value: IContactForm[keyof IContactForm];
	}) => {
		appData.setOrderContactsFields(data.field, data.value);
	}
);

// Запускаем валидацию полей контактов
events.on('ContactsFields:change', (errors: Partial<IOrder>) => {
	const { email, phone } = errors;
	contactsForm.validity = !email && !phone;
	contactsForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

//Отправляем заказ на сервер и выводим окно с успешным заказом
events.on('contacts:submit', () => {
	api
		.makeOrder(appData.getOrder())
		.then((res) => {
			successForm.TotalSpentCounter = res.total;
			modalWindow.render({ content: successForm.render() });
			appData.clearBasket();
		})
		.catch((error) => {
			console.error(error);
		});
});
