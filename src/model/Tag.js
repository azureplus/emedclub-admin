/*

        Tag: {
            information_id: s,
            name: s,
        },
*/

import Model from './Model'

export default class Tag extends Model {
    constructor(attrs){
        super("Tag", attrs);

        this.defineRWAttrs(["information_id", "name"]);
    }
}