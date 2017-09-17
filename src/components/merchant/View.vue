<template>
    <layout :progressing="refreshing" :toast="toast" :destroySheet="destroySheet" @on-destroy="onDestroy" @on-cancel-destroy="onCancelDestroy" activeIndex="/merchant/index">
        <mu-content-block>
            <mu-raised-button label="修改" @click="onEdit"/>
            <mu-raised-button label="删除" @click="canDestroy"/>
            <mu-raised-button label="增加药品" @click="onAddMedicine"/>

            <mu-table multiSelectable enableSelectAll ref="table" v-if="merchant">
                <mu-tbody>
                    <mu-td style="width:20%">ID</mu-td>
                    <mu-td>{{merchant.id}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>名称</mu-td>
                    <mu-td>{{merchant.name}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>商标</mu-td>
                    <mu-td><img :src="merchant.logo" width=100 height=100/></mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>简介</mu-td>
                    <mu-td v-html="merchant.introduction"></mu-td>
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
                merchant: null,

                destroySheet: false,
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

            canDestroy: function() {
                this.destroySheet = true;
            },

            onCancelDestroy: function() {
                this.destroySheet = false;
            },

            onDestroy: function() {
                var self = this

                self.destroySheet = false;
                self.wait(api.destroy(self.merchant)).then(function(){
                    self.back()
                })
            },

            onEdit: function() {
                this.goto("/merchant/edit/" + this.merchant.id)
            },

            onAddMedicine: function() {
                this.goto("/medicine/new?name=" + this.merchant.name)
            }            
        },

        components: {
            'layout': Layout,
        }
    }
</script>