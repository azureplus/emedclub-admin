<template>
    <layout :progressing="refreshing" :toast="toast" activeIndex="/information/index">
        <mu-content-block>
            <mu-raised-button label="增加" @click="onAdd"/>

            <mu-table ref="table" :showCheckbox="false" @rowClick="onView">
                <mu-thead>
                    <mu-tr>
                        <mu-th>照片</mu-th>
                        <mu-th>标题</mu-th>
                        <mu-th>分类</mu-th>
                        <mu-th>价格</mu-th>
                    </mu-tr>
                </mu-thead>
                <mu-tbody>
                    <mu-tr v-for="information in informations" :key="information.id">
                        <mu-td><img :src="information.media" width=100 height=100/></mu-td>
                        <mu-td>{{information.title}}</mu-td>
                        <mu-td>{{information.categoryName}}</mu-td>
                        <mu-td>{{information.price}}</mu-td>
                    </mu-tr>
                </mu-tbody>
            </mu-table>
            
            <mu-pagination :total="total" :current="current" @pageChange="onPage"></mu-pagination>
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

        data () {
            return {
                informations: [],
                total: 0,
                current: 1,
            }
        },

        methods: {
            onInitialize() {
                var self = this;

                api.count("Information").then(function(total){
                    self.total = total
                    self.current = 1
                    self.wait(self.loadData())
                })
            },

            onUpdate() {
                this.onInitialize()
            },

            onRefresh() {
                this.wait(this.loadData())
            },

            onAdd: function(index) {
                this.goto("/information/new")
            },

            onView: function(index) {
                this.goto("/information/view/" + this.informations[index].id)
            },

            onPage(page) {
                this.current = page;
                this.wait(this.loadData())
            },

            loadData: function() {
                var self = this;

                return api.query("Information", {}, {limit: 20, offset: 20 * (self.current - 1)}).then(function(informations){
                    self.informations = informations
                })
            }
        },

        components: {
            'layout': Layout,
        }
    }
</script>