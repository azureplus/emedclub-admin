/*
	db.addModel("Message", {
		customer_id: String,
		receiver_id: String,
		title: String,
		content: String,
		entity_type:  String,
		entity_id:  String,
		state:  {type: Number, default: 0},
		wx:  {type: Number, default: 0},
		app: String
	});
*/

import Model from './Model'

export default class Message extends Model {
    constructor(attrs){
        super("Message", attrs);

        this.defineRWAttrs(["customer_id", "receiver_id", "title", "content", "entity_type", "entity_id", "state"]);
    }
}