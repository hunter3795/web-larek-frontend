import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


interface ISuccess {
    total: number;
}


export class Success extends Component<ISuccess> {
    protected _close: HTMLButtonElement;
    protected _total: HTMLElement;
    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this._total = ensureElement('.order-success__description', this.container)
        this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        
        this._close.addEventListener('click', () => {
            events.emit('success:close')
        })
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}