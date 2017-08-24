<template>
    <base-layout :refreshing="refreshing" :toast="toast">
        <mu-appbar title="消拼商户" slot="header">
        </mu-appbar>

        <mu-row gutter style="width:96%;margin-left:2%">
            <mu-col width="25">
                <img :src="merchant.logo" style="width:100%;height:70px;margin-left:10px;margin-top:10px;"/>
            </mu-col>
            <mu-col width="75">
                <div style="margin-top:10px;margin-left:10px;">
                    <p style="font-size:larger;">{{merchant.name}}</p>
                    <p style="padding-bottom:2px">{{['服饰鞋包', '汽车美容', '水果生鲜', '美容美发'][merchant.category]}}</p>
                    <p style="padding-bottom:2px">{{merchant.address}}</p>
                </div>
            </mu-col>
        </mu-row>

        <mu-content-block v-if="merchant">
            <mu-list v-if="merchant">
                <mu-list-item v-if="!merchant.wx_mchid" title="绑定微信商户号" @click="onBind">
                    <mu-icon slot="left" value="link"/>
                </mu-list-item>
                <mu-list-item title="商户消息" @click="onListMessage">
                    <mu-icon slot="left" value="mail"/>
                </mu-list-item>
                <mu-list-item title="商户活动" @click="onShowActivities">
                    <mu-icon slot="left" value="assignment"/>
                </mu-list-item>
                <mu-list-item title="商户拼单" @click="onShowContracts">
                    <mu-icon slot="left" value="assignment"/>
                </mu-list-item>
            </mu-list>
            <mu-list v-else>
                <mu-list-item>
                    <mu-raised-button label="商户免费入驻" fullWidth @click="onNewMerchant"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </base-layout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'
    import api from '../../api'

    export default {
        mixins: [Mixin],

        computed: mapGetters({
            me: 'me',
            merchant: 'merchant'
        }),
          
        methods: {
            onViewMe: function() {
                this.goto(this.me.url);
            },

            onListMessage: function() {
                this.goto("/messages");
            },

            onNewMerchant() {
                this.goto("/merchant/new");
            },

            onShowMerchant() {
                this.goto("/merchant/" + this.merchant.id)
            },

            onShowActivities() {
                this.goto("/activities?merchant_id=" + this.merchant.id);
            },

            onShowContracts() {
                this.goto("/contracts?merchant_id=" + this.merchant.id);
            },

            onBind() { 
                this.goto("/merchant/bind");
            }
        },

        components: {
            'base-layout': BaseLayout
        }
    }
</script>