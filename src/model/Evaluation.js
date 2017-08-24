/*
db.addModel("Evaluation", {
    customer_id: String,
    contractor_id: String,
    activity_id: String,
    rating: {type: Number, default: 0},
    comment: String,
    app: String
});

*/

import Model from './Model'

export default class Evaluation extends Model {
    constructor(attrs){
        super("Evaluation", attrs);

        this.defineRWAttrs(["customer_id", "contractor_id", "activity_id", "rating", "comment"]);
    }
}