# Проектная работа "Веб-ларек"

Проект представляет собой небольшой шуточный интернет-магазин с товарами для программистов.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения

Приложение построено по архитектурной модели MVP (Model-View-Presenter). Эта модель разделяет логику приложения на три компонента:

- **Model (Модель)**: управляет данными и бизнес-логикой приложения. Она отвечает за получение данных, их хранение и манипуляции с ними.
- **View (Представление)**: отвечает за отображение данных и взаимодействие с пользователем. View получает данные от Presenter и отображает их пользователю.
- **Presenter (Презентер)**: связывает Model и View. Он получает данные из Model, обрабатывает пользовательские действия, поступающие из View, и обновляет View в соответствии с изменениями данных.

Такое разделение позволяет сделать код более структурированным, легко поддерживаемым и тестируемым.

### Базовые классы

#### EventEmitter
Механизм для управления событиями (брокер событий), который позволяет отправлять и подписываться на события.
- **Свойства**:
  - нет

- **Методы**:
  - **on**: подписка на событие
  - **emit**: инициирует событие
  - **trigger**: возвращает функцию для инициализации события

#### Model
Абстрактный класс для слоя данных. Его функции включают получение данных и событий для уведомления об изменениях данных.
- **Конструктор**:
  - принимает данные для инициализации модели и объект событий

- **Свойства**:
  - **events**: объект событий, используемый для уведомления об изменениях модели

- **Методы**:
  - **emitChanges**: сообщает всем, что модель поменялась, инициируя событие


#### Api
Класс для взаимодействия с сервером.
- **Свойства**:
  - нет

- **Методы**:
  - **get**: выполняет GET запрос на указанный эндпоинт и возвращает промис с ответом от сервера.
  - **post**: отправляет данные в теле запроса на указанный эндпоинт с помощью POST запроса. Метод запроса можно изменить, передав третий параметр.

#### Component
Базовый класс для работы с элементами DOM.
- **Конструктор**:
  - принимает контейнер для компонента

- **Свойства**:
  - нет

- **Методы**:
  - **toggleClass**: переключает класс у элемента.
  - **setText**: устанавливает текстовое содержимое элемента.
  - **setDisabled**: устанавливает состояние блокировки элемента.
  - **setHidden**: скрывает элемент.
  - **setVisible**: показывает элемент.
  - **setImage**: устанавливает изображение и альтернативный текст.
  - **render**: возвращает корневой DOM-элемент.

### Слой данных (Model)

#### AppData
Класс для управления состоянием данных приложения. Наследуется от `Model`.
- **Конструктор**:
  - принимает объект событий и передает его в базовый класс вместе с пустым объектом состояния

- **Свойства**:
  - **products**: массив товаров
  - **cart**: массив товаров в корзине
  - **formValidationErrors**: ошибки валидации форм
  - **previewProductId**: ID карточки для превью
  - **orderDetails**: данные заказа

- **Методы**:
  - **Корзина**:
    - **isCartEmpty**: проверяет, пуста ли корзина.
    - **addProductToCart**: добавляет товар в корзину.
    - **removeProductFromCart**: удаляет товар из корзины.
    - **clearCart**: очищает корзину.
    - **getCartItems**: возвращает товары в корзине.
    - **findProductIndexInCart**: возвращает индекс товара в корзине.
    - **calculateTotalPrice**: вычисляет общую стоимость товаров в корзине.
  
  - **Продукты**:
    - **addProducts**: добавляет товары в список.
    - **setPreviewProduct**: устанавливает ID выбранной карточки для превью.

  - **Заказ**:
    - **createOrder**: создает объект заказа.
    - **setPaymentMethod**: устанавливает способ оплаты.
    - **setDeliveryAddress**: устанавливает адрес доставки.
    - **updateOrderField**: устанавливает значение для полей заказа address, phone и email.
    - **validateOrderForm**: проверяет заполнение полей заказа.

#### WebLarekApi
Класс для взаимодействия с сервером. Наследуется от `Api`.
- **Свойства**:
  - нет

- **Методы**:
  - **fetchProductList**: получает список товаров.
  - **submitOrder**: отправляет заказ на сервер.

### Слой представления (View)

#### Page
Класс для управления состоянием страницы и отображения товаров. Наследуется от `Component`.
- **Конструктор**:
  - принимает контейнер для карточек товаров и объект событий

- **Свойства**:
  - **modalContainer**: контейнер для модального окна
  - **cartElement**: элемент корзины
  - **cartCounter**: элемент счетчика корзины
  - **productContainer**: контейнер для товаров

- **Методы**:
  - **setProductElements**: добавляет товары на страницу.
  - **updateCartCounter**: устанавливает количество товаров в корзине.
  - **toggleScrollLock**: блокирует прокрутку.

