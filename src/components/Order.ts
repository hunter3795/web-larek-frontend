import { IOrderAddress, IOrderContacts } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export class Order extends Form<IOrderAddress> {
    protected button_cash: HTMLButtonElement;
    protected button_card: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.button_cash = this.container.querySelector<HTMLButtonElement>('.button_cash')
        this.button_card = this.container.querySelector<HTMLButtonElement>('.button_card')

        this.button_cash.addEventListener('click', () => {
            this.events.emit('payment-Cash:select')
        })
        this.button_card.addEventListener('click', () => {
            this.events.emit('payment-Card:select')
        })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}


export class OrderContacts extends Form<IOrderContacts> {

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }


    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}