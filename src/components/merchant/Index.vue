<template>
    <layout :progressing="refreshing" :toast="toast" @on-add="onAdd" @on-refresh="onRefresh">
        <mu-table ref="table" selectable="false" showCheckbox="false" rowClick="onView">
            <mu-thead>
                <mu-tr>
                    <mu-th>ID</mu-th>
                    <mu-th>商标</mu-th>
                    <mu-th>名称</mu-th>
                </mu-tr>
            </mu-thead>
            <mu-tbody>
                <mu-tr v-for="merchant in merchants" @>
                    <mu-td>{{merchant.id}}</mu-td>
                    <mu-td><img src="{{merchant.logo}}" width=100 height=100/></mu-td>
                    <mu-td>{{merchant.name}}</mu-td>
                </mu-tr>
            </mu-tbody>
        </mu-table>
        
        <mu-pagination :total="total" :current="current" @pageChange="onPage"></mu-pagination>
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

                Api.count("Merchant").then(function(total){
                    self.total = total
                    selr.current = 1

                    self.wait(self.loadData(0))
                })
            },

            onUpdate() {
                this.onInitialize()
            },

            onRefresh() {
                this.wait(this.loadData(0))
            },

            onView: function(index) {
                this.goto("/merchant/view/" + this.merchants[index].id)
            },

            onUnselectAll: funtion() {
                this.$refs.table.unSelectAll()
            },

            onPage(page) {
                this.wait(this.loadData((page - 1) * 20 ))
            },

            loadData: function(offset) {
                var self = this;

                return api.query("Merchant", {}, {limit: 20, offset: offset}).then(function(merchants){
                    self.merchants = merchants
                })
            }
        },

        components: {
            'layout': Layout,
        }
    }
</script>
