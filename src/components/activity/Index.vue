<template>
    <base-layout :progressing="refreshing" :toast="toast">
    </base-layout>
</template>

<script>
	import BaseLayout from '../BaseLayout'
	import api from '../../api'
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
    	}
	}
</script>
