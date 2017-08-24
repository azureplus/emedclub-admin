<template>
    <layout :refreshing="refreshing" :toast="toast" @on-refresh="onRefresh">
        <mu-content-block v-if="me">
            <mu-list>
                <mu-list-item :title="me.name" @click="onViewMe">
                    <mu-avatar :src="me.avatar" slot="leftAvatar"/>
                    <span slot="describe">
                        <span style="color: rgba(0, 0, 0, .87)">拼单数：{{ me.total_contracts }}，成功率：{{ ratio() }}%</span><br/>
                    </span>
                </mu-list-item>
            </mu-list>

            <mu-divider />

            <mu-list>        
                <mu-list-item title="我的消息" @click="onShowMessages">
                    <mu-icon slot="left" value="email"/>
                    <mu-badge :content="totalMessages" primary slot="right"/>
                </mu-list-item> 
                <mu-list-item title="全部品牌" @click="onShowBrands" v-if="me.role == 1">
                    <mu-icon slot="left" value="place"/>
                    <mu-badge :content="totalMerchants" primary slot="right"/>
                </mu-list-item>
                <mu-list-item title="我的品牌" @click="onShowBrands" v-else>
                    <mu-icon slot="left" value="place"/>
                    <mu-badge :content="totalMerchants" primary slot="right"/>
                </mu-list-item>
                <mu-list-item title="我的活动" @click="onShowActivities">
                    <mu-icon slot="left" value="assignment"/>
                    <mu-badge :content="totalActivities" primary slot="right"/>
                </mu-list-item>                       
            </mu-list>
        </mu-content-block>
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import Account from '../../model/Account'
    import Customer from '../../model/Customer'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'
    import api from '../../api'

    export default {
        mixins: [Mixin],

        computed: mapGetters({
            me: 'me'
        }),

        data () {
            return {
                totalActivities: "",
                totalMerchants: "",
                totalMessages: ""
            }
        },

        methods: {
            onInitialize: function() {
                var self = this;
                
                if (self.me.role == 1) {
                    api.count("Merchant", {}).then(function(total){
                        self.totalMerchants = total.toString();
                    }) 
                } else {
                    api.count("Merchant", {customer_id: self.me.id}).then(function(total){
                        self.totalMerchants = total.toString();
                    })               
                }

                api.count("Activity", {customer_id: self.me.id}).then(function(total){
                    self.totalActivities = total.toString();
                })
                api.count("Message", {receiver_id: self.me.id, state: 0}).then(function(total){
                    self.totalMessages = total.toString();
                })
            },

            onRefresh: function() {
                this.onInitialize()
            },

            onUpdate: function() {
                this.onInitialize()
            },

            onViewMe: function() {
                this.goto("/customer/" + this.me.id);
            },

            onShowMessages: function() {
                this.goto("/messages");
            },

            onShowActivities: function() {
                this.goto("/activities");
            },

            onShowBrands: function() {
                this.goto("/brands");
            },

            ratio: function() {
                return Customer.ratio(this.me);
            }
        },

        components: {
            'layout': Layout
        }
    }
</script>
