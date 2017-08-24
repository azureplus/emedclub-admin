<template>
    <base-layout :progressing="refreshing" :toast="toast">
        <mu-appbar title="搜索" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
        </mu-appbar>

        <mu-list>
            <mu-list-item>
                <mu-text-field v-model="title" fullWidth />
                <mu-icon value="search" slot="right" @click="onFind" :size="32"/>
            </mu-list-item>
        </mu-list>

        <contract-list :contracts="contracts"/>
    </base-layout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import ContractList from '../contract/List'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data () {
            return {
                title: "",
                contracts: []
            }
        },

        methods: {
            onChange: function(val) {
                this.goto(val);
            },

            onFind: function() {
                var self = this;

                self.wait(api.query("Contract", {title: {'$regex': '.*' + self.title + '.*'}, state: [1, 2, 3, 4, 5]}, {order: 'deadline DESC'})).then(function(contracts){
                    self.contracts = contracts;
                })
            },
        },

        components: {
            'base-layout': BaseLayout,
            'contract-list': ContractList
        }
    }
</script>
