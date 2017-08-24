<template>
	<mu-list v-if="merchants.length > 0">
		<mu-sub-header v-if="header && header.length > 0">{{header}}</mu-sub-header>
		<mu-list-item v-for="merchant in merchants" :key="merchant.id" :title="merchant.title">
			<mu-avatar :src="merchant.logo" slot="leftAvatar" @click='onChange(merchant)'/>
			<span slot="describe">{{merchant.address}}</span>
			<mu-checkbox name="merchants" v-model="selected" slot="right" v-if="selected & selected.length == merchants.length"/>
		</mu-list-item>
	</mu-list>
</template>

<script>
	import Datetime from '../../util/date'
	import Map from '../../util/map'

	export default {
		props: ['merchants', 'selected', 'location', 'header'],

		methods: {
		    onChange(merchant) {
		      	this.$router.push({path: "/merchant/" + merchant.id});
		    },

	        pretty(day) {
	            return Datetime.pretty(day);
	        },

			distance(merchant) {
				var location = new BMap.Point(merchant.location[0], merchant.location[1]);
				return Map.distance(this.location, location);
			},
		},
	}
</script>