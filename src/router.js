import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// require.ensure在需要的时候才下载依赖的模块  // 出现问题: 刷新时获取不到url

// const index = r => require.ensure([], () => r(require('../views/Recommend/recommend.vue')), 'index')  

export default new Router({
  base: "/shopping/",
  
  routes: [
    {
    	path: '/land',
      name: 'land',
    	component: require('./components/home/Land.vue'),
  	},
    {
      path: '/home',
      name: 'customer_home',
      component: require('./components/home/Index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/merchant',
      name: 'merchant_home',
      component: require('./components/home/Merchant.vue'),
      meta: { requiresAuth: true }
    },

    { 
      path: '/activities',
      name: 'list-activity',
      component: require('./components/activity/Index.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/activity/new',
      name: 'new_activity',
      component: require('./components/activity/New.vue'),
      meta: { requiresAuth: true }
    },  
    { 
      path: '/activity/:id',
      name: 'show_activity',
      component: require('./components/activity/View.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activities/history',
      name: 'history_activity',
      component: require('./components/activity/History.vue'),
      meta: { requiresAuth: true }
    },

    { 
      path: '/brands',
      name: 'list-brand',
      component: require('./components/brand/Index.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/brand/new',
      name: 'new_brand',
      component: require('./components/brand/New.vue'),
      meta: { requiresAuth: true }
    }, 

    { 
      path: '/brand/:id',
      name: 'view_brand',
      component: require('./components/brand/View.vue'),
      meta: { requiresAuth: true }
    }, 

    { 
      path: '/contracts',
      name: 'contract',
      component: require('./components/contract/Index.vue'),
      meta: { requiresAuth: true }
    },    
    { 
      path: '/contract/new',
      name: 'new_contract',
      component: require('./components/contract/New.vue'),
      meta: { requiresAuth: true }
    },  
    { 
      path: '/contract/:id',
      name: 'view_contract',
      component: require('./components/contract/View.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/find',
      name: 'find_contract',
      component: require('./components/contract/Find.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/nearby',
      name: 'nearby_contract',
      component: require('./components/contract/Nearby.vue'),
      meta: { requiresAuth: true }
    },

    { 
      path: '/contractor',
      name: 'list_contractor',
      component: require('./components/contractor/Index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/history',
      name: 'history_contractor',
      component: require('./components/contractor/History.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/join/:contract_id',
      name: 'new_contractor',
      component: require('./components/contractor/New.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/contractor/edit/:id',
      name: 'edit_contractor',
      component: require('./components/contractor/Edit.vue'),
      meta: { requiresAuth: true }
    },

    { 
      path: '/evaluate',
      name: 'evaluate',
      component: require('./components/Evaluation/New.vue'),
      meta: { requiresAuth: true }
    }, 

    {
      path: '/rule',
      name: 'rule',
      component: require('./components/contract/Rule.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/path',
      name: 'path',
      component: require('./components/Path.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/setting',
      name: 'setting',
      component: require('./components/customer/Setting.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/my',
      name: 'my',
      component: require('./components/customer/Index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/customer/:id',
      name: 'show_customer',
      component: require('./components/customer/View.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/edit/:category',
      name: 'edit_customer',
      component: require('./components/customer/Edit.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/messages',
      name: 'list_message',
      component: require('./components/message/Index.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/login',
      name: 'login',
      component: require('./components/account/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: require('./components/account/Register.vue'),
    },
    {
      path: '/reset',
      name: 'reset',
      component: require('./components/account/Register.vue'),
    },

    { 
      path: '/merchants',
      name: 'list_merchant',
      component: require('./components/merchant/Index.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/merchant/find',
      name: 'find_merchant',
      component: require('./components/merchant/Find.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/merchant/new',
      name: 'new_merchant',
      component: require('./components/merchant/New.vue'),
      meta: { requiresAuth: true }
    }, 
    { 
      path: '/merchant/agreement',
      name: 'agree_merchant',
      component: require('./components/merchant/Agreement.vue'),
      meta: { requiresAuth: true }
    }, 
    { 
      path: '/merchant/edit',
      name: 'edit_merchant',
      component: require('./components/merchant/Edit.vue'),
      meta: { requiresAuth: true }
    }, 
    { 
      path: '/merchant/bind',
      name: 'bind_merchant',
      component: require('./components/merchant/Bind.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/merchant/:id',
      name: 'show_merchant',
      component: require('./components/merchant/View.vue'),
      meta: { requiresAuth: true }
    }, 
    
    {
      path: '*',
      redirect: '/home'
    }
  ]
})