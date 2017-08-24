import Dao from './dao/Dao'
import Window from './util/window'
import Map from './util/map'
import AxiosDataSource from './dao/AxiosDataSource'

import Account      from './model/Account'
import Activity     from './model/Activity'
import Brand        from './model/Brand'
import Chat         from './model/Chat'
import Contract     from './model/Contract'
import Contractor   from './model/Contractor'
import Customer     from './model/Customer'
import Discount     from './model/Discount'
import Evaluation   from './model/Evaluation'
import Favorable    from './model/Favorable'
import Merchant     from './model/Merchant'
import Message      from './model/Message'
import Setting      from './model/Setting'

var url = Window.getBaseUrl();
const _dao = new Dao("shopping", url, new AxiosDataSource());

_dao.addSchema("Account", Account);
_dao.addSchema("Activity", Activity).belongsTo("Merchant").hasMany("Favorable", "threshold ASC");
_dao.addSchema("Brand", Brand);
_dao.addSchema("Chat", Chat).belongsTo("Customer");
_dao.addSchema("Contract", Contract).belongsTo("Customer").hasMany("Discount", "threshold ASC").hasMany("Contractor").belongsTo("Merchant");
_dao.addSchema("Contractor", Contractor).belongsTo("Customer");
_dao.addSchema("Customer", Customer);
_dao.addSchema("Discount", Discount);
_dao.addSchema("Evaluation", Evaluation).belongsTo("Contractor");
_dao.addSchema("Favorable", Favorable);
_dao.addSchema("Merchant", Merchant);
_dao.addSchema("Message", Message).belongsTo("Customer");
_dao.addSchema("Setting", Setting);

export default {
    getUrl() {
        return url;
    },

    queryMySetting(me) {
        return _dao.query("Setting", {customer_id: me.id}, {limit: 1});
    },

    queryOne(modelClass, id) {
        return _dao.queryOne(modelClass, id);
    },

    query(modelClass, conditions, filters) {
        return _dao.query(modelClass, conditions, filters);
    },

    queryNearby(modelClass, miles, conditions, filters) {
        return new Promise(function(resolve, reject){
            Map.locate().then(function(point){
                conditions = conditions || {};
                conditions.location = {
                    '$nearSphere': [ point.lng, point.lat ],
                }
                if (miles) {
                    conditions.location['$maxDistance'] = miles / 6378100           
                }

                _dao.query(modelClass, conditions, filters).then(function(models){
                    resolve({models: models, location: point});
                }, function(err){
                    reject(err);
                })
            }, function(err){
                reject(err);
            })
        });
    },

    count(modelClass, conditions) {
        return _dao.count(modelClass, conditions);
    },

    save(model) {
        return _dao.save(model);
    },

    destroy(model) {
        return _dao.destroy(model);
    },

    upload(media, channel="default"){
        if (channel == "default") {
            return _dao.upload(media);
        } else {
            return _dao.rest("upload", {media_id: media}, channel)
        }
    },

    sendSms(mobile, channel="default") {
        return _dao.rest("send_sms", {mobile: mobile}, channel);
    },

    login(data, channel="default"){
        return new Promise(function(resolve, reject) {
            _dao.rest("login", data, channel).then(function(a){
                var account = new Account();
                account.customer_id = a.customer_id;
                account.username = a.username;
                account.token = a.token;
                
                resolve(account);
            }, function(err){
                reject(err);
            })
        });
    },

    prepare(options, channel="default"){
        return _dao.rest("prepare", options, channel);
    },
}