<template>
    <layout :refreshing="refreshing" :toast="toast" :refresh="true" @on-refresh="onRefresh" :loading="loading" @on-load-more="onLoadMore">
        <div style="text-align:center;margin:1px 0 1px 0">
            <mu-raised-button primary label="服饰鞋包" @click="onChangeCategory(0)" v-if="category != 0"/>
            <mu-raised-button primary label="汽车美容" @click="onChangeCategory(1)" v-if="category != 1"/>
            <mu-raised-button primary label="水果生鲜" @click="onChangeCategory(2)" v-if="category != 2"/>
            <mu-raised-button primary label="美容美发" @click="onChangeCategory(3)" v-if="category != 3"/>
        </div>
        <mu-list @change="onChange">
            <mu-sub-header>{{["服饰鞋包", '汽车美容', '水果生鲜', '美容美发'][category]}}</mu-sub-header>
			<mu-list-item v-for="merchant in merchants" :key="merchant.id" :title="merchant.title" :value='url(merchant)'>
				<mu-avatar :src="merchant.logo" slot="leftAvatar"/>
				<span slot="describe">
					<span style="color: rgba(0, 0, 0, .87)">{{ merchant.latest_activity }}</span><br/>
					<span style="font-size:small">{{ pretty(merchant.latest_activity_begin_time) }}到{{ pretty(merchant.latest_activity_end_time) }}</span>
				</span>
				<span slot="right" v-if="location">{{ distance(merchant) }}</span>
			</mu-list-item>
		</mu-list>
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'
    import api from '../../api'
    import Map from '../../util/map'
    
    export default {
        mixins: [Mixin],

        data () {
            return {
                loading: false,
                refreshing: false,

                category: 0,
                merchants: [],
                location: null,
                hasMore: true
            }
        },

        methods: {
            onInitialize: function() {
                this.onRefresh();
            },

            onRefresh: function() {
                this.wait(this.loadData(0))
            },

            onLoadMore: function() {
                var self = this;

                if (self.loading == false && self.hasMore) {
                    self.loading = true;

                    self.loadData(self.merchants.length).then(function(){
                        self.loading = false;
                    }, function(err){
                        self.showToast(err.message);

                        self.loading = false;
                    })
                }
            },

            url: function(merchant) {
                return "/activities?merchant_id=" + merchant.id
            },

            onChange: function(val) {
                this.$router.push({path: val});
            },

            onChangeCategory: function(category) {
                if (this.category != category) {
                    this.merchants = []
                    this.category = category;
                    this.wait(this.loadData(0))
                }
            },

			distance: function(merchant) {
				var pt = new BMap.Point(merchant.location[0], merchant.location[1]);
				return Map.distance(this.location, pt);
			},

            loadData: function(offset) {
                var self = this;

                var filters = {offset: offset, limit: 20};
                return api.queryNearby("Merchant", null, {category: self.category, total_activities: {$gt: 0}}, filters).then(function(data){
                    self.location = data.location;
                    if (offset == 0) {
                        self.merchants = data.models;
                    } else {
                        self.merchants = self.merchants.concat(data.models);
                    }

                    self.hasMore = data.models.length == filters.limit;
                })
            },
        },

        components: {
            'layout': Layout,
        }
    }
</script>