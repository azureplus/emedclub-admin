<template>
    <layout>
    </layout>
</template>

<script>
	import Layout from '../Layout'
	import api from '../../api'
	import { mapGetters, mapActions } from 'vuex'
	import Mixin from '../../mixin'

	export default {
		mixins: [Mixin],

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
      		'layout': Layout,
    	}
	}
</script>
