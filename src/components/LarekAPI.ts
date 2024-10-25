import { ApiListResponse, IItem, IOrder, IOrderResult } from "../types";
import { Api} from "./base/api";


export class LarekAPI extends Api {

    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getItems (): Promise<IItem[]> {
        return this.get('/product/').then((data: ApiListResponse<IItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );;
    };

    orderProducts(order:IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}