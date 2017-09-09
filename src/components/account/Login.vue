<template>
    <div>
        <mu-appbar title="医麦客管理后台"></mu-appbar> 

        <mu-content-block style="width:400px;margin:auto">
            <div class="logo"></div>
            
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="手机号码" type=number v-model="mobile" :errorText="validation.firstError('mobile')" fullWidth />
                    <mu-text-field label="密码" type=password v-model="password" :errorText="validation.firstError('password')" fullWidth />
                </mu-list-item>

                <mu-list-item>
                    <mu-raised-button label="进入医麦客管理后台" fullWidth @click="onLogin"/>
                </mu-list-item>

                <mu-list-item>
                    <mu-flat-button label="重置密码" primary @click="onReset" style="float:right"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </div>
</template>

<script>
    import md5 from 'blueimp-md5'
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

            onReset() {
                this.gotoWith("/reset", this.$route.query.redirect)
            },
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .logo {
      width: 120px;
      height: 120px;
      background: url(../../../static/images/logo.png) no-repeat;
      background-size: 100%;
      margin: 1.5rem auto 1.5em;
      max-width: 400px;
    }
</style>
