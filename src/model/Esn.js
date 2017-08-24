/*
	db.addModel("Esn", {
	    serial: Number,
	    app: String
	});
*/

import Model from './Model'

export default class Esn extends Model {
    constructor(attrs){
        super("Esn", attrs);

        this.defineRWAttrs(["serial"]);
    }
}