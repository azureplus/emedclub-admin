import Relation from "./Relation"

export default class Schema {   
    constructor(className, claz) {
        this._className = className;
        this._claz = claz;
        
        this._relations = [];
    }

    buildModel() {
        return new this._claz();
    }
    
    relatedWith(relationName, relatedClassName, relatedRelationName, granularity, order) {
		this._relations.push(new Relation(relatedClassName, relatedRelationName, relationName, granularity, order));
		return this;
	};
    
    belongsTo(className) {
		return this.relatedWith(className.toLowerCase() + "_id", className, 'id', 1);
	};
    
    hasMany(className, order) {
		return this.relatedWith("id", className, this._className.toLowerCase() + "_id", 0, order);
	};
    
    get relations() {
        return this._relations;
    }
}