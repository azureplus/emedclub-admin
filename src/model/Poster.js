/*
        Poster: {
            entity_type: s,
            entity_id: s,
            media: s,
            title: s,
            state: n,
        },

*/

import Model from './Model'

export default class Poster extends Model {
    constructor(attrs){
        super("Poster", attrs);

        this.defineRWAttrs(["entity_type", "entity_id", "media", "title", "state"]);
    }

    get states() {
        return ['展示', '不展示']
    }

    get stateName() {
        return this.states[this.state]
    }
}