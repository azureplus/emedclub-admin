<template>
    <layout :refreshing="refreshing" :toast="toast" :refresh="true" :loading="loading">
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'
    import api from '../../api'
    
    export default {
        mixins: [Mixin],

        data () {
            return {
                loading: false,
                refreshing: false,
                hasMore: true
            }
        },

        methods: {
            onInitialize: function() {
            },
        },

        components: {
            'layout': Layout,
        }
    }
</script>