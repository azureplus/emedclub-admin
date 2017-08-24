<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar title="保证金" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-content-block v-if="deposit">
            <mu-list>
                <mu-list-item>
                    <h2>请将保证金汇款到消拼公司</h2>
                    <p>开户名称：上海班若信息科技有限公司</p>
                    <p>开户银行：中国银行上海市嘉定支行</p>
                    <p>银行账号：454673148820</p>
                </mu-list-item>

                <mu-list-item>
                    <mu-paper :zDepth="1" style="width: 100px;height: 100px;margin: 0 auto;">
                        <img :src="deposit.certificate" style="width: 100px;height: 100%" v-if="deposit.certificate"/>
                        <div style="text-align: center;padding-top: 40px;" @click="onUpload" v-else>上传汇款凭证</div>
                    </mu-paper>
                    <input type="file" id="certificate-file" accept="image/*" @change="onCapture($event)" style="display: none"/>
                </mu-list-item>

                <mu-list-item>
                    <mu-checkbox label="" v-model="agree"/>
                    <div style="display: inline-block;height: 33px;vertical-align: middle;">同意<a @click="onShowAgreement">平台保证金协议条款</a></div>
                </mu-list-item>
            </mu-list>

            <mu-list>
                <mu-list-item>
                    <mu-raised-button label="缴纳保证金" fullWidth @click="onSave" :disabled="!agree"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import api from '../../api'
    import Deposit from '../../model/Deposit'
    import SimpleVueValidation from 'simple-vue-validator'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data() {
            return {
                deposit: null,
                agree: false,
                rulePopup: false
            }
        },
      
        computed: mapGetters({
            me: 'me'
        }),

        methods: {
            onInitialize() {
                this.deposit = new Deposit({ money: 3000 });
            },

            onUpdate() {
                this.onInitialize();
            },

            onSave: function() {
                let self = this;

                if (self.deposit.certificate) {
                    self.deposit.customer_id = self.me.id;
                    self.wait(api.save(self.deposit)).then(function(){
                        self.back();
                    })
                } else {
                    self.showToast("请上传汇款凭证")
                }
            },

            onCapture: function(event) {
                var self = this;

                self.wait(api.upload(event.target.files[0])).then(function(uri){
                    self.deposit.certificate = uri;
                })
            },

            onUpload: function() {
                var self = this;

                self.$nextTick(function () {
                    document.getElementById("certificate-file").click();
                });
            },

            onShowAgreement: function() {
                this.goto("/deposit/agreement");
            }
        },

        components: {
            'baselayout': BaseLayout
        }
    }
</script>