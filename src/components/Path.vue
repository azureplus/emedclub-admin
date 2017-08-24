<template>
    <base-layout :progressing="refreshing" :toast="toast">
        <mu-appbar title="地图" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>

        <div id="allmap"></div>
    </base-layout>
</template>

<script>
    import BaseLayout from './BaseLayout'
    import Mixin from '../mixin'
    import Map from '../util/map'

    export default {
        mixins: [Mixin],

        mounted() {
            var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var height = winHeight - 60;
            document.getElementById("allmap").style.height = height + "px"; 
        },

        methods: {
            onInitialize() {
                var self = this;

                Map.locate().then(function(point){
                    var map = new BMap.Map("allmap");                       
                    map.centerAndZoom(point, 11);
                    
                    Map.point(self.$route.query.address).then(function(target){
                        if (target) {
                            var walking = new BMap.WalkingRoute(map, {renderOptions:{map: map, autoViewport: true}});
                            walking.search(point, target);
                        }
                    })
                })
            },

            onUpdate() {
                this.onInitialize();
            },
        },

        components: {
            'base-layout': BaseLayout
        }
    }
</script>
