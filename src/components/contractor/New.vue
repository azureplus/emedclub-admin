<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar title="加入" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-content-block v-if="contractor">
            <mu-list>
                <mu-list-item v-if="contractor.category != 2">
                    <mu-text-field label="购买金额" type=number v-model="contractor.money" :errorText="validation.firstError('contractor.money')" fullWidth />
                </mu-list-item>

                <mu-list-item v-if="contractor.category == 1">
                    <mu-text-field label="购买数量" type=number v-model="contractor.quantity" :errorText="validation.firstError('contractor.quantity')" fullWidth />
                </mu-list-item>

                <mu-list-item>
                    <mu-text-field label="手机号码" type=number v-model="contractor.mobile" :errorText="validation.firstError('contractor.mobile')" fullWidth />
                </mu-list-item>

                <mu-list-item>
                    <mu-raised-button label="加入拼单" fullWidth @click="onJoin"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import Contractor from '../../model/Contractor'
    import api from '../../api'
    import SimpleVueValidation from 'simple-vue-validator'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data() {
            return {
                contractor: null
            }
        },

        computed: mapGetters({
            me: 'me'
        }),

        validators: {
            'contractor.money': function (value) {
                return SimpleVueValidation.Validator.value(value).required().integer().greaterThan(0);
            },
            'contractor.mobile': function (value) {          
                return SimpleVueValidation.Validator.value(value).required().regex('^1[34578][0-9]{9}$', "非法手机号码");
            },
            'contractor.quantity': function (value) {
                return SimpleVueValidation.Validator.value(value).required().integer().greaterThan(0);
            }
        },

        methods: {
            onInitialize: function() {
                var self = this;

                Api.queryOne("Contract", self.$route.params.contract_id).then(function(contract){
                    self.contractor = new Contractor();
                    self.contractor.category    = contract.category;
                    self.contractor.merchant_id = contract.merchant_id;
                    self.contractor.contract_id = contract.id;
                    self.contractor.money       = contract.price;
                    self.contractor.deposit     = contract.deposit;

                    self.contractor.customer_id = self.me.id;
                    self.contractor.mobile      = self.me.mobile;

                    self.contractor.state       = 1;
                })
            },

            onUpdate() {
                this.onInitialize();
            },
 
            onJoin: function() {
                var self = this;
            
                self.$validate().then(function (success) {
                    if (success) {
                        if (self.contractor.category == 2) {
                            self.$channel.pay({merchant_id: self.contractor.merchant_id, customer_id: self.me.id, money: self.contractor.deposit, product: "拼单"}).then(function(paymentId){
                                self._createContractor(paymentId)
                            }, function(err){
                                self.toast = "支付失败，请稍后再试"
                            })
                        } else {
                            self._createContractor("")
                        }
                    }
                })
            },

            _createContractor(paymentId) {
                var self = this;

                self.wait(api.save(self.contractor)).then(function(){
                    if (self.me.mobile != self.contractor.mobile) {
                        self.$store.dispatch('changeCustomer', {mobile: self.contractor.mobile});
                    }

                    self.back()
                })
            },
        },

        components: {
            'baselayout': BaseLayout
        }
    }
</script>
