/*
	db.addModel("Setting", {
	    customer_id: String,
	    location: {type:[Number], index: '2d'},
		address: String,
		distance: Number,
	    notify: {type: Number, default: 0},
	    app: String
	});
*/

import Model from './Model'

export default class Setting extends Model {
    constructor(attrs){
        super("Setting", attrs);

        this.defineRWAttrs(["customer_id", "location", "address", "distance", "notify"]);
    }
}
