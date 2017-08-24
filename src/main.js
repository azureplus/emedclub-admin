import Vue from 'vue'
import App from './App'

import api from './api'

import store from './store'

import ChannelWeixin from './channel/ChannelWeixin'
import ChannelDefault from './channel/ChannelDefault'
let ua = navigator.userAgent.toLowerCase();
let result = ua.match(/MicroMessenger/i);
if (result && result.length > 0 && result[0] == "micromessenger") {
	var channel = new ChannelWeixin();
} else {
	var channel = new ChannelDefault();
}
Vue.prototype.$channel = channel;

import router from './router'
router.beforeEach((to, from, next) => {
	if (_hmt) {
		_hmt.push(['_trackPageview', to.fullPath]);
	}

	if (to.matched.some(record => record.meta.requiresAuth)) {
	   	if (null == store.state.customers.me) {
		   	channel.loginQuietly().then(function(account){
		   		account.setCookie();
		   		store.dispatch('login', account.customer_id).then(function(){
		   			next();
		   		}, function(error){
		   			channel.login(next, to.fullPath);
		   		});
		   	}, function(error){
               	channel.login(next, to.fullPath);
		   	})
	    } else {
	      next()
	    }   
	} else {
		next();
	}
})

var SimpleVueValidation = require('simple-vue-validator');
SimpleVueValidation.extendTemplates({
	error: '错误.',
	required: '要填写.',
	float: '要是数字.',
	integer: '要是整数.',
	number: '要是数字.',
	lessThan: '要小于{0}.',
	lessThanOrEqualTo: '要小于等于{0}.',
	greaterThan: '要大于{0}.',
	greaterThanOrEqualTo: '要大于等于{0}.',
	between: '要在{0}和{1}之间.',
	size: '长度必须是{0}.',
	length: '长度必须是{0}.',
	minLength: '至少{0}个字.',
	maxLength: '最多{0}个字.',
	lengthBetween: '长度必须是{0}和{1}之间.',
	in: '必须是{0}中的任意一个.',
	notIn: '不允许是{0}.',
	match: '不匹配.',
	regex: '格式不正确.',
	digit: '必须是数字.',
	email: '邮箱地址格式不正确.',
	url: '网址格式不正确.',
    optionCombiner: function (options) {
    	if (options.length > 2) {
        	options = [options.slice(0, options.length - 1).join('，'), options[options.length - 1]];
      	}
		
      	return options.join('或');
    }
});
Vue.use(SimpleVueValidation);

// MuseUI 
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
// 自定义主题
import './assets/theme.less'
// 全局css 
import "../static/base.css";
Vue.use(MuseUI)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})