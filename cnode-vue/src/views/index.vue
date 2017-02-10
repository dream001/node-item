<template>
    <!-- 全局header -->
    <div>
        <img class="index" src="../assets/images/index.png">
    </div>
</template>
<script>
    require('../assets/scss/iconfont/iconfont.css');
    require('../assets/scss/CV.scss');                    //在这里面导入了其他所有的scss文件
    require('../assets/scss/github-markdown.css');


    export default {
        ready (){
            setTimeout(() => {
                this.$route.router.go({ name: 'list'});
            },2000); 
            // 在模板中直接用如<p>路由名称：{{$route.name}}</p>，在函数中得加this否则访问不到
            // console.log(this.$route);   //{name: "home", path: "/", query: Object, params: Object, router:Router…},this.$route.router会获取当前路由对象操作权
        }
    }
</script>
<!-- 翻译进内联样式style中 -->
<style lang="sass">     
    .index{
        width: 100%;
        background-color: #fff;
        margin-top: 40%;
    }
</style>

<!-- 对于单页应用来说，会一次将所有的代码都放到一张页面中进行管理，所以页面打开之后会有很多style标签的内联样式，这都是没有外联引入
webpack打包合并时候剩下的用style-loader解析嵌入到页面内联里面，对于dom的操作等都在打包好的js里面封装好了,所以不用的变量事件等一定要清除掉
否则他们永远在页面当中，消耗着页面的内存 -->

