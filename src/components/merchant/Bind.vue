<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar title="微信商户号" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
        </mu-appbar>  

        <mu-content-block v-if="merchant">
            <mu-list>
                <mu-list-item>
                <p>如果没有微信商户号，请将以下资料发送到平台审核部门：adonis@xpin1.com</p>
                <p>1.商户简称</p>
                <p>2.营业执照正本原件电子版</p>
                <p>3.申请人身份证原件（正反面）电子版</p></p>
                <p>4.银行开户名称、开户银行、银行账号</p>
                <p>5.申请人手机号码、邮箱地址</p></p>
                </mu-list-item>

                <mu-list-item>
                    <mu-text-field label="微信商户号" v-model="merchant.wx_mchid" :errorText="validation.firstError('merchant.wx_mchid')" />
                </mu-list-item>

                <mu-list-item>
                    <mu-raised-button label="绑定" fullWidth @click="onBind"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import api from '../../api'
    import SimpleVueValidation from 'simple-vue-validator'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],
      
        computed: mapGetters({
            merchant: 'merchant'
        }),

        validators: {
            'merchant.wx_mchid': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },                     
        },

        methods: {
            onBind: function() {
                let self = this;

                self.$validate().then(function (success) {
                    if (success) {
                        self.wait(self.$store.dispatch('changeMerchant', {wx_mchid: self.merchant.wx_mchid})).then(function() {
                            self.showToast("绑定微信商户号成功，请等待转账");

                            self.back();
                        }, function(error){
                            self.showToast("绑定微信商户号失败，请稍后再试");
                        });
                    }
                });
            }
        },

        components: {
            'baselayout': BaseLayout
        }
    }
</script>