<template>
    <base-layout :progressing="refreshing" :toast="toast">
        <mu-appbar title="个人信息" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
        </mu-appbar>

       <mu-content-block v-if="me">
            <mu-list>
                <mu-list-item v-if="category == 'name'">
                    <mu-text-field label="昵称" v-model="name" :errorText="validation.firstError('name')" fullWidth />
                </mu-list-item>
                <mu-list-item v-if="category == 'sex'">
                    <mu-radio label="男" name="sex" nativeValue="1" v-model="sex"/> <br/>
                    <mu-radio label="女" name="sex" nativeValue="2" v-model="sex"/> <br/>
                    <mu-radio label="保密" name="sex" nativeValue="3" v-model="sex"/> <br/>
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

    export default {
        mixins: [Mixin],

        data () {
            return {
                category: 'name',
                name: '',
                sex: '1'
            }
        },

        computed: mapGetters({
            me: 'me'
        }),

        validators: {
            'name': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            },
        },

        methods: {
            onInitialize: function() {
                this.name = this.me.name;
                this.sex  = "" + this.me.sex;
                this.category = this.$route.params.category;
            },

            onBack: function() {
                var self = this;
                
                if (self.category == 'name') {
                    self.$validate().then(function (success) {
                        self.$store.dispatch('changeCustomer', {name: self.name});
                    })
                } else {
                    self.$store.dispatch('changeCustomer', {sex: parseInt(self.sex)});
                }

                self.back();
            }
        },

        components: {
            'base-layout': BaseLayout
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>