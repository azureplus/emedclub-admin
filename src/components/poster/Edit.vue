<template>
    <layout :progressing="refreshing" :toast="toast" activeIndex="/information/index">
       <mu-content-block v-if="poster">
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="标题" v-model="poster.title" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-paper :zDepth="1" style="width: 100px;height: 100px;margin: 0 auto;">
                        <img :src="poster.media" style="width: 100px;height: 100%" v-if="poster.media" @click="onUploadLogo"/>
                        <div style="text-align: center;padding-top: 40px;" v-else  @click="onUploadLogo">图片</div>
                    </mu-paper>
                </mu-list-item>
                <mu-list-item>
                    <mu-select-field label="状态" v-model="poster.state">
                        <mu-menu-item :value="index" :title="state" v-for="(state, index) in poster.states"/>
                    </mu-select-field>
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
    import Poster from '../../model/Poster'

    export default {
        mixins: [Mixin],

        data () {
            return {
                poster: null,
            }
        },

        validators: {
            'poster.title': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
        },

        methods: {
            onInitialize: function() {
                var self = this;
                
                if (self.$route.params.id) {
                    api.queryOne("Poster", self.$route.params.id).then(function(poster){
                        self.poster = poster;
                    })
                } else {
                    self.poster = Poster.createDefault();
                    self.poster.entity_type = self.$route.query.entity_type
                    self.poster.entity_id   = self.$route.query.entity_id
                }
            },

            onSave: function() {
                var self = this;

                if (self.poster.media.length == 0) {
                    self.showToast("请上传图片");
                } else {
                    self.$validate().then(function (success) {
                        if (success) {
                            self.wait(api.save(self.poster)).then(function(m){
                                self.back();
                            })
                        }
                    });  
                }
            },

            onUploadLogo: function() {
                var self = this;

                self.wait(self.$channel.chooseImage()).then(function(url){
                    self.poster.media = url;
                })
            }
        },

        components: {
            'layout': Layout,
        }
    }
</script>