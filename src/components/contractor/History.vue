<template>
    <base-layout :progressing="refreshing" :toast="toast" :loading="loading" @on-load-more="onLoadMore">
        <mu-appbar title="历史订单" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
            <mu-icon-button icon="refresh" slot="right" @click="onRefresh" />
        </mu-appbar>

		<contractor-list :contracts="contracts"/>	
    </base-layout>
</template>

<script>
	import BaseLayout from '../BaseLayout'
	import api from '../../api'
	import ContractorList from './List2'
	import { mapGetters, mapActions } from 'vuex'
	import Mixin from '../../mixin'

	export default {
		mixins: [Mixin],

		data () {
			return {
				contracts: [],
				loading: false,
				hasMore: true
			}
		},

		computed: mapGetters({
    		me: 'me'
  		}),

		methods: {
			onInitialize() {
				this.onRefresh()
			},

            onRefresh: function() {
				var self = this;

				self.hasMore = true;
                self.loadData(0).then(function(contracts){
					self.contracts = contracts;
				});
            },

			onLoadMore: function() {
				var self = this;

				if (self.hasMore) {
					self.loading = true;

					self.loadData(self.contracts.length).then(function(contracts){
						self.contracts = self.contracts.concat(contracts);

						self.loading = false;
					}, function(err){
						self.loading = false;
					})
				}
			},

			loadData: function(offset) {
				var self = this;
				
				return new Promise(function(resolve, reject) {
					api.query("Contractor", {customer_id: self.me.id, state: [3, 4]}, {offset: offset, limit: 20, order: 'update_time DESC'}).then(function(contractors){
						if (contractors.length == 0) {
							self.hasMore = false
						} else {
							var contractIds = [];
							for(var i = 0; i < contractors.length; i++) {
								contractIds.push(contractors[i].contract_id);
							}

							api.query("Contract", {id: contractIds}, {order: 'update_time DESC'}).then(function(contracts){
								resolve(contracts);
							}, function(err){
								reject(err);
							})
						}
					}, function(err){
						reject(err);
					})
				})
			}
		},

    	components: {
      		'base-layout': BaseLayout,
      		'contractor-list': ContractorList
    	}
	}
</script>