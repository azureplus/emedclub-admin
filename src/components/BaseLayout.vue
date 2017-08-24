<template>
    <div>
        <div ref="header">
            <slot name="header"></slot>
        </div>

        <mu-linear-progress v-show="progressing" :size="3"/>
        
        <div ref="content" class="content">
            <mu-toast v-if="toast && toast.length > 0" :message="toast" class="centered"/>
            <slot></slot>
            <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="onLoadMore"/>
        </div>

        <div ref="footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['progressing', 'toast', 'loading'],

        data () {
            return {
                scroller: null,
            }
        },

        mounted () {
            var header = this.$refs["header"]
            var footer = this.$refs["footer"]
            var content = this.$refs["content"]

            this.scroller = content

            setTimeout(function(){
                var height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - header.offsetHeight;
                if (footer.childNodes.length > 0) {
                    content.style.height = (height - footer.childNodes[0].offsetHeight) + "px";
                } else {
                    content.style.height = height + "px";
                }
            }, 10)
        },

        methods: {
            onLoadMore: function() {
                 this.$emit("on-load-more");
            },
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../assets/theme.less";

    .centered {
      position: fixed !important;
      top: 50%;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
    }

    .content{
        width: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>
