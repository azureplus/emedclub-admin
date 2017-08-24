import Channel from "./Channel"
import api from "../api"
import Account from "../model/Account"
import Window from "../util/window"

export default class ChannelWeixin extends Channel{  
	constructor() {
        super("weixin");

        this._initialized = false;
    }
    
    loginQuietly() {
        let self = this;

        if (self.paramOf("code")) {
            api.login({token: self.paramOf("code"), referee: self.paramOf("referee"), keycode: self.paramOf("keycode")}, "weixin").then(function(account){
                self.resolve(account);  
            }, function(error) {
                self.reject("登录失败");
            });
                                
            return self.promise();
        } else {
            return self.rejectedPromise();
        }
	}

    setShareContent(title, description, link, imgUrl) {
        let self = this;

        if (self._initialized) {
            self._setShareContent(title, description, link, imgUrl);
        } else {
            self.require('https://res.wx.qq.com/open/js/jweixin-1.0.0.js').then(function(){
                api.prepare({url :location.href.split('#')[0]}, "weixin").then(function(result){
                    try {
                        var config = {
                            debug: result.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: result.appId, // 必填，公众号的唯一标识
                            timestamp: result.timestamp, // 必填，生成签名的时间戳
                            nonceStr: result.nonceStr, // 必填，生成签名的随机串
                            signature: result.signature,// 必填，签名，见附录1
                            jsApiList: result.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        };
                        wx.config(config);

                        self._initialized = true;

                        self._setShareContent(title, description, link, imgUrl);

                        wx.error(function(res){
                            console.error(res.toString());

                            self._initialized = false;
                        });
                    } catch(error) {
                        console.error("share失败：" + error.toString());
                    }
                }, function(error) {
                    console.error("share失败：" + error.toString());
                });
            }); 
        }
    }

    _setShareContent(title, description, link, imgUrl) {
        wx.ready(function(){
            try {
                wx.onMenuShareTimeline({
                    title: description, // 分享标题
                    link: link, // 分享链接
                    imgUrl: imgUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
                });

                let shareContentWeixin = {
                    title: title, // 分享标题
                    desc: description, // 分享描述
                    link: link, // 分享链接
                    imgUrl: imgUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
                };                            
                wx.onMenuShareAppMessage(shareContentWeixin);
                wx.onMenuShareQQ(shareContentWeixin);
                wx.onMenuShareWeibo(shareContentWeixin);
                wx.onMenuShareQZone(shareContentWeixin);
            } catch(error) {
                console.error("share失败：" + error.toString());
            }
        }); 
    }
    
    login(next, redirect){
        var url = Window.getBaseUrl() + "/shopping/#" + redirect + "&referee=" + this.paramOf("referee") + "&keycode=" + this.paramOf("keycode")
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + "wxefc51f42d29afacd" 
                    + '&redirect_uri=' + encodeURIComponent(url)
                    + '&response_type=code&scope=snsapi_userinfo&state=weixin#wechat_redirect';
	}
	
    pay(options) {
        let self = this;
        
        api.prepare(options, "weixin").then(function(result){
            try {
                wx.ready(function(){
                    try {
                        wx.error(function(res){
                            self.reject("支付失败：" + JSON.stringify(res));
                            return false;
                        });

                        var pay = {
                            timestamp: result.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                            nonceStr:  result.nonceStr, // 支付签名随机串，不长于 32 位
                            package:   result.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                            signType:  result.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            paySign:   result.paySign, // 支付签名
                            success: function (res) {
                                // 支付成功后的回调函数
                                self.resolve(result.paymentId);
                            },
                            cancel:function(res){
                                // 支付取消回调函数
                                self.reject(new Error("支付取消"));
                            },
                            fail: function(res){
                                // 支付失败回调函数
                                self.reject(new Error("支付失败：" + JSON.stringify(res)));
                            }
                        };
                        wx.chooseWXPay(pay);
                    } catch(error) {
                        self.reject(new Error("支付失败：" + error.toString()));
                    }
                }); 
            } catch(error) {
                self.reject(new Error("支付失败：" + error.toString()));
            }
        }, function(error) {
            self.reject(new Error("支付失败：" + error.toString()));
        });

        return self.promise();
	}
}