<template>
    <base-layout :progressing="refreshing" :toast="toast">
        <mu-appbar :title="title" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
            <mu-icon-button icon="add" slot="right" @click="onNewMerchant" />
            <mu-icon-button icon="refresh" slot="right" @click="onRefresh" />
        </mu-appbar>

        <mu-list>
            <mu-list-item>
                <mu-raised-button label="发布活动" fullWidth @click="openSheet" v-if="merchants.length > 0"/>
            </mu-list-item>                       
        </mu-list>

        <merchant-list :merchants="merchants"/>

        <mu-bottom-sheet :open="sheet" @close="closeSheet">
            <mu-raised-button label="发布满减活动" primary @click="onNewActivity(0)" style="width:100%;height:45px"/>
            <mu-raised-button label="发布满折活动" secondary @click="onNewActivity(1)" style="width:100%;height:45px"/>
            <mu-raised-button label="再想一下" @click="closeSheet" style="width:100%;height:45px"/>
        </mu-bottom-sheet>
    </base-layout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import MerchantList from '../merchant/List'
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
                merchants: [],
                loading: false,
                height: 100,
                hasMore: true,
                sheet: false
            }
        },

        methods: {
            onInitialize() {
                var self = this;

                self.merchants = [];
                self.hasMore   = true;

                api.queryOne("Brand", self.$route.query.brand_id).then(function(brand){
                    self.title = brand.name
                })

                self.wait(self.loadData())
            },

            onUpdate() {
                this.onInitialize()
            },

            onRefresh() {
                this.wait(this.loadData())
            },

            onNewMerchant: function() {
                this.goto("/merchant/new?brand_id=" + this.$route.query.brand_id)
            },

            closeSheet () {
                this.sheet = false
            },

            openSheet() {
                this.sheet = true;
            },

            onNewActivity: function(category) {
                this.sheet = false;
                this.goto("/activity/new?category=" + category + "&brand_id=" + this.$route.query.brand_id);
            },

            loadData: function() {
                var self = this;

                return api.query("Merchant", {customer_id: self.me.id, brand_id: self.$route.query.brand_id}).then(function(merchants){
                    self.merchants = merchants
                    self.hasMore   = merchants.length == 20;
                })
            }
        },

        components: {
            'base-layout': BaseLayout,
            'merchant-list': MerchantList
        }
    }
</script>
