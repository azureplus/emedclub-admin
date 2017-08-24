/*
db.addModel("Payment", {
	customer_id: String,
	channel: String,
	account: String,
	money: Number,
	state:  {type: Number, default: 0},
	reason: String,
	app: String
});
*/

import Model from './Model'

export default class Payment extends Model {
    constructor(attrs){
        super("Payment", attrs);

 		this.defineRWAttrs(["customer_id", "channel", "account", "money", "state"]);
		this.defineROAttrs(["reason"]);
    }

	get stateName() {
		return ['处理中', '成功', '失败'][this.state];
	}
}