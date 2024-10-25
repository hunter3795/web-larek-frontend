import { FormErrors, FormErrorsContacts, IBasketModel, IItem, IOrder, IOrderAddress, IOrderContacts } from "../types";
import { IEvents } from "./base/events";
// Модель данных, отвечает только за работу с даннными

export class ProductModel {
    catalog: IItem[]
    basket: IBasketModel = {
        items: []
    };
    order: IOrder = {
        address: '',
        payment: '',
        email: '',
        phone: '',
        total: 0,
        items: []
    };
    formErrors: FormErrors = {};
    formErrorsContacts: FormErrorsContacts = {};

    constructor(protected events: IEvents) { }

    getItems(): IItem[] {
        return this.catalog
    }

    getItem(id: string): IItem {
        return this.catalog.find(item => item.id === id)
    }

    setItems(items: IItem[]) {
        this.catalog = items;
        this.events.emit('items:changed');
    }

    getSelectProductBuy(item: IItem) {
        return this.basket.items.includes(this.getItem(item.id))
    }

    addProduct(item: IItem) {
        return this.basket.items.push(this.getItem(item.id))
    }

    removeProduct(item: IItem) {
        this.basket.items = this.basket.items.filter(card => card.id !== item.id)
    }

    getTotal() {
        return this.basket.items.reduce((a, c) => a + this.catalog.find(item => item.id === c.id).price, 0)
    }

    getProducts(): IItem[] {
        return this.basket.items
    }

    getIndexProduct(item: IItem) {
        return this.basket.items.indexOf(this.getItem(item.id)) + 1
    }

    setOrderField(field: keyof IOrderAddress, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    clearBasket() {
        this.basket.items.length = 0
    }

    activeButton() {
        const buttons = document.querySelectorAll<HTMLButtonElement>('.button_alt');
        function toggleButtons(activeButton: HTMLButtonElement) {
            buttons.forEach(button => {
                if (button === activeButton) {
                    button.classList.add('button_alt-active');
                } else {
                    button.classList.remove('button_alt-active');
                }
            });
        }
        buttons.forEach(button => {
            button.classList.remove('button_alt-active')
            button.addEventListener('click', () => toggleButtons(button));
        });
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    setOrderContactsField(field: keyof IOrderContacts, value: string) {
        this.order[field] = value;

        if (this.validateOrderContacts()) {
            this.events.emit('contacts:ready', this.order);
        }
    }

    validateOrderContacts() {
        const errors: typeof this.formErrorsContacts = {};

        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrorsContacts = errors;
        this.events.emit('formErrorsContacts:change', this.formErrorsContacts);
        return Object.keys(errors).length === 0;
    }
}
