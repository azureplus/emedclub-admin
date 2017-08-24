<template>
    <base-layout>
        <mu-appbar title="所有拼单" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
            <mu-icon-button icon="refresh" slot="right" @click="onRefresh" />
        </mu-appbar>

		<contract-list :contracts="contracts"/>	
    </base-layout>
</template>

<script>
	import BaseLayout from '../BaseLayout'
	import api from '../../api'
	import ContractList from './List'
	import { mapGetters, mapActions } from 'vuex'
	import Mixin from '../../mixin'

	export default {
		mixins: [Mixin],

		computed: mapGetters({
    		me: 'me'
  		}),

        data () {
            return {
                contracts: [],
            }
        },

		methods: {
			onInitialize() {
				this.onRefresh()
			},

            onRefresh: function() {
            	this.loadData()
            },

		    loadData() {
		    	var self = this;

				if (self.$route.query.merchant_id) {
					var conditions = {merchant_id: self.$route.query.merchant_id};
				} else if (self.$route.query.activity_id) {
					var conditions = {activity_id: self.$route.query.activity_id};
				} else {
					var conditions = {customer_id: self.me.id};
				}
				
                self.wait(api.query("Contract", conditions, {order: "update_time DESC"})).then(function(contracts) {
                    self.contracts = contracts;
                },function(err){
                    reject(err);
                });
		    },
		},

    	components: {
      		'base-layout': BaseLayout,
      		'contract-list': ContractList
    	}
	}
</script>
