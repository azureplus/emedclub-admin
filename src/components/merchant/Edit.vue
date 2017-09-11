<template>
    <layout :progressing="refreshing" :toast="toast">
        <mu-appbar title="企业" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
        </mu-appbar>

       <mu-content-block v-if="merchant">
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="名称" v-model="merchant.name" :disabled="true" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-paper :zDepth="1" style="width: 100px;height: 100px;margin: 0 auto;">
                        <img :src="merchant.logo" style="width: 100px;height: 100%" v-if="merchant.logo"/>
                        <div style="text-align: center;padding-top: 40px;" v-else>LOGO</div>
                    </mu-paper>
                </mu-list-item>
                <mu-list-item>
                    <vue-editor v-model="merchant.introduction"></vue-editor>
                </mu-list-item>
                <mu-list-item>
                    <mu-raised-button label="保存" fullWidth @click="onSave"/>
                </mu-list-item
            </mu-list>
        </mu-content-block>
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import api from '../../api'
    import SimpleVueValidation from 'simple-vue-validator';
    import Mixin from '../../mixin'
    import { VueEditor } from 'vue2-editor'

    export default {
        mixins: [Mixin],

        data () {
            return {
                merchant: null,
            }
        },

        validators: {
            'merchant.name': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
            'merchant.introduction': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
        },

        methods: {
            onInitialize: function() {
                var self = this;
                
                if (self.$route.params.id) {
                    api.queryOne("Merchant", self.$route.params.id).then(function(merchant){
                        self.merchant = merchant;
                    })
                } else {
                    self.merchant = new Merchant({name:'', logo: '', introduction: ''});
                }
            },

            onSave: function() {
                var self = this;

                if (self.merchant.logo.length == 0) {
                    self.showToast("请上传LOGO");
                } else {
                    self.$validate().then(function (success) {
                        if (success) {
                            self.wait(api.save(self.merchant)).then(function(m){
                                self.back();
                            })
                        }
                    });  
                }
            },

            onUploadLogo: function() {
                var self = this;

                self.wait(self.$channel.chooseImage()).then(function(url){
                    self.merchant.logo = url;
                })
            }
        },

        components: {
            'layout': Layout
        }
    }
</script>