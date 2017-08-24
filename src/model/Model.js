export default class Model {
    static relatedConditions(models, relation) {
        let result = {};

        if (models.length >= 2) {
            result[relation.relatedAttributeName] = [];
            for(let i = 0; i < models.length; i++) {
                let c = models[i].relatedCondition(relation);

                result[relation.relatedAttributeName].push(c[relation.relatedAttributeName]);
            }
        } else if (models.length == 1) {
            result = models[0].relatedCondition(relation);
        } else {
            result = {1: 2}
        }

        return result;
    }

    constructor(className, attrs){
        this._className = className;
        this._attrs = attrs || {};
        this._dirties = Object.assign({}, this._attrs);

        this.defineROAttrs(["id", "update_time", "create_time"]);
    }

	className() {
		return this._className;
	}

    get url() {
        return '/' + this._className.toLowerCase() + '/' + this.id;
    }

    static url(model) {
        return model.url;
    }

    get attrs() {
        return this._attrs;
    }

    defineRWAttrs(names) {
        for(var name of names) {
            this.defineRWAttr(name);
        }
    }

    defineROAttrs(names) {
        for(var name of names) {
            this.defineROAttr(name);
        }
    }

    defineRWAttr(name, attrName) {
        attrName = attrName || name;

        Object.defineProperty(this, name, {
            get: function() {
                return this._attrs[attrName];
            },
            set: function(v) {
                if (this._attrs[attrName] != v) {
                    this._attrs[attrName]   = v;
                    this._dirties[attrName] = v;
                }
            }
        })
    }

    defineROAttr(name, attrName) {
        attrName = attrName || name;

        Object.defineProperty(this, name, {
            get: function() {
                return this._attrs[attrName];
            },
            set: function(v) {
                console.error(name + " is read only attribute in " + this._className);
            }
        })
    }

    setAttrs(attrs) {
        for(var v in attrs) {
            if (this._attrs[v] != attrs[v]) {
                this._attrs[v] = attrs[v];
                this._dirties[v] = attrs[v];
            }
        }        
    }

    reset(attrs) {
        for(var v in attrs) {
            if (this._attrs[v] != attrs[v]) {
                this._attrs[v] = attrs[v];
            }
        }

        this._dirties = {};
    }

    decode() {
        return this._dirties;
    }
    
	relatedCondition(relation) {
        let result = {};
        result[relation.relatedAttributeName] = this._attrs[relation.attributeName];
		return result;
	}
    
    relate(relation, associatedModels) {      
        for(let i = 0; i < associatedModels.length; i++) {
            var model = associatedModels[i];
            
            if (model._attrs[relation.relatedAttributeName] === this._attrs[relation.attributeName]) {
                model[this._className.toLowerCase()] = this;

                let attrName = relation.relatedClassName.toLowerCase();
                if (relation.granularity == 1) {
                    this[attrName] = model;
                } else {
                    attrName += "s";

                    if (this[attrName]) {
                        this[attrName].push(model);
                    } else {
                        this[attrName] = [model];
                    }

                    //console.log(this._className + " push " + attrName + " " + JSON.stringify(model.attrs));
                }
            }
        }
	}

    toMoney(money) {
        return Math.round( money * 1e2 ) / 1e2;
    }
}