<template>
    <!-- 全局header -->
    <!-- prop 默认是单向绑定：当父组件的属性变化时，将传导给子组件，但是反过来不会。这是为了防止子组件无意修改了父组件的状态——这会让应用的
    数据流难以理解。解决办法 : 使用 .sync 或.once 绑定修饰符显式地强制双向或单次绑定-->
    <!-- 默认为单向绑定 -->
   <!--  <child :msg="parentMsg"></child> -->
    <!-- 双向绑定 -->
    <!-- <child :msg.sync="parentMsg"></child> -->
    <!-- 单次绑定 -->
    <!-- <child :msg.once="parentMsg"></child> -->

    <nv-head :page-type="searchKey.tab | getTitleStr"
            fix-head="true"
            :need-add="true"
            :show-menu.sync="showMenu">
    </nv-head>
    <section id="page">
        <!-- 首页列表 -->
        <ul class="posts-list">
            <li v-for="item in topics"
                    v-link="{name:'topic',params:{id:item.id}}">

                <h3 v-text="item.title"
                        :class="item.tab | getTabClassName item.good item.top"
                        :title="item.tab | getTabStr item.good item.top">      
                </h3>
                <div class="content">
                    <img class="avatar" :src="item.author.avatar_url" />
                    <div class="info">
                        <p>
                            <span class="name">
                                {{item.author.loginname}}
                            </span>
                            <span class="status" v-if="item.reply_count > 0">
                                <b>{{item.reply_count}}</b>
                                /{{item.visit_count}}
                            </span>
                        </p>
                        <p>
                            <time>
                                {{item.create_at | getLastTimeStr true}}
                            </time>
                            <time>
                                {{item.last_reply_at | getLastTimeStr true}}
                            </time>
                        </p>
                    </div>
                </div>
            </li>
        </ul>
    </section>
    <nv-top></nv-top>
</template>

<script>
    export default {
        data (){
            return {
                showMenu: false,
                scroll:true,     //是否可以滚动，防止多次滚动，多请求
                topics:[],
                searchKey:{
                    page:1,
                    limit:20,
                    tab:'all',
                    mdrender:true
                },
                searchDataStr:''
            }
        },
        route:{
            data (transition){
                let query = transition.to.query,tab = query.tab || 'all';

                //记录首次加载的查询条件
                if(this.searchDataStr == ""){
                    this.searchDataStr = JSON.stringify(this.searchKey);
                }
                //如果从左侧切换分类，则清空查询条件
                if(transition.from.name === "list"){
                    //this.searchKey.page = 1;
                    this.searchKey.limit = 20;
                    this.searchKey = JSON.parse(this.searchDataStr);
                }


                //如果从详情返回并且typeid一样才去sessionStorge
                if(sessionStorage.searchKey && transition.from.name === "topic"
                    && sessionStorage.tab == tab){
                    this.topics = JSON.parse(sessionStorage.topics);
                    this.searchKey = JSON.parse(sessionStorage.searchKey);
                    // 数据变更之后移到头部，解决异步数据更新的方法
                    this.$nextTick(()=> $(window).scrollTop(sessionStorage.scrollTop));
                }
                else{
                    //页面初次加载获取的数据
                    this.searchKey.tab = query.tab;
                    this.getTopics();
                }
                this.showMenu = false;

                //滚动加载
                $(window).on('scroll', () => {
                    this.getScrollData();
                });

            },
            deactivate (transition){
                $(window).off('scroll');
                if(transition.to.name === "topic"){
                    sessionStorage.scrollTop = $(window).scrollTop();
                    sessionStorage.topics = JSON.stringify(this.topics);
                    sessionStorage.searchKey = JSON.stringify(this.searchKey);
                    sessionStorage.tab = transition.from.query.tab || 'all';
                }
                else{
                    sessionStorage.removeItem("topics");
                    sessionStorage.removeItem("searchKey");
                    sessionStorage.removeItem("tab");
                }
                transition.next();
            }
        },
        methods:{
            getTopics (searchKey){
                let params = $.param(this.searchKey);
                $.get('https://cnodejs.org/api/v1/topics?'+params,(d)=> {
                    this.scroll = true;
                    if(d && d.data){
                        this.topics = d.data;
                        // if(this.searchKey.page == 0){
                        //     this.topics = d.data;
                        // }
                        // else{
                        //     this.topics = this.topics.concat(d.data);
                        // }
                    }
                })
            },
            //滚动加载数据,每一次滚动的时候实际上重刷了整个数据列表，这是为了保证数据的实时，每一次只是改limit加20条
            getScrollData (){
                if(this.scroll){
                    let totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
                    if ($(document).height() <= totalheight + 200) {
                        this.scroll = false;
                        this.searchKey.limit += 20;
                        this.getTopics();
                    }
                }
            }
        },
        components:{
            "nvHead":require('../components/header.vue'),
            "nvTop":require('../components/backtotop.vue')
        }
    }
</script>


<!-- 走startTransition开始进入transition的周期（也算是vue-router的核心所在），上面的router对象里面可以写data函数之外还可以写下面这些
  这里会涉及组件复用的问题，下面用cd等字母表示了路由变化时候的走的方法的顺序
     1).canReuse：调用canReuse钩子
          看当前的<vue-router>和将要跳转的<vue-router>之间有没有可重用的组件
          a/b/c
          a/b/d  =>  可复用[a,b]，需要销毁[c]，需要生成[d]
          
     2).canDeactivate(c)：调用canDeactivate钩子
         
     3).canActivate(d)：调用canActivate钩子
     
     4).deactivate(c)：调用deactivate钩子
     
     5)._afterEachHooks(c)：调用afterEach钩子
     
     6).reuse([a,b])：调用data钩子
     
     7).activate(d) ：调用activate | data钩子
 -->

 <!-- $nextTick解决异步更新问题：
 默认情况下， Vue 的 DOM 更新是异步执行的。理解这一点非常重要。当侦测到数据变化时， Vue 会打开一个队列，然后把在同一个事件循环 
 (event loop) 当中观察到数据变化的 watcher 推送进这个队列。假如一个 watcher 在一个事件循环中被触发了多次，它只会被推送到队列中一次。
 然后，在进入下一次的事件循环时， Vue 会清空队列并进行必要的 DOM 更新。在内部，Vue 会使用 MutationObserver 来实现队列的异步处理，如
 果不支持则会回退到 setTimeout(fn, 0)。
 举例来说，当你设置 vm.someData = 'new value'，DOM 并不会马上更新，而是在异步队列被清除，也就是下一个事件循环开始时执行更新。如果
 你想要根据更新的 DOM 状态去做某些事情，就必须要留意这个细节。尽管 Vue.js 鼓励开发者用 “数据驱动” 的方式想问题，避免直接操作 DOM ，
 但有时候你可能就是想要使用某个熟悉的 jQuery 插件。这种情况下怎么办呢？你可以在数据改变后，立刻调用 Vue.nextTick(callback)，并把你
 要做的事情放到回调函数里面。当 Vue.nextTick 的回调函数执行时，DOM 将会已经是更新后的状态了
 -->


<!-- 在上面的h3标签当中，加入了title属性，可以通过before选择器，在文本内容前再加上tite中的值，其中content为attr(title)即可取到title中值并写入 -->



