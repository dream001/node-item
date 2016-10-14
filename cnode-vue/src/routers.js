'use strict'

export default function(router){
    router.map({
        '/':{				//首页
            name:'home',
            component: function(resolve){
                require(['./views/index.vue'],resolve);
            }
        },
        /* 404路由 */
        '*': {
            component: function(resolve){
                require(['./views/index.vue'],resolve);
            }
        },
        '/cnodevue':{               //首页
            name:'home',
            component: function(resolve){
                require(['./views/index.vue'],resolve);
            }
        },
        '/list':{               //首页
            name:'list',
            component: function(resolve){
                require(['./views/list.vue'],resolve);
            }
        },
        '/topic/:id':{               //专题
            name:'topic',
            component: function(resolve){
                require(['./views/topic.vue'],resolve);
            }
        },
        '/add':{               //首页
            name:'add',
            component: function(resolve){
                require(['./views/new.vue'],resolve);
            },
            auth: true
        },
        '/message':{               //消息
            name:'message',
            component: function(resolve){
                require(['./views/message.vue'],resolve);
            },
            auth: true
        },
        '/about':{               //关于
            name:'about',
            component: function(resolve){
                require(['./views/about.vue'],resolve);
            }
        },
        '/login':{               //登录
            name:'login',
            component: function(resolve){
                require(['./views/login.vue'],resolve);
            }
        },
        '/user/:loginname':{               //用户信息
            name:'user',
            component: function(resolve){
                require(['./views/user.vue'],resolve);
            }
        }
    })
}


// 映射路由，直接这样写是没有结合node的写法这里Home就是注册过的组件
// router.map({
//     '/home': { component: Home },
//     '/about': { component: About }
// })

// 主要有以下几个步骤：
// （1） 设置好路由配置
// router.map({
//   '/history/:deviceId/:dataId': {
//     name: 'history', // give the route a name
//     component: require('./components/index.vue')      //这里有两种写法，要写require是因为这里是用node导出的
//     component: function (resolve) {
//         require(['./components/entry.vue'], resolve)
//     }
//   }
// })
// 这里有2个关键点：
//     a）给该路由命名，也就是上文中的 name: 'history',
//     b）在路径中要使用在路径中使用冒号开头的数字来接受参数，也就是上文中的 :deviceId, :dataId；
 
// （2）在v-link中传递参数，用于动态匹配参数的时候用params参数；
//     <a v-link="{ name: 'history', params: { deviceId: 123, dataId:456 }}">history</a>
// 这里的123，456都可以改用变量。
// 比如该template所对应的组件有2个变量定义如下：
// data: function() {
//     return {
//       deviceId:123,
//       dataId:456
//         }
// }    
// 此时上面那个v-link可以改写为：
//     <a v-link="{ name: 'history', params: { deviceId: deviceId, dataId: dataId }}">history</a>
// 还可以使用router.go()
// router.go({name: 'history', params: {deviceId: deviceId, dataId: dataId}});
// （3）在router的目标组件上获取入参
//     比如在router目标组件的ready函数中可以这么使用。
//     ready: function(){
//         console.log('deviceid: ' + this.$route.params.deviceId);
//         console.log('dataId: ' + this.$route.params.dataId);
//     }

// 如果想访问 /history?page=1这样的，连接后面直接加问号陪参数的话用query这个参数
// <a v-link="{ name: 'history', query: { page: 1 }}">history</a>


// 路由对象，即$router会被注入每个组件中，可以利用它进行一些信息的获取。如:
// 属性            说明
// $route.path     当前路由对象的路径，如'/view/a'
// $rotue.params   关于动态片段（如/user/:username)的键值对信息,如{username: 'paolino'}
// $route.query    请求参数，如/foo?user=1获取到query.user = 1
// $route.router   所属路由器以及所属组件信息
// $route.matched  数组，包含当前匹配的路径中所包含的所有片段所对应的配置参数对象。
// $route.name     当前路径名字
















