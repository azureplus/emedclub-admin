<template>
    <layout :progressing="refreshing" :toast="toast">
        <mu-content-block>
            <mu-table ref="table" :showCheckbox="false" @rowClick="onView">
                <mu-thead>
                    <mu-tr>
                        <mu-th>图片</mu-th>
                        <mu-th>标题</mu-th>
                    </mu-tr>
                </mu-thead>
                <mu-tbody>
                    <mu-tr v-for="poster in posters" :key="poster.id">
                        <mu-td><img :src="poster.media" width=100 height=100/></mu-td>
                        <mu-td>{{poster.title}}</mu-td>
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
                posters: [],
                total: 0,
                current: 1,
            }
        },

        methods: {
            onInitialize() {
                var self = this;

                api.count("Poster").then(function(total){
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
                this.goto("/poster/new")
            },

            onView: function(index) {
                this.goto("/poster/view/" + this.posters[index].id)
            },

            onPage(page) {
                this.current = page;
                this.wait(this.loadData())
            },

            loadData: function() {
                var self = this;

                return api.query("Poster", {}, {limit: 20, offset: 20 * (self.current - 1)}).then(function(posters){
                    self.posters = posters
                })
            }
        },

        components: {
            'layout': Layout,
        }
    }
</script>