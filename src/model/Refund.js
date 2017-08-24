/*

db.addModel("Refund", {
	customer_id: String,
	payment_id: String,
	state:  {type: Number, default: 0},
	reason: String,
	app: String
});

*/

import Model from './Model'

export default class Refund extends Model {
    constructor(attrs){
        super("Refund", attrs);

        this.defineRWAttrs(["customer_id", "payment_id", "state"]);
		this.defineROAttr("reason");
    }

	get stateName() {
		return ['处理中', '成功', '失败'][this.state];
	}
}