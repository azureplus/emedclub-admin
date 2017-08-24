/*

db.addModel("Deposit", {
		customer_id: String,
		money: Number,
		certificate: String,
		state:  {type: Number, default: 0},
		reason: String,
		app: String
	});

*/

import Model from './Model'

export default class Deposit extends Model {
    constructor(attrs){
        super("Deposit", attrs);

 		this.defineRWAttrs(["customer_id", "money", "certificate", "state"]);
		this.defineROAttrs(["reason"]);
    }

	get stateName() {
		return ['处理中', '成功', '失败'][this.state];
	}
}