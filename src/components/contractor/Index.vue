<template>
    <layout :refreshing="refreshing" :toast="toast" action="history" @on-action="onAction" :refresh="true"  @on-refresh="onRefresh">
		<contractor-list :contracts="contracts"/>	
    </layout>
</template>

<script>
	import Layout from '../Layout'
	import api from '../../api'
	import ContractorList from './List2'
	import { mapGetters, mapActions } from 'vuex'
	import Mixin from '../../mixin'

	export default {
		mixins: [Mixin],

		computed: mapGetters({
    		me: 'me',
  		}),

		data () {
			return {
				contracts: [],
			}
		},

		methods: {
			onInitialize() {
				this.onRefresh();
			},

            onRefresh: function() {
                var self = this;

            	self.wait(self.loadData()).then(function(contracts){
                    self.contracts = contracts;
                })
            },

			onAction: function() {
				this.goto("/history");
			},

			loadData: function() {
				var self = this;
				
				return new Promise(function(resolve, reject) {
					api.query("Contractor", {customer_id: self.me.id, state: [1, 2]}, {order: 'update_time DESC'}).then(function(contractors){
						var contractIds = [];
						for(var i = 0; i < contractors.length; i++) {
							contractIds.push(contractors[i].contract_id);
						}

						api.query("Contract", {id: contractIds}, {order: 'update_time DESC'}).then(function(contracts){
							resolve(contracts);
						}, function(err){
							reject(err);
						})
					}, function(err){
						reject(err);
					})
				})
			}
		},

    	components: {
      		'layout': Layout,
      		'contractor-list': ContractorList
    	}
	}
</script>