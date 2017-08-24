<template>
    <base-layout :progressing="refreshing" :toast="toast" :loading="loading" @on-load-more="onLoadMore">
        <mu-appbar :title="title" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
            <mu-icon-button icon="add" slot="right" @click="onNewBrand" />
            <mu-icon-button icon="refresh" slot="right" @click="onRefresh" />
        </mu-appbar>

        <brand-list :brands="brands"/>
    </base-layout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import BrandList from '../brand/List'
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
                brands: [],
                loading: false,
                hasMore: true,
                title: '我的品牌'
            }
        },

        methods: {
            onInitialize() {
                this.wait(this.loadData(0))

                if (this.me.role == 1) {
                    this.title = "所有品牌"
                } else {
                    this.title = "我的品牌"
                }
            },

            onUpdate() {
                this.onInitialize()
            },
            
            onRefresh: function() {
                this.wait(this.loadData(0))
            },

            onLoadMore: function() {
                var self = this;

                if (self.loading === false && self.hasMore) {
                    self.loading = true;
                    self.loadData(self.brands.length).then(function(){
                        self.loading = false;
                    }, function(err){
                        self.loading = false;
                    })
                }
            },

            onNewBrand: function() {
                this.goto("/brand/new")
            },

            loadData: function(offset) {
                var self = this;

                if (self.me.role == 1) {
                    var conditions = {};
                } else {
                    var conditions = {customer_id: self.me.id};
                }
                return api.query("Brand", conditions, {limit:20, offset:offset}).then(function(brands){
                    if (offset > 0) {
                        self.brands = self.brands.concat(brands)
                    } else {
                        self.brands = brands
                    }

                    self.hasMore = brands.length == 20;
                })
            }
        },

        components: {
            'base-layout': BaseLayout,
            'brand-list': BrandList
        }
    }
</script>