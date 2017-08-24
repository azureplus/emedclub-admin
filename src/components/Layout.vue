<template>
    <base-layout :progressing="refreshing" :toast="toast" :loading="loading" @on-load-more="onLoadMore">
        <mu-appbar title="消拼" slot="header">
            <mu-icon-button icon="search" slot="right" @click="onFindContract" />
            <mu-icon-button v-if="refresh" icon="refresh" slot="right" @click="onRefresh" />
            <mu-icon-button v-if="action && action.length > 0" :icon="action" slot="right" @click="onAction" />
        </mu-appbar>

        <slot></slot>

        <mu-paper class='footr_box pf' slot="footer">
            <mu-bottom-nav :value="bottomNav" @change="onChange" shift>
                <mu-bottom-nav-item value="home"        title="消拼" icon="home"           />
                <mu-bottom-nav-item value="nearby"      title="附近" icon="near_me"        />
                <mu-bottom-nav-item value="contractor"  title="订单" icon="shopping_cart"  />
                <mu-bottom-nav-item value="my"          title="我"   icon="perm_identity"  />
            </mu-bottom-nav>
        </mu-paper>
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
            onChange (val) {
                this.$router.push("/" + val);
            },

            onFindContract() {
                this.$router.push('/find');
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
