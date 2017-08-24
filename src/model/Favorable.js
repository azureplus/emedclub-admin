/*
	db.addModel("Favorable", {
		activity_id: String,
		category: {type: Number, default: 0},
	    threshold: Number,
	    discount: Number,
	    app: String
	});
*/

import Model from './Model'

export default class Favorable extends Model {
    constructor(attrs){
        super("Favorable", attrs);

        this.defineRWAttrs(["activity_id", "threshold", "category", "discount"]);
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