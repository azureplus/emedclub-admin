<template>
    <layout :progressing="refreshing" :toast="toast" activeIndex="/medicine/index">
        <mu-content-block>
            <mu-raised-button label="增加" @click="onAdd"/>

            <mu-table ref="table" :showCheckbox="false" @rowClick="onView">
                <mu-thead>
                    <mu-tr>
                        <mu-th>企业</mu-th>
						<mu-th>名称</mu-th>
                        <mu-th>分类</mu-th>
						<mu-th>靶向</mu-th>
						<mu-th>状态</mu-th>
                    </mu-tr>
                </mu-thead>
                <mu-tbody>
                    <mu-tr v-for="medicine in medicines" :key="medicine.id">
                        <mu-td>{{medicine.merchant}}</mu-td>
                        <mu-td>{{medicine.name}}</mu-td>
						<mu-td>{{medicine.category}}</mu-td>
						<mu-td>{{medicine.target}}</mu-td>
						<mu-td>{{medicine.stateName}}</mu-td>
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
                medicines: [],
                total: 0,
                current: 1,
            }
        },

        methods: {
            onInitialize() {
                var self = this;

                api.count("Medicine").then(function(total){
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
                this.goto("/medicine/new")
            },

            onView: function(index) {
                this.goto("/medicine/view/" + this.medicines[index].id)
            },

            onPage(page) {
                this.current = page;
                this.wait(this.loadData())
            },

            loadData: function() {
                var self = this;

                return api.query("Medicine", {}, {limit: 20, offset: 20 * (self.current - 1)}).then(function(medicines){
                    self.medicines = medicines
                })
            }
        },

        components: {
            'layout': Layout,
        }
    }
</script>