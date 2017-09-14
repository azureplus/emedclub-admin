/*
        Ticket: {
            information_id: s,
            name: s,
            price: n
        },

*/
import Model from './Model'

export default class Ticket extends Model {
    constructor(attrs){
        super("Ticket", attrs);

        this.defineRWAttrs(["information_id", "name", "price"]);
    }
}