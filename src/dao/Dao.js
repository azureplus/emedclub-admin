import Schema from "./Schema"
import Model from "../model/Model"

export default class Dao {
    constructor(app, url, ds) {
        this._app = app;
        this._url = url;
        this._ds  = ds;
        this._schemas = [];
    }

    addSchema(className, claz) {
        let s = new Schema(className, claz);
        this._schemas[className] = s;
        
        return s;
    }

    rest(method, data, channel) {
        if (channel) {
            return this._ds.post(this._url + "/api/" + method + "?app=" + this._app + "&channel=" + channel, data);
        } else {
            return this._ds.post(this._url + "/api/" + method + "?app=" + this._app, data);
        }
    }

    upload(file) {
        return this._ds.upload(this._url + "/api/upload", file);
    }
    
    save(model){
        let self = this;
        
        return new Promise(function(resolve, reject) {
            var data = model.decode();
            data["app"] = self._app;

            if (model.id) {
                var promise = self.rest("update/" + model.className() + "/" + model.id, data);
            } else {
                var promise = self.rest("create/" + model.className(), data);
            }

            promise.then(function(data){
                model.reset(data);                
                resolve(model);
            }, function(err){
                reject(err);
            })
        });
    }
    
    destroy(model){
        let self = this;
        
        return new Promise(function(resolve, reject) {
            var promise = self.rest("destroy/" + model.className() + "/" + model.id, {});

            promise.then(function(data){               
                resolve(model);
            }, function(err){
                reject(err);
            })
        });
    }

    count(className, conditions) {
        let self = this;

        return new Promise(function(resolve, reject) {
            self.rest("count/" + className, {conditions: conditions}).then(function(total){
                if (typeof total === 'number') {
                    resolve(total)
                } else {
                    resolve(0)
                }
            }, function(err){
                reject(err)
            })
        })
    }

    queryOne(className, id) {
        let self = this;

        return new Promise(function(resolve, reject) {
            self.query(className, {id: id}, {limit: 1}).then(function(models){
                if (models.length == 1) {
                    resolve(models[0]);
                } else {
                    reject(new Error(className + " not found"));
                }
            }, function(err){
                reject(err);
            })
        })
    }

    query(className, conditions, filters) {
        if (this._schemas[className].relations.length > 0) {
            return this._queryTree(className, conditions, filters);
        } else {
		    return this._queryRoot(className, conditions, filters);
        }
	}
    
    _queryRoot(className, conditions, filters) {
        let self = this;
        
        return new Promise(function(resolve, reject) {
            conditions["app"] = self._app;

            self.rest("select/" + className, {conditions: conditions, filters: filters}).then(function(attrs){
                let models = [];
                
                for(let i = 0; i < attrs.length; i++) {
                    let m = self._schemas[className].buildModel();
                    m.reset(attrs[i]);
                    models.push(m);
                }
                
                resolve(models);
            }, function(err){
                reject(err);
            })
        })
    }
    
    _queryTree(className, conditions, filters) {
        let self = this;
        
        return new Promise(function(resolve, reject) {
			self._queryRoot(className, conditions, filters).then(function(models) {
                if (models.length > 0) {
                    self._queryRelations(className, models).then(function(){
                        resolve(models);
                    });
                } else {
                    resolve(models);
                }
			}, function(err) {
				reject(err);
			})
        })
    }
    
    _queryRelations(className, models) {
		var promises = [];
        
        let relations = this._schemas[className].relations;
		for(let i = 0; i < relations.length; i++) {
			promises.push(this._queryRelation(relations[i], models));
		}
		
		return Promise.all(promises);
    }
    
    _queryRelation(relation, models) {
		var self = this;
		
		return new Promise(function(resolve, reject) {
            var filters = {};
            if (relation.order) {
                filters["order"] = relation.order;
            } else {
                filters["order"] = "create_time DESC";
            }

			self.query(relation.relatedClassName, Model.relatedConditions(models, relation), filters).then(function(relatedModels){
                for(let i = 0; i < models.length; i++) {
				    models[i].relate(relation, relatedModels);
                }
                
				resolve(models);
			}, function(err){
				reject(err);
			});
		})       
    }
}