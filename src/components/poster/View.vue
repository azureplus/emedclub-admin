<template>
    <layout :progressing="refreshing" :toast="toast">
        <mu-appbar :title="title" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
            <mu-icon-button icon="content_copy" slot="right" @click="onCopyMerchant" />
        </mu-appbar>

        <mu-row gutter v-if="merchant" style="width:96%;margin-left:2%">
            <mu-col width="25">
                <img :src="merchant.logo" style="width:100%;margin-left:10px;margin-top:10px;"/>
            </mu-col>
            <mu-col width="75">
                <div style="margin-top:10px;margin-left:10px;">
                    <p style="font-size:larger;">{{merchant.title}}<mu-icon value="map" style="float: right;" @click="onShowMap"/></p>
                    <p style="padding-bottom:2px">{{merchant.categoryName}}</p>
                    <p style="padding-bottom:2px">{{merchant.address}}</p>
                </div>
            </mu-col>
        </mu-row>

        <mu-divider />
        <mu-list>
            <mu-list-item>
                <mu-raised-button label="发布活动" fullWidth @click="openSheet" v-if="merchant"/>
            </mu-list-item>                       
        </mu-list>
        <activity-list :activities="activities"/>

		<mu-bottom-sheet :open="sheet" @close="closeSheet">
            <mu-raised-button label="发布满减活动" default @click="onNewActivity(0)" style="width:100%;height:45px"/>
			<mu-raised-button label="发布满折活动" default @click="onNewActivity(1)" style="width:100%;height:45px"/>
            <mu-raised-button label="再想一下" @click="closeSheet" style="width:100%;height:45px"/>
        </mu-bottom-sheet>
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'
    import Merchant from '../../model/Merchant'
    import ActivityList from '../activity/List'

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
            'layout': Layout,
            'activity-list': ActivityList
        }
    }
</script>