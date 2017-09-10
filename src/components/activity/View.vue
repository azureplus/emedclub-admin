<template>
    <baselayout :progressing="refreshing" :toast="toast">
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
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