/*
self.addModel("Account", {
    username: {type: String, default: ""},
    password: {type: String, default: ""},
    salt: {type: String, default: ""},
    token: {type: String, default: ""},
    role: {type: Number, default: 1},
    customer_id: String,
    app: String
}, {
    app: 1,
    customer_id: 1
});
*/

import Model from './Model'
import Document from '../util/document'

export default class Account extends Model {
    constructor(attrs) {
        super("Account", attrs);

        this.defineRWAttrs(["customer_id", "token", "username"]);
    }

    static clearCookie() {
        Document.setCookie('username', '', -2);
        Document.setCookie('token', '', -2);
        Document.setCookie('customer_id', '', -2);
    }

    setCookie() {
        Document.setCookie('username', this.username);
        Document.setCookie('token', this.token);
        Document.setCookie('customer_id', this.customer_id); 
    }

    getCookie() {
        this.username = Document.getCookie('username', '');
        this.token = Document.getCookie('token', '');
        this.customer_id = Document.getCookie('customer_id', '');

        return this.username.length > 1 && this.token.length > 1 && this.customer_id.length > 1;
    }
}