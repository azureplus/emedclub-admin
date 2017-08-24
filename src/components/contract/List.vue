<template>
	<mu-list @change="onChange" v-if="contracts.length > 0">
		<mu-sub-header v-if="header && header.length > 0">{{header}}</mu-sub-header>
		<mu-list-item v-for="contract in contracts" :key="contract.id" :title="contract.title" :value='contract.url'>
			<mu-avatar :src="contract.customer.avatar" slot="leftAvatar"/>
			<span slot="describe">
				<span style="color: rgba(0, 0, 0, .87)" v-if="contract.category == 2">购买{{contract.price}}元，预付{{contract.deposit}}元</span>
				<span style="color: rgba(0, 0, 0, .87)" v-else>合拼{{contract.amountOf()}}元，节省{{contract.savingOf()}}元</span>
				<br/>
				<span style="font-size:small">{{contract.stateName}}，截止时间{{pretty(contract.deadline)}}</span>
			</span>
			<span slot="right" v-if="location">{{distance(contract)}}</span>
		</mu-list-item>
	</mu-list>
</template>

<script>
	import Datetime from '../../util/date'
	import Map from '../../util/map'

	export default {
		props: ['contracts', 'location', 'header'],

		methods: {
		    onChange: function(val) {
		      	this.$router.push({path: val});
		    },

	        pretty(day) {
	            return Datetime.pretty(day);
	        },

			distance: function(contract) {
				var locationOfContract = new BMap.Point(contract.location[0], contract.location[1]);
				return Map.distance(this.location, locationOfContract);
			}
		},
	}
</script>
