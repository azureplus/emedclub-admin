<template>
    <base-layout :progressing="refreshing" :toast="toast">
        <mu-appbar :title="title" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
			<mu-icon-button icon="refresh" slot="right" @click="onRefresh" />
			<mu-icon-button icon="add" slot="right" @click="openSheet" v-if="merchant && merchant.id == $route.query.merchant_id"/>
        </mu-appbar>

		<activity-list :activities="activities"/>

		<mu-bottom-sheet :open="sheet" @close="closeSheet">
            <mu-raised-button label="发布满减活动" default @click="onNewActivity(0)" style="width:100%;height:45px"/>
			<mu-raised-button label="发布满折活动" default @click="onNewActivity(1)" style="width:100%;height:45px"/>
			<mu-raised-button label="发布快消活动" default @click="onNewActivity(2)" style="width:100%;height:45px"/>
            <mu-raised-button label="再想一下" @click="closeSheet" style="width:100%;height:45px"/>
        </mu-bottom-sheet>
    </base-layout>
</template>

<script>
	import BaseLayout from '../BaseLayout'
	import api from '../../api'
	import ActivityList from './List'
	import { mapGetters, mapActions } from 'vuex'
	import Mixin from '../../mixin'

	export default {
		mixins: [Mixin],

        data() {
            return {
				title: '活动',
                activities: [],
				sheet: false
            }
        },

		computed: mapGetters({
			me: 'me',
			merchant: 'merchant'
  		}),

		methods: {
			onInitialize() {
				var self = this;

				if (self.$route.query.merchant_id) {
					api.queryOne("Merchant", self.$route.query.merchant_id).then(function(merchant){
						self.title = merchant.title
					})
					self.wait(api.query("Activity", {merchant_id: self.$route.query.merchant_id, state: [0, 1]}, {order: 'create_time DESC'})).then(function(activities){
						self.activities = activities;
					})
				} else {
					self.wait(api.query("Activity", {customer_id: self.me.id, state: [0, 1]}, {order: 'create_time DESC'})).then(function(activities){
						self.activities = activities;
						self.title = "我的活动"
					})			
				}
			},

            onRefresh: function() {
                this.onInitialize();
            },

            openSheet() {
            	this.sheet = true;
            },

            closeSheet () {
                this.sheet = false
            },

			onNewActivity: function(category) {
				this.sheet = false;

				if (category == 2) {
					if (this.merchant.wx_mchid) {
						this.goto("/activity/new?category=" + category + "&merchant_id" + this.merchant.id);
					} else {
						this.showToast('只有绑定了微信商户号后才能够发布活动');
					}
				} else {
					this.goto("/activity/new?category=" + category + "&merchant_id" + this.merchant.id);
				}
				
			},
		},

    	components: {
      		'base-layout': BaseLayout,
      		'activity-list': ActivityList
    	}
	}
</script>
