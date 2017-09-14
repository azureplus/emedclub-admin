<template>
    <layout :progressing="refreshing" :toast="toast">
       <mu-content-block v-if="information">
            <mu-list>
                <mu-list-item title="类别">
                    <mu-select-field v-model="information.category">
                        <mu-menu-item value="0" title="课堂"/>
                        <mu-menu-item value="1" title="会议"/>
                        <mu-menu-item value="2" title="人才"/>
                        <mu-menu-item value="3" title="融资"/>
                        <mu-menu-item value="4" title="公司"/>
                    </mu-select-field>
                </mu-list-item>
                <mu-list-item>
                    <mu-text-field label="标题" v-model="information.title" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-text-field label="价格" v-model="information.price" type="number" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-paper :zDepth="1" style="width: 100px;height: 100px;margin: 0 auto;">
                        <img :src="information.media" style="width: 100px;height: 100%" v-if="information.media" @click="onUploadLogo"/>
                        <div style="text-align: center;padding-top: 40px;" v-else  @click="onUploadLogo">照片</div>
                    </mu-paper>
                </mu-list-item>
                <mu-list-item>
                    <vue-editor v-model="information.content"></vue-editor>
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
    import Information from '../../model/Information'
    import { VueEditor } from 'vue2-editor'

    export default {
        mixins: [Mixin],

        data () {
            return {
                information: null,
            }
        },

        validators: {
            'information.title': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },

            'information.content': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
        },

        methods: {
            onInitialize: function() {
                var self = this;
                
                if (self.$route.params.id) {
                    api.queryOne("Information", self.$route.params.id).then(function(medicine){
                        self.information = information;
                    })
                } else {
                    self.information = Information.createDefault()
                }
            },

            onSave: function() {
                var self = this;

                if (self.information.media.length == 0) {
                    self.showToast("请上传图片");
                } else {
                    self.$validate().then(function (success) {
                        if (success) {
                            self.wait(api.save(self.information)).then(function(m){
                                self.back();
                            })
                        }
                    });  
                }
            },

            onUploadLogo: function() {
                var self = this;

                self.wait(self.$channel.chooseImage()).then(function(url){
                    self.information.media = url;
                })
            }
        },

        components: {
            'layout': Layout,
            VueEditor
        }
    }
</script>