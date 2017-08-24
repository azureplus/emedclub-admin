<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar title="通知" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-content-block v-if="setting">
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="地点" v-model="setting.address" :errorText="validation.firstError('setting.address')" fullWidth />
                    <mu-icon value="my_location" slot="right" @click="onLocate" :size="32"/>
                </mu-list-item>
                <mu-list-item>
                    <mu-text-field label="距离（米）" v-model="setting.distance" :errorText="validation.firstError('setting.distance')" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-raised-button label="有拼单通知我" fullWidth @click="onSave"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import SimpleVueValidation from 'simple-vue-validator';
    import Mixin from '../../mixin'
    import Map from '../../util/map'
    import Setting from '../../model/Setting'

    export default {
        mixins: [Mixin],

        data() {
            return {
                address: "",
                setting: null
            }
        },

        computed: mapGetters({
            me: 'me'
        }),

        validators: {
            'setting.address': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
            'setting.distance': function (value) {
                return SimpleVueValidation.Validator.value(value).required().integer().greaterThanOrEqualTo(0).lessThanOrEqualTo(3000);
            },            
        },

        methods: {
            onInitialize() {
                let self = this;

                api.queryMySetting(self.me).then(function(settings){
                    if (settings.length > 0) {
                        self.setting = settings[0];
                    } else {
                        self.setting = new Setting({customer_id: self.me.id, distance:3000, address:''});
                        self.onLocate();
                    }

                    self.setting.notify = 1;
                })
            },

            onUpdate() {
                this.onInitialize();
            },

            onLocate() {
                var self = this;

                self.setting.address = "";
                Map.locate().then(function(point){
                    Map.address(point).then(function(address){
                        if (self.setting.address.length == 0) {
                            self.setting.address  = address; 
                        }
                    })
                })
            },
            
            onSave: function() {
                var self = this;
            
                self.$validate().then(function (success) {
                    if (success) {
                        Map.point(self.setting.address).then(function(pt){
                            self.setting.location = [pt.lng, pt.lat];
                            self.wait(api.save(self.setting)).then(function(c){
                                self.back();
                            })
                        }, function(error){
                            self.showToast(error.message);
                        })
                    }
                });
            }
        },

        components: {
            'baselayout': BaseLayout
        }
    }
</script>
