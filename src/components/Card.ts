import { IItem } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";


export class Card extends Component<IItem> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _buttonItem: HTMLButtonElement;
    protected _id: string

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container)

        this._title = ensureElement('.card__title', this.container)
        this._image = ensureElement<HTMLImageElement>('.card__image', this.container)
        this._category = ensureElement('.card__category', this.container)
        this._price = ensureElement('.card__price', this.container)
        container.addEventListener('click', () => this.events.emit('item:select', {id: this._id}))
    }

    set title(value:string) {
        this.setText(this._title, value)
    }

    set image(value:string) {
        this.setImage(this._image, value, this.title)
    }

    set category(value:string) {
        this.setText(this._category, value)
        if (value === 'софт-скил') {
            this._category.classList.add('card__category_soft')
        }
        else if (value === 'другое') {
            this._category.classList.add('card__category_other')
        }
        else if(value === 'хард-скил') {
            this._category.classList.add('card__category_hard')
        }
        else if(value === 'кнопка') {
            this._category.classList.add('card__category_button')
        }
        else {
            this._category.classList.add('card__category_additional')
        }
    }

    set price(value:number) {
        if(value == null) {
            this.setText(this._price, `Бесценно`)
        }
        else {
            this.setText(this._price, `${value} синапсов`)
        }   
    }

    set id(value: string) {
        this._id = value;
    }  
}

export class PreviewCard extends Card {
    protected _button: HTMLButtonElement;
    protected _description: HTMLElement;
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events)
        this._button = ensureElement<HTMLButtonElement>('.card__button', this.container)
        this._description = ensureElement('.card__text', this.container)
        this._button.addEventListener('click', () => this.events.emit('item:buy', {id: this._id}))
    }

    set description(value:string) {
        this.setText(this._description, value)
    }

    set selectedBuy(value: boolean) {
        if (!value) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }
}

export class CardBasket extends Component<IItem> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _id: string;
    protected _removeButton: HTMLButtonElement;
    protected _indexElement: HTMLElement;
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container)

        this._title = ensureElement('.card__title', this.container)
        this._price = ensureElement('.card__price', this.container)
        this._removeButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        this._indexElement = container.querySelector('.basket__item-index')
        this._removeButton.addEventListener('click', () => {
            this.events.emit('cardBasket-remove', {id: this._id})
        })
    }

    set title(value:string) {
        this.setText(this._title, value)
    }

    set price(value:number) {
        if(value == null) {
            this.setText(this._price, `Бесценно`)
        }
        else {
            this.setText(this._price, `${value} синапсов`)
        }   
    }

    set id(value: string) {
        this._id = value;
    }  
    
    set indexEl(value:number) {
        this.setText(this._indexElement, value)
    }
}