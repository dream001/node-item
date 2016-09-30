# vue-vueRouter-webpack-example

## Setup

``` bash
npm install
npm run dev       //不会生成dist文件，只是在内存中生成，访问的时候要用publicpath中的路径才可以访问到
```

``` bash
npm run build    //最终生成文件的方法
```

## 目录结构
<pre>
│  .gitignore          # 忽略无需git控制的文件  比如 node_modules
│  package.json        # 项目配置
│  readme.md           # 项目说明
│  index.html          # 首页
│
├─node_modules
│
├─build
│     │  webpack.base.config.js         # webpack 基础配置
│     │  webpack.dev.config.js          # webpack 开发配置
│     └─ webpack.prod.config.js         # webpack 生产配置
│
└─src
    │  app.vue         # 主vue
    │  main.js         # 启动配置
    │  router.js       # 路由
    │  filter.js       # 过滤器
    │  directive.js    # 指令
    │
    ├─components       # 组件
    │      index.vue
    │
    └─assets             
          │            
	      │
	      ├─ css 		# 公用css
    	  │
    	  │
    	  ├─ font 		# 字体
    	  │
    	  │
    	  └─ img 		# 图片资源
</pre>
