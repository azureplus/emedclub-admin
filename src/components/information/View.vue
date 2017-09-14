<template>
    <layout :progressing="refreshing" :toast="toast" :destroySheet="destroySheet" @on-destroy="onDestroy" @on-cancel-destroy="onCancelDestroy">
        <mu-content-block>
            <mu-raised-button label="修改" @click="onEdit"/>
            <mu-raised-button label="删除" @click="canDestroy"/>
            <mu-raised-button label="发布广告" @click="onNewPoster"/>

            <mu-table multiSelectable enableSelectAll ref="table" v-if="information">
                <mu-tbody>
                    <mu-td style="width:20%">ID</mu-td>
                    <mu-td>{{information.id}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>标题</mu-td>
                    <mu-td>{{information.title}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>作者</mu-td>
                    <mu-td>{{information.author}}</mu-td>
                </mu-tbody>                
                <mu-tbody>
                    <mu-td>类别</mu-td>
                    <mu-td>{{information.categoryName}}</mu-td>
                </mu-tbody>
                <mu-tbody v-if="information.category > 1">
                    <mu-td>价格</mu-td>
                    <mu-td>{{information.price}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>照片</mu-td>
                    <mu-td><img :src="information.media" width=100 height=100/></mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>内容</mu-td>
                    <mu-td v-html="information.content"></mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>点赞</mu-td>
                    <mu-td>{{information.total_likes}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>浏览</mu-td>
                    <mu-td>{{information.total_viewrs}}</mu-td>
                </mu-tbody>
                <mu-tbody>
                    <mu-td>评论</mu-td>
                    <mu-td>{{information.total_comments}}</mu-td>
                </mu-tbody>
            </mu-table>
        </mu-content-block>
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data() {
            return {
                information: null,

                destroySheet: false,
            }
        },

        methods: {
            onInitialize: function() {
                var self = this;

                api.queryOne("Information", self.$route.params.id).then(function(model){
                    self.information = model;
                })
            },

            onUpdate: function() {
                this.onInitialize();
            },

            canDestroy: function() {
                this.destroySheet = true;
            },

            onCancelDestroy: function() {
                this.destroySheet = false;
            },

            onDestroy: function() {
                var self = this

                self.destroySheet = false;
                self.wait(api.destroy(self.information)).then(function(){
                    self.back()
                })
            },

            onEdit: function() {
                this.goto("/information/edit/" + this.information.id)
            },

            onNewPoster: function{
                this.goto("/poster/new?entity_type=Information&entity_id=" + this.information.id)
            }
        },

        components: {
            'layout': Layout,
        }
    }
</script>