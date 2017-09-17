<template>
    <layout :progressing="refreshing" :toast="toast" :destroySheet="destroySheet" @on-destroy="onDestroy" @on-cancel-destroy="onCancelDestroy" activeIndex="/information/index">
        <mu-content-block>
            <mu-raised-button label="修改" @click="onEdit"/>
            <mu-raised-button label="删除" @click="canDestroy"/>

            <mu-table multiSelectable enableSelectAll ref="table" v-if="poster">
                <mu-tbody>
                    <mu-td style="width:20%">ID</mu-td>
                    <mu-td>{{poster.id}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>标题</mu-td>
                    <mu-td>{{poster.title}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>图片</mu-td>
                    <mu-td><img :src="poster.media" width=100 height=100/></mu-td>
                </mu-tbody>   
                <mu-tbody>
                    <mu-td>状态</mu-td>
                    <mu-td>{{poster.stateName}}</mu-td>
                </mu-tbody>              
            </mu-table>
        </mu-content-block>
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data() {
            return {
                poster: null,

                destroySheet: false,
            }
        },

        methods: {
            onInitialize: function() {
                var self = this;

                api.queryOne("Poster", self.$route.params.id).then(function(model){
                    self.poster = model;
                })
            },

            onUpdate: function() {
                this.onInitialize();
            },

            canDestroy: function() {
                this.destroySheet = true;
            },

            onCancelDestroy: function() {
                this.destroySheet = false;
            },

            onDestroy: function() {
                var self = this

                self.destroySheet = false;
                self.wait(api.destroy(self.poster)).then(function(){
                    self.back()
                })
            },

            onEdit: function() {
                this.goto("/poster/edit/" + this.poster.id)
            }          
        },

        components: {
            'layout': Layout,
        }
    }
</script>