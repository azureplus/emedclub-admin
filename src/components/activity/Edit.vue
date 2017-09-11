<template>
    <layout :progressing="refreshing" :toast="toast">
        <mu-appbar :title="title" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-content-block v-if="activity">
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="名称" v-model="activity.title" hintText="全场" :errorText="validation.firstError('activity.title')" fullWidth />
                </mu-list-item>
                <mu-list-item>
                   <mu-date-picker label="开始时间" v-model="begin_day" :errorText="validation.firstError('begin_day')"  fullWidth />
                </mu-list-item>
                <mu-list-item>
                   <mu-date-picker label="结束时间" v-model="end_day" :errorText="validation.firstError('end_day')"  fullWidth />
                </mu-list-item>

                <mu-list-item v-for="(favorable, index) in activity.favorables" :key="favorable.id" v-if="activity.category == 0">
                    <mu-flexbox>
                        <mu-flexbox-item>
                            <mu-text-field label="满（元）" type=number v-model="favorable.threshold" fullWidth />
                        </mu-flexbox-item>
                        <mu-flexbox-item>
                            <mu-text-field label="减（元）" type=number v-model="favorable.discount" fullWidth />
                        </mu-flexbox-item>
                    </mu-flexbox>
                </mu-list-item>

                <mu-list-item v-for="(favorable, index) in activity.favorables" :key="favorable.id" v-if="activity.category == 1">
                    <mu-flexbox>
                        <mu-flexbox-item>
                            <mu-text-field label="满（件）" type=number v-model="favorable.threshold" fullWidth />
                        </mu-flexbox-item>
                        <mu-flexbox-item>
                            <mu-text-field label="折扣" type=number v-model="favorable.discount" fullWidth />
                        </mu-flexbox-item>
                    </mu-flexbox>
                </mu-list-item>

                <mu-list-item v-if="activity.category == 2">
                    <mu-text-field label="拼单人数" type=number v-model="activity.total_contractors" :errorText="validation.firstError('activity.total_contractors')" fullWidth />
                </mu-list-item>
                <mu-list-item v-if="activity.category == 2">
                    <mu-text-field label="拼单价格" type=number v-model="activity.price" :errorText="validation.firstError('activity.price')" fullWidth />
                </mu-list-item>
                <mu-list-item v-if="activity.category == 2">
                    <mu-text-field label="预付款" type=number v-model="activity.deposit" :errorText="validation.firstError('activity.deposit')" fullWidth />
                </mu-list-item>


                <mu-list-item>
                    <mu-text-field label="备注" v-model="activity.comment" multiLine :rows="2" :rowsMax="6" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-raised-button label="发布活动" fullWidth @click="onSave"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import Activity from '../../model/Activity'
    import Favorable from '../../model/Favorable'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import SimpleVueValidation from 'simple-vue-validator';
    import Mixin from '../../mixin'
    import Map from '../../util/map'

    export default {
        mixins: [Mixin],

        data() {
            return {
                title: "活动",
                begin_day: "",
                end_day: "",
                activity: null,
                merchants: []
            }
        },

        computed: mapGetters({
            me: 'me',
        }),

        validators: {
            'activity.title': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
            'activity.total_contractors': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
            'activity.price': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
            'activity.deposit': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
            'begin_day': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
            'end_day': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
        },

        methods: {
            onInitialize() {
                let self = this;

                api.query("Merchant", {id: self.$route.query.merchant_id}).then(function(merchants){
                    self.merchants = merchants
                })

                self.activity = new Activity()
                self.activity.category = self.$route.query.category

                self.activity.title = ""
                self.activity.total_contractors = 0
                self.activity.price = 0
                self.activity.deposit = 0
                self.activity.comment = ""

                self.activity.favorables = []
                if (self.activity.category == 0 || self.activity.category == 1) {
                    self.activity.favorables.push(new Favorable({category: self.$route.query.category, threshold: 0, discount: 0}))
                    self.activity.favorables.push(new Favorable({category: self.$route.query.category, threshold: 0, discount: 0}))
                }

                self.title = self.activity.categoryName
            },

            onUpdate() {
                this.onInitialize();
            },
            
            onSave: function() {
                var self = this;
            
                if (self.activity.category == 0 || self.activity.category == 1) {
                    var hasValidFavorable = false;
                    for(var i = 0; i < self.activity.favorables.length; i++) {
                        if (self.activity.favorables[i].isValid()) {
                            hasValidFavorable = true;
                        }
                    }

                    if (!hasValidFavorable) {
                        self.showToast("至少要有一个折扣");
                    } else {
                        self._saveActivities();
                    }
                } else {
                    self._saveActivities();
                }
            },

            _saveActivities: function() {
                var self = this;

                self.$validate().then(function (success) {
                    if (success) {
                        var promises = [];

                        for(var i = 0; i < self.merchants.length; i++) {
                            promises.push(self._saveActivity(self.merchants[i]));
                        }

                        self.wait(Promise.all(promises)).then(function(){
                            self.back();
                        })
                    }
                })
            },

            _saveActivity: function(merchant) {
                var self = this;

                return new Promise(function(resolve, reject){
                    var activity = new Activity();

                    activity.merchant_id = merchant.id;
                    activity.location    = merchant.location;

                    activity.begin_time  = self.begin_day + " 00:00:00";
                    activity.end_time    = self.end_day + " 23:59:59";

                    activity.category    = self.activity.category;
                    activity.title       = self.activity.title;
                    activity.total_contractors = self.activity.total_contractors
                    activity.price       = self.activity.price
                    activity.deposit     = self.activity.deposit
                    activity.comment     = self.activity.comment

                    activity.customer_id = self.me.id;
                    activity.state = 0;

                    api.save(activity).then(function(c){
                        var promises = [];

                        for(var i = 0; i < self.activity.favorables.length; i++) {
                            if (self.activity.favorables[i].isValid()) {
                                var favorable = new Favorable()
                                favorable.activity_id = c.id;
                                favorable.category    = self.activity.favorables[i].category;
                                favorable.threshold   = self.activity.favorables[i].threshold;
                                favorable.discount    = self.activity.favorables[i].discount;
                                promises.push(api.save(favorable));
                            }
                        }

                        Promise.all(promises).then(function(){
                            resolve()
                        }, function(err){
                            reject(err)
                        })
                    }, function(err){
                        reject(err)
                    })
                })
            }
        },

        components: {
            'layout': Layout
        }
    }
</script>
