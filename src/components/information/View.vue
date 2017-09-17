<template>
    <layout :progressing="refreshing" :toast="toast" :destroySheet="destroySheet" @on-destroy="onDestroy" @on-cancel-destroy="onCancelDestroy">
        <mu-content-block v-if="information">
            <mu-raised-button label="修改" @click="onEdit"/>
            <mu-raised-button label="删除" @click="canDestroy"/>
            <mu-raised-button label="发布广告" @click="onNewPoster"/>

            <mu-table multiSelectable enableSelectAll>
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
                <mu-tbody v-else>
                    <mu-td>报名人数</mu-td>
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

        <mu-content-block v-if="information && information.category <= 1">
            <mu-sub-header>门票</mu-sub-header>
            <mu-table ref="table" :showCheckbox="false">
                <mu-thead>
                    <mu-tr>
                        <mu-th>名称</mu-th>
                        <mu-th>价格</mu-th>
                        <mu-th></mu-th>
                    </mu-tr>
                </mu-thead>
                <mu-tbody>
                    <mu-tr v-for="ticket in information.tickets" :key="ticket.id">
                        <mu-td>{{ticket.name}}</mu-td>
                        <mu-td>{{ticket.price}}</mu-td>
                        <mu-td><mu-raised-button label="删除" @click="onDestroyTicket(ticket.id)"/></mu-td>
                    </mu-tr>
                </mu-tbody>
            </mu-table>

            <mu-list>
                <mu-list-item>
                    <mu-text-field label="名称" v-model="name" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-text-field label="价格" v-model="price" type="number" fullWidth />
                </mu-list-item>
                <mu-list-item>
                    <mu-raised-button label="增加门票" fullWidth @click="onAddTicket"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'
    import Ticket from '../../model/Ticket'

    export default {
        mixins: [Mixin],

        data() {
            return {
                information: null,

                destroySheet: false,

                name: '',
                price: 100,
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

            onNewPoster: function(){
                this.goto("/poster/new?entity_type=Information&entity_id=" + this.information.id)
            },

            onAddTicket: function() {
                var self = this

                var ticket = new Ticket()
                ticket.information_id = self.information.id
                ticket.name = self.name
                ticket.price = self.price
                api.save(ticket).then(function(){
                    if (!self.information.tickets) {
                        self.information.tickets = []
                    }

                    self.information.tickets.push(ticket)
                })
            },

            onDestroyTicket: function(ticketId) {
                var self = this

                for(var i = 0; i < self.information.tickets.length; i++) {
                    if (self.information.tickets[i].id === ticketId) {
                        self.wait(api.destroy(self.information.tickets[i])).then(function(){
                            self.information.tickets.splice(i, 1)
                        })

                        break;
                    }
                }
            },
        },

        components: {
            'layout': Layout,
        }
    }
</script>