<template>
	<mu-content-block>
	  	<mu-grid-list :cols="2" :cellHeight="150">
	    	<mu-sub-header v-if="header && header.length > 0">{{header}}</mu-sub-header>

	    	<mu-grid-tile v-for="brand, index in brands" :key="brand.id">
	      		<img :src="brand.logo" @click="onChange(brand)"/>
	      		<span slot="title" @click="onChange(brand)">{{brand.name}}</span>
	      		<span slot="subTitle" @click="onChange(brand)"></span>
	    	</mu-grid-tile>
	  	</mu-grid-list>
	</mu-content-block>
</template>

<script>
	export default {
		props: ['brands', 'header'],

		methods: {
		    onChange: function(brand) {
		      	this.$router.push({path: "/brand/" + brand.id});
		    }
		},
	}
</script>