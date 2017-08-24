/*
    db.addModel("Contract", {
        category: {type: Number, default: 0},
        customer_id: String,
        merchant_id: String,
        activity_id: String,
        mobile: String,
        room_id: String,
        title: String,
        location: {type:[Number], index: '2d'},
        amount: Number,
        saving: Number,
        total_contractors: {type: Number, default: 0},
        price: {type: Number, default: 0},
        deposit: {type: Number, default: 0},
        deadline: String,
        comment: {type: String, default: ""},
        state: {type: Number, default: 1},
        app: String
    });
*/

import Model from './Model'
import Discount from './Discount'

export default class Contract extends Model {
    constructor(attrs){
        super("Contract", attrs);

        this.defineRWAttrs(["customer_id", "merchant_id", "activity_id", "mobile", "title", "location", "amount", "saving", "total_contractors", "price", "deposit", "deadline", "comment", "state", "category"]);
        this.defineROAttrs(["room_id"]);

        this.contractors = [];
    }

    get categoryName() {
        return ["满减拼单", "满折拼单", "快消拼单"][this.category];
    }

    amountOf() {
        let sum = 0;
        for(var contractor of this.contractors) {
            sum += contractor.money;
        }
        return sum;
    }

    sumOf() {
         let sum = 0;
        for(var contractor of this.contractors) {
            sum += contractor.quantity;
        }
        return sum;       
    }

    savingOf() {
        return Discount.savingOf(this.discounts, this.amountOf(), this.sumOf());
    }

    expired() {
        return (new Date()) > (new Date(this.deadline));
    }

    contractorOf(customer) {
        return this._contractorOf(customer.id);
    }

    _contractorOf(customerId) {
        for(var contractor of this.contractors) {
            if (contractor.customer_id == customerId) {
                return contractor;
            }
        }

        return null;
    }

    canJoin(customer) {
        var contractor = this.contractorOf(customer);
        return !this.expired() && (this.state == 1) && (null == contractor);
    }
       
    canExit(customer) {
        var contractor = this.contractorOf(customer);
        return !this.expired() && (this.state == 1) && (null != contractor) && this.category == 0;
    }

    canPay(customer) {
        var contractor = this.contractorOf(customer);
        return (this.state == 3) && (contractor.state == 1) && (null != contractor) && this.category != 0;       
    }
       
    canSettle(customer) {
        return (this.state == 1) && (this.customer_id == customer.id) && (this.savingOf() > 0);
    }

    canChat(customer) {
        return this.room_id && this.contractorOf(customer) != null && this.state < 6;
    }

    canCall(customer, callee) {
        var contractor = this.contractorOf(customer);
        return contractor && callee.mobile && callee.customer_id != customer.id && this.state <= 6;
    }

    canRate(customer) {
        var contractor = this.contractorOf(customer);
        return this.state == 6 && contractor && !(contractor.rating > 0);
    }

    settle() {
        this.amount = this.amountOf();
        this.saving = this.savingOf();
        
        this.state = 6;
    }

    get stateName() {
        return ["拼单中", "确认中", "付款中", "结算中", "退款中", "已结算", "已取消"][this.state - 1];
    }

    toString() {
        let result = [];

        if (this.discounts) {
            for(var i = 0; i < this.discounts.length; i++){
                result.push(this.discounts[i].toString());
            }
        }
        
        return result.join("，");
    }
}