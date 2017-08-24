<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar title="我的消息" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-list v-if="messages.length > 0">
            <mu-list-item v-for="(message, index) in messages" :key="message.id" :title="message.customer.name" disabled>
                <mu-avatar slot="left" :src="message.customer.avatar" @click="onShowCustomer(message.customer)"/>
                <span slot="describe" @click="onShowMessage(message)">
                    <span style="color: rgba(0, 0, 0, .87)">{{message.title}}</span> <br/>
                    {{ pretty(message.create_time) }}
                </span>
            </mu-list-item>
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
          
        computed: mapGetters({
            me: 'me'
        }),

        data () {
            return {
                messages: [],
            }
        },

        methods: {
            onInitialize: function() {
                let self = this;

                self.wait(self._queryMyMessages(self.me)).then(function(messages){
                    self.messages = messages;
                })
            },

            onUpdate() {
                this.onInitialize();
            },

            onShowCustomer(customer) {
                this.goto(customer.url);
            },

            onShowMessage(message) {
                if (message.entity_type == "Contract") {
                    this.goto("/contract/" + message.entity_id);
                } else if (message.entity_type == "Withdraw") {
                    this.goto("/withdraw/" + message.entity_id);
                } else if (message.entity_type == "Deposit") {
                    this.goto("/deposit/" + message.entity_id);
                }

                message.state = 1;
                api.save(message);
            },

            _queryMyMessages(me) {
                return api.query("Message", {receiver_id: me.id, state: 0}, {order: 'create_time DESC'});
            },
        },

        components: {
            'baselayout': BaseLayout
        }
    }
</script>
