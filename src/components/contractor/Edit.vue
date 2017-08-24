<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar title="修改订单" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-content-block v-if="contractor">
            <mu-list>
                <mu-list-item>
                    <mu-text-field label="购买金额" type=number v-model="contractor.money" :errorText="validation.firstError('contractor.money')" fullWidth />
                </mu-list-item>

                <mu-list-item v-if="$route.query.category == 1">
                    <mu-text-field label="购买数量" type=number v-model="contractor.quantity" :errorText="validation.firstError('contractor.quantity')" fullWidth />
                </mu-list-item>

                <mu-list-item>
                    <mu-raised-button label="修改订单" fullWidth @click="onJoin"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import Contractor from '../../model/Contractor'
    import api from '../../api'
    import SimpleVueValidation from 'simple-vue-validator'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data() {
            return {
                contractor: null,
            }
        },

        computed: mapGetters({
            me: 'me'
        }),

        validators: {
            'contractor.money': function (value) {
                return SimpleVueValidation.Validator.value(value).required().integer().greaterThan(0);
            },
            'contractor.quantity': function (value) {
                return SimpleVueValidation.Validator.value(value).required().integer().greaterThan(0);
            }
        },

        methods: {
            onInitialize: function() {
                var self = this;

                self.wait(api.queryOne("Contractor", self.$route.params.id)).then(function(contractor){
                    self.contractor = contractor
                })
            },

            onUpdate() {
                this.onInitialize();
            },
            
            onJoin: function() {
                var self = this;

                self.$validate().then(function (success) {
                    if (success) {
                        self.wait(api.save(self.contractor)).then(function(c){                           
                            self.back();
                        })
                    }
                });
            },
        },

        components: {
            'baselayout': BaseLayout
        }
    }
</script>