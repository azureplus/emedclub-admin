/*
        Merchant: {
            name: s,
            logo: s,
            introduction: s,
        },
*/

import Model from './Model'

export default class Merchant extends Model {
    constructor(attrs){
        super("Merchant", attrs);

        this.defineRWAttrs(["name", "logo", "introduction"]);
    }
}