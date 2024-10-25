import { IBasketView, IItem } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter, IEvents } from "../base/events";


export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _buttonOrder: HTMLElement;
    protected _buttonRemove: HTMLButtonElement;
    id: string
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._buttonOrder = this.container.querySelector('.basket__button');

        if (this._buttonOrder) {
            this._buttonOrder.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set selected(value: number) {
        if (value === 0) {
            this.setDisabled(this._buttonOrder, true);
        } else {
            this.setDisabled(this._buttonOrder, false);
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}