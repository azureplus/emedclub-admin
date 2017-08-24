<template>
    <base-layout>
        <mu-appbar title="平台保证金协议条款" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="onBack"/>
        </mu-appbar>

        <mu-content-block style="text-align:left">
            <p>为树立商户与平台的经营信誉，共同打造高度诚信的电子商务服务平台，特制定如下保险金协议条款，并共同遵守：</p>
            <h2>一、保证金用途</h2>
            <p>如果商户在产品交易过程中出现顾客投诉或赔付时，平台在核实交易真实情况的前提下，会用甲方所支付保证金给予用户第一时间的赔付，平台保证在24小时内协助商户解决客户的投诉和赔付问题。</p>
            <h2>二、保证金缴纳</h2>
            <p>1.为保证平台系统自动结算的一致性，商户全额如数缴纳给平台，不计算利息。</p>
            <p>2.平台收到商户保证金后，7个工作日内开具加盖平台财务专用章的保证金收款凭证，不开具发票。</p>
            <h2>三、保证金金额及期限</h2>
            <p>1.商户支付缴纳保证金金额为人民币3000元（叁仟元）。</p>
            <p>2.保证金缴纳后次日开通平台服务功能，保证金有效期限为一年。</p>
            <h2>四、保证金补缴</h2>
            <p>如果商户保证金因经营纠纷而赔偿支付顾客，造成不足的，商户需要5个工作日内补缴，否则，平台有权暂停商户的平台经营活动，直至商户补齐保证金为止。</p>
            <h2>五、保证金退还</h2>
            <p>1. 保证金期满后：</p>
            <p>1) 商户继续在平台经营活动的，自动续签一年。</p>
            <p>2) 商户退出平台经营的，在保证金期满后，商户提交办理退款申请，7个工作日内，平台返还商户保证金。</p>
            <p>2. 平台超期不退保证金的，按保证金总额的1%每日赔偿商户损失。</p>
        </mu-content-block>
    </base-layout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import Mixin from '../../mixin'
    
    export default {
        mixins: [Mixin],

        components: {
            'base-layout': BaseLayout
        }
    }
</script>