<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar :title="title" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
            <mu-icon-button v-if="activity && activity.state != 2 && activity.customer_id == me.id" icon="stop" slot="right" @click="openSheet" />
        </mu-appbar>

        <div v-if="activity">
            <mu-row gutter v-if="activity" style="width:96%;margin-left:2%">
                <mu-col width="25">
                    <img :src="activity.merchant.logo" style="width:100%;margin-left:10px;margin-top:10px;"/>
                </mu-col>
                <mu-col width="75">
                    <div style="margin-top:10px;margin-left:10px;">
                        <p style="font-size:larger;padding-bottom:5px">{{activity.merchant.title}}</p>
                        <p style="padding-bottom:3px">{{activity.duration()}}</p>
                        <p>{{activity.toString()}}</p>
                    </div>
                </mu-col>
            </mu-row>

            <mu-divider/>
            <mu-list>
                <mu-list-item>
                    <mu-raised-button label="我要拼单" fullWidth @click="onNewContract"/>
                </mu-list-item>                       
            </mu-list>

            <contract-list :contracts="contracts" header="拼单"/>
            <mu-list>
                <mu-list-item title="所有拼单" @click="onListContract">
                    <mu-icon slot="right" value="keyboard_arrow_right"/>
                </mu-list-item>
            </mu-list>

            <mu-divider/>

            <evaluation-list :evaluations="evaluations" header="评价"/>
        </div>

        <mu-bottom-sheet :open="sheet" @close="closeSheet">
            <mu-raised-button label="确定要停止活动" primary @click="onStopActivity" style="width:100%;height:45px"/>
            <mu-raised-button label="再想一下" @click="closeSheet" style="width:100%;height:45px"/>
        </mu-bottom-sheet>
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import ContractList from '../contract/List'
    import EvaluationList from '../evaluation/List'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data() {
            return {
                title: '活动',
                activity: null,
                contracts: [],
                evaluations: [],
                sheet: false
            }
        },

        computed: mapGetters({
            me: 'me',
        }),

        methods: {
            onInitialize: function() {
                this.onUpdate();
            },

            onUpdate() {
                let self = this;

                self.activity = null;
                self.wait(api.queryOne("Activity", self.$route.params.id)).then(function(activity){
                    self.activity = activity;
                    self.share();

                    self.wait(api.query("Contract", {activity_id: activity.id, state: [1, 2, 3, 4, 5]})).then(function(contracts){
                        self.contracts = contracts;
                    })

                    self.wait(api.query("Evaluation", {activity_id: activity.id})).then(function(evaluations){
                        self.evaluations = evaluations;
                    })

                    self.title = self.activity.categoryName
                });
            },

            closeSheet () {
                this.sheet = false
            },

            openSheet(label) {
                this.sheet = true;
            },

            onNewContract() {
                this.goto('/contract/new?activity_id=' + this.activity.id)
            },

            onStopActivity() {
                this.activity.state = 2;
                this.wait(api.save(this.activity));
            },

            share() {
                if (this.activity) {
                    this.$channel.setShareContent(
                        '消拼', // 分享标题
                        '我加入了这个优惠活动，' + this.activity.toString() + '，还不快来。', // 分享描述
                        'https://www.xpin1.com/shopping/#/activity/' + this.activity.id + '?redirect=%2Fhome&referee=' + this.me.id , // 分享链接
                        'https://www.xpin1.com/shopping/images/logo.png' // 分享图标
                    );
                }
            },

            onListContract() {
                this.goto("/contracts?activity_id=" + this.activity.id)
            }
        },

        components: {
            'baselayout': BaseLayout,
            'contract-list': ContractList,
            'evaluation-list': EvaluationList
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .mu-td, .mu-th {
        padding-left: 12px;
        padding-right: 12px;
        text-align: left;
    }
</style>