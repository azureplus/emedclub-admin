/*
db.addModel("Contractor", {
    merchant_id: String,
    contract_id: String,
    customer_id: String,
    category: {type: Number, default: 0},
    payment_id: String,
    refund_id: String,
    money: Number,
    deposit: Number,
    mobile: Number,
    quantity: {type: Number, default: 0},
    saving: Number,
    rating: {type: Number, default: 0},
    comment: String,
    state: {type: Number, default: 1},
    app: String
});
*/

import Model from './Model'
import Discount from './Discount'

export default class Contractor extends Model {
    constructor(attrs){
        super("Contractor", attrs);

        this.defineRWAttrs(["merchant_id", "contract_id", "customer_id", "payment_id", "refund_id", "money", "deposit", "mobile", "quantity", "saving", "rating", "comment", "state", "category"]);
    }

    pay() {
        this.state = 2
    }

    /*
        Si(old) = 用户i折扣（拼单前）
        Mi(old) = 用户i金额（拼单前）
        S(old) = S1(old) + S2(old) + ... Si(old) + ... + Sn(old)
        M(old) = M1(old) + M2(old) + ... Mi(old) + ... + Mn(old)
        S(new) = 总折扣（拼单后）
        Si(new) = (Mi(old) -Si(old)) / [(M(old) - S(old) ) / (S(new) -  S(old) )] + Si(old)
    */
    savingOf() {
        if (this.customer_id == this.contract.customer_id) {
            var sNew = 0;
            
            for(var contractor of this.contract.contractors) {
                if (contractor.customer_id != this.contract.customer_id) {
                    sNew += contractor.savingOf();
                }
            }
            
            return this.toMoney(this.contract.savingOf() - sNew);
        } else {
            var siOld = Discount.savingOf(this.contract.discounts, this.money, this.quantity);

            var sOld = 0;
            for(var contractor of this.contract.contractors) {
                if (contractor.customer_id != this.contract.customer_id) {
                    sOld += Discount.savingOf(this.contract.discounts, contractor.money, contractor.quantity);
                }
            }

            var sNew = this.contract.savingOf();
            if (sNew > sOld) {
                var ratio = (this.contract.amountOf() - sOld) / (sNew - sOld);
                return this.toMoney(((this.money - siOld) / ratio) + siOld);
            } else {
                return this.toMoney(siOld);
            }
        }
    }

    actualOf() {
        return this.toMoney(this.money - this.savingOf());
    }

    get stateName() {
        return ["拼单中", "已结算，待评论", "已关闭", "已取消"][this.state - 1]
    }

    toString() {
        if (this.category == 0) {
            if (this.contract.discountCategory == 0) {
                return "购买" + this.money + "元，节省" + this.savingOf() + "元，实付" + this.actualOf() + "元"
            } else {
                return "购买" + this.quantity + "件" + this.money + "元，节省" + this.savingOf() + "元，实付" + this.actualOf() + "元"
            }
        } else {
            return "购买" + this.money + "元，预付" + this.deposit + "元"
        }
    }
}