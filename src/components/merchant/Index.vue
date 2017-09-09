<template>
    <layout :progressing="refreshing" :toast="toast">
      <mu-raised-button label="全不选" @click="onUnselectAll"/>
      <mu-table multiSelectable enableSelectAll ref="table">
        <mu-thead>
          <mu-tr>
            <mu-th>ID</mu-th>
            <mu-th>商标</mu-th>
            <mu-th>名称</mu-th>
            <mu-th>介绍</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
            <mu-tr>
                <mu-td>1</mu-td>
                <mu-td>1</mu-td>
                <mu-td>John Smith</mu-td>
                <mu-td>Employed</mu-td>
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
