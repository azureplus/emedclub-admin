<template>
    <base-layout :progressing="refreshing" :toast="toast">
        <mu-appbar title="消拼">
        </mu-appbar> 

        <mu-content-block>
            <div class="logo"></div>
            
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="手机号码" type=number v-model="mobile" :errorText="validation.firstError('mobile')" fullWidth />
                    <mu-text-field label="密码" type=password v-model="password" :errorText="validation.firstError('password')" fullWidth />
                </mu-list-item>

                <mu-list-item>
                    <mu-raised-button label="进入消拼" fullWidth @click="onLogin"/>
                </mu-list-item>

                <mu-list-item>
                    <mu-flat-button label="免费注册" primary @click="onRegister"/>
                    <mu-flat-button label="重置密码" primary @click="onReset" style="float:right"/>
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
                password: '',
            }
        },

        validators: {
            'mobile': function (value) {          
                return SimpleVueValidation.Validator.value(value).required().regex('^1[34578][0-9]{9}$', "非法手机号码");
            },

            'password': function (value) {
                return SimpleVueValidation.Validator.value(value).minLength(6);
            },
        },

        methods: {
            onLogin(){
                var self = this;

                self.$validate().then(function (success) {
                    if (success) {
                        self.wait(api.login({username: self.mobile, password:md5(self.password)}, "default")).then(function(account){
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

            onRegister() {
                this.gotoWith("/register", this.$route.query.redirect)
            },

            onReset() {
                this.gotoWith("/reset", this.$route.query.redirect)
            },
        },

        components: {
            'base-layout': BaseLayout
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .logo {
      width: 4rem;
      height: 4rem;
      background: url(../../../static/images/logo.jpg) no-repeat;
      background-size: 100%;
      margin: 1.5rem auto 1.5em;
      max-width: 400px;
    }
</style>
