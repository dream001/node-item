'use strict'

import Vue from 'vue';
import VueRouter from 'vue-router';
import filters from './filters';
import routerMap from './routers';
import FastClick from 'fastclick';    //去除掉移动端点击事件的300毫秒的延迟

Vue.use(VueRouter);
// 全局设置允许ajax跨域
$.ajaxSettings.crossDomain = true;

//实例化Vue的filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

//实例化VueRouter
let router = new VueRouter({
    hashbang: true,
    history: false,
    saveScrollPosition: true,
    transitionOnLoad: true
});

//登录中间验证，页面需要登录而没有登录的情况直接跳转登录，每个路由都会走这个方法,在每个组件的route对象中的data(transition){},就
//可以接到该钩子，函数中的transition对象依赖于router.beforeEach(function(transition){})中,他们两个完全一样，如果不传的话那么data中就没有
//值接到了,那么在这个函数里面就会有当前页的路由信息transition.to和从哪一页跳转过来的路由信息transition.from
//每个切换钩子函数都会接受一个 transition 对象作为参数,可以写三个分开，也可以一起作为一个对象
// router.beforeEach((to, from, next) => {
//   // ...
// })
//transition.to:一个代表将要切换到的路径的路由对象估计他的值应该就等于跳转到的那个页面的路由信息$router
//transition.next:调用此函数处理切换过程的下一步
//transition.from:一个代表当前路径的路由对象
//transition.abort([reason]):调用此函数来终止或者拒绝此次切换。
//transition.redirect(path):取消当前切换并重定向到另一个路由
router.beforeEach((transition) => {
    //处理左侧滚动不影响右边
    $("html, body, #page").removeClass("scroll-hide");
    FastClick.attach(document.body);      //应用该方法去掉延时，这样就可以使用click事件了
    if (transition.to.auth) {
        if (localStorage.userId) {
            transition.next();
        } else {
            var redirect = encodeURIComponent(transition.to.path);
            transition.redirect('/login?redirect=' + redirect);
        }
    } else {
        transition.next();
    }
});
// 路由器需要一个根组件。
// 出于演示的目的，这里使用一个空的组件，直接使用 HTML 作为应用的模板
let app = Vue.extend({});
routerMap(router);

router.start(app, "#app");


// 上面实例化路由的参数介绍：
// 路由选项名            默认值            作用
// hashbang              true              将路径格式化为#!开头
// history               false             启用HTML5 history模式，可以使用pushState和replaceState来管理记录
// abstract              false             使用一个不依赖于浏览器的浏览历史虚拟管理后端。
// transitionOnLoad      false             初次加载是否启用场景切换
// saveScrollPosition    false             在启用html5 history模式的时候生效，用于后退操作的时候记住之前的滚动条位置
// linkActiveClass       "v-link-active"   链接被点击时候需要添加到v-link元素上的class类,默认为active

