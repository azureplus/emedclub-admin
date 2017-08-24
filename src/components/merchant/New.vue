<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar title="新建商户" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-content-block v-if="merchant">
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="品牌" v-model="merchant.name" :disabled="true" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-select-field v-model="merchant.category" label="类型">
                        <mu-menu-item value=0 title="服饰鞋包"/>
                        <mu-menu-item value=1 title="汽车美容"/>
                        <mu-menu-item value=2 title="水果生鲜"/>
                        <mu-menu-item value=3 title="美容美发"/>
                    </mu-select-field>
                </mu-list-item>
                <mu-list-item>
                    <mu-text-field label="商圈" v-model="merchant.area" :errorText="validation.firstError('merchant.area')" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-text-field label="地点" v-model="merchant.address" :errorText="validation.firstError('merchant.address')" fullWidth />
                    <mu-icon value="my_location" slot="right" @click="onLocate" :size="32"/>
                </mu-list-item>
                <mu-list-item>
                    <mu-paper :zDepth="1" style="width: 100px;height: 100px;margin: 0 auto;">
                        <img :src="merchant.logo" style="width: 100px;height: 100%" v-if="merchant.logo"/>
                        <div style="text-align: center;padding-top: 40px;" v-else>LOGO</div>
                    </mu-paper>
                </mu-list-item>

                <mu-list-item>
                    <mu-raised-button label="保存" fullWidth @click="onSave"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import Merchant from '../../model/Merchant'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import SimpleVueValidation from 'simple-vue-validator';
    import Mixin from '../../mixin'
    import Map from '../../util/map'

    export default {
        mixins: [Mixin],

        data() {
            return {
                merchant: null
            }
        },

        computed: mapGetters({
            me: 'me'
        }),

        validators: {
            'merchant.name': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
            'merchant.area': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
            'merchant.address': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
        },

        methods: {
            onInitialize() {
                var self = this;

                self.wait(api.queryOne("Brand", self.$route.query.brand_id)).then(function(brand){
                    self.merchant = new Merchant({category: 0, brand_id: brand.id, name: brand.name, area: "", address: '', logo: brand.logo, state: 0});
                })
            },

            onUpdate() {
                this.onInitialize();
            },
 
            onLocate() {
                var self = this;

                self.merchant.address = "";
                Map.locate().then(function(point){
                    Map.address(point).then(function(address){
                        if (self.merchant.address.length == 0) {
                            self.merchant.address  = address; 
                        }
                    })
                })
            },

            onSave: function() {
                var self = this;

                if (self.merchant.logo.length == 0) {
                    self.showToast("请上传LOGO");
                } else {
                    self.$validate().then(function (success) {
                        if (success) {
                            Map.point(self.merchant.address).then(function(pt){
                                self.merchant.location = [pt.lng, pt.lat];
                                self.merchant.customer_id = self.me.id;
                                self.wait(api.save(self.merchant)).then(function(m){
                                    self.back();
                                })
                            }, function(err){
                                self.showToast(err.message);
                            });
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
            'baselayout': BaseLayout
        }
    }
</script>
