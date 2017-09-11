<template>
    <layout :progressing="refreshing" :toast="toast">
        <mu-raised-button label="修改" @click="onEdit"/>
        <mu-raised-button label="删除" @click="onDestroy"/>

        <mu-table multiSelectable enableSelectAll ref="table">
            <mu-tbody>
                <mu-td>ID</mu-td>
                <mu-td>{{merchant.id}}</mu-td>
            </mu-tbody>
            <mu-tbody>
                <mu-td>名称</mu-td>
                <mu-td>{{merchant.name}}</mu-td>
            </mu-tbody>
            <mu-tbody>
                <mu-td>商标</mu-td>
                <mu-td><img src="{{merchant.logo}}" width=100 height=100/></mu-td>
            </mu-tbody>
            <mu-tbody>
                <mu-td>简介</mu-td>
                <mu-td>{{merchant.introduction}}</mu-td>
            </mu-tbody>      
        </mu-table>
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
                merchant: null,
            }
        },

        methods: {
            onInitialize: function() {
                var self = this;

                api.queryOne("Merchant", self.$route.params.id).then(function(model){
                    self.merchant = model;
                })
            },

            onUpdate: function() {
                this.onInitialize();
            },

            onDestroy: function() {
                var self = this
                self.wait(api.destroy(self.merchant)).then(function(){
                    self.back()
                })
            },

            onEdit: function() {
                this.goto("/merchant/edit/" + this.merchant.id)
            }
        },

        components: {
            'layout': Layout,
        }
    }
</script>