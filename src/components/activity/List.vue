<template>
	<div v-if="activities && activities.length > 0">
		<mu-list @change="onChange">
			<mu-sub-header v-if="header && header.length > 0">{{header}}</mu-sub-header>
			<mu-list-item v-for="activity in activities" :key="activity.id" :title="activity.merchant.title" :value='activity.url'>
				<mu-avatar :src="activity.merchant.logo" slot="leftAvatar"/>
				<span slot="describe">
					<span style="color: rgba(0, 0, 0, .87)">{{ activity.toString() }}</span><br/>
					<span style="font-size:small">{{ pretty(activity.begin_time) }}到{{ pretty(activity.end_time) }}</span>
				</span>
				<span slot="right" v-if="location">{{ distance(activity) }}</span>
			</mu-list-item>
		</mu-list>
	</div>
	<div v-else>
		<div style="text-align: center;margin-top: 100px;font-size: larger;">没有活动</div>
	</div>
</template>

<script>
	import Time from '../../util/date'
	import Map from '../../util/map'

	export default {
		props: ['activities', 'location', 'header'],

		methods: {
		    onChange: function(val) {
		      	this.$router.push({path: val});
		    },

	        pretty(day) {
	            return Time.pretty(day);
	        },

			distance: function(activity) {
				var pt = new BMap.Point(activity.location[0], activity.location[1]);
				return Map.distance(this.location, pt);
			}
		},
	}
</script>
