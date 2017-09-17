<template>
    <div>
        <div ref="header">
            <mu-appbar title="医麦客管理后台"></mu-appbar>
        </div>

        <mu-linear-progress v-show="progressing" :size="3"/>

        <div class="sidebar">
            <mu-list @change="onModelIndex" :value="activeIndex">
                <mu-list-item title="企业" value="/merchant/index">
                    <mu-icon slot="left" value="drafts"/>
                </mu-list-item>
                <mu-list-item title="药品" value="/medicine/index">
                    <mu-icon slot="left" value="drafts"/>
                </mu-list-item>
                <mu-list-item title="资讯" value="/information/index">
                    <mu-icon slot="left" value="drafts"/>
                </mu-list-item>
                <mu-list-item title="广告" value="/poster/index">
                    <mu-icon slot="left" value="drafts"/>
                </mu-list-item>
            </mu-list>
        </div>
        
        <div ref="content" class="content">
            <mu-toast v-if="toast && toast.length > 0" :message="toast" class="centered"/>
            <slot></slot>
            <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="onLoadMore"/>
        </div>

        <div ref="footer">
            <slot name="footer"></slot>
        </div>

        <mu-bottom-sheet :open="destroySheet" @close="closeDestroySheet">
            <mu-raised-button label="确定要删除" primary @click="onDestroy" style="width:100%;height:45px"/>
            <mu-raised-button label="再想一下" @click="closeDestroySheet" style="width:100%;height:45px"/>
        </mu-bottom-sheet>
    </div>
</template>

<script>
    export default {
        props: ['progressing', 'toast', 'loading', 'destroySheet'],

        data () {
            return {
                scroller: null,

                activeIndex: '',
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

            onModelIndex: function(val) {
                this.activeIndex = val
                this.$router.replace({path: val});
            },

            closeDestroySheet: function() {
                this.$emit("on-cancel-destroy")
            },

            onDestroy: function() {
                this.$emit("on-destroy")
            }
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

    .sidebar {
        max-width: 20%;
        float: left;
        background-color: white;
        margin-bottom: -4000px;
        padding-bottom: 4000px;
    }

    .content{
        width: 80%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        display: inline-block;
        float: right;
        padding: 10px 20px;
        background-color: rgba(0, 0, 0, 0) 
    }
</style>
