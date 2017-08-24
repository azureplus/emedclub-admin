<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar title="缴保证金" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-list>
            <mu-list-item v-if="deposit">
                <mu-table :showCheckbox="false">
                    <mu-tbody>
                        <mu-tr>
                            <mu-td>时间</mu-td>
                            <mu-td>{{ pretty(deposit.create_time) }}</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>金额</mu-td>
                            <mu-td>{{deposit.money}}元</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>状态</mu-td>
                            <mu-td>{{ deposit.stateName }}</mu-td>
                        </mu-tr>
                        <mu-tr v-if="deposit.state == 2">
                            <mu-td>失败原因</mu-td>
                            <mu-td>{{ deposit.reason }}</mu-td>
                        </mu-tr>
                    </mu-tbody>
                </mu-table>
            </mu-list-item>
            <mu-divider/>
        </mu-list>
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data () {
            return {
                deposit: null,
            }
        },

        methods: {
            onInitialize: function() {
                let self = this;

                self.wait(api.queryOne("Deposit", self.$route.params.id)).then(function(deposit){
                    self.deposit = deposit;
                })
            },
        },

        components: {
            'baselayout': BaseLayout
        }
    }
</script>