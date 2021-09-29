import Vue from 'vue'
import App from './App'
import store from '@/store';
import uView from "uview-ui";
import VueI18n from 'vue-i18n'
import messages from '@/i18n/messages'

Vue.use(uView);
Vue.use(VueI18n) 
Vue.config.productionTip = false

export const i18n = new VueI18n({
	locale: 'cn', // set locale
	messages,
})

i18n.locale = 'cn'

// vuex
const vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);

// 国际化
Vue.prototype._i18n = i18n
App.mpType = 'app'

const app = new Vue({
	i18n,
	store,
	...App
})

// http拦截器
import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app)

// http接口API集中管理
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)

// 公共函数
import globalFunc from '@/utils/common.js'
Vue.use(globalFunc, app)

// 微信SDK
// #ifdef H5
import weixin from '@/utils/jwx.js'
Vue.use(weixin, app)
// #endif

app.$mount()
