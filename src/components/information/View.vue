<template>
    <layout :progressing="refreshing" :toast="toast">
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        computed: mapGetters({
            me: 'me'
        }),

        data () {
            return {
                title: '品牌',
                brand: null,
                merchants: [],
                selected: [],
                hasMore: true,
                sheet: false,
                destroySheet: false
            }
        },

        methods: {
            onInitialize() {
                var self = this;

                self.merchants = [];
                self.hasMore   = true;

                api.queryOne("Brand", self.$route.params.id).then(function(brand){
                    self.brand = brand

                    self.title = brand.name

                    self.wait(self.loadData())
                })
            },

            onUpdate() {
                this.onInitialize()
            },

            onRefresh() {
                this.wait(this.loadData())
            },

            closeSheet() {
                this.sheet = false
            },

            openSheet() {
                this.sheet = true;
            },

            closeDestroySheet() {
                this.destroySheet = false
            },

            openDestroySheet() {
                this.destroySheet = true;
            },

            onNewMerchant() {
                this.goto("/merchant/new?brand_id=" + this.brand.id)
            },

            onNewActivity(category) {
                this.sheet = false;

                this.$router.push({ path: '/activity/new', query: { category: category, merchant_id: this.selected }})
            },

            onDestroyBrand() {
                var self = this;

                self.destroySheet = false;
                self.wait(api.destroy(self.brand)).then(function(){
                    self.back()
                })
            },

            onChange(merchant) {
                this.goto(merchant.url)
            },

            loadData() {
                var self = this;

                if (self.me.role == 1) {
                    var conditions = {brand_id: self.brand.id}
                } else {
                    var conditions = {customer_id: self.me.id, brand_id: self.brand.id}
                }

                return api.query("Merchant", conditions).then(function(merchants){
                    self.selected = []
                    for(var i = 0; i < merchants.length; i++) {
                        self.selected.push(merchants[i].id)
                    }
                    
                    self.merchants = merchants
                    self.hasMore   = merchants.length == 20;
                })
            }
        },

        components: {
            'layout': Layout,
        }
    }
</script>
