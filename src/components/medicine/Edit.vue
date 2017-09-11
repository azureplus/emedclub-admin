<template>
    <layout :progressing="refreshing" :toast="toast">
        <mu-appbar :title="title" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
            <mu-icon-button icon="help" slot="right" @click="onShowRule"/>
        </mu-appbar>  

        <mu-content-block v-if="contract">
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="手机号码" type=number v-model="mobile" :errorText="validation.firstError('mobile')" fullWidth />
                </mu-list-item>

                <mu-list-item>
                    <mu-flexbox>
                        <mu-flexbox-item>
                            <mu-date-picker label="截止时间" v-model="day" :errorText="validation.firstError('day')"  fullWidth/>
                        </mu-flexbox-item>
                        <mu-flexbox-item>
                            <mu-time-picker label="  " format="24hr" v-model="time" :errorText="validation.firstError('time')"  fullWidth/>
                        </mu-flexbox-item>
                    </mu-flexbox>
                </mu-list-item>

                <mu-list-item v-if="contract.category != 2">
                    <mu-text-field label="购买金额（元）" type=number v-model="money" :errorText="validation.firstError('money')" fullWidth />
                </mu-list-item>

                <mu-list-item v-if="contract.category == 1" >
                    <mu-text-field label="购买数量（件）" type=number v-model="quantity" :errorText="validation.firstError('quantity')" fullWidth />
                </mu-list-item>

                <mu-list-item v-if="contract.category == 0">
                    <mu-table @rowClick="onSelectFavorable" :showCheckbox="false">
                        <mu-tbody>
                            <mu-tr v-for="(favorable, index) in activity.favorables" :key="favorable.id">
                                <mu-td style="width:24px">
                                    <mu-icon value="check" :size="24" v-if="index == favorableIndex"/>
                                </mu-td>
                                <mu-td>
                                    <mu-text-field label="满（元）" type=number v-model="favorable.threshold" fullWidth disabled/>
                                </mu-td>
                                <mu-td>
                                    <mu-text-field label="减（元）" type=number v-model="favorable.discount" fullWidth disabled/>
                                </mu-td>
                            </mu-tr>
                        </mu-tbody>
                    </mu-table>
                </mu-list-item>

                <mu-list-item v-if="contract.category == 1">
                    <mu-table @rowClick="onSelectFavorable" :showCheckbox="false">
                        <mu-tbody>
                            <mu-tr v-for="(favorable, index) in activity.favorables" :key="favorable.id">
                                <mu-td style="width:24px">
                                    <mu-icon value="check" :size="24" v-if="index == favorableIndex"/>
                                </mu-td>
                                <mu-td>
                                    <mu-text-field label="满（件）" type=number v-model="favorable.threshold" fullWidth disabled/>
                                </mu-td>
                                <mu-td>
                                    <mu-text-field label="折扣" type=number v-model="favorable.discount" fullWidth disabled/>
                                </mu-td>
                            </mu-tr>
                        </mu-tbody>
                    </mu-table>
                </mu-list-item>

                <mu-list-item>
                    <mu-text-field label="备注" v-model="contract.comment" multiLine :rows="2" :rowsMax="6" fullWidth />
                </mu-list-item>

                <mu-list-item>
                    <mu-raised-button label="开始拼单" fullWidth @click="onNewContract"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import Contract from '../../model/Contract'
    import Contractor from '../../model/Contractor'
    import Discount from '../../model/Discount'
    import api from '../../api'
    import jsonp from 'jsonp'
    import { mapGetters, mapActions } from 'vuex'
    import SimpleVueValidation from 'simple-vue-validator';
    import Mixin from '../../mixin'
    import Datetime from '../../util/date'

    export default {
        mixins: [Mixin],

        data() {
            return {
                title: '拼单',
                day: "",
                time: "",
                mobile: "",
                money: 0,
                quantity: 1,
                contract: null,
                activity: null,
                submitted: false,
                favorableIndex: -1
            }
        },

        computed: mapGetters({
            me: 'me'
        }),

        validators: {
            'money': function (value) {
                return SimpleVueValidation.Validator.value(value).required().integer().greaterThan(0);
            },
            'mobile': function (value) {          
                return SimpleVueValidation.Validator.value(value).required().regex('^1[34578][0-9]{9}$', "非法手机号码");
            },
            'quantity': function (value) {
                return SimpleVueValidation.Validator.value(value).required().integer().greaterThan(0);
            },
            'day': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
            'time, day': function (time, day) {
                if (this.submitted || this.validation.isTouched('time')) {
                    var self = this;
                    return SimpleVueValidation.Validator.value(time).required().custom(function(){
                        if (!SimpleVueValidation.Validator.isEmpty(time)) {
                            var datetime = new Date(day + " " + time);
                            var endtime  = new Date(self.activity.end_time);
                            if (datetime > endtime) {
                                return '不能晚于活动结束时间';
                            }
                        }
                    });
                }
            }
        },

        methods: {
            onInitialize() {
                let self = this;

                self.day = "";
                self.time = "";
                self.money = 0;
                self.mobile = self.me.mobile;
                self.quantity = 1;
                self.contract = null;
                self.activity = null;
                self.submitted = false;
                self.favorableIndex = -1;

                self.wait(api.queryOne("Activity", self.$route.query.activity_id)).then(function(activity){
                    self.activity = activity;

                    self.money = activity.price;

                    self.contract = new Contract({
                        merchant_id: activity.merchant_id, 
                        activity_id: activity.id, 
                        title: activity.title, 
                        category: activity.category, 
                        total_contractors: activity.total_contractors,
                        deposit: activity.deposit,
                        price: activity.price});
                    self.contract.discounts = [];

                    self.day  = Datetime.day(activity.end_time);
                    self.time = Datetime.time(activity.end_time);

                    self.title = self.contract.categoryName
                })
            },

            onUpdate() {
                this.onInitialize();
            },

            onShowRule() {
                this.goto('/rule');
            },

            onNewContract() {
                var self = this;

                if (self.contract.category == 0 || self.contract.category == 1) {
                    var hasValidDiscount = false;
                    for(var i = 0; i < self.contract.discounts.length; i++) {
                        if (self.contract.discounts[i].isValid()) {
                            hasValidDiscount = true;
                        }
                    }

                    if (hasValidDiscount) {
                        self.submitted = true;
                        self.$validate().then(function (success) {
                            if (success) {
                                self._createContract("")
                            }
                        });
                    } else {
                        self.showToast("至少要有一个折扣");
                    }
                } else {
                    self.submitted = true;
                    self.$validate().then(function (success) {
                        if (success) {
                            self.$channel.pay({merchant_id: self.activity.merchant_id, customer_id: self.me.id, money: self.activity.deposit, product: "拼单"}).then(function(paymentId){
                                self._createContract(paymentId)
                            }, function(err){
                                self.toast = "支付失败，请稍后再试"
                            })
                        } else {
                            alert("contract failed ")
                        }
                    })
                }
            },
            
            onSelectFavorable(selectedRowsIndex) {
                if (selectedRowsIndex < this.activity.favorables.length) {
                    this.favorableIndex = selectedRowsIndex;

                    var favorable = this.activity.favorables[selectedRowsIndex];
                    this.contract.discounts = [new Discount({category: favorable.category, threshold: favorable.threshold, discount: favorable.discount})];
                } else {
                    console.error("selectedRowsIndex " + selectedRowsIndex + " bigger than this.activity.favorables.length ");
                }
            },

            _createContract(paymentId) {
                var self = this;

                self.contract.deadline = self.day + " " + self.time;
                self.contract.location    = self.activity.location;
                self.contract.customer_id = self.me.id;
                self.contract.category    = self.activity.category;
                self.contract.state = 1;
                self.wait(api.save(self.contract)).then(function(c){
                    var promises = [];

                    var contractor = new Contractor();
                    contractor.contract_id = c.id;
                    contractor.customer_id = self.me.id;
                    contractor.state = 1;
                    contractor.money = self.money;
                    contractor.deposit = self.activity.deposit;
                    contractor.mobile = self.mobile;
                    contractor.quantity = self.quantity;
                    contractor.category = self.activity.category;
                    contractor.payment_id = paymentId;
                    promises.push(api.save(contractor));

                    if (self.contract.category == 0 || self.contract.category == 1) {
                        for(var i = 0; i < self.contract.discounts.length; i++) {
                            if (self.contract.discounts[i].isValid()) {
                                self.contract.discounts[i].contract_id = c.id;
                                promises.push(api.save(self.contract.discounts[i]));
                            }
                        }
                    }

                    if (self.me.mobile != self.mobile) {
                        self.$store.dispatch('changeCustomer', {mobile: self.mobile});
                    }

                    self.wait(Promise.all(promises)).then(function(){
                        self.$store.dispatch("newContract", self.contract);

                        self.$router.replace(c.url);
                    })
                })
            },
        },

        components: {
            'layout': Layout
        }
    }
</script>
