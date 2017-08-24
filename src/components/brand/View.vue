<template>
    <base-layout :progressing="refreshing" :toast="toast">
        <mu-appbar :title="title" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
            <mu-icon-button icon="clear" slot="right" @click="openDestroySheet" v-if="me && brand && me.id == brand.customer_id"/>
            <mu-icon-button icon="refresh" slot="right" @click="onRefresh" />
        </mu-appbar>

        <div style="text-align:center;margin:1px 0 1px 0">
            <mu-raised-button primary label="发布活动" @click="openSheet" v-if="merchants.length > 0"/>
            <mu-raised-button primary label="新建商户" @click="onNewMerchant"/>
        </div>

        <mu-list v-if="merchants.length > 0">
            <mu-list-item v-for="merchant in merchants" :key="merchant.id" :title="merchant.title">
                <mu-avatar :src="merchant.logo" slot="leftAvatar" @click='onChange(merchant)'/>
                <span slot="describe">{{merchant.address}}</span>
                <mu-checkbox name="merchants" v-model="selected" :nativeValue="merchant.id" slot="right"/>
            </mu-list-item>
        </mu-list>

        <mu-bottom-sheet :open="sheet" @close="closeSheet">
            <mu-raised-button label="发布满减活动" default @click="onNewActivity(0)" style="width:100%;height:45px"/>
            <mu-raised-button label="发布满折活动" default @click="onNewActivity(1)" style="width:100%;height:45px"/>
            <mu-raised-button label="再想一下" @click="closeSheet" style="width:100%;height:45px"/>
        </mu-bottom-sheet>

        <mu-bottom-sheet :open="destroySheet" @close="closeDestroySheet">
            <mu-raised-button label="删除品牌" primary @click="onDestroyBrand" style="width:100%;height:45px"/>
            <mu-raised-button label="再想一下" @click="closeDestroySheet" style="width:100%;height:45px"/>
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
            'base-layout': BaseLayout,
            'merchant-list': MerchantList
        }
    }
</script>
