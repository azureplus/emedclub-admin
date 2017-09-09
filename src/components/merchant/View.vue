<template>
    <base-layout :progressing="refreshing" :toast="toast">
    </base-layout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'
    import Merchant from '../../model/Merchant'

    export default {
        mixins: [Mixin],

        computed: mapGetters({
            me: 'me'
        }),

        data() {
            return {
                merchant: null,
                activities: [],
                title: '',
                sheet: false
            }
        },

        methods: {
            onInitialize: function() {
                var self = this;

                self.merchant = null;
                self.activities = [];
                self.title = "商户"

                api.queryOne("Merchant", self.$route.params.id).then(function(model){
                    self.merchant = model;

                    self.title = self.merchant.name

                    self.wait(api.query("Activity", {merchant_id: model.id})).then(function(activities){
                        self.activities = activities;
                    });
                })
            },

            onUpdate: function() {
                this.onInitialize();
            },

            closeSheet () {
                this.sheet = false
            },

            openSheet() {
                this.sheet = true;
            },

			onNewActivity: function(category) {
				this.sheet = false;
				this.goto("/activity/new?category=" + category + "&merchant_id=" + this.merchant.id);
			},

            onCopyMerchant: function() {
                this.$router.replace({
                    path: "/merchant/new", 
                    query: {name: this.merchant.name, logo: this.merchant.logo, area: this.merchant.area}
                })
            },

            onShowMap: function() {
                this.$router.push({path: "/path", query:{address: this.merchant.address}})
            }
        },

        components: {
            'base-layout': BaseLayout,
        }
    }
</script>