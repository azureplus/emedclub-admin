import Dao from './dao/Dao'
import Window from './util/window'
import Map from './util/map'
import AxiosDataSource from './dao/AxiosDataSource'

import Account      from './model/Account'
import Activity     from './model/Activity'
import Customer     from './model/Customer'
import Merchant     from './model/Merchant'

var url = Window.getBaseUrl();
const _dao = new Dao(url, new AxiosDataSource());

_dao.addSchema("Account", Account);
_dao.addSchema("Activity", Activity)
_dao.addSchema("Customer", Customer);
_dao.addSchema("Merchant", Merchant);

export default {
    getUrl() {
        return url;
    },

    queryOne(modelClass, id) {
        return _dao.queryOne(modelClass, id);
    },

    query(modelClass, conditions, filters) {
        return _dao.query(modelClass, conditions, filters);
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