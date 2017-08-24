/*
    db.addModel("Activity", {
        customer_id: String,
        merchant_id: String,
        category: {type: Number, default: 0},
        total_contractors: {type: Number, default: 0},
        price: {type: Number, default: 0},
        deposit: {type: Number, default: 0},
        location: {type:[Number], index: '2d'},
        title: String,
        begin_time: String,
        end_time: String,
        comment: {type: String, default: ""},
        state: {type: Number, default: 1},
        app: String
    });
*/

import Model from './Model'
import Time from '../util/date'

export default class Activity extends Model {
    constructor(attrs){
        super("Activity", attrs);

        this.defineRWAttrs(["customer_id", "merchant_id", "category", "total_contractors", "price", "deposit", "location", "title", "begin_time", "end_time", "comment", "state"]);
    }

    get stateName() {
        return ["计划中", "进行中", "结束"][this.state];
    }

    get categoryName() {
        return ["满减活动", "满折活动", "快消活动"][this.category];
    }

    duration() {
        return Time.pretty(this.begin_time) + "到" + Time.pretty(this.end_time)
    }

    toString() {
        let result = [];

        if (this.title && this.title.length > 0) {
            result.push(this.title)
        }

        if (this.category == 0 || this.category == 1) {
            if (this.favorables) {
                for(var i = 0; i < this.favorables.length; i++){
                    result.push(this.favorables[i].toString());
                }
            }
        } else {
            result.push('购买' + this.price + "元")
            result.push('预付' + this.deposit + "元")
        }
        
        return result.join("，");
    }
}