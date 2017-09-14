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
}