import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Card, CardBasket, PreviewCard } from './components/Card';
import { LarekAPI } from './components/LarekAPI';
import { ProductModel } from './components/LarekModel';
import { Modal } from './components/common/Modal';
import { Order, OrderContacts } from './components/Order';
import { Page } from './components/Page';
import { Success } from './components/common/Success';
import './scss/styles.scss';
import { IOrderAddress, IOrderContacts } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const itemTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const itemPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const page = new Page(document.body, events);
const model = new ProductModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const orderContacts = new OrderContacts(cloneTemplate(orderContactsTemplate),events);
const success = new Success(cloneTemplate(successTemplate), events);
// Получаем данные с сервера
api.getItems()
	.then((data) => {
		model.setItems(data);
		console.log(model);
	})
	.catch((err) => console.log(err));

// Выводим карточки
events.on('items:changed', () => {
	const itemsHTMLArray = model.getItems().map((item) => new Card(cloneTemplate(itemTemplate), events).render(item));
	page.render({
		catalog: itemsHTMLArray,
		counter: model.getProducts().length,
	});
});

// Открываем содержание карточки
events.on('item:select', (item: PreviewCard) => {
	item.id = model.getItem(item.id).id;
	item.price = model.getItem(item.id).price;
	item.category = model.getItem(item.id).category;
	item.image = model.getItem(item.id).image;
	item.description = model.getItem(item.id).description;
	item.title = model.getItem(item.id).title;
	const card = new PreviewCard(cloneTemplate(itemPreviewTemplate), events);

	modal.render({
		content: card.render(item),
	});
	page.render({
		counter: model.getProducts().length,
	});

	card.selectedBuy = model.getSelectProductBuy(item);
});

// Добавляем товар в корзину
events.on('item:buy', (item: PreviewCard) => {
	model.addProduct(item);
});

events.on('basket:open', () => {
	page.counter = model.getProducts().length;
	const cards = model.getProducts().map((item) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
		card.indexEl = model.getIndexProduct(item);
		return card.render(item);
	});
	basket.items = cards;
	modal.render({
		content: basket.render(),
	});
	basket.total = model.getTotal();
	basket.selected = model.getTotal();
});

events.on('cardBasket-remove', (item: CardBasket) => {
	model.removeProduct(model.getItem(item.id));
	// Перерисовываем всю корзину
	basket.items = model.getProducts().map((item) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
		card.indexEl = model.getIndexProduct(item);
		return card.render(item);
	});
	modal.render({
		content: basket.render(),
	});
	basket.total = model.getTotal();
	page.counter = model.getProducts().length;
	basket.selected = model.getTotal();
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
	model.activeButton();
	console.log(model.order.payment);
	model.order.total = model.getTotal();
	model.order.items = model.basket.items.filter((item) => item.price !== null).map((item) => item.id);
});

events.on('payment-Cash:select', () => {
	model.order.payment = 'cash';
});

events.on('payment-Card:select', () => {
	model.order.payment = 'card';
});

events.on('formErrors:change', (errors: Partial<IOrderAddress>) => {
	const { address, payment } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderAddress; value: string }) => {
		model.setOrderField(data.field, data.value);
	}
);

events.on('order:submit', () => {
	modal.render({
		content: orderContacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
	console.log(model.order);
});

events.on('formErrorsContacts:change', (errors: Partial<IOrderContacts>) => {
	const { email, phone } = errors;
	orderContacts.valid = !email && !phone;
	orderContacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderContacts; value: string }) => {
		model.setOrderContactsField(data.field, data.value);
	}
);

events.on('contacts:submit', () => {
	api.orderProducts(model.order)
		.then((result) => {
			console.log(result);
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
	page.render({
		counter: model.getProducts().length,
	});
	model.clearBasket();
});

events.on('success:close', () => {
	modal.close();
	const itemsHTMLArray = model.getItems().map((item) => new Card(cloneTemplate(itemTemplate), events).render(item));
	page.render({
		catalog: itemsHTMLArray,
		counter: model.getProducts().length,
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});
