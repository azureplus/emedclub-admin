<template>
    <base-layout :progressing="refreshing" :toast="toast" :loading="loading" @on-load-more="onLoadMore">
        <mu-appbar title="医麦客" slot="header">
            <mu-icon-button icon="add" slot="right" @click="onAdd" />
            <mu-icon-button v-if="refresh" icon="refresh" slot="right" @click="onRefresh" />
            <mu-icon-button v-if="action && action.length > 0" :icon="action" slot="right" @click="onAction" />
        </mu-appbar>

        <slot></slot>
    </base-layout>
</template>

<script>
    import BaseLayout from './BaseLayout'

    export default {
        props: ['refreshing', 'toast', 'loading', 'action', 'refresh'],

        data() {
            return {
                bottomNav: 'home',
            }
        },

        mounted(){
            // 当created函数时监测路由信息,防止页面刷新tab高亮错误
            var tmpArr = this.$route.path.split('/');
            this.bottomNav = tmpArr[1];
        },

        methods: {
            onAdd() {
                this.$emit("on-add");
            },

            onAction() {
                this.$emit("on-action", this.action);
            },

            onRefresh() {
                this.$emit("on-refresh");
            },

            onLoadMore() {
                this.$emit("on-load-more");
            }
        },

        components: {
          'base-layout': BaseLayout
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../assets/theme.less";

  /*底部样式*/
  .footr_box {
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    background: #fff;
    z-index: 11;
    a {
      color: #333;
    }
    .list-inline {
      display: flex;
      width: 100%;
      padding-top: 10px;
      li {
        flex: 1;
        >a.active {
          color: #d1506d;
        }
        >a {
          position: relative;
          z-index: 2;
          display: block;
          img {
            width: 30%;
          }
        }
      }
    }
  }  
</style>
