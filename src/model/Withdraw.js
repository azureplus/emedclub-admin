/*
db.addModel("Withdraw", {
	customer_id: String,
	money: Number,
	channel: String,
	account: String,
	bank_name: String,
	bank_account_name: String,
	state:  {type: Number, default: 0},
	reason: String,
	app: String
});
*/

import Model from './Model'

export default class Withdraw extends Model {
    constructor(attrs){
        super("Withdraw", attrs);

        this.defineRWAttrs(["customer_id", "money", "channel", "account", "bank_name", "bank_account_name", "state"]);
		this.defineROAttr("reason");
    }

	get stateName() {
		return ['处理中', '成功', '失败'][this.state];
	}
}