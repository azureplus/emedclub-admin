<template>
    <layout :progressing="refreshing" :toast="toast" :destroySheet="destroySheet" @on-destroy="onDestroy" @on-cancel-destroy="onCancelDestroy">
        <mu-content-block>
            <mu-raised-button label="修改" @click="onEdit"/>
            <mu-raised-button label="删除" @click="canDestroy"/>

            <mu-table multiSelectable enableSelectAll ref="table" v-if="medicine">
                <mu-tbody>
                    <mu-td style="width:20%">ID</mu-td>
                    <mu-td>{{medicine.id}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>国家</mu-td>
                    <mu-td>{{merchant.country}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>企业</mu-td>
                    <mu-td>{{merchant.merchant}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>首席科学家</mu-td>
                    <mu-td>{{merchant.scientist}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>领域</mu-td>
                    <mu-td>{{merchant.domain}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>名称</mu-td>
                    <mu-td>{{merchant.name}}</mu-td>
                </mu-tbody> 
                <mu-tbody>
                    <mu-td>靶向</mu-td>
                    <mu-td>{{merchant.target}}</mu-td>
                </mu-tbody> 
                <mu-tbody>
                    <mu-td>适应症</mu-td>
                    <mu-td>{{merchant.indication}}</mu-td>
                </mu-tbody> 
                <mu-tbody>
                    <mu-td>临床前研究</mu-td>
                    <mu-td>{{merchant.preclinical_study}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>临床申报</mu-td>
                    <mu-td>{{merchant.clinical_declaration}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>临床I期研究</mu-td>
                    <mu-td>{{merchant.clinical_1_study}}</mu-td>
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
                medicine: null,

                destroySheet: false,
            }
        },

        methods: {
            onInitialize: function() {
                var self = this;

                api.queryOne("Medicine", self.$route.params.id).then(function(model){
                    self.medicine = model;
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
                self.wait(api.destroy(self.medicine)).then(function(){
                    self.back()
                })
            },

            onEdit: function() {
                this.goto("/medicine/edit/" + this.medicine.id)
            }          
        },

        components: {
            'layout': Layout,
        }
    }
</script>