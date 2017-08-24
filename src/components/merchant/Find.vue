<template>
    <div class='infinite-scroll' :style="{height: height + 'px'}">
        <base-layout :progressing="refreshing" :toast="toast">
            <mu-appbar title="选择商户" slot="header">
                <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
            </mu-appbar>

            <mu-list>
                <mu-list-item>
                    <mu-text-field v-model="query" fullWidth />
                    <mu-icon value="search" slot="right" @click="onFind" :size="32"/>
                </mu-list-item>
            </mu-list>

            <merchant-list :merchants="merchants" :location="location"/>

            <mu-list v-if="!hasMore">
                <mu-list-item>
                    <mu-raised-button label="没有找到商户？新建一个！" fullWidth @click="onNewMerchant"/>
                </mu-list-item>
            </mu-list>
        </base-layout>

        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="onLoadMore"/>
    </div>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import MerchantList from '../merchant/List'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data () {
            return {
                query: "",
                merchants: [],
                loading: false,
                scroller: null,
                hasMore: true,
                location: null,
                height:100
            }
        },

        methods: {
            onInitialize() {
                this.scroller = this.$el;

                this.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            },

            onFind: function() {
                this.page = 0;
                this.hasMore = true;
                this.merchants = [];
                this.loadData(0)
            },

            onLoadMore: function() {
                var self = this;

                if (self.loading == false && self.hasMore == true) {
                    self.loading = true;
                    self.loadData(self.merchants.length).then(function(){
                        self.loading = false;
                    }, function(err){
                        self.loading = false;
                    })
                }
            },

            onNewMerchant: function() {
                this.goto("/merchant/new")
            },

            loadData: function(offset) {
                var self = this;

                return self.wait(api.queryNearby("Merchant", null, {name: {'$regex': self.query, '$options': "$i"}}, {limit: 20, offset: offset})).then(function(data){
                    self.location = data.location;

                    if (data.models.length > 0) {
                        if (offset == 0) {
                            self.merchants = data.models;
                        } else {
                            self.merchants = self.merchants.concat(data.models)
                        }

                        if (data.models.length == 20) {
                            self.hasMore = true;
                        } else {
                            self.hasMore = false;
                        }
                    } else {
                        self.hasMore = false;
                    }
                })                
            }
        },

        components: {
            'base-layout': BaseLayout,
            'merchant-list': MerchantList
        }
    }
</script>
