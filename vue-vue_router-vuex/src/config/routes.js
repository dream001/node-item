import App from '../app'
//<router-view> 是最顶层的出口，渲染最高级路由匹配到的组件。同样地，一个被渲染组件同样可以包含自己的嵌套 <router-view>
//要在嵌套的出口中渲染组件，需要在 VueRouter 的参数中使用 children 配置
//正如下面这个写法，如果不用children就会去渲染父组件的router-view，这里的意思就是去渲染App组件的router-view,注意这里的路由
//路径都是在最外层配置的path参数目录下面，要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径
export default [
    {
        path: '/',
        component: App,
        children: [
            {
                path: '/login', 
                meta: { auth: false },     //这是路由元信息，会被记录到$route.matched 数组
                // component: resolve => require(['../pages/login/'], resolve)
                // resolve参数是用来触发渲染的参数，不传的话就不会渲染，这里的异步懒加载有好几种写法
                component: function(resolve) {
                    require(['../pages/login/'],function(form){
                        resolve(form)
                    })
                }
            },
            {
                path: '/signout',
                component: resolve => require(['../pages/signout/'], resolve)
            },
            {
                path: '/home',
                component: resolve => require(['../pages/home/'], resolve)
            },
            {
                path: '/',
                meta: { auth: false },
                component: resolve => require(['../pages/index/'], resolve)
            },
            {
                path: '*',
                redirect: '/login'
            }
        ]
    }
]


// 对于我们这个应用也是用的懒加载，main.bundle.js是一打开页面就会引入加载，之后根据进入哪个路由加载渲染相应页面也就是这里的各个
// chunk文件如1.bundle.js,2.bundle.js,3.bundle.js,4.bundle.js,已经加载过得就会被缓存不会下一次跳入后缓存了


// 路由懒加载
// 当打包构建应用时，Javascript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问
// 的时候才加载对应组件，这样就更加高效了。结合 Vue 的 异步组件 和 Webpack 的 code splitting feature, 轻松实现路由组件的懒加载。
// 我们要做的就是把路由对应的组件定义成异步组件：
//     const Foo = resolve => {
//       // require.ensure 是 Webpack 的特殊语法，用来设置 code-split point,注意它只是加载了并不执行要想执行必须在里面require一下
//       // （代码分块）
//       require.ensure(['./Foo.vue'], () => {
//         resolve(require('./Foo.vue'))
//       })
//     }
// 这里还有另一种代码分块的语法，使用 AMD 风格的 require，于是就更简单了：
//     const Foo = resolve => require(['./Foo.vue'], resolve)
// 上面那样加载之后不需要改变任何路由配置，跟之前一样使用 Foo就行了

// 有时候我们想把某个路由下的所有组件都打包在同个异步 chunk 中。只需要 给 chunk 命名，提供 require.ensure 第三个参数作为chunk名称:
    // const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo')
    // const Bar = r => require.ensure([], () => r(require('./Bar.vue')), 'group-foo')
    // const Baz = r => require.ensure([], () => r(require('./Baz.vue')), 'group-foo')
// Webpack 将相同 chunk 下的所有异步模块打包到一个异步块里面 —— 这也意味着我们无须明确列出 require.ensure 的依赖（传空数组就行）
//上述如果没有加入第三个参数就会产生多个chunk包，加入之后会打进一个叫group-foo.min.js的包


