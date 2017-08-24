export default class Relation {   
    constructor(relatedClassName, relatedAttributeName, attributeName, granularity, order) {
        this._relatedClassName     = relatedClassName;
        this._relatedAttributeName = relatedAttributeName;
        this._attributeName        = attributeName;
        this._granularity          = granularity;
        this._order                = order;
    }
    
    get relatedClassName() {
        return this._relatedClassName;
    }
    
    get relatedAttributeName() {
        return this._relatedAttributeName;
    }
    
    get attributeName() {
        return this._attributeName;
    }

    get granularity() {
        return this._granularity;
    }

    get order() {
        return this._order;
    }
}