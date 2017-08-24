<template>
    <base-layout :progressing="refreshing" :toast="toast">
        <mu-appbar :title="title" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-content-block>
            <mu-table :showCheckbox="false" v-if="customer">
                <mu-tbody>
                    <mu-tr>
                        <mu-td>头像</mu-td>
                        <mu-td @click="onChangeAvatar"><mu-avatar :src="customer.avatar"/></mu-td>
                    </mu-tr>
                    <mu-tr>
                        <mu-td>昵称</mu-td>
                        <mu-td @click="onChangeName">{{ customer.name }}</mu-td>
                    </mu-tr>
                    <mu-tr>
                        <mu-td>性别</mu-td>
                        <mu-td @click="onChangeSex">{{ sexName() }}</mu-td>
                    </mu-tr>
                </mu-tbody>
            </mu-table>

            <mu-list v-if="message">
                <mu-list-item>
                    <mu-text-field hintText="给TA发条消息" v-model="message.title" :errorText="validation.firstError('message.title')" fullWidth />
                    <mu-icon value="send" slot="right" @click="onSend" :size="32"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>

		<input type="file" id="avatar-file" accept="image/*" @change="onCaptureAvatar($event)" style="display: none"/>
    </base-layout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'
    import Message from '../../model/Message'
    import Customer from '../../model/Customer'
    import SimpleVueValidation from 'simple-vue-validator';

    export default {
        mixins: [Mixin],

        data () {
            return {
                message: null,
                customer: null,
                title: ""
            }
        },

        computed: mapGetters({
            me: 'me'
        }),

        validators: {
            'message.title': function (value) {
                return SimpleVueValidation.Validator.value(value).required();
            }
        },

        methods: {
            onInitialize: function() {
                var self = this;

                self.message   = null;
                self.merchants = null;

                if (self.$route.params.id == self.me.id) {
                    self.customer = self.me;
                    self.title = "我的信息";
                } else {
                    self.wait(api.queryOne("Customer", self.$route.params.id)).then(function(customer){
                        self.customer = customer;

                        self.message = new Message();
                    })

                    self.customer = null;
                    self.title = "详细资料";
                }
            },

            onUpdate() {
                this.onInitialize();
            },
            
            onChangeAvatar: function() {
                var self = this;

                if (self.$route.params.id == self.me.id) {
                    self.$nextTick(function () {
                        document.getElementById("avatar-file").click();
                    });
                }
            },

            onCaptureAvatar: function(event) {
                var self = this;

                if (self.$route.params.id == self.me.id) {
                    self.wait(api.upload(event.target.files[0])).then(function(uri){
                        self.$store.dispatch('changeCustomer', {avatar: uri});
                    })
                }
            },

            onChangeSex: function() {
                if (this.$route.params.id == this.me.id) {
                    this.goto("/edit/sex");
                }
            },

            onChangeName: function() {
                if (this.$route.params.id == this.me.id) {
                    this.goto("/edit/name");
                }
            }, 

            onSend: function() {
                var self = this;

                self.$validate().then(function (success) {
                    if (success) {
                        self.message.customer_id = self.me.id;
                        self.message.receiver_id = self.customer.id;
                        self.message.entity_type = "Customer";
                        self.message.entity_id   = self.me.id;
                        self.wait(api.save(self.message)).then(function(){
                            self.message = new Message();

                            self.showToast('给' + self.customer.name + '发了一条消息');
                        })
                    }
                })
            },

            sexName: function(){
                return Customer.sexName(this.customer);
            }

        },

        components: {
            'base-layout': BaseLayout
        }
    }
</script>
