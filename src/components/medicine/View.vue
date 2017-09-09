<template>
    <baselayout :progressing="refreshing" :toast="toast">
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data() {
            return {
                medicine: null,
            }
        },

        methods: {
            onInitialize: function() {
            },
        },

        components: {
            'baselayout': BaseLayout,
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .mu-td, .mu-th {
        padding-left: 12px;
        padding-right: 12px;
        text-align: left;
    }
</style>