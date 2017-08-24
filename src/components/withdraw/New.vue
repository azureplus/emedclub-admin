<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar title="保证金" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-content-block v-if="withdraw">
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="开户名称" v-model="withdraw.bank_account_name" :errorText="validation.firstError('withdraw.bank_account')" />
                </mu-list-item>

                <mu-list-item>
                    <mu-text-field label="开户银行" v-model="withdraw.bank" :errorText="validation.firstError('withdraw.bank')" />
                </mu-list-item>

                <mu-list-item>
                    <mu-text-field label="银行账号" v-model="withdraw.account" :errorText="validation.firstError('withdraw.account')" />
                </mu-list-item>

                <mu-list-item>
                    <mu-raised-button label="退保证金" fullWidth @click="onWithdraw"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import api from '../../api'
    import Withdraw from '../../model/Withdraw'
    import SimpleVueValidation from 'simple-vue-validator'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data() {
            return {
                withdraw: null,
            }
        },
      
        computed: mapGetters({
            me: 'me',
            merchant: 'merchant'
        }),

        validators: {
            'withdraw.bank_account_name': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
            'withdraw.bank_name': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
            'withdraw.account': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },                        
        },

        methods: {
            onInitialize() {
                this.withdraw = new Withdraw();
            },

            onUpdate() {
                this.onInitialize();
            },

            onWithdraw: function() {
                let self = this;

                self.$validate().then(function (success) {
                    if (success) {
                        self.withdraw.customer_id = self.me.id;
                        self.withdarw.money = self.merchant.deposit;
                        self.withdraw.state = 0;
                        self.wait(api.save(self.withdraw)).then(function(w) {
                            self.showToast("退保证金成功，请等待转账");

                            self.back();
                        }, function(error){
                            self.showToast("退保证金失败，请稍后再试");
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