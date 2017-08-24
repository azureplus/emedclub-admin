<template>
    <base-layout>
        <mu-appbar title="消拼" slot="header">
        </mu-appbar>

       <mu-content-block>
            <div style="text-align: center;margin-top: 25%;font-size: larger;">
                <div class="logo"></div>
            </div>
        </mu-content-block>
       <mu-content-block>
            <div style="text-align: center;margin-top: 10%;font-size: larger;">
                <mu-raised-button label="顾客" class="demo-raised-button" primary @click="onCustomerHome"/>
                <mu-raised-button label="商户" class="demo-raised-button" primary @click="onMerchantHome"/>
            </div>
        </mu-content-block>
       <mu-content-block>
            <div style="text-align: center;margin-top: 25%;font-size: larger;">
                <p style="margin-top:40px;font-size: smaller;">上海班若信息科技有限公司</p>
            </div>
        </mu-content-block>

    </base-layout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        data () {
            return {
            }
        },

        methods: {
            onInitialize: function() {
            },

            onCustomerHome: function() {
                this.goto("/home");
            },

            onMerchantHome: function() {
                this.gotoWith("/login", "/merchant");
            }
        },

        components: {
            'base-layout': BaseLayout
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .logo {
        width: 6rem;
        height: 6rem;
        background: url(../../../static/images/logo.jpg) no-repeat;
        background-size: 100%;
        margin: 2rem auto 2em;
    }
</style>