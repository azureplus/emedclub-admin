/*
	db.addModel("Chat", {
		room_id: String,
	    customer_id: String,
	    content: String,
	    app: String
	});
*/

import Model from './Model'

export default class Chat extends Model {
    constructor(attrs){
        super("Chat", attrs);

        this.defineRWAttrs(["room_id", "customer_id", "content"]);
    }
}