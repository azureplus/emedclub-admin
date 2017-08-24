import Channel from "./Channel"
import Customer from "../model/Customer"
import api from "../api"
import Account from "../model/Account"

export default class ChannelDefault extends Channel{  
	constructor() {
        super("default");

        console.info("using channel default");
	}

    loginQuietly(){
        let self = this;

        let account = new Account();
        if (account.getCookie()) {
            var data = account.decode();
            data.referee = self.paramOf("referee");
            data.keycode = self.paramOf("keycode");
            api.login(data, "default").then(function(account){
                self.resolve(account);
            }, function(error){
                self.reject(error);
            })

            return self.promise();     
        } else {
            return self.rejectedPromise();    
        }    
	}

    login(next, redirect){
        next({
            path: '/login?referee=' + this.paramOf("referee"),
            query: { redirect: redirect }
        })
	} 
	
    pay(options){
        let self = this;
        
        api.prepare(options, "default").then(function(result){
            self.resolve(result.paymentId);
        }, function(error) {
            self.reject(new Error("支付失败：" + error.toString()));
        });

        return self.promise();
	}  
}