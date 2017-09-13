<template>
    <layout :progressing="refreshing" :toast="toast">
       <mu-content-block v-if="medicine">
            <mu-list>
                <mu-list-item title="医药公司">
                    <mu-text-field v-model="medicine.merchant" fullWidth />
                </mu-list-item>
                <mu-list-item title="所属国家">
                    <mu-select-field v-model="medicine.country">
                        <mu-menu-item value="澳大利亚" title="澳大利亚"/>
                        <mu-menu-item value="巴西" title="巴西"/>
                        <mu-menu-item value="加拿大" title="加拿大"/>
                        <mu-menu-item value="中国" title="中国"/>
                        <mu-menu-item value="古巴" title="古巴"/>
                        <mu-menu-item value="丹麦" title="丹麦"/>
                        <mu-menu-item value="芬兰" title="芬兰"/>
                        <mu-menu-item value="法国" title="法国"/>
                        <mu-menu-item value="德国" title="德国"/>
                        <mu-menu-item value="印度" title="印度"/>
                        <mu-menu-item value="以色列" title="以色列"/>
                        <mu-menu-item value="日本" title="日本"/>
                        <mu-menu-item value="韩国" title="韩国"/>
                        <mu-menu-item value="挪威" title="挪威"/>
                        <mu-menu-item value="英国" title="英国"/>
                        <mu-menu-item value="美国" title="美国"/>
                    </mu-select-field>
                </mu-list-item>
                <mu-list-item title="合作机构">
                    <mu-text-field v-model="medicine.institute" fullWidth />
                </mu-list-item>
                <mu-list-item title="首席科学家">
                    <mu-text-field v-model="medicine.scientist" fullWidth />
                </mu-list-item> 
                <mu-list-item title="所属领域">
                    <mu-text-field label="" v-model="medicine.domain" fullWidth />
                </mu-list-item> 
                <mu-list-item title="药品名称">
                    <mu-text-field label="" v-model="medicine.name" fullWidth :errorText="validation.firstError('medicine.name')" />
                </mu-list-item>     
                <mu-list-item title="技术类别">
                    <mu-select-field v-model="medicine.category">
                        <mu-menu-item value="体外诊断" title="体外诊断"/>
                        <mu-menu-item value="细胞治疗" title="细胞治疗"/>
                        <mu-menu-item value="抗体药物" title="抗体药物"/>
                        <mu-menu-item value="基因治疗" title="基因治疗"/>
                    </mu-select-field>
                </mu-list-item> 
                <mu-list-item title="药物靶">
                    <mu-text-field label="" v-model="medicine.target" fullWidth :errorText="validation.firstError('medicine.target')" />
                </mu-list-item>       
                <mu-list-item title="适应症">
                    <mu-text-field label="" v-model="medicine.indication" fullWidth :errorText="validation.firstError('medicine.indication')" />
                </mu-list-item>
                <mu-list-item title="研究状态">
                    <mu-select-field v-model="medicine.state">
                        <mu-menu-item :value="index" :title="stateName" v-for="(stateName, index) in medicine.stateNames"/>
                    </mu-select-field>
                </mu-list-item> 
                <mu-list-item title="临床前研究">
                    <mu-text-field label="" v-model="medicine.preclinical_study" fullWidth />
                </mu-list-item>
                <mu-list-item title="临床申报">
                    <mu-date-picker v-model="medicine.clinical_declaration"/> <br/>
                </mu-list-item>  
                <mu-list-item title="临床批准">
                    <mu-date-picker v-model="medicine.clinical_approval"/> <br/>
                </mu-list-item>  
                <mu-list-item title="临床试验编号">
                    <mu-text-field label="" v-model="medicine.clinical_trial_no" fullWidth />
                </mu-list-item>    
                <mu-list-item title="临床I期研究">
                    <mu-text-field label="" v-model="medicine.clinical_1_study" fullWidth />
                </mu-list-item> 
                <mu-list-item title="临床II期研究">
                    <mu-text-field label="" v-model="medicine.clinical_2_study" fullWidth />
                </mu-list-item> 
                <mu-list-item title="临床III期研究">
                    <mu-text-field label="" v-model="medicine.clinical_3_study" fullWidth />
                </mu-list-item> 
                <mu-list-item title="上市申请">
                    <mu-date-picker v-model="medicine.listing_application"/> <br/>
                </mu-list-item>    
                <mu-list-item title="上市日期">
                    <mu-date-picker v-model="medicine.listing_approval"/> <br/>
                </mu-list-item>  
                <mu-list-item title="销售数据">
                    <mu-text-field label="" v-model="medicine.sales" type="number" fullWidth />
                </mu-list-item>   

                <mu-list-item>
                    <mu-raised-button label="保存" fullWidth @click="onSave"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import api from '../../api'
    import SimpleVueValidation from 'simple-vue-validator';
    import Mixin from '../../mixin'
    import Medicine from '../../model/Medicine'

    export default {
        mixins: [Mixin],

        data () {
            return {
                medicine: null,
            }
        },

        validators: {
            'medicine.name': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },

            'medicine.target': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },

            'medicine.indication': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
        },

        methods: {
            onInitialize: function() {
                var self = this;
                
                if (self.$route.params.id) {
                    api.queryOne("Medicine", self.$route.params.id).then(function(medicine){
                        self.medicine = medicine;
                    })
                } else {
                    self.medicine = Medicine.createDefault()
                    self.medicine.merchant = self.$route.query.name;
                }
            },

            onSave: function() {
                var self = this;

                self.$validate().then(function (success) {
                    if (success) {
                        self.wait(api.save(self.medicine)).then(function(m){
                            self.back();
                        })
                    }
                });  
            },
        },

        components: {
            'layout': Layout
        }
    }
</script>