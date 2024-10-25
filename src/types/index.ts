export type ApiPostMethods = 'POST' | 'PATCH' | 'DELETE';

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};


export interface IItem {
    id: string;
    title: string;
    price: number;
    category?: string;
    description?: string;
    image?: string;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
    id: string;
}

export interface IBasketModel {
    items: IItem[]
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IOrderAddress {
    address: string;
    payment: string;
}

export interface IOrderContacts {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderAddress, IOrderContacts {
    items: string[],
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrderAddress, string>>;

export type FormErrorsContacts = Partial<Record<keyof IOrderContacts, string>>;

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface IModalData {
    content: HTMLElement;
}

