<template>
    <layout :progressing="refreshing" :toast="toast" activeIndex="/merchant/index">
        <mu-content-block>
            <mu-raised-button label="增加" @click="onAdd"/>

            <mu-table ref="table" :showCheckbox="false" @rowClick="onView">
                <mu-thead>
                    <mu-tr>
                        <mu-th>商标</mu-th>
                        <mu-th>名称</mu-th>
                    </mu-tr>
                </mu-thead>
                <mu-tbody>
                    <mu-tr v-for="merchant in merchants" :key="merchant.id">
                        <mu-td><img :src="merchant.logo" width=100 height=100/></mu-td>
                        <mu-td>{{merchant.name}}</mu-td>
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
                merchants: [],
                total: 0,
                current: 1,
            }
        },

        methods: {
            onInitialize() {
                var self = this;

                api.count("Merchant").then(function(total){
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
                this.goto("/merchant/new")
            },

            onView: function(index) {
                this.goto("/merchant/view/" + this.merchants[index].id)
            },

            onPage(page) {
                this.current = page;
                this.wait(this.loadData())
            },

            loadData: function() {
                var self = this;

                return api.query("Merchant", {}, {limit: 20, offset: 20 * (self.current - 1)}).then(function(merchants){
                    self.merchants = merchants
                })
            }
        },

        components: {
            'layout': Layout,
        }
    }
</script>
