<template>
	<div id="app">
		<keep-alive>
			<router-view></router-view>
		</keep-alive>

		<form id="image-file-form">
			<input type="file" id="image-file-input" accept="image/*" @change="onCaptureLogo($event)" style="display: none"/>
		</form>
	</div>
</template>

<script>
	import api from './api'

	export default {
		methods: {
            onCaptureLogo: function(event) {
                var self = this;

                var file = event.target.files[0];
                if (file.size / 1024 / 1024 > 5){  
                    var value = file.size / 1024 / 1024;  
                    self.$channel.reject(new Error('图片大小' + value .toFixed(0)  + "MB，超过最大5M限制，请修改！"))
                } else {
                	api.upload(file).then(function(url){
                    	self.$channel.resolve(url)
                    }, function(err){
                    	self.$channel.reject(err)
                    })
                }
            },
		}
	}
</script>
