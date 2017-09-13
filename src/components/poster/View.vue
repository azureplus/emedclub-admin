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
                    <mu-td>医药公司</mu-td>
                    <mu-td>{{medicine.merchant}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>所属国家</mu-td>
                    <mu-td>{{medicine.country}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>合作机构</mu-td>
                    <mu-td>{{medicine.institute}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>首席科学家</mu-td>
                    <mu-td>{{medicine.scientist}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>所属领域</mu-td>
                    <mu-td>{{medicine.domain}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>药品名称</mu-td>
                    <mu-td>{{medicine.name}}</mu-td>
                </mu-tbody> 
                <mu-tbody>
                    <mu-td>药物靶</mu-td>
                    <mu-td>{{medicine.target}}</mu-td>
                </mu-tbody> 
                <mu-tbody>
                    <mu-td>适应症</mu-td>
                    <mu-td>{{medicine.indication}}</mu-td>
                </mu-tbody> 
                <mu-tbody>
                    <mu-td>临床前研究</mu-td>
                    <mu-td>{{medicine.preclinical_study}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>临床申报</mu-td>
                    <mu-td>{{medicine.clinical_declaration}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>临床批准</mu-td>
                    <mu-td>{{medicine.clinical_approval}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>临床I期研究</mu-td>
                    <mu-td>{{medicine.clinical_1_study}}</mu-td>
                </mu-tbody>  
                <mu-tbody>
                    <mu-td>临床II期研究</mu-td>
                    <mu-td>{{medicine.clinical_2_study}}</mu-td>
                </mu-tbody> 
                <mu-tbody>
                    <mu-td>临床III期研究</mu-td>
                    <mu-td>{{medicine.clinical_3_study}}</mu-td>
                </mu-tbody> 
                <mu-tbody>
                    <mu-td>上市申请</mu-td>
                    <mu-td>{{medicine.listing_application}}</mu-td>
                </mu-tbody> 
                <mu-tbody>
                    <mu-td>上市日期</mu-td>
                    <mu-td>{{medicine.listing_approval}}</mu-td>
                </mu-tbody> 
                <mu-tbody>
                    <mu-td>销售数据</mu-td>
                    <mu-td>{{medicine.sales}}</mu-td>
                </mu-tbody> 
                <mu-tbody>
                    <mu-td>研究状态</mu-td>
                    <mu-td>{{medicine.stateName}}</mu-td>
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