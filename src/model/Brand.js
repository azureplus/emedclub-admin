/*
	db.addModel("Brand", {
		customer_id: String,
		name: String,
		logo: String,
		state: {type: Number, default: 0},
		app: String
	});
*/

import Model from './Model'

export default class Brand extends Model {
    constructor(attrs){
        super("Brand", attrs);

        this.defineRWAttrs(["customer_id", "name", "logo", "state"]);
    }
}