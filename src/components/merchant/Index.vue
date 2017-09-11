<template>
    <layout :progressing="refreshing" :toast="toast" @on-add="onAdd" @on-refresh="onRefresh">
      <mu-raised-button label="全不选" @click="onUnselectAll"/>
      <mu-table multiSelectable enableSelectAll ref="table">
        <mu-thead>
          <mu-tr>
            <mu-th>ID</mu-th>
            <mu-th>商标</mu-th>
            <mu-th>名称</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
            <mu-tr v-for="merchant in merchants">
                <mu-td>{{merchant.id}}</mu-td>
                <mu-td><img src="{{merchant.logo}}" width=100 height=100/></mu-td>
                <mu-td>{{merchant.name}}</mu-td>
            </mu-tr>
        </mu-tbody>
      </mu-table>
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
            }
        },

        methods: {
            onInitialize() {
                var self = this;

                self.merchants = [];
                self.wait(self.loadData())
            },

            onUpdate() {
                this.onInitialize()
            },

            onRefresh() {
                this.wait(this.loadData())
            },

            onAdd: function() {
                this.goto("/merchant/new")
            },

            onUnselectAll: funtion() {
                this.$refs.table.unSelectAll()
            },

            loadData: function() {
                var self = this;

                return api.query("Merchant", {}).then(function(merchants){
                    self.merchants = merchants
                })
            }
        },

        components: {
            'layout': Layout,
        }
    }
</script>
