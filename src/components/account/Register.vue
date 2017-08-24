<template>
    <base-layout :progressing="refreshing" :toast="toast">
        <mu-appbar title="消拼">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
        </mu-appbar>

        <mu-content-block>
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="手机号码" type=number v-model="mobile" :errorText="validation.firstError('mobile')" fullWidth />
                    <mu-text-field label="密码" type="password" v-model="password" :errorText="validation.firstError('password')" fullWidth />
                    <mu-text-field label="验证密码" type="password" v-model="repeat" :errorText="validation.firstError('repeat')" fullWidth />
                    <mu-table :showCheckbox="false">
                        <mu-tbody>
                            <mu-tr>
                                <mu-td style="width:100%"<mu-text-field type=number label="验证码" v-model="code" :errorText="validation.firstError('code')" fullWidth/></mu-td>
                                <mu-td style="width:120px"><mu-flat-button :label="codeLabel" primary @click="onGetCode($event)" :disabled="codeDisabled"/></mu-td>
                            </mu-tr>
                        </mu-tbody>
                    </mu-table>
                </mu-list-item>

                <mu-list-item>
                    <mu-raised-button v-if="$route.name == 'register'" label="免费注册" fullWidth @click="onRegister"/>
                    <mu-raised-button v-if="$route.name == 'reset'" label="重置密码" fullWidth @click="onRegister"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </base-layout>
</template>

<script>
    import md5 from 'blueimp-md5'
    import BaseLayout from '../BaseLayout'
    import api from '../../api'
    import Mixin from '../../mixin'
    import SimpleVueValidation from 'simple-vue-validator'

    export default{
        mixins: [Mixin],

        data(){
            return {
                mobile: '',
                code: '',
                password: '',
                repeat: '',
                codeLabel: '获取验证码',
                codeDisabled: false,
                submitted: false
            }
        },

        validators: {
            'mobile': function (value) {          
                return SimpleVueValidation.Validator.value(value).required().regex('^1[34578][0-9]{9}$', "非法手机号码");
            },

            'password': function (value) {
                return SimpleVueValidation.Validator.value(value).minLength(6);
            },

            'repeat, password': function (repeat, password) {
                if (this.submitted || this.validation.isTouched('repeat')) {
                    return SimpleVueValidation.Validator.value(repeat).required().match(password);
                }
            },

            'code': function (value) {
                return SimpleVueValidation.Validator.value(value).digit().length(5);
            },
        },

        methods: {
            onRegister(){
                var self = this;

                self.submitted = true;
                self.$validate().then(function (success) {
                    if (success) {
                        self.wait(api.login({mobile: self.mobile, password:md5(self.password), code:md5(self.code), referee:self.$route.params.referee}, "default")).then(function(account){
                            account.setCookie();

                            self.wait(self.$store.dispatch('login', account.customer_id)).then(function(){
                                self.$router.replace(self.$route.query.redirect);
                            });
                        });
                    }
                })
            },

            onBack(){
                this.$router.back();
            },

            onGetCode(e){
                var self = this;

                self.$validate("mobile").then(function (success) {
                    if (success) {
                        self.codeDisabled = true;

                        //发送短信
                        api.sendSms(self.mobile);

                        // 重新发送
                        var time = 60; // 时长
                        var timer = setInterval(function () {
                            time--;
                            self.codeLabel = time + '秒'
                            if (!time) {
                                time = 0;
                                clearInterval(timer)
                                self.codeDisabled = false;
                                self.codeLabel = '重新发送';
                            }
                        }, 1000)
                    }
                })
            },
        },

        components: {
            'base-layout': BaseLayout
        }
    }
</script>

