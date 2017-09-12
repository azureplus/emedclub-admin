<template>
    <layout :progressing="refreshing" :toast="toast">
       <mu-content-block v-if="medicine">
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="名称" v-model="merchant.name" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-text-field label="企业" v-model="merchant.merchant" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-text-field label="国家" v-model="merchant.country" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-text-field label="首席科学家" v-model="merchant.scientist" fullWidth />
                </mu-list-item>       
                <mu-list-item>
                    <mu-text-field label="靶点" v-model="merchant.target" fullWidth />
                </mu-list-item>       
                <mu-list-item>
                    <mu-text-field label="领域" v-model="merchant.domain" fullWidth />
                </mu-list-item> 
                <mu-list-item>
                    <mu-text-field label="临床前研究" v-model="merchant.preclinical_study" fullWidth />
                </mu-list-item>   
                <mu-list-item>
                    <mu-text-field label="临床申请" v-model="merchant.clinical_declaration" fullWidth />
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
        },

        methods: {
            onInitialize: function() {
                var self = this;
                
                if (self.$route.params.id) {
                    api.queryOne("Medicine", self.$route.params.id).then(function(medicine){
                        self.medicine = medicine;
                    })
                } else {
                    self.medicine = new Medicine({name:''});
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