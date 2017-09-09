import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// require.ensure在需要的时候才下载依赖的模块  // 出现问题: 刷新时获取不到url

// const index = r => require.ensure([], () => r(require('../views/Recommend/recommend.vue')), 'index')  

export default new Router({
  base: "/shopping/",
  
  routes: [
    {
      path: '/home',
      name: 'home',
      component: require('./components/home/Index.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/login',
      name: 'login',
      component: require('./components/account/Login.vue'),
    },
    {
      path: '/reset',
      name: 'reset',
      component: require('./components/account/Register.vue'),
    },

    { 
      path: '/activity/index',
      name: 'list-activity',
      component: require('./components/activity/Index.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/activity/new',
      name: 'new_activity',
      component: require('./components/activity/Edit.vue'),
      meta: { requiresAuth: true }
    },  
    { 
      path: '/activity/edit/:id',
      name: 'edit_activity',
      component: require('./components/activity/Edit.vue'),
      meta: { requiresAuth: true }
    }, 
    { 
      path: '/activity/view/:id',
      name: 'show_activity',
      component: require('./components/activity/View.vue'),
      meta: { requiresAuth: true }
    },

    { 
      path: '/medicine',
      name: 'list-medicine',
      component: require('./components/medicine/Index.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/medicine/new',
      name: 'new-medicine',
      component: require('./components/medicine/Edit.vue'),
      meta: { requiresAuth: true }
    }, 

    { 
      path: '/medicine/:id',
      name: 'view-medicine',
      component: require('./components/medicine/View.vue'),
      meta: { requiresAuth: true }
    }, 

    { 
      path: '/information/index',
      name: 'information',
      component: require('./components/information/Index.vue'),
      meta: { requiresAuth: true }
    },    
    { 
      path: '/information/new',
      name: 'new-information',
      component: require('./components/information/Edit.vue'),
      meta: { requiresAuth: true }
    },  
    { 
      path: '/information/view/:id',
      name: 'view-information',
      component: require('./components/information/View.vue'),
      meta: { requiresAuth: true }
    },

    { 
      path: '/poster/index',
      name: 'list-poster',
      component: require('./components/poster/Index.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/poster/new/',
      name: 'new-poster',
      component: require('./components/poster/Edit.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/poster/edit/:id',
      name: 'edit-poster',
      component: require('./components/poster/Edit.vue'),
      meta: { requiresAuth: true }
    },


    { 
      path: '/merchant/index',
      name: 'list_merchant',
      component: require('./components/merchant/Index.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/merchant/new',
      name: 'new_merchant',
      component: require('./components/merchant/Edit.vue'),
      meta: { requiresAuth: true }
    }, 
    { 
      path: '/merchant/edit/:id',
      name: 'edit_merchant',
      component: require('./components/merchant/Edit.vue'),
      meta: { requiresAuth: true }
    }, 
    { 
      path: '/merchant/view/:id',
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