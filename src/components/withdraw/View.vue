<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar title="退保证金" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-list>
            <mu-list-item v-if="withdraw">
                <mu-table :showCheckbox="false">
                    <mu-tbody>
                        <mu-tr>
                            <mu-td style="width:30%">时间</mu-td>
                            <mu-td>{{ pretty(withdraw.create_time) }}</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>开户银行</mu-td>
                            <mu-td>{{ withdraw.bank }}</mu-td>
                        </mu-tr>
                         <mu-tr>
                            <mu-td>开户名称</mu-td>
                            <mu-td>{{ withdraw.bank_account_name }}</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>银行账号</mu-td>
                            <mu-td>{{ withdraw.account }}</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>金额</mu-td>
                            <mu-td>{{withdraw.money}}元</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>状态</mu-td>
                            <mu-td>{{ withdraw.stateName }}</mu-td>
                        </mu-tr>
                        <mu-tr v-if="withdraw.state == 2">
                            <mu-td>失败原因</mu-td>
                            <mu-td>{{ withdraw.reason }}</mu-td>
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
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data () {
            return {
                withdraw: null,
            }
        },

        methods: {
            onInitialize: function() {
                let self = this;

                self.wait(api.queryOne("Withdraw", self.$route.params.id)).then(function(withdraw){
                    self.withdraw = withdraw;
                })
            },
        },

        components: {
            'baselayout': BaseLayout
        }
    }
</script>