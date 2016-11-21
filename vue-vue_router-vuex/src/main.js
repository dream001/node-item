import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './config/routes'
import store from './store/'
import common from './component/' //加载公共组件

import './css/common.css'
import './less/common.less'
// 全局注册组件
Object.keys(common).forEach((key) => {
    var name = key.replace(/(\w)/, (v) => v.toUpperCase()) //首字母大写
    Vue.component(`common${name}`, common[key])            //组件名字改成了驼峰式的了commonHeader,用的时候用下划线形式common-header
})

Vue.use(VueRouter)

const router = new VueRouter({
    routes
})
router.beforeEach(({meta, path}, from, next) => {
	// 注意to对象也就是对应来自的那个路由的$route对象，其中是有路由元信息的在meta字段里面，在路由里面可以配置meta的值
    var {auth = true} = meta
    var isLogin = Boolean(store.state.user.id) //true用户已登录， false用户未登录

    if (auth && !isLogin && path !== '/login') {
        return next({ path: '/login' })
    }
    next()
})

new Vue({ store, router }).$mount('#app')