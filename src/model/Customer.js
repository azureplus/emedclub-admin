/*
db.addModel("Customer", {
	moblie: String,
	uid: String,

	name: String,
	age: Number,
	sex: Number,
	avatar: String,

	role: {type: Number, default: 0},
	
	money: {type: Number, default: 0},

	total_contracts:{type: Number, default: 0},
	settled_contracts:{type: Number, default: 0},
	
	last_login: String,
	
	version: String,
	
	channel_data: String,

	app: String
})
*/

import Model from './Model'

export default class Customer extends Model {
    constructor(attrs){
        super("Customer", attrs);

        this.defineRWAttrs(["name", "avatar", "sex", "total_contracts", "settled_contracts", "mobile"]);
		this.defineROAttrs(["uid", "last_login", "role"]);
    }

	static sexName(customer) {
		if (customer.sex == 1) {
			return '男';
		} else if (customer.sex == 2) {
			return '女';
		} else {
			return '保密';
		}
	}

	static ratio(customer) {
		if (customer.total_contracts == 0) {
			return "0";
		} else {
			return new Number(100 * customer.settled_contracts / customer.total_contracts).toFixed(0);
		}
	}
}