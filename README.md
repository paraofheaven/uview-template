#### 写在前面
>本模版是uniapp项目基础模板，集成了uview-ui和微信jssdk，免去配置的麻烦，并封装了众多全局方法及小组件，适合开新项目使用。如果对你有帮助的话，给个好评和star吧~


#### 基本功能 🚀

>1. 统一配置
>2. 集成微信公众号JSSDK，已封装部分sdk方法，请扫描下方二维码查看演示
>3. 集成uview-ui，采用下载安装方式，已配置好，无需npm
>4. api分模块管理和拦截器
>5. vuex和缓存实现全局变量
>6. 全局公共函数
>7. 小清新轻提示toast组件
>8. 更多组件开发中。。。


#### 相关文档 &#x1F4C3;

>1. <a href="http://www.uviewui.com/" target="_blank" style="font-size:16px">uview-ui官方文档</a>
>2. <a href="http://www.uviewui.com/components/common.html" target="_blank" style="font-size:16px">全局样式类</a>
>3. <a href="http://www.uviewui.com/js/apiManage.html" target="_blank" style="font-size:16px">api集中管理和拦截器</a>
>4. <a href="http://www.uviewui.com/guide/globalVariable.html" target="_blank" style="font-size:16px">全局变量的实现</a>
>5. <a href="https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html" target="_blank" style="font-size:16px">微信公众号JSSDK官方文档</a>
>6. <a href="https://u.tools/" target="_blank" style="font-size:16px">超好用的utools工具(含内网穿透，公众号开发神器)</a>



#### 项目目录 &#x1F4C1;

```
│  App.vue
│  main.js
│  manifest.json
│  package-lock.json
│  package.json
│  pages.json
│  README.md
│  uni.scss
│  
├─api // api目录，把模块的api写在对应的js文件中
│  |  order.js
│  |  wxapp.js
│      
├─common
|  |  settings.js // 全局配置文件
│  |  common.style.scss  // 全局样式类
│  |  http.api.js // api集中管理，挂载所有api到$u.api中
│  |  http.interceptor.js // api拦截器
│      
├─components
│  │  iconfont.css // toast字体图标
│  │  style.components.scss // 组件公共样式
│  ├─ v-bottom-menu // 底部菜单组件，用户表单提交等场景
│  ├─ v-image // 小巧的image组件
│  ├─ v-navtab // tabs组件封装，固定在页面顶部
│  ├─ v-title // 标题组件
│  └─ v-toast // 小清新轻提示组件
│          
├─pages // 页面主目录
│          
├─static
│  │  logo.png
│  │  
│  └─tabbar // tabbar图标目录
│          
├─store
│      $u.mixin.js // vuex挂载全局变量
│      index.js // vuex主文件
│      
├─utils
│      common.js // 全局公共函数
│      jwx.js // 封装的jssdk函数
│      wx-jssdk.js // 微信jssdk
│      
└─uview-ui // uview-ui组件库
                
```


#### 鸣谢 &#x1F681;
>1. <a href="http://www.uviewui.com/" target="_blank" style="font-size:16px">uview-ui</a>  多平台快速开发的UI框架，uniapp生态最优秀的UI框架。


#### 项目演示(公众号授权)  👇 
![image](https://oss.galaxy-x.cn/images/2021/3/19/%E5%BE%AE%E4%BF%A1%E6%8E%88%E6%9D%83demo.png)


#### tips &#x1F4CC;
>使用过程中遇到问题请发评论或加QQ 1843544121 反馈，感谢~


