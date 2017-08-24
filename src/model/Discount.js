/*
db.addModel("Discount", {
	contract_id: String,
	category: {type: Number, default: 0},
    threshold: Number,
    discount: Number,
    app: String
});
*/

import Model from './Model'

export default class Discount extends Model {
    constructor(attrs){
        super("Discount", attrs);

        this.defineRWAttrs(["contract_id", "category", "threshold", "discount"]);
    }

	static savingOf(discounts, money, quantity) {
		var t = 0;
		var d = 0;

		if (!discounts || discounts.length == 0) {
			return d;
		}

		if (discounts[0].category == 0) {
			for(var discount of discounts) {
				if (discount.threshold <= money && t < discount.threshold) {
					t = discount.threshold;
					d = discount.discount;
				}
			}

			if (d > 0) {
				var s = d * Math.floor(money / t);
				return s + Discount.savingOf(discounts, money - Math.floor(money / t) * t);
			} else {
				return 0;
			}
		} else {
			for(var discount of discounts) {
				if (discount.threshold <= quantity && t < discount.threshold) {
					t = discount.threshold;
					d = discount.discount;
				}
			}

			if (d > 0) {
				return money * (10 - d) /10 ;
			} else {
				return 0;
			}
		}
	}

	toString() {
		if (this.category == 0) {
			return "满" + this.threshold + "元减" + this.discount + "元";
		} else {
			return "满" + this.threshold + "件打" + this.discount + "折";
		}
	}

	isValid() {
		return (this.threshold > 0 && this.discount > 0);
	}
}