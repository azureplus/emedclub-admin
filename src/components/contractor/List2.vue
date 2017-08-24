<template>
    <mu-list @change="onChange" v-if="contracts.length > 0">
        <mu-sub-header v-if="header && header.length > 0">{{header}}</mu-sub-header>
        <mu-list-item v-for="contract in contracts" :key="contract.id" :title="contract.title" :value='contract.url'>
            <mu-avatar :src="contract.merchant.logo" slot="leftAvatar"/>
            <span slot="describe">
                <span style="color: rgba(0, 0, 0, .87)">购买{{contractor(contract).money}}元，节省{{contractor(contract).savingOf()}}元</span><br/>

                <span style="font-size:small" v-if="contract.state == 1">{{contractor(contract).stateName}}，截止时间{{pretty(contract.deadline)}}</span>
                <span style="font-size:small" v-else>{{contractor(contract).stateName}}</span>
            </span>
        </mu-list-item>
    </mu-list>
</template>

<script>
    import Datetime from '../../util/date'
    import { mapGetters, mapActions } from 'vuex'

    export default {
        props: ['contracts', 'header'],

        computed: mapGetters({
            me: 'me',
        }),

        methods: {
            onChange: function(val) {
                this.$router.push({path: val});
            },

            pretty(day) {
                return Datetime.pretty(day);
            },

            contractor(contract) {
                return contract.contractorOf(this.me)
            }
        },
    }
</script>
