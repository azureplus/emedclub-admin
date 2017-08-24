/*
	db.addModel("Merchant", {
		category: {type: Number, default: 0},
		customer_id: String,
		brand_id: String,
		name: String,
		area: String,
		logo: String,
		address: String,
		location: {type:[Number], index: '2d'},
		mobile: String,
		serial: Number,
		total_activities: {type: Number, default: 0},
		latest_activity: String,
		latest_activity_begin_time: String,
		latest_activity_end_time: String,
		wx_mchid: String,
		state: {type: Number, default: 0},
		app: String
	});
*/

import Model from './Model'

export default class Merchant extends Model {
    constructor(attrs){
        super("Merchant", attrs);

        this.defineRWAttrs(["category", "serial", "customer_id", "brand_id", "name", "area", "logo", "address", "location", "mobile", "total_activities", "latest_activity", "latest_activity_begin_time", "latest_activity_end_time", "wx_mchid", "state"]);
    }

	get title() {
		if (this.area) {
			return this.name + "(" + this.area + ")"
		} else {
			return this.name
		}
	}

	get categoryName() {
		return ['服饰鞋包', '汽车美容', '水果生鲜', '美容美发'][this.category]
	}

	static noOf(merchant) {
		merchant.serial = merchant.serial || 10000;
		var zero = 10 - merchant.serial.toString().length + 1;
  		return Array(+(zero > 0 && zero)).join("0") + merchant.serial;
	}
}