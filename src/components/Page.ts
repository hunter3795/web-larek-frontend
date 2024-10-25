import { IPage } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._counter = ensureElement('.header__basket-counter', this.container);
        this._catalog = ensureElement('.gallery', this.container);
        this._wrapper = ensureElement('.page__wrapper', this.container);
        this._basket = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set catalog(items:HTMLElement[]) {
        this._catalog.replaceChildren(...items)
    }

    set counter(value:number) {
        this.setText(this._counter, value)
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}