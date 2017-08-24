<template>
    <base-layout :progressing="refreshing" :toast="toast">
        <mu-appbar title="规则" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>

        <mu-content-block style="text-align:center">
            <h1>新手攻略</h1>
            <h2 style="color:red">发起拼单</h2>
            <p>1.    点击屏幕右上角“+”</p>
            <img src="images/发起1.png" style="width:70%"/>
            <p>2.    设置拼单地点，拼单截止时间</p>
            <img src="images/发起2.png" style="width:70%"/>
            <p>3.    输入自购金额，设置优惠折扣满减比列</p>
            <img src="images/发起3.png" style="width:70%"/>
            <p>4.    备注特殊要求，开始拼单</p>
            <img src="images/发起4.png" style="width:70%"/>
            <h2 style="color:red">加入拼单</h2>
            <p>1.    浏览已发起的拼单信息，选择进入</p>
            <img src="images/加入1.png" style="width:70%"/>
            <p>2.点击“我要加入”</p>
            <img src="images/加入2.png" style="width:70%"/>
            <p>3.输入自己购买金额</p>
            <img src="images/加入3.png" style="width:70%"/>
            <h2 style="color:red">拼单小窍门</h2>
            <p>1.    点击“附近”，迅速查收周边的拼单信息</p>
            <img src="images/窍门1.png" style="width:70%"/>
            <p>2.    点击右上方“”输入地址，主动查找拼单信息</p>
            <img src="images/窍门2.png" style="width:70%"/>
            <p>3.    拼单发起人，可以延长拼单时间</p>
            <img src="images/窍门3.png" style="width:70%"/>
        </mu-content-block>
    </base-layout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import Mixin from '../../mixin'

    export default {
        mixins: [Mixin],

        mounted() {
        },

        components: {
            'base-layout': BaseLayout
        }
    }
</script>