#### Card
Класс для отображения данных в карточке товара. Наследуется от `Component`.
- **Конструктор**:
  - принимает контейнер для карточки товара и действие над карточкой

- **Свойства**:
  - **categoryElement**: категория товара
  - **titleElement**: название товара
  - **descriptionElement**: описание товара 
  - **imageElement**: изображение товара
  - **priceElement**: цена товара 
  - **actionButton**: кнопка 

- **Методы**:
  - **setTitle**: устанавливает название.
  - **setDescription**: устанавливает описание.
  - **setCategory**: устанавливает категорию.
  - **setPrice**: устанавливает цену.
  - **setImage**: устанавливает изображение.
  - **setActionButtonText**: устанавливает текст на кнопке.

#### Cart
Класс для отображения корзины. Наследуется от `Component`.
- **Конструктор**:
  - принимает контейнер для данных корзины и объект событий

- **Свойства**:
  - **cartItemList**: список товаров в корзине
  - **totalPriceElement**: элемент с общей стоимостью 
  - **cartButton**: кнопка корзины

- **Методы**:
  - **setCartItems**: устанавливает список товаров.
  - **setTotalPrice**: устанавливает общую стоимость.

#### Form
Класс для работы с формами. Наследуется от `Component`.
- **Свойства**:
  - **submitButton**: кнопка отправки формы
  - **errorContainer**: элемент для отображения ошибок

- **Методы**:
  - **setFormValidity**: устанавливает валидность формы.
  - **setFormErrors**: устанавливает ошибки формы.
  - **renderForm**: отрисовывает форму.
  - **handleInputChange**: проверяет поле.

#### OrderForm
Класс для формы заказа. Наследуется от `Form`.
- **Свойства**:
  - **onlinePaymentButton**: кнопка выбора онлайн оплаты
  - **cashPaymentButton**: кнопка выбора оплаты при получении
  - **selectedPaymentMethod**: способ оплаты

- **Методы**:
  - **setDeliveryAddress**: устанавливает адрес доставки.
  - **addPaymentOption**: добавляет способ оплаты.
  - **removePaymentOption**: удаляет способ оплаты.

#### ContactForm
Класс для формы контактных данных. Наследуется от `Form`.
- **Конструктор**:
  - принимает контейнер для данных контактов и объект событий

- **Методы**:
  - **setEmail**: устанавливает email.
  - **setPhoneNumber**: устанавливает телефон.

#### SuccessMessage
Класс для отображения сообщения об успешном заказе. Наследуется от `Component`.
- **Конструктор**:
  - принимает контейнер данных об успешном заказе и объект событий

- **Свойства**:
  - **closeButton**: кнопка закрытия
  - **totalSpentElement**: общее количество потраченных средств

- **Методы**:
  - **setTotalSpent**: устанавливает количество потраченных средств.

#### Modal
Класс для работы с модальными окнами. Наследуется от `Component`.
- **Конструктор**:
  - принимает контейнер для данных модального окна и объект событий

- **Свойства**:
  - **openButton**: кнопка модального окна
  - **contentElement**: содержимое модального окна

- **Методы**:
  - **setContent**: устанавливает содержимое.
  - **renderModal**: отрисовывает модальное окно.
  - **openModal**: открывает модальное окно.
  - **closeModal**: закрывает модальное окно.

### Презентер (Presenter)

#### index.ts
Презентер связывает View и Model, обрабатывает события от View и обновляет данные в Model. Он обеспечивает логику работы приложения и взаимодействие между слоями.


## Интерфейсы

- **IProduct**: Интерфейс для описания товара.

- **ICard**: Интерфейс для описания карточки товара.

- **IAppData**: Интерфейс для описания состояния приложения с методами управления корзиной, заказом и превью.

- **IForm**: Интерфейс формы с методами управления формой.

- **IOrderForm**: Интерфейс формы заказа с методами и свойствами для формы заказа.

- **IContactForm**: Интерфейс контактной информации.

- **IOrder**: Интерфейс заказа, объединяющий свойства заказа и контактной информации.

- **FormErrors**: интерфейс для валидации формы.

- **ICart**: Интерфейс корзины с методами управления корзиной.

- **ISuccessForm**: Интерфейс успешного заказа.

- **IOperation**: Интерфейс операции с методами для действий над карточкой.

- **ISuccessResult**: Интерфейс успешной операции оформления заказа.

- **IPage**: Интерфейс для управления главной страницей.

- **IOrderResult**: Интерфейс для ответа сервера на создание заказа.

- **IModal**: Интерфейс модального окна с методами для управления модальными окнами.