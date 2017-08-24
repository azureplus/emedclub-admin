<template>
    <layout :refreshing="refreshing" :toast="toast" :action="notify" @on-action="onAction" :refresh="true"  @on-refresh="onRefresh">
        <contract-list v-if="contracts" :contracts="contracts" :location="location"/>
    </layout>
</template>

<script>
    import Layout from '../Layout'
    import api from '../../api'
    import ContractList from './List'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'
    import Map from '../../util/map'

    export default {
        mixins: [Mixin],

        data () {
            return {
                contracts: [],
                location: null,
                notify: ''
            }
        },

        computed: mapGetters({
            me: 'me'
        }),

        methods: {
            onInitialize: function() {
                var self = this;

                self.onRefresh();

                api.queryMySetting(self.me).then(function(settings){
                    if (settings.length > 0 && settings[0].notify == 1) {
                        self.notify = 'notifications';
                    } else {
                        self.notify = 'notifications_off';
                    }
                });                
            },

            onUpdate: function() {
                this.onInitialize();
            },

            onRefresh: function() {
                this.wait(this.queryContracts());
            },

            onAction: function() {
                var self = this;

                api.queryMySetting(self.me).then(function(settings){
                    if (settings.length > 0 && settings[0].notify == 1) {
                        settings[0].notify = 0;
                        api.save(settings[0]);

                        self.notify = 'speaker_notes_off';
                    } else {
                        self.goto("/setting");
                    }
                });
            },

            queryContracts: function() {
                var self = this;
                
                return api.queryNearby("Contract", 3000, {state: 1}, {order: 'deadline DESC'}).then(function(data){
                    self.contracts = data.models;
                    self.location  = data.location;
                })
            },
        },

        components: {
            'layout': Layout,
            'contract-list': ContractList
        }
    }
</script>
