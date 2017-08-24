<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar :title="title" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
            <mu-icon-button icon="help" slot="right" @click="onShowRule"/>
        </mu-appbar>  
        <div v-if="contract" style="margin-bottom: 50px;">
            <div v-if="contract.category == 0 || contract.category == 1">
                <div style="text-align:center;margin:1px 0 1px 0">
                    <mu-raised-button v-if='canJoin()' primary label="加入拼单" @click="onJoin"/>
                    <mu-raised-button v-if='canExit()' primary label="退出拼单" @click="openSheet('退出拼单')"/>
                    <mu-raised-button v-if='canRate()' primary label="评价拼单" @click="onRate"/>
                    <mu-raised-button v-if='canSettle()' primary label="结算拼单" @click="openSheet('结算拼单')"/>
                </div>
                <mu-table :showCheckbox="false">
                    <mu-tbody>
                        <mu-tr>
                            <mu-td>截止时间</mu-td>
                            <mu-td>{{ pretty(contract.deadline) }}</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>实拼人数</mu-td>
                            <mu-td>{{ contract.contractors.length }}人</mu-td>
                        </mu-tr>
                        <mu-tr v-if="contract.discountCategory == 0">
                            <mu-td>总金额</mu-td>
                            <mu-td>{{ contract.amountOf() }}元</mu-td>
                        </mu-tr>
                        <mu-tr v-else>
                            <mu-td>总件数</mu-td>
                            <mu-td>{{ contract.sumOf() }}件</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>节省金额</mu-td>
                            <mu-td>{{ contract.savingOf() }}元</mu-td>
                        </mu-tr>
                        <mu-tr v-for="discount in contract.discounts" :key="discount.id">
                            <mu-td>折扣率</mu-td>
                            <mu-td>{{ discount.toString() }}</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>编号</mu-td>
                            <mu-td >{{ contract.id }}</mu-td>
                        </mu-tr>
                        <mu-tr v-if="contract.comment">
                            <mu-td>备注</mu-td>
                            <mu-td>{{ contract.comment }}</mu-td>
                        </mu-tr>
                    </mu-tbody>
                </mu-table>
            </div>
            <div v-else>
                <div style="text-align:center;margin:1px 0 1px 0">
                    <mu-raised-button v-if='canJoin()' primary label="加入拼单" @click="onJoin"/>
                    <mu-raised-button v-if='canPay()'  primary label="支付余款" @click="openSheet('支付余款')"/>
                    <mu-raised-button v-if='canRate()' primary label="评价拼单" @click="onRate"/>
                </div>
                <mu-table :showCheckbox="false">
                    <mu-tbody>
                        <mu-tr>
                            <mu-td>活动名称</mu-td>
                            <mu-td>{{ contract.title }}</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>截止时间</mu-td>
                            <mu-td>{{ pretty(contract.deadline) }}</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>拼单人数</mu-td>
                            <mu-td>{{ contract.total_contractors }}人</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>实拼人数</mu-td>
                            <mu-td>{{ contract.contractors.length }}人</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>金额</mu-td>
                            <mu-td>{{ contract.price }}元</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>预付</mu-td>
                            <mu-td>{{ contract.deposit }}元</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td>编号</mu-td>
                            <mu-td >{{ contract.id }}</mu-td>
                        </mu-tr>
                        <mu-tr v-if="contract.comment">
                            <mu-td>备注</mu-td>
                            <mu-td>{{ contract.comment }}</mu-td>
                        </mu-tr>
                    </mu-tbody>
                </mu-table>
            </div>

            <mu-divider/>

            <div style="background:white;">
                <contractor-list :contractors="contract.contractors" />
            </div>

            <mu-divider/>

            <chat-list :chats="chats"/> 
        </div>

        <mu-paper class='footr_box pf' slot="footer" v-if="canChat()">
            <mu-text-field hintText="有话要说" v-model="chat.content" style="padding-right:40px;margin:0"/>
            <div style="padding-top:5px;top:10px;display: inline-block;position: relative;">
                <mu-icon value="chat" @click="onChat" :size="24"/>
            </div>
        </mu-paper>

        <mu-bottom-sheet :open="sheet" @close="closeSheet">
            <mu-raised-button :label="sheetLabel" primary @click="onOk" style="width:100%;height:45px"/>
            <mu-raised-button label="取消" @click="onCancel" style="width:100%;height:45px"/>
        </mu-bottom-sheet>
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import ChatList from '../chat/List'
    import ContractorList from '../contractor/List'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'
    import Chat from '../../model/Chat'

    export default {
        mixins: [Mixin],

        data() {
            return {
                contract: null,
                chats:[],
                chat: null, 
                title: '拼单',

                sheet: false,
                sheetLabel: ''
            }
        },

        computed: mapGetters({
            me: 'me',
            merchant: 'merchant'
        }),

        methods: {
            onInitialize: function() {
                let self = this;

                self.onUpdate();

                setInterval(function(){
                    self._refreshChats();
                }, 10000);
            },

            canChat: function() {
                return this.contract && this.contract.canChat(this.me)
            },

            onChat: function() {
                var self = this;

                if (self.chat.content.length > 0) {
                    self.chat.customer_id = self.me.id;
                    self.chat.room_id = self.contract.room_id;
                    api.save(self.chat).then(function(c){
                        c.customer = self.me;
                        self.chats.splice(0, 0, c);
                        self.chat = new Chat({content:""});
                    })
                }
            },

            _refreshChats() {
                var self = this;

                if (self.contract && self.contract.room_id) {
                    self._queryContractChats(self.contract, self.chatTime).then(function(chats){
                        for(var c of chats) {
                            if (-1 == self.chats.findIndex(function(value, index, arr) { return value.id  == c.id; })) {
                                self.chats.splice(0, 0, c);
                            }
                        }
                        self.chats.sort(function(a, b){
                            return new Date(b.create_time) - new Date(a.create_time);
                        })
                        self.chatTime = new Date();
                    })
                }
            },

            _queryContractChats(contract, time) {
                return api.query("Chat", {room_id: contract.room_id, create_time: {$gt: time.toString()}}, {order: 'create_time DESC'});
            },

            onUpdate() {
                let self = this;

                self.contract = null;
                self.title = "拼单";

                self.chats = [];
                self.chat = null;

                self.chatTime = new Date("2001-1-1 12:12:12");

                self.wait(api.queryOne("Contract", self.$route.params.id)).then(function(contract){
                    self.contract = contract;
                    self.share();

                    self.title = self.contract.stateName;

                    if (self.contract.canChat(self.me)) {
                        self.chat = new Chat({content:""});

                        self._refreshChats();
                    }
                });
            },

            share() {
                if (this.contract) {
                    this.$channel.setShareContent(
                        '消拼', // 分享标题
                        '我加入了这个拼单，' + this.contract.toString() + '，还不快来。', // 分享描述
                        'https://www.xpin1.com/shopping/#/contract/' + this.contract.id + '?redirect=%2Fhome&referee=' + this.me.id , // 分享链接
                        'https://www.xpin1.com/shopping/images/logo.png' // 分享图标
                    );
                }
            },

            onShowPath() {
                let query = {
                      address: this.contract.address
                };
                this.$router.push({ path: '/path', query: query })
            },

            onShowRule() {
                this.goto('/rule');
            },

            onShowCustomer(customer) {
                this.goto(customer.url);
            },

            closeSheet () {
                this.sheet = false
                this.sheetLabel = ""
            },

            openSheet(label) {
                this.sheet = true;
                this.sheetLabel = "确定" + label;
            },

            onCancel: function() {
                this.closeSheet();
            },

            onOk: function() {
                console.log(this.sheetLabel);

                var self = this;
                
                var contractor = self.contract.contractorOf(self.me);

                if (self.sheetLabel == "确定退出拼单") {
                    var promise = api.destroy(contractor);
                } else if (self.sheetLabel == "确定结算拼单") {
                    self.contract.settle();
                    var promise = api.save(self.contract);
                } else if (self.sheetLabel == "确定支付余款") {
                    self.$channel.pay({merchant_id: self.contract.merchant_id, customer_id: self.me.id, money: contractor.money - contractor.deposit, product: "拼单"}).then(function(paymentId){
                        contractor.pay()
                        self.wait(api.save(contractor)).then(function(){
                            api.queryOne("Contract", self.contract.id).then(function(contract){
                                self.contract = contract;

                                self.title = self.contract.stateName;
                            })
                        })                        
                    }, function(err){
                        console.error("支付失败，请稍后再试", err)
                        self.toast = "支付失败，请稍后再试"
                    })
                }

                if (promise) {
                    self.wait(promise).then(function(){
                        api.queryOne("Contract", self.contract.id).then(function(contract){
                            self.contract = contract;

                            self.title = self.contract.stateName;
                        })
                    })
                }

                self.closeSheet();
            },

            canJoin: function() {
                return this.contract.canJoin(this.me);
            },

            onJoin: function() {
                this.$router.push("/join/" + this.contract.id);
            },

            canRate: function() {
                return this.contract.canRate(this.me);
            },

            onRate: function() {
                var contractor = this.contract.contractorOf(this.me);
                this.$router.push("/evaluate?contractor_id=" + contractor.id + "&activity_id=" + this.contract.activity_id);
            },

            canExit: function() {
                return this.contract.canExit(this.me);
            },

            canSettle: function() {
                return this.contract.canSettle(this.me);
            },

            canPay: function() {
                return this.contract.canPay(this.me);
            }
        },

        components: {
            'baselayout': BaseLayout,
            'chat-list':  ChatList,
            'contractor-list': ContractorList
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