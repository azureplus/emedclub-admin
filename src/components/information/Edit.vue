<template>
    <layout :progressing="refreshing" :toast="toast">
        <mu-appbar title="新建品牌" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-content-block v-if="brand">
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="名称" v-model="brand.name" :errorText="validation.firstError('brand.name')" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-paper :zDepth="1" style="width: 100px;height: 100px;margin: 0 auto;">
                        <img :src="brand.logo" style="width: 100px;height: 100%" v-if="brand.logo" @click="onUploadLogo"/>
                        <div style="text-align: center;padding-top: 40px;" v-else @click="onUploadLogo">LOGO</div>
                    </mu-paper>
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
    import Brand from '../../model/Brand'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import SimpleVueValidation from 'simple-vue-validator';
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data() {
            return {
                brand: null
            }
        },

        computed: mapGetters({
            me: 'me'
        }),

        validators: {
            'brand.name': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
        },

        methods: {
            onInitialize() {
                this.brand = new Brand({customer_id: this.me.id, name: '', logo: '', state: 0});
            },

            onUpdate() {
                this.onInitialize();
            },

            onSave: function() {
                var self = this;

                if (self.brand.logo.length == 0) {
                    self.showToast("请上传LOGO");
                } else {
                    self.$validate().then(function (success) {
                        if (success) {
                            self.wait(api.save(self.brand)).then(function(m){
                                self.back();
                            })
                        }
                    });  
                }
            },

            onUploadLogo: function() {
                var self = this;

                self.wait(self.$channel.chooseImage()).then(function(url){
                    self.brand.logo = url;
                })
            }
        },

        components: {
            'layout': Layout
        }
    }
</script>