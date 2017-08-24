<template>
    <base-layout :progressing="refreshing" :toast="toast" :loading="loading" @on-load-more="onLoadMore">
        <mu-appbar title="历史活动" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
            <mu-icon-button icon="refresh" slot="right" @click="onRefresh" />
        </mu-appbar>

		<activity-list :activities="activities"/>	
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

		data () {
			return {
				activities: [],
				loading: false
			}
		},

		computed: mapGetters({
    		me: 'me'
  		}),

		methods: {
			onInitialize() {
				var self = this;
				self.wait(api.query("Activity", {customer_id: self.me.id}, {offset: 0, limit:20})).then(function(activities){
					self.contractivitiesacts = activities;
				});
			},

		    onChange: function(val) {
		      	this.goto(val);
		    },

            onRefresh: function() {
				var self = this;
                self.wait(api.query("Activity", {customer_id: self.me.id}, {offset: 0, limit:self.activities.length})).then(function(activities){
					self.activities = activities;
				});
            },

			onLoadMore: function() {
				var self = this;

				if (self.activities.length % 20 == 0) {
					self.loading = true;
					api.query("Activity", {customer_id: self.me.id}, {offset: self.activities.length, limit:20}).then(function(activities){
						self.activities.concat(activities);
						self.loading = false;
					}, function(err){
						self.loading = false;
					})
				}
			},
		},

    	components: {
      		'base-layout': BaseLayout,
      		'activity-list': ActivityList
    	}
	}
</script>