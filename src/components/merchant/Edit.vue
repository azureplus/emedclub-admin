<template>
    <base-layout :progressing="refreshing" :toast="toast">
        <mu-appbar title="企业" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
        </mu-appbar>

       <mu-content-block v-if="merchant">
            <mu-list>
                <mu-list-item v-if="$route.query.category == 'address'">
                    <mu-text-field label="商户地点" v-model="address" :errorText="validation.firstError('address')" fullWidth />
                    <mu-icon value="my_location" slot="right" @click="onLocate" :size="32"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </base-layout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import SimpleVueValidation from 'simple-vue-validator';
    import Mixin from '../../mixin'
    import Map from '../../util/map'

    export default {
        mixins: [Mixin],

        data () {
            return {
                address: '',
            }
        },

        computed: mapGetters({
            merchant: 'merchant'
        }),

        validators: {
            'address': function (value) {
                return SimpleVueValidation.Validator.value(value).required().custom(function() {
                    if (!SimpleVueValidation.Validator.isEmpty(value)) {
                        Map.point(value).then(function(pt){
                        }, function(error){
                            return error.message;
                        });
                    }
                });
            },
        },

        methods: {
            onInitialize: function() {
                this.address  = this.merchant.address;
            },

            onLocate() {
                var self = this;

                self.address = "";
                Map.locate().then(function(point){
                    Map.address(point).then(function(address){
                        if (self.address.length == 0) {
                            self.address  = address; 
                        }
                    })
                })
            },

            onBack: function() {
                var self = this;
                
                if (self.$route.query.category == 'address') {
                    self.$validate("address").then(function (success) {
                        if (success) {
                            Map.point(self.address).then(function(pt){
                                self.$store.dispatch('changeMerchant', {address: self.address, location: [pt.lng, pt.lat]});
                            });

                            self.back();
                        }
                    });
                } else {
                    self.back();
                }
            }
        },

        components: {
            'base-layout': BaseLayout
        }
    }
</script>